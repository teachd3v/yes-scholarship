'use server'

import { writeClient } from "@/sanity/client";
import { revalidatePath } from "next/cache";
import type { ApplicationListItem, ApplicationDetail, PaginatedResult, MentorListItem, MentorDetail, EmailMetrics, ResendEmailLog } from "@/lib/types";
import type { EmailDocData } from "@/lib/mail";
import { getAdminUser, verifyAdminPassword } from "./auth-actions";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


if (!writeClient) throw new Error("Sanity writeClient not configured")
const client = writeClient;

export async function updateApplicationData(
  id: string,
  password: string,
  patch: {
    // biodata
    nama?: string; nik?: string; no_kk?: string; email?: string; whatsapp?: string;
    jenis_kelamin?: string; agama?: string; tempat_lahir?: string; tanggal_lahir?: string;
    alamat_detail?: string;
    provinsi?: string; provinsi_nama?: string;
    kabupaten?: string; kabupaten_nama?: string;
    kecamatan?: string; kecamatan_nama?: string;
    kelurahan?: string; kelurahan_nama?: string;
    // keluarga
    nama_ayah?: string; nama_ibu?: string; kondisi_ayah?: string; kondisi_ibu?: string;
    penghasilan_ortu?: string; kontak_ortu?: string; jumlah_saudara?: number;
    // seleksi
    asal_sekolah?: string; jenjang_pendidikan?: string;
    nilai_raport_1?: number; nilai_raport_2?: number; nilai_raport_3?: number;
    status_beasiswa?: string; keterangan_beasiswa?: string; motivasi?: string;
    sumber_info?: string; social_media?: string; kategori_hafalan?: string;
  }
) {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser) return { success: false, error: "Tidak terautentikasi" };

    const isAuthorized = adminUser.role === 'superadmin' || adminUser.role === 'admin_wilayah';
    if (!isAuthorized) return { success: false, error: "Tidak punya akses edit" };

    const valid = await verifyAdminPassword(password);
    if (!valid) return { success: false, error: "Password salah" };

    const sanityPatch: Record<string, unknown> = {};

    const bioFields = ['nama','nik','no_kk','email','whatsapp','jenis_kelamin','agama','tempat_lahir','tanggal_lahir','alamat_detail','provinsi','provinsi_nama','kabupaten','kabupaten_nama','kecamatan','kecamatan_nama','kelurahan','kelurahan_nama'] as const;
    for (const f of bioFields) {
      if (patch[f] !== undefined && patch[f] !== '') sanityPatch[`biodata.${f}`] = patch[f];
    }

    const keluargaFields = ['nama_ayah','nama_ibu','kondisi_ayah','kondisi_ibu','penghasilan_ortu','kontak_ortu','jumlah_saudara'] as const;
    for (const f of keluargaFields) {
      if (patch[f] !== undefined && patch[f] !== '') sanityPatch[`keluarga.${f}`] = patch[f];
    }

    const seleksiFields = ['asal_sekolah','jenjang_pendidikan','nilai_raport_1','nilai_raport_2','nilai_raport_3','status_beasiswa','keterangan_beasiswa','motivasi','sumber_info','social_media','kategori_hafalan'] as const;
    for (const f of seleksiFields) {
      if (patch[f] !== undefined && patch[f] !== '') sanityPatch[`seleksi.${f}`] = patch[f];
    }

    if (Object.keys(sanityPatch).length === 0) return { success: false, error: "Tidak ada data yang diubah" };

    await client.patch(id).set(sanityPatch).commit();
    revalidatePath(`/admin/application/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating application data:", error);
    return { success: false, error: "Gagal menyimpan perubahan" };
  }
}

export async function updateApplicationStatus(id: string, status: 'approved' | 'rejected' | 'pending', reason?: string) {
  try {
    const patch: { status: 'approved' | 'rejected' | 'pending'; rejectedReason?: string } = { status };
    if (status === 'rejected' && reason) {
        patch.rejectedReason = reason;
    }
    await client.patch(id).set(patch).commit();
    revalidatePath('/admin');
    revalidatePath(`/admin/application/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Gagal mengupdate status" };
  }
}

export async function deleteApplication(id: string, password?: string) {
  try {
    if (!password) return { success: false, error: "Password wajib diisi" };
    const valid = await verifyAdminPassword(password);
    if (!valid) return { success: false, error: "Password salah" };

    await client.delete(id);
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error deleting application:", error);
    return { success: false, error: "Gagal menghapus data" };
  }
}

export async function saveRekomendasi(formData: FormData) {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser) return { success: false, error: "Unauthorized" };

    const id = formData.get('id') as string;
    const tipe = formData.get('tipe') as string;
    const catatan = formData.get('catatan') as string;

    if (!id || !tipe || !catatan?.trim()) {
      return { success: false, error: "ID, tipe, dan catatan wajib diisi" };
    }

    // Upload bukti files
    const bukti: { _key: string; keterangan: string; file: { _type: 'image'; asset: { _type: 'reference'; _ref: string } } }[] = [];
    let i = 0;
    while (formData.has(`bukti_file_${i}`)) {
      const file = formData.get(`bukti_file_${i}`) as File;
      const keterangan = (formData.get(`bukti_ket_${i}`) as string) || '';
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const asset = await client.assets.upload('image', buffer, {
          filename: file.name,
          contentType: file.type,
        });
        bukti.push({
          _key: `bukti_${Date.now()}_${i}`,
          keterangan,
          file: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
        });
      }
      i++;
    }

    const statusOverride = tipe === 'rekomendasikan_lolos' ? 'approved' : 'rejected';

    await client.patch(id).set({
      status: statusOverride,
      rekomendasi: {
        tipe,
        catatan,
        bukti_pendukung: bukti,
        dibuat_oleh: adminUser.username,
        tanggal: new Date().toISOString(),
      },
    }).commit();

    revalidatePath('/admin');
    revalidatePath(`/admin/application/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error saving rekomendasi:", error);
    return { success: false, error: "Gagal menyimpan rekomendasi" };
  }
}

export async function deleteRekomendasi(id: string) {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser) return { success: false, error: "Unauthorized" };

    await client.patch(id).set({ status: 'pending' }).unset(['rekomendasi']).commit();
    revalidatePath('/admin');
    revalidatePath(`/admin/application/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting rekomendasi:", error);
    return { success: false, error: "Gagal menghapus rekomendasi" };
  }
}

const PAGE_SIZE = 100;

export async function getApplications(
    page: number = 1, 
    filters: { 
        search?: string, 
        province?: string, 
        status?: string, 
        screening?: string, 
        income?: string 
    } = {}
): Promise<PaginatedResult<ApplicationListItem>> {
    try {
        const adminUser = await getAdminUser();
        if (!adminUser) throw new Error("Unauthorized");

        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        let baseCondition = `_type == "application"`;
        
        // Role based restriction
        if (adminUser.role === 'admin_wilayah' && adminUser.region) {
             baseCondition += ` && biodata.provinsi_nama match "${adminUser.region}"`;
        }

        // Dynamic filters
        if (filters.province && filters.province !== 'All') {
            baseCondition += ` && biodata.provinsi_nama match "${filters.province}"`;
        }
        if (filters.status && filters.status !== 'All') {
            baseCondition += ` && status == "${filters.status}"`;
        }
        if (filters.screening && filters.screening !== 'All') {
            const isLolos = filters.screening === 'Lolos';
            baseCondition += ` && scoring.lolos_screening == ${isLolos}`;
        }
        if (filters.income && filters.income !== 'All') {
            baseCondition += ` && keluarga.penghasilan_ortu == "${filters.income}"`;
        }
        if (filters.search) {
            baseCondition += ` && (biodata.nama match "*${filters.search}*" || biodata.email match "*${filters.search}*")`;
        }
        // Super Admin sees all data by default, no lolos_screening filter here anymore.

        const query = `{
            "items": *[${baseCondition}] | order(_createdAt desc) [$start...$end] {
                _id,
                _createdAt,
                status,
                "nama": biodata.nama,
                "email": biodata.email,
                "whatsapp": biodata.whatsapp,
                "provinsi_nama": biodata.provinsi_nama,
                "penghasilan_ortu": keluarga.penghasilan_ortu,
                "nilai_raport_1": seleksi.nilai_raport_1,
                "nilai_raport_2": seleksi.nilai_raport_2,
                "nilai_raport_3": seleksi.nilai_raport_3,
                "total_skor": scoring.total_skor,
                "lolos_screening": scoring.lolos_screening,
                "detail_skor": scoring.detail_skor,
                "has_rekomendasi": defined(rekomendasi.tipe),
                "rekomendasi_tipe": rekomendasi.tipe
            },
            "total": count(*[${baseCondition}]),
            "stats": {
                "approved": count(*[${baseCondition} && status == "approved"]),
                "pending": count(*[${baseCondition} && status == "pending"]),
                "rejected": count(*[${baseCondition} && status == "rejected"]),
                "lolos": count(*[${baseCondition} && scoring.lolos_screening == true]),
                "gagal": count(*[${baseCondition} && scoring.lolos_screening == false])
            }
        }`;
        const data = await client.fetch(query, { start, end }, { cache: 'no-store' });
        return {
            items: data.items || [],
            total: data.total || 0,
            page,
            pageSize: PAGE_SIZE,
            totalPages: Math.ceil((data.total || 0) / PAGE_SIZE),
            stats: data.stats
        };
    } catch (error) {
        console.error("Error fetching applications:", error);
        return { items: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 };
    }
}

export async function exportAllApplications(onlyLolos: boolean = false): Promise<ApplicationDetail[]> {
    try {
        const adminUser = await getAdminUser();
        if (!adminUser) throw new Error("Unauthorized");

        let baseCondition = `_type == "application"`;
        if (adminUser.role === 'admin_wilayah' && adminUser.region) {
             baseCondition += ` && biodata.provinsi_nama match "${adminUser.region}"`;
        }
        
        if (onlyLolos) {
            baseCondition += ` && scoring.lolos_screening == true`;
        }

        const query = `*[${baseCondition}] | order(_createdAt desc) {
            ...,
            biodata {
                ...,
                "foto_diri_url": foto_diri.asset->url
            },
            keluarga {
                ...,
                "file_kk_url": file_kk.asset->url,
                "file_sktm_url": file_sktm.asset->url,
                "file_skb_url": file_skb.asset->url
            },
            seleksi {
                ...,
                "foto_raport_1_url": foto_raport_1.asset->url,
                "foto_raport_2_url": foto_raport_2.asset->url,
                "foto_raport_3_url": foto_raport_3.asset->url
            },
            rekomendasi {
                tipe,
                catatan,
                dibuat_oleh,
                tanggal
            }
        }`;
        
        const data = await client.fetch(query, {}, { cache: 'no-store' });
        return data || [];
    } catch (error) {
        console.error("Error exporting applications:", error);
        return [];
    }
}

export async function getApplicationById(id: string): Promise<ApplicationDetail | null> {
    try {
        const query = `*[_type == "application" && _id == $id][0] {
            ...,
            biodata {
                ...,
                "foto_diri_url": foto_diri.asset->url
            },
            keluarga {
                ...,
                "file_kk_url": file_kk.asset->url,
                "file_sktm_url": file_sktm.asset->url,
                "file_skb_url": file_skb.asset->url
            },
            seleksi {
                ...,
                "foto_raport_1_url": foto_raport_1.asset->url,
                "foto_raport_2_url": foto_raport_2.asset->url,
                "foto_raport_3_url": foto_raport_3.asset->url
            },
            rekomendasi {
                ...,
                "bukti_pendukung": bukti_pendukung[] {
                    _key,
                    keterangan,
                    "file_url": file.asset->url
                }
            }
        }`;
        const data = await client.fetch(query, { id }, { cache: 'no-store' });
        return data;
    } catch (error) {
        console.error("Error fetching application:", error);
        return null;
    }
}

// ==================== Mentor Actions ====================

export async function getMentors(
    page: number = 1,
    filters: {
        search?: string,
        province?: string,
        status?: string,
        jenjang?: string
    } = {}
): Promise<PaginatedResult<MentorListItem>> {
    try {
        const adminUser = await getAdminUser();
        if (!adminUser) throw new Error("Unauthorized");

        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        let baseCondition = `_type == "mentor"`;
        
        // Dynamic filters
        if (filters.province && filters.province !== 'All') {
            baseCondition += ` && domisili.provinsi_nama match "${filters.province}"`;
        }
        if (filters.status && filters.status !== 'All') {
            baseCondition += ` && status == "${filters.status}"`;
        }
        if (filters.jenjang && filters.jenjang !== 'All') {
            baseCondition += ` && pendidikan.jenjang == "${filters.jenjang}"`;
        }
        if (filters.search) {
            baseCondition += ` && (biodata.nama_lengkap match "*${filters.search}*" || biodata.email match "*${filters.search}*")`;
        }

        const query = `{
            "items": *[${baseCondition}] | order(_createdAt desc) [$start...$end] {
                _id,
                _createdAt,
                status,
                "nama": biodata.nama_lengkap,
                "email": biodata.email,
                "whatsapp": biodata.whatsapp,
                "provinsi_nama": domisili.provinsi_nama,
                "jenjang": pendidikan.jenjang
            },
            "total": count(*[${baseCondition}]),
            "stats": {
                "approved": count(*[${baseCondition} && status == "approved"]),
                "pending": count(*[${baseCondition} && status == "pending"]),
                "rejected": count(*[${baseCondition} && status == "rejected"])
            }
        }`;
        const data = await client.fetch(query, { start, end }, { cache: 'no-store' });
        return {
            items: data.items || [],
            total: data.total || 0,
            page,
            pageSize: PAGE_SIZE,
            totalPages: Math.ceil((data.total || 0) / PAGE_SIZE),
            stats: data.stats
        };
    } catch (error) {
        console.error("Error fetching mentors:", error);
        return { items: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 };
    }
}

export async function updateMentorStatus(id: string, status: 'approved' | 'rejected' | 'pending', reason?: string) {
  try {
    const patch: { status: 'approved' | 'rejected' | 'pending'; rejectedReason?: string } = { status };
    if (status === 'rejected' && reason) {
        patch.rejectedReason = reason;
    }
    await client.patch(id).set(patch).commit();
    revalidatePath('/admin');
    revalidatePath(`/admin/mentor/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating mentor status:", error);
    return { success: false, error: "Gagal mengupdate status mentor" };
  }
}

export async function deleteMentor(id: string, password?: string) {
  try {
    if (!password) return { success: false, error: "Password wajib diisi" };
    const valid = await verifyAdminPassword(password);
    if (!valid) return { success: false, error: "Password salah" };

    await client.delete(id);
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error deleting mentor:", error);
    return { success: false, error: "Gagal menghapus data mentor" };
  }
}

export async function getMentorById(id: string): Promise<MentorDetail | null> {
    try {
        const query = `*[_type == "mentor" && _id == $id][0] {
            ...,
            biodata {
                ...,
                "foto_profil_url": foto_profil.asset->url
            },
            domisili {
                ...
            },
            pendidikan {
                ...
            },
            tambahan {
                ...,
                "cv_resume_url": cv_resume.asset->url
            }
        }`;
        const data = await client.fetch(query, { id }, { cache: 'no-store' });
        return data;
    } catch (error) {
        console.error("Error fetching mentor detail:", error);
        return null;
    }
}

export async function exportAllMentors(): Promise<MentorDetail[]> {
    try {
        const adminUser = await getAdminUser();
        if (!adminUser) throw new Error("Unauthorized");

        const query = `*[_type == "mentor"] | order(_createdAt desc) {
            ...,
            biodata {
                ...,
                "foto_profil_url": foto_profil.asset->url
            },
            tambahan {
                ...,
                "cv_resume_url": cv_resume.asset->url
            }
        }`;
        
        const data = await client.fetch(query, {}, { cache: 'no-store' });
        return data || [];
    } catch (error) {
        console.error("Error exporting mentors:", error);
        return [];
    }
}

// ==================== Email Actions ====================

export async function getEmailLogs(limit: number = 20, cursor?: string | null, direction: 'after' | 'before' = 'after') {
    try {
        const adminUser = await getAdminUser();
        if (!adminUser || adminUser.role !== 'superadmin') throw new Error("Unauthorized");

        const options: { limit: number; after?: string; before?: string } = { limit };
        if (cursor) {
            if (direction === 'after') {
                options.after = cursor;
            } else {
                // Resend SDK may not type 'before' in all versions — cast to bypass
                options.before = cursor;
            }
        }

        const { data, error } = await resend.emails.list(options as Parameters<typeof resend.emails.list>[0]);
        
        if (error) {
            console.error("Resend API error:", error);
            return { items: [], hasNextPage: false };
        }

        const items = (data?.data || data || []) as ResendEmailLog[];
        
        return {
            items,
            hasNextPage: items.length >= limit
        };
    } catch (error) {
        console.error("Error fetching email logs:", error);
        return { items: [], hasNextPage: false };
    }
}

export async function getRecentEmailMetrics(): Promise<EmailMetrics> {
    const metrics: EmailMetrics = { sent: 0, delivered: 0, bounced: 0, failed: 0, total: 0 };
    try {
        const adminUser = await getAdminUser();
        if (!adminUser || adminUser.role !== 'superadmin') return metrics;

        let totalFetched = 0;
        let lastId: string | null = null;
        let hasMore = true;

        // Fetch up to 500 emails to build a mini scorecard
        while (hasMore && totalFetched < 500) {
             const options: { limit: number; after?: string } = { limit: 100 };
             if (lastId) options.after = lastId;

             const { data, error } = await resend.emails.list(options as Parameters<typeof resend.emails.list>[0]);
             if (error) break;

             const items = (data?.data || data || []) as ResendEmailLog[];
             if (!items || items.length === 0) break;

             items.forEach((email) => {
                 metrics.total++;
                 const status = (email.last_event || 'sent').toLowerCase();
                 if (status === 'delivered') metrics.delivered++;
                 else if (status === 'bounced') metrics.bounced++;
                 else if (['failed', 'delivery_delayed', 'complained'].includes(status)) metrics.failed++;
                 else metrics.sent++;
             });

             totalFetched += items.length;
             if (items.length < 100) hasMore = false;
             else lastId = items[items.length - 1].id;
        }

        return metrics;
    } catch (error) {
        console.error("Error generating metrics:", error);
        return metrics;
    }
}

export async function retryEmail(emailId: string) {
    try {
        const adminUser = await getAdminUser();
        if (!adminUser || adminUser.role !== 'superadmin') return { success: false, error: 'Unauthorized' };

        const { data: original, error: getErr } = await resend.emails.get(emailId);
        if (getErr || !original) {
            return { success: false, error: getErr?.message || 'Gagal mengambil data riwayat email' };
        }

        // Ambil payload HTML, text, atau subject.
        const html = original.html || original.text || '<h1>Notifikasi</h1><p>Pesan otomatis.</p>';
        const subjectStr = original.subject?.startsWith('[RETRY]') ? original.subject : `[RETRY] ${original.subject || 'Notifikasi'}`;
        
        // Kita gunakan .send untuk mengirim ulang
        const { data: newlySent, error: sendErr } = await resend.emails.send({
            from: original.from || 'YES Scholarship <admin@youthekselensia.id>',
            to: Array.isArray(original.to) ? original.to : [original.to],
            subject: subjectStr,
            html: html,
        });

        if (sendErr) return { success: false, error: sendErr.message };

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Error retrying email:", error);
        const message = error instanceof Error ? error.message : 'Terjadi kesalahan sistem';
        return { success: false, error: message };
    }
}

export async function resendWelcomeEmailApplication(id: string) {
    try {
        const adminUser = await getAdminUser();
        if (!adminUser || adminUser.role !== 'superadmin') return { success: false, error: 'Unauthorized' };

        const app = await getApplicationById(id);
        if (!app) return { success: false, error: 'Aplikasi pendaftar tidak ditemukan' };

        // We need to construct emailData to match EmailDocData in mail.ts
        // Not all data might perfectly map directly if it wasn't captured, but we map as much as we can.
        const { sendConfirmationEmail } = await import('@/lib/mail');
        
        const biodata = app.biodata;
        const keluarga = app.keluarga;
        const seleksi = app.seleksi;

        const emailData: EmailDocData = {
            biodata: {
                nama: biodata.nama, nik: biodata.nik, no_kk: biodata.no_kk,
                email: biodata.email, whatsapp: biodata.whatsapp,
                jenis_kelamin: biodata.jenis_kelamin, agama: biodata.agama,
                tempat_lahir: biodata.tempat_lahir, tanggal_lahir: biodata.tanggal_lahir,
                provinsi_nama: biodata.provinsi_nama, kabupaten_nama: biodata.kabupaten_nama,
                kecamatan_nama: biodata.kecamatan_nama, kelurahan_nama: biodata.kelurahan_nama,
                alamat_detail: biodata.alamat_detail,
                foto_diri_assetId: biodata.foto_diri?.asset?._ref,
            },
            keluarga: {
                nama_ayah: keluarga.nama_ayah, kondisi_ayah: keluarga.kondisi_ayah, 
                pekerjaan_ayah: keluarga.pekerjaan_ayah,
                nama_ibu: keluarga.nama_ibu, kondisi_ibu: keluarga.kondisi_ibu,
                pekerjaan_ibu: keluarga.pekerjaan_ibu,
                penghasilan_ortu: keluarga.penghasilan_ortu, kontak_ortu: keluarga.kontak_ortu,
                jumlah_saudara: keluarga.jumlah_saudara,
                file_kk_assetId: keluarga.file_kk?.asset?._ref,
                file_sktm_assetId: keluarga.file_sktm?.asset?._ref,
                file_skb_assetId: keluarga.file_skb?.asset?._ref,
            },
            seleksi: {
                asal_sekolah: seleksi.asal_sekolah, jenjang_pendidikan: seleksi.jenjang_pendidikan,
                nilai_raport_1: seleksi.nilai_raport_1, nilai_raport_2: seleksi.nilai_raport_2,
                nilai_raport_3: seleksi.nilai_raport_3, status_beasiswa: seleksi.status_beasiswa,
                keterangan_beasiswa: seleksi.keterangan_beasiswa, kategori_hafalan: seleksi.kategori_hafalan,
                motivasi: seleksi.motivasi, sumber_info: seleksi.sumber_info, social_media: seleksi.social_media,
                list_organisasi: seleksi.list_organisasi || [], list_prestasi: seleksi.list_prestasi || [],
                foto_raport_1_assetId: seleksi.foto_raport_1?.asset?._ref,
                foto_raport_2_assetId: seleksi.foto_raport_2?.asset?._ref,
                foto_raport_3_assetId: seleksi.foto_raport_3?.asset?._ref,
            }
        };

        const res = await sendConfirmationEmail(app.biodata.email, app.biodata.nama, emailData);
        if (!res || !res.success) {
            return { success: false, error: 'Gagal mengirim email verifikasi melalui Resend' };
        }

        return { success: true };
    } catch (error) {
        console.error("Error resend welcome email:", error);
        const message = error instanceof Error ? error.message : 'Terjadi kesalahan sistem';
        return { success: false, error: message };
    }
}

'use server'

import { writeClient } from "@/sanity/client";
import { revalidatePath } from "next/cache";
import type { ApplicationListItem, ApplicationDetail, PaginatedResult } from "@/lib/types";
import { getAdminUser } from "./auth-actions";

if (!writeClient) throw new Error("Sanity writeClient not configured")
const client = writeClient;

export async function updateApplicationStatus(id: string, status: 'approved' | 'rejected' | 'pending') {
  try {
    await client.patch(id).set({ status }).commit();
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Gagal mengupdate status" };
  }
}

export async function deleteApplication(id: string) {
  try {
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

const PAGE_SIZE = 20;

export async function getApplications(page: number = 1): Promise<PaginatedResult<ApplicationListItem>> {
    try {
        const adminUser = await getAdminUser();
        if (!adminUser) throw new Error("Unauthorized");

        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        let baseCondition = `_type == "application"`;
        if (adminUser.role === 'admin_wilayah' && adminUser.region) {
             baseCondition += ` && biodata.provinsi_nama match "${adminUser.region}"`;
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
            "total": count(*[${baseCondition}])
        }`;
        const data = await client.fetch(query, { start, end }, { cache: 'no-store' });
        return {
            items: data.items || [],
            total: data.total || 0,
            page,
            pageSize: PAGE_SIZE,
            totalPages: Math.ceil((data.total || 0) / PAGE_SIZE),
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

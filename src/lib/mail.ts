import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailDocData {
  biodata: {
    nama: string;
    nik: string;
    no_kk: string;
    email: string;
    whatsapp: string;
    jenis_kelamin: string;
    agama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    provinsi_nama: string;
    kabupaten_nama: string;
    kecamatan_nama: string;
    kelurahan_nama: string;
    alamat_detail: string;
    foto_diri_assetId?: string;
  };
  keluarga: {
    nama_ayah: string;
    pekerjaan_ayah?: string;
    kondisi_ayah: string;
    nama_ibu: string;
    pekerjaan_ibu?: string;
    kondisi_ibu: string;
    penghasilan_ortu: string;
    kontak_ortu: string;
    jumlah_saudara: number;
    has_sktm?: string;
    has_skb?: string;
    file_kk_assetId?: string;
    file_sktm_assetId?: string;
    file_skb_assetId?: string;
  };
  seleksi: {
    asal_sekolah: string;
    jenjang_pendidikan: string;
    nilai_raport_1: number;
    nilai_raport_2: number;
    nilai_raport_3: number;
    status_beasiswa: string;
    keterangan_beasiswa?: string;
    motivasi: string;
    sumber_info: string;
    foto_raport_1_assetId?: string;
    foto_raport_2_assetId?: string;
    foto_raport_3_assetId?: string;
    list_organisasi?: any[];
    list_prestasi?: any[];
    kategori_hafalan?: string;
    social_media?: string;
  };
}

export interface MentorEmailData {
  nama_lengkap: string;
  email: string;
  whatsapp: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat_lengkap: string;
  status_pernikahan: string;
  jenjang_pendidikan: string;
  jurusan: string;
  social_media?: string;
  lancar_quran: string;
  sumber_info: string;
  motivasi: string;
  foto_profil_assetId?: string;
  cv_resume_assetId?: string;
}

function getSanityImageUrl(assetId?: string) {
  if (!assetId) return null;
  // Sanity asset ID format: image-d7e41e809b45...-720x1280-webp
  // We need to convert it to: https://cdn.sanity.io/images/lxtfznya/production/d7e41e809b45...-720x1280.webp
  const parts = assetId.split('-');
  if (parts.length < 4) return null;
  
  const id = parts[1];
  const dimensions = parts[2];
  const extension = parts[3];
  
  return `https://cdn.sanity.io/images/lxtfznya/production/${id}-${dimensions}.${extension}?w=200&auto=format`;
}

export async function sendConfirmationEmail(to: string, data: EmailDocData) {
  try {
    const { error } = await resend.emails.send({
      from: 'YES Scholarship <admin@youthekselensia.id>',
      to: [to],
      subject: 'Pendaftaran Berhasil - YES Scholarship 2026',
      html: `
        <div style="font-family:Arial,sans-serif; max-width:620px; margin:0 auto; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
          <div style="background-color:#2563eb; padding:24px; text-align:center;">
            <h1 style="color:white; margin:0; font-size:22px;">Pendaftaran Berhasil!</h1>
            <p style="color:#bfdbfe; margin:6px 0 0; font-size:14px;">YES Scholarship 2026</p>
          </div>
          <div style="padding:32px; background-color:#ffffff;">
            <p style="font-size:16px; color:#334155; margin-bottom:16px;">Hai <strong>${data.biodata.nama.toUpperCase()}</strong>,</p>
            <p style="font-size:15px; color:#334155; line-height:1.6; margin-bottom:16px;">
              Terima kasih telah mendaftar di program <strong>Youth Ekselensia Scholarship (YES) 2026</strong>.
              Data pendaftaranmu telah kami terima dan sedang dalam proses verifikasi.
            </p>
            <div style="background-color:#f0fdf4; border-left:4px solid #22c55e; padding:14px 16px; margin-bottom:20px; border-radius:4px;">
              <p style="margin:0; color:#166534; font-size:14px; font-weight:600;">✅ Data kamu tersimpan permanen di sistem kami.</p>
            </div>
            <div style="background-color:#eff6ff; border-radius:8px; padding:14px 16px; margin-bottom:20px;">
              <p style="margin:0; color:#1e40af; font-size:14px;">
                📣 Pantau pengumuman seleksi di Instagram resmi kami:
                <a href="https://instagram.com/youthekselensia" style="color:#2563eb; font-weight:bold;">@youthekselensia</a>
              </p>
            </div>
            
            <div style="margin-top:24px; border-top:2px solid #e2e8f0; padding-top:20px;">
              <h2 style="font-size:16px; font-weight:700; color:#1e293b; margin:0 0 16px;">Ringkasan Data Pendaftaran Kamu</h2>
              <p style="font-size:13px; color:#64748b; margin:0 0 16px;">Simpan email ini sebagai bukti bahwa data kamu telah berhasil tercatat. Pastikan semua data berikut sudah sesuai.</p>

              ${getSanityImageUrl(data.biodata.foto_diri_assetId) ? `
              <div style="text-align:center; margin-bottom:16px;">
                <img src="${getSanityImageUrl(data.biodata.foto_diri_assetId)}" width="100" style="width:100px; height:100px; object-fit:cover; border-radius:50%; border:3px solid #2563eb;" />
                <p style="font-size:12px; color:#64748b; margin:6px 0 0;">Foto Diri</p>
              </div>
              ` : ''}

              <table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif;">
                <tr><td colspan="2" style="padding:16px 0 6px; font-size:14px; font-weight:700; color:#1e40af; border-bottom:2px solid #dbeafe;">📋 Biodata Diri</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Nama Lengkap</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.biodata.nama.toUpperCase()}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">NIK</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.biodata.nik}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">No KK</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.biodata.no_kk}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Jenis Kelamin</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.biodata.jenis_kelamin}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Agama</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.biodata.agama}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Tempat Lahir</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.biodata.tempat_lahir}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Tanggal Lahir</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.biodata.tanggal_lahir}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Email</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.biodata.email}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">WhatsApp</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.biodata.whatsapp}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Alamat Domisili</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.biodata.alamat_detail}, ${data.biodata.kelurahan_nama}, ${data.biodata.kecamatan_nama}, ${data.biodata.kabupaten_nama}, ${data.biodata.provinsi_nama}</td></tr>

                <tr><td colspan="2" style="padding:16px 0 6px; font-size:14px; font-weight:700; color:#1e40af; border-bottom:2px solid #dbeafe;">👨👩👧 Data Keluarga</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Nama Ayah</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.keluarga.nama_ayah}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Kondisi Ayah</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.keluarga.kondisi_ayah}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Nama Ibu</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.keluarga.nama_ibu}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Kondisi Ibu</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.keluarga.kondisi_ibu}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Penghasilan Ortu</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.keluarga.penghasilan_ortu}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Kontak Ortu/Wali</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.keluarga.kontak_ortu}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Jumlah Saudara</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.keluarga.jumlah_saudara}</td></tr>

                <tr><td colspan="2" style="padding:16px 0 6px; font-size:14px; font-weight:700; color:#1e40af; border-bottom:2px solid #dbeafe;">🎓 Data Seleksi & Prestasi</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Asal Sekolah</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.seleksi.asal_sekolah}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Jenis Pendidikan</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.seleksi.jenjang_pendidikan}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Rata-rata Nilai</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${((data.seleksi.nilai_raport_1 + data.seleksi.nilai_raport_2 + data.seleksi.nilai_raport_3) / 3).toFixed(2)}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Status Beasiswa</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.seleksi.status_beasiswa}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Hafalan Quran</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.seleksi.kategori_hafalan || '-'}</td></tr>
                
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; vertical-align:top;">Organisasi</td><td style="padding:6px 0; color:#1e293b; font-size:13px;">${(data.seleksi.list_organisasi || []).map((o:any, i:number) => `${i+1}. ${o.nama} — ${o.jabatan}`).join('<br/>') || '-'}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; vertical-align:top;">Prestasi</td><td style="padding:6px 0; color:#1e293b; font-size:13px;">${(data.seleksi.list_prestasi || []).map((p:any, i:number) => `${i+1}. ${p.nama} (${p.tingkat})`).join('<br/>') || '-'}</td></tr>
                
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Sumber Info</td><td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${data.seleksi.sumber_info}</td></tr>
                <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">Motivasi</td><td style="padding:6px 0; color:#1e293b; font-size:13px; line-height:1.5;">${data.seleksi.motivasi}</td></tr>
              </table>

              <div style="margin-top:20px; border-top:1px solid #e2e8f0; padding-top:16px; background-color:#f0fdf4; border-radius:8px; padding:14px 16px;">
                <p style="font-size:13px; font-weight:700; color:#166534; margin:0 0 8px;">📎 Dokumen Terunggah</p>
                <p style="font-size:13px; color:#166534; margin:0;">Kartu Keluarga &nbsp;•&nbsp; SKTM/KIP/PKH/KIS &nbsp;•&nbsp; SKB &nbsp;•&nbsp; Raport Sem 1 &nbsp;•&nbsp; Raport Sem 2 &nbsp;•&nbsp; Raport Sem 3</p>
              </div>
            </div>
            <hr style="border:none; border-top:1px solid #e2e8f0; margin:28px 0 16px;" />
            <p style="font-size:12px; color:#94a3b8; text-align:center; margin:0;">
              Email ini dikirim otomatis. Mohon tidak membalas email ini.<br/>
              Jika ada pertanyaan, hubungi panitia melalui Instagram atau WhatsApp resmi YES.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending confirmation email:", error);
      return { success: false, error };
    }
    return { success: true };
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return { success: false, error };
  }
}

export async function sendMentorConfirmationEmail(to: string, data: MentorEmailData) {
  try {
    const { error } = await resend.emails.send({
      from: 'YES Scholarship <admin@youthekselensia.id>',
      to: [to],
      subject: 'Pendaftaran Mentor Berhasil - YES Scholarship 2026',
      html: `
        <div style="font-family:Arial,sans-serif; max-width:600px; margin:0 auto; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
          <div style="background-color:#059669; padding:32px 24px; text-align:center;">
            <h1 style="color:white; margin:0; font-size:24px;">Pendaftaran Mentor Berhasil!</h1>
            <p style="color:#d1fae5; margin:8px 0 0;">Terima kasih atas dedikasi Anda, Kak ${data.nama_lengkap}.</p>
          </div>
          <div style="padding:24px; background-color:#ffffff;">
             <p style="font-size:16px; color:#334155;">Data pendaftaran mentor Anda telah masuk ke sistem kami.</p>
             <div style="margin-top:24px; padding:16px; background-color:#f0fdf4; border-radius:8px; border-left:4px solid #059669;">
                <p style="margin:0; font-size:14px; color:#065f46; line-height:1.5;">
                  <strong>Informasi</strong><br/>
                  Proses seleksi mentor akan segera dilakukan. Kami akan menghubungi Anda kembali melalui email ini atau WhatsApp jika Anda terpilih ke tahap selanjutnya.
                </p>
             </div>
          </div>
          <div style="padding:24px; background-color:#f1f5f9; text-align:center;">
            <p style="margin:0; font-size:12px; color:#94a3b8;">Youth Ekselensia Scholarship — Mewujudkan Mimpi Anak Bangsa</p>
          </div>
        </div>
      `,
    });

    if (error) { console.error("Error sending mentor email:", error); return { success: false, error }; }
    return { success: true };
  } catch (error) {
    console.error("Error sending mentor email:", error);
    return { success: false, error };
  }
}

// ==================== Announcement Emails ====================

export function getAnnouncementLolosHtml(name: string, school?: string): string {
    const schoolText = school ? ` dari <strong>${school}</strong>` : '';
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid #f1f5f9;">
          <!-- Header with Gradient -->
          <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 60px 40px; text-align: center;">
            <div style="background-color: rgba(255,255,255,0.2); display: inline-block; padding: 12px 24px; border-radius: 100px; color: #ffffff; font-size: 14px; font-weight: bold; margin-bottom: 24px; letter-spacing: 1px;">
              YES SCHOLARSHIP 2026
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 42px; font-weight: 800; line-height: 1.2;">Hooray! <br/>Kamu Lolos! 🎉</h1>
          </div>

          <div style="padding: 40px;">
            <p style="font-size: 18px; color: #1e293b; line-height: 1.6; margin-bottom: 32px;">
              Halo <strong>${name}</strong>${schoolText}, <br/><br/>
              Gokil! Perjuangan kamu berbuah manis. Kami dengan bangga mengumumkan bahwa kamu <strong>LOLOS</strong> tahap Seleksi Administrasi program <strong>Youth Ekselensia Scholarship (YES) 2026</strong>. 🥳
            </p>

            <div style="background-color: #f0fdf4; border-radius: 20px; padding: 32px; border: 1px solid #dcfce7; margin-bottom: 32px;">
              <h3 style="color: #166534; margin-top: 0; font-size: 20px;">
                🚀 Apa Langkah Selanjutnya?
              </h3>
              <p style="color: #166534; font-size: 16px; line-height: 1.5; margin-bottom: 0;">
                Siapkan diri kamu buat <strong>Tes Tahap 2 (Akademik)</strong>. Info lengkap soal jadwal dan teknisnya bakal kita update terus di Instagram <a href="https://instagram.com/youthekselensia" style="color: #10b981; font-weight: bold; text-decoration: none;">@youthekselensia</a>. Jangan sampai ketinggalan ya!
              </p>
            </div>

            <p style="font-size: 14px; color: #64748b; text-align: center; margin-top: 40px; line-height: 1.5;">
              Sekali lagi selamat ya! Manfaatin waktu ini buat belajar dan persiapin mental. Sampai ketemu di tahap selanjutnya!
            </p>
          </div>

          <div style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0; font-size: 14px; color: #94a3b8;">
              Youth Ekselensia Scholarship — Mewujudkan Mimpi Anak Bangsa
            </p>
          </div>
        </div>
    `;
}

export async function sendAnnouncementLolosEmail(to: string, name: string, school?: string) {
    try {
      const html = getAnnouncementLolosHtml(name, school);
      console.log(`[Resend] Attempting to send Lolos email to: ${to}`);
      
      const { data, error } = await resend.emails.send({
        from: 'YES Scholarship <admin@youthekselensia.id>',
        to: [to],
        subject: '🎉 Selamat! Kamu Lolos Seleksi Administrasi YES 2026',
        tags: [
          { name: 'category', value: 'announcement' },
          { name: 'type', value: 'lolos' }
        ],
        html: html
      });

      if (error) {
        console.error("[Resend Error] Lolos email failed:", error);
        return { success: false, error };
      }

      console.log("[Resend Success] Lolos email sent, ID:", data?.id);
      return { success: true, id: data?.id };
    } catch (error) {
      console.error("Error sending lolos email:", error);
      return { success: false, error };
    }
}

export function getAnnouncementGagalHtml(name: string, reason?: string, school?: string): string {
    const schoolText = school ? ` dari <strong>${school}</strong>` : '';
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid #f1f5f9;">
          <!-- Header for Gagal -->
          <div style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 60px 40px; text-align: center;">
            <div style="background-color: rgba(255,255,255,0.2); display: inline-block; padding: 12px 24px; border-radius: 100px; color: #ffffff; font-size: 14px; font-weight: bold; margin-bottom: 24px; letter-spacing: 1px;">
              YES SCHOLARSHIP 2026
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; line-height: 1.2;">Semangat Terus, <br/>${name}! 💪</h1>
          </div>

          <div style="padding: 40px;">
            <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 32px;">
              Halo <strong>${name}</strong>${schoolText}, <br/><br/>
              Makasih banyak ya sudah daftar dan ikut proses seleksi administrasi program <strong>YES 2026</strong>. Kami sangat mengapresiasi semangat dan mimpi besar kamu!
            </p>

            <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 32px;">
              Setelah proses kurasi yang super ketat, dengan berat hati kami sampaikan bahwa kamu belum bisa lanjut ke tahap berikutnya untuk periode kali ini.
            </p>

            <div style="background-color: #f8fafc; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 32px;">
              <p style="margin: 0; font-size: 13px; color: #94a3b8; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">
                Catatan dari Tim Seleksi:
              </p>
              <p style="margin: 0; font-size: 15px; color: #475569; line-height: 1.5; font-style: italic;">
                "${reason || 'Tetap semangat, peluang lain masih menantimu!'}"
              </p>
            </div>

            <div style="text-align: center; background-color: #fff7ed; border-radius: 20px; padding: 24px; border: 1px solid #ffedd5;">
              <p style="margin: 0; font-size: 15px; color: #9a3412; line-height: 1.6;">
                <strong>Ingat ya:</strong> Kegagalan hari ini bukan akhir dari segalanya. Ini cuma satu langkah kecil buat kamu jadi lebih hebat lagi. Jangan nyerah sama mimpi kamu! 🌟
              </p>
            </div>

            <p style="font-size: 14px; color: #94a3b8; text-align: center; margin-top: 40px; line-height: 1.5;">
              Kami mendoakan yang terbaik buat langkah pendidikan kamu ke depan. Stay inspired!
            </p>
          </div>

          <div style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #f1f5f9;">
            <p style="margin: 0; font-size: 14px; color: #94a3b8;">
              Youth Ekselensia Scholarship — Tetaplah Menginspirasi
            </p>
          </div>
        </div>
    `;
}

export async function sendAnnouncementGagalEmail(to: string, name: string, reason?: string, school?: string) {
    try {
      const html = getAnnouncementGagalHtml(name, reason, school);
      console.log(`[Resend] Attempting to send Gagal email to: ${to}`);

      const { data, error } = await resend.emails.send({
        from: 'YES Scholarship <admin@youthekselensia.id>',
        to: [to],
        subject: 'Pengumuman Seleksi Administrasi YES 2026',
        tags: [
          { name: 'category', value: 'announcement' },
          { name: 'type', value: 'gagal' }
        ],
        html: html
      });

      if (error) {
        console.error("[Resend Error] Gagal email failed:", error);
        return { success: false, error };
      }

      console.log("[Resend Success] Gagal email sent, ID:", data?.id);
      return { success: true, id: data?.id };
    } catch (error) {
      console.error("Error sending gagal email:", error);
      return { success: false, error };
    }
}

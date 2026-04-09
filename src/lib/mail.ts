import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const INCOME_LABELS: Record<string, string> = {
  range_a: "0 - < 1 Juta",
  range_b: "1 - 2.5 Juta",
  range_c: "2.6 - 4 Juta",
  range_d: "4 - 5 Juta",
  range_e: "> 5 Juta",
};

/** Konversi Sanity asset _id ke CDN image URL (resize ke lebar tertentu) */
function assetIdToUrl(assetId: string | undefined, projectId: string, dataset: string, width = 400): string | null {
  if (!assetId) return null;
  // assetId: "image-abc123-1200x800-jpg" → CDN: abc123-1200x800.jpg
  const stripped = assetId.replace(/^image-/, '');
  const lastDash = stripped.lastIndexOf('-');
  if (lastDash === -1) return null;
  const filename = stripped.substring(0, lastDash) + '.' + stripped.substring(lastDash + 1);
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${filename}?w=${width}&auto=format`;
}

function row(label: string, value: string | number | null | undefined) {
  const v = value !== undefined && value !== null && value !== '' ? String(value) : '—';
  return `
    <tr>
      <td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">${label}</td>
      <td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${v}</td>
    </tr>`;
}

function sectionHeader(title: string) {
  return `<tr><td colspan="2" style="padding:16px 0 6px; font-size:14px; font-weight:700; color:#1e40af; border-bottom:2px solid #dbeafe;">${title}</td></tr>`;
}

function photoBlock(label: string, url: string | null) {
  if (!url) return '';
  return `
    <div style="display:inline-block; margin:6px 8px 6px 0; text-align:center; vertical-align:top;">
      <img src="${url}" alt="${label}" width="140" style="width:140px; height:105px; object-fit:cover; border-radius:8px; border:1px solid #e2e8f0; display:block;" />
      <p style="margin:4px 0 0; font-size:11px; color:#64748b;">${label}</p>
    </div>`;
}

export interface EmailDocData {
  biodata: {
    nama: string; nik: string; no_kk: string; email: string; whatsapp: string;
    jenis_kelamin: string; agama: string; tempat_lahir: string; tanggal_lahir: string;
    provinsi_nama: string; kabupaten_nama: string; kecamatan_nama: string;
    kelurahan_nama: string; alamat_detail: string;
    foto_diri_assetId?: string;
  };
  keluarga: {
    nama_ayah: string; kondisi_ayah: string; pekerjaan_ayah?: string;
    nama_ibu: string; kondisi_ibu: string; pekerjaan_ibu?: string;
    penghasilan_ortu: string; kontak_ortu: string; jumlah_saudara: number;
    file_kk_assetId?: string; file_sktm_assetId?: string; file_skb_assetId?: string;
  };
  seleksi: {
    asal_sekolah: string; jenjang_pendidikan: string;
    nilai_raport_1: number; nilai_raport_2: number; nilai_raport_3: number;
    foto_raport_1_assetId?: string; foto_raport_2_assetId?: string; foto_raport_3_assetId?: string;
    status_beasiswa: string; keterangan_beasiswa?: string;
    kategori_hafalan?: string; motivasi: string; sumber_info: string; social_media?: string;
    list_organisasi?: { jenis: string; jabatan: string; ket_lainnya?: string }[];
    list_prestasi?: { tingkat: string; juara: string; keterangan: string }[];
  };
}

export async function sendConfirmationEmail(to: string, name: string, docData?: EmailDocData) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

  // Build summary HTML if data provided
  let summaryHtml = '';
  if (docData) {
    const { biodata, keluarga, seleksi } = docData;

    const fotoDiriUrl = assetIdToUrl(biodata.foto_diri_assetId, projectId, dataset, 160);
    const kkUrl = assetIdToUrl(keluarga.file_kk_assetId, projectId, dataset, 400);
    const sktmUrl = assetIdToUrl(keluarga.file_sktm_assetId, projectId, dataset, 400);
    const skbUrl = assetIdToUrl(keluarga.file_skb_assetId, projectId, dataset, 400);
    const r1Url = assetIdToUrl(seleksi.foto_raport_1_assetId, projectId, dataset, 400);
    const r2Url = assetIdToUrl(seleksi.foto_raport_2_assetId, projectId, dataset, 400);
    const r3Url = assetIdToUrl(seleksi.foto_raport_3_assetId, projectId, dataset, 400);

    const alamatLengkap = [biodata.alamat_detail, biodata.kelurahan_nama, biodata.kecamatan_nama, biodata.kabupaten_nama, biodata.provinsi_nama].filter(Boolean).join(', ');
    const avgNilai = ((seleksi.nilai_raport_1 + seleksi.nilai_raport_2 + seleksi.nilai_raport_3) / 3).toFixed(2);

    const orgList = seleksi.list_organisasi?.length
      ? seleksi.list_organisasi.map((o, i) => `${i + 1}. ${o.jenis === 'Lainnya' ? o.ket_lainnya : o.jenis} — ${o.jabatan}`).join('<br/>')
      : '—';

    const presList = seleksi.list_prestasi?.length
      ? seleksi.list_prestasi.map((p, i) => `${i + 1}. ${p.keterangan} (${p.juara} Tk. ${p.tingkat})`).join('<br/>')
      : '—';

    summaryHtml = `
      <div style="margin-top:24px; border-top:2px solid #e2e8f0; padding-top:20px;">
        <h2 style="font-size:16px; font-weight:700; color:#1e293b; margin:0 0 16px;">Ringkasan Data Pendaftaran Kamu</h2>
        <p style="font-size:13px; color:#64748b; margin:0 0 16px;">Simpan email ini sebagai bukti bahwa data kamu telah berhasil tercatat. Pastikan semua data berikut sudah sesuai.</p>

        ${fotoDiriUrl ? `<div style="text-align:center; margin-bottom:16px;"><img src="${fotoDiriUrl}" width="100" style="width:100px; height:100px; object-fit:cover; border-radius:50%; border:3px solid #2563eb;" /><p style="font-size:12px; color:#64748b; margin:6px 0 0;">Foto Diri</p></div>` : ''}

        <table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif;">
          ${sectionHeader('📋 Biodata Diri')}
          ${row('Nama Lengkap', biodata.nama)}
          ${row('NIK', biodata.nik)}
          ${row('No KK', biodata.no_kk)}
          ${row('Jenis Kelamin', biodata.jenis_kelamin)}
          ${row('Agama', biodata.agama)}
          ${row('Tempat Lahir', biodata.tempat_lahir)}
          ${row('Tanggal Lahir', biodata.tanggal_lahir)}
          ${row('Email', biodata.email)}
          ${row('WhatsApp', '+62' + biodata.whatsapp)}
          ${row('Alamat Domisili', alamatLengkap)}

          ${sectionHeader('👨‍👩‍👧 Data Keluarga')}
          ${row('Nama Ayah', keluarga.nama_ayah)}
          ${row('Kondisi Ayah', keluarga.kondisi_ayah)}
          ${keluarga.pekerjaan_ayah ? row('Pekerjaan Ayah', keluarga.pekerjaan_ayah) : ''}
          ${row('Nama Ibu', keluarga.nama_ibu)}
          ${row('Kondisi Ibu', keluarga.kondisi_ibu)}
          ${keluarga.pekerjaan_ibu ? row('Pekerjaan Ibu', keluarga.pekerjaan_ibu) : ''}
          ${row('Penghasilan Ortu', INCOME_LABELS[keluarga.penghasilan_ortu] || keluarga.penghasilan_ortu || '—')}
          ${row('Kontak Ortu/Wali', keluarga.kontak_ortu)}
          ${row('Jumlah Saudara', keluarga.jumlah_saudara)}

          ${sectionHeader('🎓 Data Seleksi & Prestasi')}
          ${row('Asal Sekolah', seleksi.asal_sekolah)}
          ${row('Jenis Pendidikan', seleksi.jenjang_pendidikan)}
          ${row('Nilai Raport Sem 1', seleksi.nilai_raport_1)}
          ${row('Nilai Raport Sem 2', seleksi.nilai_raport_2)}
          ${row('Nilai Raport Sem 3', seleksi.nilai_raport_3)}
          ${row('Rata-rata Nilai', avgNilai)}
          ${row('Status Beasiswa', seleksi.status_beasiswa)}
          ${seleksi.keterangan_beasiswa ? row('Keterangan Beasiswa', seleksi.keterangan_beasiswa) : ''}
          ${seleksi.kategori_hafalan ? row('Hafalan Quran', seleksi.kategori_hafalan) : ''}
          <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; vertical-align:top;">Organisasi</td><td style="padding:6px 0; color:#1e293b; font-size:13px;">${orgList}</td></tr>
          <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; vertical-align:top;">Prestasi</td><td style="padding:6px 0; color:#1e293b; font-size:13px;">${presList}</td></tr>
          ${row('Sumber Info', seleksi.sumber_info)}
          ${seleksi.social_media ? row('Social Media', seleksi.social_media) : ''}
          <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; vertical-align:top;">Motivasi</td><td style="padding:6px 0; color:#1e293b; font-size:13px; line-height:1.5;">${seleksi.motivasi || '—'}</td></tr>
        </table>

        ${(kkUrl || sktmUrl || skbUrl || r1Url || r2Url || r3Url) ? `
        <div style="margin-top:20px; border-top:1px solid #e2e8f0; padding-top:16px;">
          <p style="font-size:14px; font-weight:700; color:#1e40af; margin:0 0 12px;">📎 Dokumen yang Diunggah</p>
          <div style="line-height:0;">
            ${photoBlock('Kartu Keluarga', kkUrl)}
            ${photoBlock('SKTM/KIP/PKH/KIS', sktmUrl)}
            ${photoBlock('SKB', skbUrl)}
            ${photoBlock('Raport Sem 1', r1Url)}
            ${photoBlock('Raport Sem 2', r2Url)}
            ${photoBlock('Raport Sem 3', r3Url)}
          </div>
        </div>` : ''}
      </div>`;
  }

  try {
    const { data, error } = await resend.emails.send({
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
            <p style="font-size:16px; color:#334155; margin-bottom:16px;">Hai <strong>${name}</strong>,</p>
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
                <a href="https://instagram.com/youthekselensia.id" style="color:#2563eb; font-weight:bold;">@youthekselensia.id</a>
              </p>
            </div>
            ${summaryHtml}
            <hr style="border:none; border-top:1px solid #e2e8f0; margin:28px 0 16px;" />
            <p style="font-size:12px; color:#94a3b8; text-align:center; margin:0;">
              Email ini dikirim otomatis. Mohon tidak membalas email ini.<br/>
              Jika ada pertanyaan, hubungi panitia melalui Instagram atau WhatsApp resmi YES.
            </p>
          </div>
        </div>
      `,
    });

    if (error) { console.error("Error sending email:", error); return { success: false, error }; }
    console.log("Email confirmation sent:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

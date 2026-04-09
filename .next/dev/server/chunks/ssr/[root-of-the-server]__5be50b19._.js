module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/sanity/client.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "client",
    ()=>client,
    "safeFetch",
    ()=>safeFetch,
    "writeClient",
    ()=>writeClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$index$2e$browser$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@sanity/client/dist/index.browser.js [app-rsc] (ecmascript) <locals>");
;
const projectId = ("TURBOPACK compile-time value", "lxtfznya");
const dataset = ("TURBOPACK compile-time value", "production") || 'production';
const apiVersion = '2024-02-03';
const client = ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$index$2e$browser$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])({
    projectId,
    dataset,
    apiVersion,
    useCdn: true
}) : "TURBOPACK unreachable";
const writeClient = ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$index$2e$browser$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])({
    projectId,
    dataset,
    apiVersion,
    token: process.env.SANITY_API_TOKEN,
    useCdn: false
}) : "TURBOPACK unreachable";
async function safeFetch(query, params) {
    if (!client) {
        console.warn('[Sanity] Client not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
        return [];
    }
    try {
        return await client.fetch(query, params);
    } catch (error) {
        console.error('[Sanity] Fetch error:', error);
        return [];
    }
}
}),
"[project]/src/app/admin/auth-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"008b4e6c188e3862240227792b926c3f5e421c92aa":"getAdminUser","00d86fab05de2f6c15afd9b5256f9ad719ec2c7569":"logoutAction","4003511742bee5421f4e70cbaf0b94af48b6d79cd8":"loginAction","4019263e5f038da1bca320c1292a91c74d844e9209":"verifyAdminPassword"},"",""] */ __turbopack_context__.s([
    "getAdminUser",
    ()=>getAdminUser,
    "loginAction",
    ()=>loginAction,
    "logoutAction",
    ()=>logoutAction,
    "verifyAdminPassword",
    ()=>verifyAdminPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
const ADMIN_MAPPING = [
    {
        username: 'admin_jabar',
        region: 'Jawa Barat'
    },
    {
        username: 'admin_jogja',
        region: 'DI Yogyakarta'
    },
    {
        username: 'admin_jatim',
        region: 'Jawa Timur'
    },
    {
        username: 'admin_sulsel',
        region: 'Sulawesi Selatan'
    },
    {
        username: 'admin_riau',
        region: 'Riau'
    },
    {
        username: 'admin_sumsel',
        region: 'Sumatera Selatan'
    },
    {
        username: 'admin_sumut',
        region: 'Sumatera Utara'
    },
    {
        username: 'admin_sumbar',
        region: 'Sumatera Barat'
    }
];
const USERS = [
    {
        username: 'superadmin',
        password: '1234',
        role: 'superadmin'
    },
    ...ADMIN_MAPPING.map((adm)=>({
            username: adm.username,
            password: '1234',
            role: 'admin_wilayah',
            region: adm.region
        }))
];
async function loginAction(formData) {
    const username = formData.get('username');
    const password = formData.get('password');
    if (!username || !password) {
        return {
            error: 'Username dan password wajib diisi'
        };
    }
    const user = USERS.find((u)=>u.username === username && u.password === password);
    if (!user) {
        return {
            error: 'Username atau Password salah'
        };
    }
    // Create token by base64 encoding the user object (Without password)
    const payload = {
        username: user.username,
        role: user.role,
        region: 'region' in user ? user.region : undefined
    };
    const token = Buffer.from(JSON.stringify(payload)).toString('base64');
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24
    });
    return {
        success: true
    };
}
async function logoutAction() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete('admin_token');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/admin/login');
}
async function verifyAdminPassword(password) {
    const adminUser = await getAdminUser();
    if (!adminUser) return false;
    const user = USERS.find((u)=>u.username === adminUser.username && u.password === password);
    return !!user;
}
async function getAdminUser() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get('admin_token')?.value;
    if (!token) return null;
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        return JSON.parse(decoded);
    } catch (e) {
        return null;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    loginAction,
    logoutAction,
    verifyAdminPassword,
    getAdminUser
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loginAction, "4003511742bee5421f4e70cbaf0b94af48b6d79cd8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logoutAction, "00d86fab05de2f6c15afd9b5256f9ad719ec2c7569", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(verifyAdminPassword, "4019263e5f038da1bca320c1292a91c74d844e9209", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAdminUser, "008b4e6c188e3862240227792b926c3f5e421c92aa", null);
}),
"[project]/src/app/admin/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4002718e7d104173832fc8b4c7ecfb876c8be08266":"deleteRekomendasi","402aef33e70dcd4b3fcbd9b1ae71152b1789b82ede":"saveRekomendasi","4065c9da40822eb26895568457ae80e7d540d89c92":"getApplications","40a2fa5907c02c738ed2289c9125b1e537acb50c8e":"deleteApplication","40b9281047d6ec60e9ce4ec26d58f56060a1b840bb":"getApplicationById","40d6b999f4d4516c7e100abf58b3307cb7e3bea798":"exportAllApplications","603d3563092b31a099a778f402375c3cf1a6401a04":"updateApplicationStatus","705410af886992832ddbfe0df421ad19752d43e44b":"updateApplicationData"},"",""] */ __turbopack_context__.s([
    "deleteApplication",
    ()=>deleteApplication,
    "deleteRekomendasi",
    ()=>deleteRekomendasi,
    "exportAllApplications",
    ()=>exportAllApplications,
    "getApplicationById",
    ()=>getApplicationById,
    "getApplications",
    ()=>getApplications,
    "saveRekomendasi",
    ()=>saveRekomendasi,
    "updateApplicationData",
    ()=>updateApplicationData,
    "updateApplicationStatus",
    ()=>updateApplicationStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$sanity$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/sanity/client.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/auth-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$sanity$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeClient"]) throw new Error("Sanity writeClient not configured");
const client = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$sanity$2f$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["writeClient"];
async function updateApplicationData(id, password, patch) {
    try {
        const adminUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminUser"])();
        if (!adminUser) return {
            success: false,
            error: "Tidak terautentikasi"
        };
        const isAuthorized = adminUser.role === 'superadmin' || adminUser.role === 'admin_wilayah';
        if (!isAuthorized) return {
            success: false,
            error: "Tidak punya akses edit"
        };
        const valid = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAdminPassword"])(password);
        if (!valid) return {
            success: false,
            error: "Password salah"
        };
        // Build a flat patch object only with defined values
        const sanityPatch = {};
        const bioFields = [
            'nama',
            'nik',
            'no_kk',
            'email',
            'whatsapp',
            'jenis_kelamin',
            'agama',
            'tempat_lahir',
            'tanggal_lahir',
            'alamat_detail'
        ];
        for (const f of bioFields){
            if (patch[f] !== undefined && patch[f] !== '') sanityPatch[`biodata.${f}`] = patch[f];
        }
        const keluargaFields = [
            'nama_ayah',
            'nama_ibu',
            'kondisi_ayah',
            'kondisi_ibu',
            'penghasilan_ortu',
            'kontak_ortu',
            'jumlah_saudara'
        ];
        for (const f of keluargaFields){
            if (patch[f] !== undefined && patch[f] !== '') sanityPatch[`keluarga.${f}`] = patch[f];
        }
        const seleksiFields = [
            'asal_sekolah',
            'jenjang_pendidikan',
            'nilai_raport_1',
            'nilai_raport_2',
            'nilai_raport_3',
            'status_beasiswa',
            'keterangan_beasiswa',
            'motivasi',
            'sumber_info',
            'social_media',
            'kategori_hafalan'
        ];
        for (const f of seleksiFields){
            if (patch[f] !== undefined && patch[f] !== '') sanityPatch[`seleksi.${f}`] = patch[f];
        }
        if (Object.keys(sanityPatch).length === 0) return {
            success: false,
            error: "Tidak ada data yang diubah"
        };
        await client.patch(id).set(sanityPatch).commit();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/admin/application/${id}`);
        return {
            success: true
        };
    } catch (error) {
        console.error("Error updating application data:", error);
        return {
            success: false,
            error: "Gagal menyimpan perubahan"
        };
    }
}
async function updateApplicationStatus(id, status) {
    try {
        await client.patch(id).set({
            status
        }).commit();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin');
        return {
            success: true
        };
    } catch (error) {
        console.error("Error updating status:", error);
        return {
            success: false,
            error: "Gagal mengupdate status"
        };
    }
}
async function deleteApplication(id) {
    try {
        await client.delete(id);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin');
        return {
            success: true
        };
    } catch (error) {
        console.error("Error deleting application:", error);
        return {
            success: false,
            error: "Gagal menghapus data"
        };
    }
}
async function saveRekomendasi(formData) {
    try {
        const adminUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminUser"])();
        if (!adminUser) return {
            success: false,
            error: "Unauthorized"
        };
        const id = formData.get('id');
        const tipe = formData.get('tipe');
        const catatan = formData.get('catatan');
        if (!id || !tipe || !catatan?.trim()) {
            return {
                success: false,
                error: "ID, tipe, dan catatan wajib diisi"
            };
        }
        // Upload bukti files
        const bukti = [];
        let i = 0;
        while(formData.has(`bukti_file_${i}`)){
            const file = formData.get(`bukti_file_${i}`);
            const keterangan = formData.get(`bukti_ket_${i}`) || '';
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const asset = await client.assets.upload('image', buffer, {
                    filename: file.name,
                    contentType: file.type
                });
                bukti.push({
                    _key: `bukti_${Date.now()}_${i}`,
                    keterangan,
                    file: {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: asset._id
                        }
                    }
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
                tanggal: new Date().toISOString()
            }
        }).commit();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/admin/application/${id}`);
        return {
            success: true
        };
    } catch (error) {
        console.error("Error saving rekomendasi:", error);
        return {
            success: false,
            error: "Gagal menyimpan rekomendasi"
        };
    }
}
async function deleteRekomendasi(id) {
    try {
        const adminUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminUser"])();
        if (!adminUser) return {
            success: false,
            error: "Unauthorized"
        };
        await client.patch(id).set({
            status: 'pending'
        }).unset([
            'rekomendasi'
        ]).commit();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/admin/application/${id}`);
        return {
            success: true
        };
    } catch (error) {
        console.error("Error deleting rekomendasi:", error);
        return {
            success: false,
            error: "Gagal menghapus rekomendasi"
        };
    }
}
const PAGE_SIZE = 20;
async function getApplications(page = 1) {
    try {
        const adminUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminUser"])();
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
        const data = await client.fetch(query, {
            start,
            end
        }, {
            cache: 'no-store'
        });
        return {
            items: data.items || [],
            total: data.total || 0,
            page,
            pageSize: PAGE_SIZE,
            totalPages: Math.ceil((data.total || 0) / PAGE_SIZE)
        };
    } catch (error) {
        console.error("Error fetching applications:", error);
        return {
            items: [],
            total: 0,
            page: 1,
            pageSize: PAGE_SIZE,
            totalPages: 0
        };
    }
}
async function exportAllApplications(onlyLolos = false) {
    try {
        const adminUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminUser"])();
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
        const data = await client.fetch(query, {}, {
            cache: 'no-store'
        });
        return data || [];
    } catch (error) {
        console.error("Error exporting applications:", error);
        return [];
    }
}
async function getApplicationById(id) {
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
        const data = await client.fetch(query, {
            id
        }, {
            cache: 'no-store'
        });
        return data;
    } catch (error) {
        console.error("Error fetching application:", error);
        return null;
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    updateApplicationData,
    updateApplicationStatus,
    deleteApplication,
    saveRekomendasi,
    deleteRekomendasi,
    getApplications,
    exportAllApplications,
    getApplicationById
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateApplicationData, "705410af886992832ddbfe0df421ad19752d43e44b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateApplicationStatus, "603d3563092b31a099a778f402375c3cf1a6401a04", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteApplication, "40a2fa5907c02c738ed2289c9125b1e537acb50c8e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveRekomendasi, "402aef33e70dcd4b3fcbd9b1ae71152b1789b82ede", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteRekomendasi, "4002718e7d104173832fc8b4c7ecfb876c8be08266", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getApplications, "4065c9da40822eb26895568457ae80e7d540d89c92", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(exportAllApplications, "40d6b999f4d4516c7e100abf58b3307cb7e3bea798", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getApplicationById, "40b9281047d6ec60e9ce4ec26d58f56060a1b840bb", null);
}),
"[project]/.next-internal/server/app/admin/application/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/admin/auth-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/auth-actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/admin/application/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/admin/auth-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "008b4e6c188e3862240227792b926c3f5e421c92aa",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminUser"],
    "00d86fab05de2f6c15afd9b5256f9ad719ec2c7569",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logoutAction"],
    "4002718e7d104173832fc8b4c7ecfb876c8be08266",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteRekomendasi"],
    "4003511742bee5421f4e70cbaf0b94af48b6d79cd8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginAction"],
    "4019263e5f038da1bca320c1292a91c74d844e9209",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyAdminPassword"],
    "402aef33e70dcd4b3fcbd9b1ae71152b1789b82ede",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveRekomendasi"],
    "4065c9da40822eb26895568457ae80e7d540d89c92",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getApplications"],
    "40a2fa5907c02c738ed2289c9125b1e537acb50c8e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteApplication"],
    "40b9281047d6ec60e9ce4ec26d58f56060a1b840bb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getApplicationById"],
    "40d6b999f4d4516c7e100abf58b3307cb7e3bea798",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["exportAllApplications"],
    "603d3563092b31a099a778f402375c3cf1a6401a04",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateApplicationStatus"],
    "705410af886992832ddbfe0df421ad19752d43e44b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateApplicationData"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$application$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/application/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/admin/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/admin/auth-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/auth-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5be50b19._.js.map
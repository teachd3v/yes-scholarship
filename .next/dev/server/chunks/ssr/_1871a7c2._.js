module.exports = [
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
"[project]/.next-internal/server/app/admin/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/auth-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/auth-actions.ts [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/admin/login/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/auth-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "4003511742bee5421f4e70cbaf0b94af48b6d79cd8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$login$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admin/login/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/admin/auth-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$auth$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/auth-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_1871a7c2._.js.map
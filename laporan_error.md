laporan error 1
02:24:53.133 Running build in Washington, D.C., USA (East) – iad1
02:24:53.134 Build machine configuration: 2 cores, 8 GB
02:24:53.256 Cloning github.com/teachd3v/yes-scholarship (Branch: main, Commit: 7b098cb)
02:24:54.868 Cloning completed: 1.612s
02:24:56.375 Restored build cache from previous deployment (L4cRpTzf2Ht5xA5dd9me8ZUdjZgW)
02:24:56.579 Running "vercel build"
02:24:57.233 Vercel CLI 51.6.1
02:24:57.590 Installing dependencies...
02:24:59.684 
02:24:59.684 up to date in 2s
02:24:59.685 
02:24:59.685 336 packages are looking for funding
02:24:59.685   run `npm fund` for details
02:24:59.715 Detected Next.js version: 16.1.6
02:24:59.723 Running "npm run build"
02:24:59.829 
02:24:59.829 > yes-scholarship@0.1.0 build
02:24:59.830 > next build
02:24:59.830 
02:25:00.866 ▲ Next.js 16.1.6 (Turbopack)
02:25:00.867 - Experiments (use with caution):
02:25:00.867   · serverActions
02:25:00.867 
02:25:00.875 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
02:25:00.919   Creating an optimized production build ...
02:26:05.937 ✓ Compiled successfully in 64s
02:26:05.939   Running TypeScript ...
02:26:16.162 Failed to compile.
02:26:16.163 
02:26:16.163 ./src/app/(site)/daftar-mentor/page.tsx:17:9
02:26:16.164 Type error: Type 'Resolver<{ foto_profil: any; nama_lengkap: string; jenis_kelamin: "Laki-Laki" | "Perempuan"; tempat_lahir: string; tanggal_lahir: string; whatsapp: string; email: string; provinsi: string; kabupaten: string; ... 20 more ...; siap_komitmen?: boolean | undefined; }, any, { ...; }>' is not assignable to type 'Resolver<{ foto_profil: any; nama_lengkap: string; jenis_kelamin: "Laki-Laki" | "Perempuan"; tempat_lahir: string; tanggal_lahir: string; whatsapp: string; email: string; provinsi: string; kabupaten: string; ... 20 more ...; kelurahan_nama?: string | undefined; }, any, { ...; }>'.
02:26:16.164   Types of parameters 'options' and 'options' are incompatible.
02:26:16.164     Type 'ResolverOptions<{ foto_profil: any; nama_lengkap: string; jenis_kelamin: "Laki-Laki" | "Perempuan"; tempat_lahir: string; tanggal_lahir: string; whatsapp: string; email: string; provinsi: string; kabupaten: string; ... 20 more ...; kelurahan_nama?: string | undefined; }>' is not assignable to type 'ResolverOptions<{ foto_profil: any; nama_lengkap: string; jenis_kelamin: "Laki-Laki" | "Perempuan"; tempat_lahir: string; tanggal_lahir: string; whatsapp: string; email: string; provinsi: string; kabupaten: string; ... 20 more ...; siap_komitmen?: boolean | undefined; }>'.
02:26:16.164       Type 'boolean | undefined' is not assignable to type 'boolean'.
02:26:16.165         Type 'undefined' is not assignable to type 'boolean'.
02:26:16.165 
02:26:16.165 [0m [90m 15 |[39m [36mexport[39m [36mdefault[39m [36mfunction[39m [33mDaftarMentorPage[39m() {
02:26:16.165  [90m 16 |[39m     [36mconst[39m methods [33m=[39m useForm[33m<[39m[33mMentorSchemaType[39m[33m>[39m({
02:26:16.166 [31m[1m>[22m[39m[90m 17 |[39m         resolver[33m:[39m zodResolver(mentorSchema)[33m,[39m
02:26:16.166  [90m    |[39m         [31m[1m^[22m[39m
02:26:16.166  [90m 18 |[39m         defaultValues[33m:[39m {
02:26:16.166  [90m 19 |[39m             nama_lengkap[33m:[39m [32m""[39m[33m,[39m
02:26:16.166  [90m 20 |[39m             jenis_kelamin[33m:[39m undefined[33m,[39m[0m
02:26:16.228 Next.js build worker exited with code: 1 and signal: null
02:26:16.287 Error: Command "npm run build" exited with 1

laporan error 2
02:29:37.867 Running build in Washington, D.C., USA (East) – iad1
02:29:37.868 Build machine configuration: 2 cores, 8 GB
02:29:37.978 Cloning github.com/teachd3v/yes-scholarship (Branch: main, Commit: dd1507a)
02:29:39.776 Cloning completed: 1.798s
02:29:41.710 Restored build cache from previous deployment (L4cRpTzf2Ht5xA5dd9me8ZUdjZgW)
02:29:42.134 Running "vercel build"
02:29:42.993 Vercel CLI 51.6.1
02:29:43.467 Installing dependencies...
02:29:45.717 
02:29:45.718 up to date in 2s
02:29:45.718 
02:29:45.718 336 packages are looking for funding
02:29:45.719   run `npm fund` for details
02:29:45.747 Detected Next.js version: 16.1.6
02:29:45.756 Running "npm run build"
02:29:45.860 
02:29:45.861 > yes-scholarship@0.1.0 build
02:29:45.861 > next build
02:29:45.861 
02:29:46.905 ▲ Next.js 16.1.6 (Turbopack)
02:29:46.906 - Experiments (use with caution):
02:29:46.906   · serverActions
02:29:46.907 
02:29:46.914 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
02:29:46.956   Creating an optimized production build ...
02:30:51.384 ✓ Compiled successfully in 64s
02:30:51.386   Running TypeScript ...
02:31:01.627 Failed to compile.
02:31:01.628 
02:31:01.629 ./src/app/(site)/daftar-mentor/page.tsx:17:9
02:31:01.629 Type error: Type 'Resolver<{ foto_profil: any; nama_lengkap: string; jenis_kelamin: "Laki-Laki" | "Perempuan"; tempat_lahir: string; tanggal_lahir: string; whatsapp: string; email: string; provinsi: string; kabupaten: string; ... 20 more ...; siap_komitmen?: boolean | undefined; }, any, { ...; }>' is not assignable to type 'Resolver<{ foto_profil: any; nama_lengkap: string; jenis_kelamin: "Laki-Laki" | "Perempuan"; tempat_lahir: string; tanggal_lahir: string; whatsapp: string; email: string; provinsi: string; kabupaten: string; ... 20 more ...; kelurahan_nama?: string | undefined; }, any, { ...; }>'.
02:31:01.630   Types of parameters 'options' and 'options' are incompatible.
02:31:01.630     Type 'ResolverOptions<{ foto_profil: any; nama_lengkap: string; jenis_kelamin: "Laki-Laki" | "Perempuan"; tempat_lahir: string; tanggal_lahir: string; whatsapp: string; email: string; provinsi: string; kabupaten: string; ... 20 more ...; kelurahan_nama?: string | undefined; }>' is not assignable to type 'ResolverOptions<{ foto_profil: any; nama_lengkap: string; jenis_kelamin: "Laki-Laki" | "Perempuan"; tempat_lahir: string; tanggal_lahir: string; whatsapp: string; email: string; provinsi: string; kabupaten: string; ... 20 more ...; siap_komitmen?: boolean | undefined; }>'.
02:31:01.631       Type 'boolean | undefined' is not assignable to type 'boolean'.
02:31:01.631         Type 'undefined' is not assignable to type 'boolean'.
02:31:01.631 
02:31:01.632 [0m [90m 15 |[39m [36mexport[39m [36mdefault[39m [36mfunction[39m [33mDaftarMentorPage[39m() {
02:31:01.632  [90m 16 |[39m     [36mconst[39m methods [33m=[39m useForm[33m<[39m[33mMentorSchemaType[39m[33m>[39m({
02:31:01.632 [31m[1m>[22m[39m[90m 17 |[39m         resolver[33m:[39m zodResolver(mentorSchema)[33m,[39m
02:31:01.632  [90m    |[39m         [31m[1m^[22m[39m
02:31:01.633  [90m 18 |[39m         defaultValues[33m:[39m {
02:31:01.633  [90m 19 |[39m             nama_lengkap[33m:[39m [32m""[39m[33m,[39m
02:31:01.633  [90m 20 |[39m             jenis_kelamin[33m:[39m undefined[33m,[39m[0m
02:31:01.698 Next.js build worker exited with code: 1 and signal: null
02:31:01.763 Error: Command "npm run build" exited with 1

laporan error 3
02:29:37.867 Running build in Washington, D.C., USA (East) – iad1
02:29:37.868 Build machine configuration: 2 cores, 8 GB
02:29:37.978 Cloning github.com/teachd3v/yes-scholarship (Branch: main, Commit: dd1507a)
02:29:39.776 Cloning completed: 1.798s
02:29:41.710 Restored build cache from previous deployment (L4cRpTzf2Ht5xA5dd9me8ZUdjZgW)
02:29:42.134 Running "vercel build"
02:29:42.993 Vercel CLI 51.6.1
02:29:43.467 Installing dependencies...
02:29:45.717 
02:29:45.718 up to date in 2s
02:29:45.718 
02:29:45.718 336 packages are looking for funding
02:29:45.719   run `npm fund` for details
02:29:45.747 Detected Next.js version: 16.1.6
02:29:45.756 Running "npm run build"
02:29:45.860 
02:29:45.861 > yes-scholarship@0.1.0 build
02:29:45.861 > next build
02:29:45.861 
02:29:46.905 ▲ Next.js 16.1.6 (Turbopack)
02:29:46.906 - Experiments (use with caution):
02:29:46.906   · serverActions
02:29:46.907 
02:29:46.914 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
02:29:46.956   Creating an optimized production build ...
02:30:51.384 ✓ Compiled successfully in 64s
02:30:51.386   Running TypeScript ...
02:31:01.627 Failed to compile.
02:31:01.628 
02:31:01.629 ./src/app/(site)/daftar-mentor/page.tsx:17:9
02:31:01.629 Type error: Type 'Resolver<{ foto_profil: any; nama_lengkap: string; jenis_kelamin: "Laki-Laki" | "Perempuan"; tempat_lahir: string; tanggal_lahir: string; whatsapp: string; email: string; provinsi: string; kabupaten: string; ... 20 more ...; siap_komitmen?: boolean | undefined; }, any, { ...; }>' is not assignable to type 'Resolver<{ foto_profil: any; nama_lengkap: string; jenis_kelamin: "Laki-Laki" | "Perempuan"; tempat_lahir: string; tanggal_lahir: string; whatsapp: string; email: string; provinsi: string; kabupaten: string; ... 20 more ...; kelurahan_nama?: string | undefined; }, any, { ...; }>'.
02:31:01.630   Types of parameters 'options' and 'options' are incompatible.
02:31:01.630     Type 'ResolverOptions<{ foto_profil: any; nama_lengkap: string; jenis_kelamin: "Laki-Laki" | "Perempuan"; tempat_lahir: string; tanggal_lahir: string; whatsapp: string; email: string; provinsi: string; kabupaten: string; ... 20 more ...; kelurahan_nama?: string | undefined; }>' is not assignable to type 'ResolverOptions<{ foto_profil: any; nama_lengkap: string; jenis_kelamin: "Laki-Laki" | "Perempuan"; tempat_lahir: string; tanggal_lahir: string; whatsapp: string; email: string; provinsi: string; kabupaten: string; ... 20 more ...; siap_komitmen?: boolean | undefined; }>'.
02:31:01.631       Type 'boolean | undefined' is not assignable to type 'boolean'.
02:31:01.631         Type 'undefined' is not assignable to type 'boolean'.
02:31:01.631 
02:31:01.632 [0m [90m 15 |[39m [36mexport[39m [36mdefault[39m [36mfunction[39m [33mDaftarMentorPage[39m() {
02:31:01.632  [90m 16 |[39m     [36mconst[39m methods [33m=[39m useForm[33m<[39m[33mMentorSchemaType[39m[33m>[39m({
02:31:01.632 [31m[1m>[22m[39m[90m 17 |[39m         resolver[33m:[39m zodResolver(mentorSchema)[33m,[39m
02:31:01.632  [90m    |[39m         [31m[1m^[22m[39m
02:31:01.633  [90m 18 |[39m         defaultValues[33m:[39m {
02:31:01.633  [90m 19 |[39m             nama_lengkap[33m:[39m [32m""[39m[33m,[39m
02:31:01.633  [90m 20 |[39m             jenis_kelamin[33m:[39m undefined[33m,[39m[0m
02:31:01.698 Next.js build worker exited with code: 1 and signal: null
02:31:01.763 Error: Command "npm run build" exited with 1

laporan error 4
02:36:35.869 Running build in Washington, D.C., USA (East) – iad1
02:36:35.869 Build machine configuration: 2 cores, 8 GB
02:36:36.090 Cloning github.com/teachd3v/yes-scholarship (Branch: main, Commit: ff7cdde)
02:36:38.828 Cloning completed: 2.738s
02:36:38.931 Restored build cache from previous deployment (L4cRpTzf2Ht5xA5dd9me8ZUdjZgW)
02:36:39.139 Running "vercel build"
02:36:40.030 Vercel CLI 51.6.1
02:36:40.327 Installing dependencies...
02:36:42.470 
02:36:42.470 up to date in 2s
02:36:42.471 
02:36:42.471 336 packages are looking for funding
02:36:42.471   run `npm fund` for details
02:36:42.500 Detected Next.js version: 16.1.6
02:36:42.508 Running "npm run build"
02:36:42.609 
02:36:42.610 > yes-scholarship@0.1.0 build
02:36:42.610 > next build
02:36:42.610 
02:36:43.634 ▲ Next.js 16.1.6 (Turbopack)
02:36:43.635 - Experiments (use with caution):
02:36:43.635   · serverActions
02:36:43.636 
02:36:43.643 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
02:36:43.684   Creating an optimized production build ...
02:37:50.255 ✓ Compiled successfully in 66s
02:37:50.257   Running TypeScript ...
02:38:01.607 Failed to compile.
02:38:01.607 
02:38:01.607 ./src/app/admin/DashboardClient.tsx:168:51
02:38:01.608 Type error: Property 'lancar_baca_quran' does not exist on type '{ social_media: string; lancar_quran: string; sumber_info: string; motivasi: string; cv_resume_url?: string | undefined; berakhlak_islam_tidak_merokok?: boolean | undefined; bersedia_rangkaian_program?: boolean | undefined; mampu_mengajar_ptn?: boolean | undefined; komunikatif_remaja?: boolean | undefined; hafalan_1...'. Did you mean 'lancar_quran'?
02:38:01.608 
02:38:01.608 [0m [90m 166 |[39m                     [32m'Jurusan'[39m[33m:[39m m[33m.[39mpendidikan[33m.[39mjurusan[33m,[39m
02:38:01.608  [90m 167 |[39m                     [32m'Status'[39m[33m:[39m m[33m.[39mstatus[33m,[39m
02:38:01.609 [31m[1m>[22m[39m[90m 168 |[39m                     [32m'Lancar Al-Quran'[39m[33m:[39m m[33m.[39mtambahan[33m.[39mlancar_baca_quran[33m,[39m
02:38:01.609  [90m     |[39m                                                   [31m[1m^[22m[39m
02:38:01.609  [90m 169 |[39m                     [32m'Alasan Gagal'[39m[33m:[39m [m[33m.[39mscoring[33m?[39m[33m.[39malasan_gagal[33m?[39m[33m.[39mjoin([32m', '[39m)[33m,[39m m[33m.[39mrejectedReason][33m.[39mfilter([33mBoolean[39m)[33m.[39mjoin([32m' | '[39m) [33m||[39m [32m'-'[39m
02:38:01.610  [90m 170 |[39m                 })))[33m;[39m
02:38:01.610  [90m 171 |[39m                 [36mconst[39m workbook [33m=[39m [33mXLSX[39m[33m.[39mutils[33m.[39mbook_new()[33m;[39m[0m
02:38:01.675 Next.js build worker exited with code: 1 and signal: null
02:38:01.733 Error: Command "npm run build" exited with 1

laporan error 5
02:41:53.242 Running build in Washington, D.C., USA (East) – iad1
02:41:53.243 Build machine configuration: 2 cores, 8 GB
02:41:53.370 Cloning github.com/teachd3v/yes-scholarship (Branch: main, Commit: b6fe6b9)
02:41:54.986 Cloning completed: 1.615s
02:41:56.211 Restored build cache from previous deployment (L4cRpTzf2Ht5xA5dd9me8ZUdjZgW)
02:41:56.407 Running "vercel build"
02:41:57.440 Vercel CLI 51.6.1
02:41:57.744 Installing dependencies...
02:41:59.908 
02:41:59.909 up to date in 2s
02:41:59.909 
02:41:59.910 336 packages are looking for funding
02:41:59.910   run `npm fund` for details
02:41:59.939 Detected Next.js version: 16.1.6
02:41:59.947 Running "npm run build"
02:42:00.051 
02:42:00.051 > yes-scholarship@0.1.0 build
02:42:00.051 > next build
02:42:00.052 
02:42:01.163 ▲ Next.js 16.1.6 (Turbopack)
02:42:01.163 - Experiments (use with caution):
02:42:01.164   · serverActions
02:42:01.164 
02:42:01.171 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
02:42:01.213   Creating an optimized production build ...
02:43:06.710 ✓ Compiled successfully in 65s
02:43:06.712   Running TypeScript ...
02:43:16.915 Failed to compile.
02:43:16.916 
02:43:16.916 ./src/app/admin/DashboardClient.tsx:320:55
02:43:16.916 Type error: Type 'number | undefined' is not assignable to type 'number'.
02:43:16.917   Type 'undefined' is not assignable to type 'number'.
02:43:16.917 
02:43:16.917 [0m [90m 318 |[39m                 [33m<[39m[33mStatCard[39m label[33m=[39m[32m"Rejected"[39m value[33m=[39m{stats[33m.[39mrejected} icon[33m=[39m{[33m<[39m[33mX[39m size[33m=[39m{[35m16[39m} [35m/>} color="bg-gray-100 text-gray-800" /[39m[33m>[39m
02:43:16.918  [90m 319 |[39m                 {activeTab [33m===[39m [32m'applicants'[39m [33m&&[39m (
02:43:16.918 [31m[1m>[22m[39m[90m 320 |[39m                     [33m<[39m[33mStatCard[39m label[33m=[39m[32m"Lolos Screening"[39m value[33m=[39m{stats[33m.[39mlolos} icon[33m=[39m{[33m<[39m[33mCheckCircle[39m size[33m=[39m{[35m16[39m} [35m/>} color="bg-green-50 text-green-700" /[39m[33m>[39m
02:43:16.918  [90m     |[39m                                                       [31m[1m^[22m[39m
02:43:16.918  [90m 321 |[39m                 )}
02:43:16.918  [90m 322 |[39m             [33m<[39m[33m/[39m[33mdiv[39m[33m>[39m
02:43:16.919  [90m 323 |[39m[0m
02:43:16.978 Next.js build worker exited with code: 1 and signal: null
02:43:17.038 Error: Command "npm run build" exited with 1

laporan error 6
02:45:23.447 Running build in Washington, D.C., USA (East) – iad1
02:45:23.448 Build machine configuration: 2 cores, 8 GB
02:45:23.632 Cloning github.com/teachd3v/yes-scholarship (Branch: main, Commit: 66dca59)
02:45:25.513 Cloning completed: 1.881s
02:45:26.343 Restored build cache from previous deployment (L4cRpTzf2Ht5xA5dd9me8ZUdjZgW)
02:45:27.131 Running "vercel build"
02:45:27.802 Vercel CLI 51.6.1
02:45:28.089 Installing dependencies...
02:45:30.180 
02:45:30.181 up to date in 2s
02:45:30.181 
02:45:30.182 336 packages are looking for funding
02:45:30.182   run `npm fund` for details
02:45:30.211 Detected Next.js version: 16.1.6
02:45:30.218 Running "npm run build"
02:45:31.183 
02:45:31.184 > yes-scholarship@0.1.0 build
02:45:31.184 > next build
02:45:31.185 
02:45:32.226 ▲ Next.js 16.1.6 (Turbopack)
02:45:32.226 - Experiments (use with caution):
02:45:32.227   · serverActions
02:45:32.227 
02:45:32.235 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
02:45:32.280   Creating an optimized production build ...
02:46:32.866 ✓ Compiled successfully in 60s
02:46:32.868   Running TypeScript ...
02:46:42.961 Failed to compile.
02:46:42.961 
02:46:42.961 ./src/app/admin/application/[id]/page.tsx:108:26
02:46:42.961 Type error: Cannot find name 'XCircle'.
02:46:42.961 
02:46:42.962 [0m [90m 106 |[39m                 [33m<[39m[33mdiv[39m className[33m=[39m[32m"bg-red-50 border border-red-200 rounded-xl overflow-hidden shadow-sm"[39m[33m>[39m
02:46:42.962  [90m 107 |[39m                     [33m<[39m[33mdiv[39m className[33m=[39m[32m"px-6 py-3 border-b border-red-200 bg-red-100/50 flex items-center gap-2"[39m[33m>[39m
02:46:42.962 [31m[1m>[22m[39m[90m 108 |[39m                         [33m<[39m[33mXCircle[39m size[33m=[39m{[35m18[39m} className[33m=[39m[32m"text-red-600"[39m [33m/[39m[33m>[39m
02:46:42.962  [90m     |[39m                          [31m[1m^[22m[39m
02:46:42.962  [90m 109 |[39m                         [33m<[39m[33mh3[39m className[33m=[39m[32m"font-bold text-red-800 text-sm"[39m[33m>[39m[33mAlasan[39m [33mPenolakan[39m ([33mAdmin[39m)[33m<[39m[33m/[39m[33mh3[39m[33m>[39m
02:46:42.962  [90m 110 |[39m                     [33m<[39m[33m/[39m[33mdiv[39m[33m>[39m
02:46:42.962  [90m 111 |[39m                     [33m<[39m[33mdiv[39m className[33m=[39m[32m"p-5"[39m[33m>[39m[0m
02:46:43.008 Next.js build worker exited with code: 1 and signal: null
02:46:43.064 Error: Command "npm run build" exited with 1
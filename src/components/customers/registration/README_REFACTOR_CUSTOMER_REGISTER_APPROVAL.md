# README Implementasi — Refactor & Redesign Customer Register Approval

**Proyek:** Epanel / Ekaplus Admin (Next.js + TypeScript)  
**Area:** Customer > Customer Register (`/customers/registrations`)  
**Target utama:** `ApproveRegistrationModal.tsx`  
**Prioritas:** Perbaikan integritas data approval, kemudian redesign UI/UX  
**Batasan:** **FRONTEND ONLY**. Gunakan endpoint Golang yang sudah ada. **Jangan mengubah backend, database, endpoint, autentikasi, atau kontrak API.** Jika ada kemampuan yang tidak tersedia di API saat ini, gunakan perilaku paling aman, dokumentasikan keterbatasannya, dan jangan mengarang endpoint.

> **Instruksi untuk Codex:** Baca file implementasi aktual dan `README.md` Customer Register terlebih dahulu. Dokumen ini merupakan spesifikasi target, bukan klaim bahwa fitur tersebut sudah tersedia. Implementasikan perubahan pada kode nyata dengan menjaga payload, hak akses, dan mekanisme Saga yang telah berjalan. Jangan berhenti hanya pada mockup.

---

## 1. Latar belakang dan masalah saat ini

Implementasi sekarang menggunakan wizard lima langkah: National Brand (NB) → Group Parent (GP) → Group Customer (GC) → Branch Customer (BC) → Commit Approve.

Pada `ApproveRegistrationModal.tsx`, fungsi `handleNextStep()` sekarang melakukan POST NB, GP, dan GC **ketika admin menekan Next**. Baru kemudian `handleSubmitApproval()` mengirim PUT Customer Register. Ini mengakibatkan master yang belum disetujui terlanjur dibuat apabila admin Back, Cancel, menutup browser, atau mengganti pilihan. Ada risiko master yatim, salah relasi, dan duplikat.

Temuan spesifik yang harus diperiksa pada versi sumber terbaru:

- `handleNextStep()` berisi operasi POST National Brand, Group Parent, dan Group Customer.
- `handleSubmitApproval()` masih mengandalkan ID master yang tercipta sebelumnya.
- `effectiveBcid = existingBcid || selectedBcid || undefined` membuat nilai lama selalu lebih dominan daripada pilihan baru.
- `canSearchExistingBc = Boolean(false)` menonaktifkan pemilihan BC existing.
- State `createdNbid/createdGpid/createdGcid`, `selected*`, dan `*CreatedViaCreateFlow` berpotensi tidak sinkron jika pilihan berubah.
- BC mempunyai ketergantungan dengan mekanisme pembuatan/resolusi dan Saga backend. **Jangan membuat BC di dua tempat.**

### Tujuan utama

1. Jadikan approval **satu halaman/area scroll**, bukan lima tab atau stepper Next/Back.
2. Terapkan **Search First → Select Existing / Create New**, bukan tab/toggle mode.
3. **Tidak ada POST NB/GP/GC/BC selama admin mencari, mengetik, memilih, mengubah, atau membatalkan draft**.
4. POST master baru hanya sesudah admin menekan **Commit Approve**.
5. Hasil POST NB.id digunakan sebagai `group_parent.nbid`; GP.id sebagai `group_customer.gpid`; GC.id sebagai `branch_customer.gcid` apabila BC memang dibuat oleh frontend sesuai API existing.
6. Pertahankan semua field penting dari payload, validasi, keamanan, dan proses Saga yang sudah bekerja.
7. Retry harus **melanjutkan dari operasi yang berhasil**, bukan mengirim ulang semua POST.

## 2. Scope dan non-scope

### Dalam scope

- Refactor `ApproveRegistrationModal.tsx`, termasuk state, pencarian, hierarki, validasi, summary, commit, loading, error handling, dan aksesibilitas.
- Bila bermanfaat, pecah UI menjadi komponen kecil seperti `MasterSearchSection`, `MasterSelectionCard`, `ApprovalSummary`, `ApprovalProgress` dan helper/hook khusus; jangan memecah menjadi halaman/tab terpisah.
- Penyesuaian minor di `CustomerRegistrationList.tsx`/`RegistrationDetailModal.tsx` jika diperlukan untuk refresh dan penyajian status.
- Update README existing dan tambahkan test sesuai setup repository.

### Di luar scope

- Perubahan backend Golang/DB/schema, endpoint baru, migrasi data, atau API approval transaksional baru.
- Penghapusan otomatis master yang sudah sempat dibuat.
- Perubahan kebijakan role admin untuk Resync/Rollback.
- Redesign penuh halaman lain yang tidak terkait approval.

## 3. Desain UI target — satu halaman

Desain mengikuti `DESIGN.md` repository bila tersedia, identitas Ekatunggal Group, dominan **maroon**, nuansa enterprise, rapi, responsif, tidak menggunakan warna biru sebagai warna primer.

### Struktur visual

```text
┌───────────────────────────────────────────────────────────────┐
│ Approve Customer                                             │
│ PT MAJU BERSAMA • Cabang Bogor                    [Request]   │
├───────────────────────────────────────────────────────────────┤
│ Hierarki Customer                                            │
│                                                               │
│ NATIONAL BRAND (opsional)                                    │
│ [ Cari nama National Brand ...                         🔎 ]   │
│   Hasil existing / pilihan terpilih                           │
│   [+ Buat National Brand Baru]    [Lewati / Tanpa NB]          │
│                                                               │
│ GROUP PARENT (wajib)                                         │
│ [ Cari nama Group Parent ...                           🔎 ]   │
│   Hasil existing sesuai NB / hasil pencarian relevan          │
│   [+ Buat Group Parent Baru]                                  │
│                                                               │
│ GROUP CUSTOMER (wajib)                                       │
│ [ Cari nama Group Customer ...                         🔎 ]   │
│   Hasil existing hanya milik GP yang valid                    │
│   [+ Buat Group Customer Baru]                                │
│                                                               │
│ BRANCH CUSTOMER                                              │
│ [ Cari Branch Customer ... (jika API mendukung)         🔎 ]   │
│   Existing / akan dibuat atau di-resolve oleh Saga            │
│                                                               │
│ RINGKASAN APPROVAL                                           │
│ NB: Existing / Baru / Tanpa NB                                │
│ GP: Existing / Akan Dibuat                                    │
│ GC: Existing / Akan Dibuat                                    │
│ BC: Existing / Akan Diresolve / Akan Dibuat                   │
├───────────────────────────────────────────────────────────────┤
│ [Batal]                     [Commit Approve]  (sticky footer) │
└───────────────────────────────────────────────────────────────┘
```

### Interaksi pencarian (seragam untuk NB/GP/GC/BC yang didukung)

1. Admin langsung melihat **satu kolom search** per master, tanpa tab `Pilih Existing` dan `Buat Baru`.
2. Admin mengetik nama. Gunakan debounce sekitar 300–400 ms jika perlu request; filter lokal jika data sudah di-cache.
3. Tampilkan daftar existing yang relevan (nama lengkap, kode/ID, dan parent jika tersedia). Jangan menganggap `name` sebagai nama bisnis jika ada field `gp_name`, `gc_name`, `nb_name`, `bcid_name`.
4. Tampilkan aksi **`+ Buat [Master] Baru`** dalam area yang sama, **termasuk ketika hasil existing ada**. Namun, jika nama identik ditemukan, tampilkan peringatan dan jangan izinkan duplikat yang jelas secara sembarangan.
5. Klik hasil existing → tampilkan **selected summary** dengan badge `Existing`, ID aktual, dan aksi `Ubah`.
6. Klik `Buat Baru` → tampilkan form inline, nama awal dari query (tetap editable), label **`Akan Dibuat`**, tombol `Gunakan Nama Ini`. **Tombol ini hanya menyimpan draft lokal, bukan POST.**
7. Saat item baru dipilih, tampilkan summary terpilih dan aksi `Ubah`; pencarian tidak perlu memenuhi layar setelah pilihan ditetapkan.
8. NB menyediakan aksi **`Tanpa National Brand`** karena opsional; GP dan GC wajib.
9. Untuk pilihan di bawah parent baru yang belum punya ID, jangan tampilkan existing yang tidak dapat memiliki relasi ke parent baru. Berikan penjelasan singkat dan form pembuatan child baru.
10. Saat loading/empty/error, tampilkan state yang berbeda: `Mencari...`, `Tidak ditemukan`, atau `Pencarian gagal` dengan `Coba lagi`. **Gagal load API bukan berarti tidak ada data**, sehingga jangan mengizinkan Buat Baru seolah hasil pencarian pasti kosong.
11. Search tidak boleh membanjiri API; gunakan cache/deduping request, AbortController atau request sequence untuk menghindari hasil lama mengganti hasil baru.
12. Semua form harus keyboard-friendly, memiliki focus, label, feedback error dekat input, dan responsive untuk mobile/desktop.

## 4. Data hierarchy dan aturan pemilihan

```text
NB.id  ──> group_parent.nbid (NB opsional)
GP.id  ──> group_customer.gpid
GC.id  ──> branch_customer.gcid
BC.id  ──> customer_register.bcid (jika tersedia/digunakan)
NB/GP/GC IDs ──> customer_register.nbid/gpid/gcid
```

**Prinsip:** selama draft, parent yang baru **tidak memiliki ID**. Simpan referensi draft secara konseptual (`mode: 'create'`) dan resolve ID baru pada Commit secara berurutan.

Aturan perubahan parent:

- NB existing/baru/tanpa NB: GP existing harus diperiksa relasi `nbid`-nya. Bila tidak cocok, tampilkan incompatibility dan minta admin memilih GP lain atau buat GP baru. Jangan diam-diam mengubah hubungan GP existing.
- Mengganti NB → invalidasi/reset GP, GC, BC yang tidak kompatibel; jangan menghapus semua pilihan tanpa perlu jika relasinya tetap valid.
- GP baru → GC harus baru; BC juga tidak bisa existing di bawah GC baru.
- GP existing → GC existing hanya dari `gpid` tersebut, atau buat GC baru.
- Mengganti GP → reset/validasi GC dan BC.
- GC baru → BC baru / resolusi Saga; jangan memilih BC existing yang berasal dari GC berbeda.
- GC existing → BC existing harus punya `gcid` sama dan cabang sesuai bila branch menjadi bagian identitas.
- Jika register sudah punya `nb_id/gp_id/gc_id/bc_id`, gunakan sebagai nilai awal **hanya jika valid**; pilihan terbaru admin adalah sumber kebenaran. Jangan gunakan pola `existingBcid || selectedBcid`.
- Jangan izinkan menggabungkan parent/child yang tidak memiliki relasi konsisten meskipun nama terlihat sama.

### Keputusan BC — pertahankan kontrak existing

README lama tidak sepenuhnya konsisten: flow usulan menginginkan BC sebelum submit, sedangkan implementasi sekarang menunda create/resolve BC ke proses final/Saga. Codex **wajib menelusuri payload builder `buildCustomerRegisterApprovePayload`, endpoint yang benar-benar dipanggil, data `registration`, dan dokumentasi Saga** sebelum mengubah BC.

- Bila API existing mendukung query BC existing secara benar, aktifkan search BC dengan filter GC + branch dan validasi hasilnya.
- Bila API/backend saat ini membuat BC lewat Saga, **jangan POST BC secara terpisah**. Tampilkan status `Akan Diresolve oleh Sinkronisasi`, lalu kirim `bcid` sesuai kontrak saat ini (bisa null jika diperbolehkan).
- Bila BC existing ternyata belum didukung oleh kontrak API, jangan memaksa mengaktifkan UI palsu. Pertahankan resolusi backend dan beri catatan keterbatasan.
- Jangan pernah menebak format ID/kode BC.

## 5. Bentuk state frontend

**Contoh desain TypeScript** (sesuaikan dengan tipe aktual):

```ts
type MasterDraft =
  | { mode: "existing"; id: number; name: string }
  | { mode: "create"; name: string }
  | { mode: "none" }; // none hanya sah untuk NB

type ApprovalDraft = {
  nb: MasterDraft;
  gp: Exclude<MasterDraft, { mode: "none" }> | null;
  gc: Exclude<MasterDraft, { mode: "none" }> | null;
  bc:
    | { mode: "existing"; id: number; name: string }
    | { mode: "create"; name: string; branchId: number }
    | { mode: "saga_resolve"; branchId: number }
    | null;
};

type CommitStage = "idle" | "checking" | "nb" | "gp" | "gc" | "bc" | "register" | "completed" | "failed";
```

- Jangan mewajibkan `nb` ketika mode `none`.
- Gunakan satu `approvalDraft` sebagai sumber state utama, bukan beberapa flag yang saling konflik.
- Jika existing dipilih, simpan ID numerik aktual. Jika baru, simpan nama yang telah dinormalisasi dan **jangan membuat ID palsu**.
- State progres commit terpisah dari draft UI.
- Gunakan resolver/helper seperti `resolveNationalBrand`, `resolveGroupParent`, `resolveGroupCustomer`, `resolveBranchCustomer` (jika diperlukan) agar orkestrasi mudah diuji.

## 6. Validasi sebelum commit

Validasi harus berjalan **tanpa POST**:

1. Pastikan status register masih eligible (`Draft` atau `Request`) dan user memiliki akses approve.
2. NB valid existing/create/none; GP dan GC selalu valid dan wajib.
3. Normalisasi nama menggunakan helper existing (`normalizeEntityName`); hindari duplikat case-insensitive, whitespace, dan varian penamaan sesuai aturan sebenarnya.
4. Cari kemungkinan duplikat berdasarkan data existing melalui GET; bedakan `nama identik`, `mirip`, dan `tidak ditemukan`.
5. Validasi parent-child dan cabang; jangan sekadar mencocokkan nama.
6. Master existing yang dipilih harus masih ada; validasi ulang sebelum commit bila memungkinkan.
7. **GET tidak menjamin uniqueness** pada kondisi concurrent; backend tetap sumber validasi akhir. Bila POST mengembalikan konflik, berhenti dan tampilkan pilihan existing hanya setelah hasil cocok diverifikasi.
8. Gagal GET atau validasi → hentikan commit dan tampilkan pesan dapat ditindaklanjuti.
9. Tidak perlu request GET di setiap ketikan tanpa debounce; tidak melakukan POST sampai admin klik Commit.
10. Semua payload master baru harus mempertahankan atribut yang dibangun kode lama, bukan hanya nama dan parent ID.

## 7. Alur Commit Approve (frontend orchestration)

**Commit sekali**, dengan urutan berdasarkan dependensi:

```text
Admin klik Commit Approve
  ↓
Final check: status register + selected masters + nama duplikat + relasi
  ↓
Resolve NB → existing ID / POST NB baru / null
  ↓
Resolve GP → existing ID / POST GP dengan nbid dari hasil NB
  ↓
Resolve GC → existing ID / POST GC dengan gpid dari hasil GP
  ↓
Resolve BC → existing ID / penciptaan sesuai API / ditangani Saga
  ↓
PUT Customer Register (data lengkap; docstatus=1; status=Syncing)
  ↓
Refresh list/detail → tampilkan Submitted dan status Saga berjalan
  ↓
Saga completed = sinkronisasi selesai (BUKAN syarat untuk menampilkan sukses submit)
```

### Detail pelaksanaan

- Jangan melakukan POST dari search, select, `Gunakan Nama Ini`, atau edit draft.
- Hanya POST resource dengan `mode: 'create'`; existing langsung menggunakan ID-nya.
- Urutkan request dengan `await`, jangan `Promise.all` untuk resource yang bergantung.
- NB opsional. Jika tanpa NB, ikuti aturan backend saat ini untuk `nbid` null/omitted; jangan memaksakan nilai `0`.
- GP baru mengisi `gp_name`, `nbid` yang di-resolve, dan field kebijakan kredit existing dari `buildCreditPolicyPayload`.
- GC baru wajib menggunakan `buildGroupCustomerPayload` yang sudah ada; pastikan menerima `gpid` hasil resolve, dan **jangan menghilangkan data perusahaan, pajak, alamat, pembayaran, atau field yang sudah disuplai helper**.
- PUT Customer Register menggunakan `buildCustomerRegisterApprovePayload`; tetap membawa payment, pajak, sales team, ERP customer group, catatan, dan shipping address sesuai fungsi lama.
- Jangan mengganti `docstatus` dengan `saga_status`. `docstatus=1/status=Syncing` hanya berarti approve di-commit, sedangkan keberhasilan sinkronisasi tergantung Saga `completed`.
- Gunakan `extractIdFromResourceResponse` atau helper teruji untuk membaca ID, cek ID valid setelah setiap POST; jangan menganggap respons sukses selalu berisi ID.
- Double-click: disable Commit dan gunakan synchronous in-flight guard (`useRef`) untuk menghindari dua handler berjalan bersamaan.
- Setelah success, trigger update event existing `ekatalog:customer_registrations_update`, `ekatalog:gp_update`, `ekatalog:gc_update`, `ekatalog:bc_update` sebagaimana diperlukan, serta refresh data.
- **Jangan mengubah `Resync` dan `Rollback` Saga** dan otorisasi `administrator`.

## 8. Partial failure, retry, dan idempotency (krusial)

Karena tidak mengubah Golang, frontend tidak dapat menjamin transaksi atomik lintas POST. Solusinya adalah **checkpoint lokal + verifikasi server + proses retry konservatif**, bukan mengklaim rollback penuh.

Contoh: NB dan GP berhasil, POST GC gagal. **Jangan POST NB dan GP lagi** saat Retry; lanjutkan dari GC dengan ID sebelumnya.

Persyaratan:

1. Simpan hasil setiap operasi berhasil dalam checkpoint yang terikat `registration.id` dan identitas draft/operation, misalnya `{ nbid, gpid, gcid, bcid, completedStages, status }`.
2. Untuk kegagalan selama modal masih terbuka, gunakan checkpoint in-memory; untuk ketahanan saat refresh/tutup browser, pilih strategi persisten yang aman dan realistis di repository (misalnya `sessionStorage` dengan TTL, hanya ID dan fingerprint non-sensitif). **Jangan menyimpan token, dokumen identitas, nomor pajak, atau payload sensitif.**
3. Jika admin mengubah draft setelah sebagian POST berhasil, **jangan otomatis meneruskan** checkpoint lama ke hierarki baru. Tampilkan warning dan minta rekonsiliasi, jangan auto-delete master.
4. Bila request timeout/network error, status POST adalah `unknown`, bukan `failed definitif`. **Jangan blind retry POST**. GET detail/list untuk verifikasi apakah master tercipta dan cocok dengan relasi/nama; jika tidak dapat dipastikan, blok retry otomatis dan tampilkan instruksi cek manual.
5. Jika server mengembalikan conflict/duplicate, lakukan GET dan validasi bahwa record yang ditemukan benar-benar entitas yang sama dan parent-nya sesuai; jangan asal memakai record dengan nama mirip.
6. Jika POST/PUT Customer Register gagal setelah semua master tersedia, ulangi hanya PUT setelah verifikasi status register agar tidak memicu approval ulang.
7. Jika PUT timeout dan status tidak diketahui, GET Customer Register terlebih dahulu. Jika sudah Submitted/Syncing, jangan kirim PUT ulang; tampilkan status aktual.
8. Persistensi browser hanya best-effort. Tidak boleh diklaim memberikan exactly-once atau idempotensi global. Jika tidak aman untuk melanjutkan secara otomatis, arahkan pemeriksaan manual dan dokumentasikan kebutuhan backend idempotency sebagai improvement masa depan.
9. Jangan jalankan penghapusan otomatis master ketika user menutup modal atau terjadi error.
10. Tampilkan daftar langkah commit dan status: `Pending`, `Checking`, `Created/Resolved`, `Failed`, `Unknown`, `Submitted`.

## 9. UX saat Commit

- Tombol utama `Commit Approve` hanya aktif jika draft valid, data search yang dibutuhkan siap, dan tidak ada proses berjalan.
- Tampilkan ringkasan akhir (bisa panel konfirmasi dalam halaman/modal konfirmasi ringan), misalnya:

```text
National Brand : Existing — NB25
Group Parent   : Akan Dibuat — PT MAJU BERSAMA
Group Customer : Akan Dibuat — PT MAJU BERSAMA
Branch Customer: Akan Diresolve oleh Saga (Bogor)

Master baru: 2
[ Kembali Edit ] [ Ya, Commit Approve ]
```

- Saat commit dimulai, kunci perubahan draft dan tutup modal hanya ketika aman. Jangan menampilkan tombol Cancel yang membuat admin mengira request dapat dibatalkan padahal POST sudah berjalan.
- Jika gagal, tampilkan stage, pesan error dari API (disanitasi), operasi yang sudah berhasil, dan aksi yang aman: `Coba Lanjutkan` (jika checkpoint jelas) atau `Periksa Status` (jika outcome unknown).
- Setelah PUT sukses, tampilkan `Approval berhasil dikirim — Sinkronisasi berjalan`, bukan `Customer sudah dibuat di ERP`.
- Progress Saga tampil terpisah dari progres pembuatan master.

## 10. Detail visual

- Gunakan gaya enterprise, layout satu scroll dengan section NB, GP, GC, BC jelas. Tetap satu komponen halaman/modal approval, **bukan tabs**, **bukan wizard Next/Back**, **bukan modal berlapis untuk setiap master**.
- Desktop: panel hierarki utama + ringkasan sticky di samping jika ruang cukup; mobile: satu kolom dan footer bawah yang aman dari navigation bar.
- Visual status master: `Existing` / `Akan Dibuat` / `Tanpa NB` / `Akan Diresolve`.
- Dropdown hasil search compact, nama dominan, ID/parent/cabang lebih kecil.
- CTA Buat Baru selalu mudah ditemukan, tapi jangan mempromosikan duplikasi nama identik.
- Background terang/abu muda dan card putih dengan border/shadow ringan jika sesuai `DESIGN.md` aplikasi; warna maroon sebagai accent. Pastikan dark mode bila project memilikinya.
- Loading skeleton/spinner, empty state, error state, disabled states, validasi inline, keyboard navigation, responsive, tidak ada horizontal overflow.
- Footer `Batal` + `Commit Approve` sticky, tetapi jangan menghalangi konten paling bawah.

## 11. Hal yang tidak boleh rusak

- Approval hanya untuk status yang diizinkan (`Draft` / `Request`).
- Permission dan akses sesuai existing code.
- `docstatus=1`, `status=Syncing`, serta tracking `saga_status`, `sync_saga_id`, `sync_last_error`, `sync_last_rollback_error`.
- Seluruh field payload customer yang sudah dibangun helper existing: kebijakan kredit, pembayaran, pajak, sales team, ERP customer group, alamat pengiriman, dll.
- Registrasi existing yang sudah memiliki relasi master tetap bisa ditampilkan dan diproses dengan benar.
- Refresh list dan detail, viewer dokumen, tombol Reject/Edit, Resync/Rollback role administrator.
- Demo mode, jika digunakan dalam kode sekarang, tetap tanpa POST aktual.

## 12. File yang harus diperiksa / diubah

Utama:

- `registration/ApproveRegistrationModal.tsx` (di repository gunakan path aktual).
- `@/types/customerRegistration` untuk tipe `ApprovalResult`/`ApprovalOperationLog`.
- `@/config/api` untuk endpoint existing.
- `@/utils/fetchAllQueryRows` untuk mengambil master list.
- `registration/README.md` untuk dokumentasi user dan alur teknis.

Pendukung jika memang diperlukan:

- `registration/CustomerRegistrationList.tsx`
- `registration/RegistrationDetailModal.tsx`
- `DESIGN.md` dan komponen UI reusable dalam repo.

Jangan berasumsi semua file pendukung tersedia di arsip; baca yang ada pada working tree Codex.

## 13. Acceptance criteria / wajib lulus QA

- [ ] Seluruh NB/GP/GC/BC ada di **satu halaman** tanpa tabs Next/Back.
- [ ] Semua master memakai **search-first**, pilihan existing, tombol `Buat Baru` dalam area sama, dan summary terpilih.
- [ ] NB dapat `Tanpa NB`; GP dan GC wajib.
- [ ] Mengetik/memilih/membuat draft/membatalkan approval **tidak menyebabkan POST master** (verifikasi Network tab/test mocks).
- [ ] Memilih NB baru + GP baru + GC baru menghasilkan urutan POST NB → GP (`nbid` valid) → GC (`gpid` valid) **hanya saat Commit**.
- [ ] Bila GP existing dipilih, POST GP tidak terjadi; begitu pula master existing lainnya.
- [ ] Parent baru membatasi child pada create baru; penggantian parent memvalidasi/reset child incompatible.
- [ ] Duplikasi nama identik diperingatkan; API search error tidak ditafsirkan sebagai hasil kosong.
- [ ] `effectiveBcid` tidak lagi mengutamakan ID lama ketika pilihan valid baru dibuat.
- [ ] BC tidak dibuat dua kali; alur sesuai kontrak Saga/backend existing.
- [ ] Request payload tidak kehilangan credit policy/payment/tax/sales/address fields existing.
- [ ] Double-click Commit tidak membuat request ganda.
- [ ] POST GP sukses lalu POST GC gagal: retry tidak POST GP ulang.
- [ ] Timeout setelah POST unknown: tidak blind POST ulang; ada GET verifikasi atau stop aman.
- [ ] PUT sukses → UI menunjukkan Submitted/Syncing; Saga `completed` tetap diperlakukan terpisah.
- [ ] Edit/Reject/Resync/Rollback permissions dan fungsi lain tidak regresi.
- [ ] Build, typecheck, lint, dan test project lulus; bila ada kegagalan existing, laporkan eksplisit.
- [ ] Responsive desktop/mobile, keyboard/focus, loading/error states rapi.

### Skenario pengujian minimal

1. Search NB existing → pilih → batal: **0 POST**.
2. Buat draft GP → edit nama → batal: **0 POST**.
3. GP existing + GC existing valid → commit: **tidak POST GP/GC**.
4. NB create → GP create → GC create: ID parent diteruskan dengan tepat.
5. GP create lalu ubah NB/GP: GC/BC otomatis divalidasi ulang.
6. Nama duplicate/konflik API: tidak membuat duplicate secara sembrono.
7. Error GET search: tidak dianggap `not found`.
8. POST GC gagal setelah POST GP sukses: restore/retry menggunakan GP.id yang tercatat.
9. Timeout PUT: cek GET status register sebelum retry.
10. Existing BC diganti: payload mengikuti pilihan baru jika API mendukung.
11. `docstatus=1/status=Syncing` setelah submit; detail Saga menunjukkan status aktual.
12. Klik Commit dua kali secara cepat: hanya satu proses.

## 14. Urutan implementasi untuk Codex

1. **Audit** fungsi/API/state existing dan alur BC/Saga; catat temuan singkat.
2. Implementasi model draft dan aturan dependensi NB→GP→GC→BC.
3. Implementasi search-first + create-inline + clear/selected-state pada satu halaman.
4. Implementasi preflight validasi dan deteksi duplikasi berbasis GET existing.
5. Pindahkan POST dari `handleNextStep` ke orchestrator `handleSubmitApproval` yang sequential.
6. Tambahkan checkpoint, penanganan unknown outcome, dan retry aman sejauh dimungkinkan tanpa backend.
7. Pertahankan seluruh payload builder dan validasi yang sudah berjalan; perbaiki prioritas existing vs selected BC.
8. Redesign final summary, progress, error, footer sticky, dan responsive layout.
9. Tambah/ubah test, jalankan typecheck/lint/build, dokumentasikan hasil dan batasan.

## 15. Format laporan akhir yang harus diberikan Codex

Berikan ringkasan:

- File yang diubah dan fungsi penting yang dipindah.
- Perilaku lama vs baru, termasuk kapan POST terjadi.
- Endpoint yang benar-benar digunakan dan perlakuan BC (frontend vs Saga), dengan dasar dari kode.
- Cara kerja duplicate-check, retry, dan batasan idempotency frontend.
- Hasil build/typecheck/lint/tests dan skenario yang diuji.
- Keterbatasan API yang **tidak bisa** diselesaikan frontend saja.

**Definition of Done:** Admin dapat melakukan pencarian dan penyusunan hierarki NB/GP/GC/BC di satu halaman tanpa menciptakan master secara prematur. Commit membuat master yang diperlukan secara berurutan dengan ID relasi benar, kemudian men-submit Customer Register sambil tetap menjaga seluruh integrasi Saga dan meminimalkan duplikasi pada retry. Jangan mengklaim transaksi atomik atau exactly-once tanpa dukungan backend.

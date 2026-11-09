# PRD – Loyalty Management System

**Project:** Epanel Ekaplus Admin  
**Module:** Loyalty Management  
**Platform:** Web Admin – Next.js  
**Backend:** Golang (Goback Core)  
**Version:** 1.0  
**Status:** Proposed  
**Referensi:** README_LOYALTY_POINT.md – 28 Oktober 2026

---

## 1. Latar Belakang

Ekaplus memiliki sistem Loyalty Point untuk memberikan penghargaan kepada customer berdasarkan total omzet pembelian.

Poin loyalty dihitung berdasarkan seluruh transaksi Branch Customer (BC) yang berada di bawah satu Group Parent (GP).

Struktur customer:

**Group Parent (GP) → Group Customer (GC) → Branch Customer (BC)**

Ketentuan utama:

- Poin hanya dimiliki Group Parent.
- Omzet seluruh BC yang berada di bawah GP dihitung sebagai sumber perolehan poin.
- Poin dihitung berdasarkan aturan loyalty yang ditentukan admin.
- Poin dapat ditukarkan dengan reward.
- Penukaran dapat memerlukan persetujuan admin.
- Poin dapat memiliki masa berlaku.
- Seluruh transaksi dan perubahan status tercatat untuk kebutuhan audit.

Saat ini backend Loyalty sudah menyediakan REST API dan custom method untuk mendukung proses tersebut.

Dibutuhkan antarmuka admin yang terintegrasi pada Epanel agar seluruh aktivitas loyalty dapat dikelola tanpa menggunakan Postman atau akses database secara langsung.

## 2. Tujuan Pengembangan

1. Menyediakan halaman administrasi Loyalty terpusat.
2. Memudahkan admin membuat dan mengelola periode loyalty.
3. Memudahkan konfigurasi aturan perhitungan poin.
4. Memudahkan pelaksanaan dan pemantauan kalkulasi poin.
5. Memungkinkan admin melihat saldo poin setiap Group Parent.
6. Menyediakan pengelolaan katalog reward secara lengkap.
7. Memudahkan admin memproses transaksi penukaran reward.
8. Menyediakan informasi dan histori yang dapat diaudit.
9. Mengurangi kebutuhan pengoperasian API melalui Postman.

## 3. Ruang Lingkup

### 3.1 Termasuk

- Dashboard Loyalty
- Periode Loyalty
- Aturan Poin dan Detail Aturan
- Kalkulasi Poin dan Monitoring Batch
- Saldo Poin Customer
- Katalog Reward
- Master Tipe Reward
- Master Kategori Reward
- Master Partner Reward
- Penukaran Reward
- Detail dan Histori Penukaran
- Approval dan Fulfillment Reward

### 3.2 Tidak Termasuk

- Perubahan database
- Pembuatan endpoint baru
- Perubahan rumus kalkulasi poin
- Perubahan mekanisme FEFO
- Perubahan mekanisme redemption backend
- Pengembangan halaman customer Ekaplus Mobile
- Perubahan scheduler dan worker Golang

Seluruh validasi bisnis dan perubahan saldo tetap menjadi tanggung jawab backend.

---

## 4. Struktur Navigasi

Menu utama pada sidebar Epanel:

**Loyalty**

| Submenu          | Route yang Direkomendasikan |
| ---------------- | --------------------------- |
| Dashboard        | `/loyalty`                  |
| Periode Loyalty  | `/loyalty/periods`          |
| Aturan Poin      | `/loyalty/rules`            |
| Kalkulasi Poin   | `/loyalty/calculations`     |
| Saldo Poin       | `/loyalty/balances`         |
| Katalog Reward   | `/loyalty/rewards`          |
| Master Reward    | `/loyalty/masters`          |
| Penukaran Reward | `/loyalty/redemptions`      |

Route merupakan usulan frontend dan dapat disesuaikan dengan struktur routing Epanel yang sudah ada.

---

# 5. Detail Kebutuhan Halaman

## 5.1 Dashboard Loyalty

### Tujuan

Memberikan ringkasan aktivitas Loyalty untuk admin.

### Komponen Utama

**A. Summary Cards**

- Total Group Parent yang memiliki saldo loyalty
- Total poin diperoleh
- Total poin tersedia
- Total poin telah digunakan
- Total poin reserved
- Total redemption pending

**B. Informasi Kalkulasi**

- Batch kalkulasi terakhir
- Status batch
- Total GP diproses
- Jumlah kalkulasi sukses
- Jumlah kalkulasi gagal
- Jumlah perlu review

**C. Aktivitas Terbaru**

- Penukaran reward terbaru
- Penukaran yang membutuhkan approval
- Kalkulasi terakhir

**D. Quick Actions**

- Jalankan Kalkulasi
- Lihat Pending Redemption
- Tambah Reward
- Lihat Saldo Poin

### Ketentuan

Data ringkasan harus berasal dari API.

Jika agregasi dashboard tidak tersedia dalam endpoint yang ada, frontend hanya menampilkan metrik yang dapat diperoleh secara akurat dari API.

Jangan menghitung ringkasan global dari satu halaman hasil pagination.

---

## 5.2 Halaman Periode Loyalty

### Tujuan

Mengelola periode perhitungan dan masa berlaku poin.

### Endpoint

`GET /api/resource/loyalty_period`

`POST /api/resource/loyalty_period`

`GET /api/resource/loyalty_period/:id`

`PUT /api/resource/loyalty_period/:id`

### Tampilan List

Kolom yang ditampilkan:

- Nama periode
- Tanggal mulai
- Tanggal selesai
- Rule yang digunakan
- Expiry Mode
- Point Ready
- Status
- Aksi

### Form Tambah/Edit Periode

Form mengikuti metadata resource backend, dengan bagian utama berikut.

**Informasi Periode**

- Nama periode
- Tanggal mulai
- Tanggal selesai
- Rule Loyalty
- Status periode

**Pengaturan Poin**

Expiry Mode:

| Nilai      | Keterangan                              |
| ---------- | --------------------------------------- |
| NEVER      | Poin tidak memiliki tanggal kedaluwarsa |
| DURATION   | Poin berlaku hingga durasi tertentu     |
| PERIOD_END | Poin berlaku sesuai periode             |

Jika `DURATION`, tampilkan input `expiry_months`.

Point Ready:

| Nilai            | Keterangan                                      |
| ---------------- | ----------------------------------------------- |
| IMMEDIATE        | Poin dapat digunakan setelah kalkulasi berhasil |
| AFTER_PERIOD_END | Poin tersedia setelah periode ditutup           |

### Validasi

- Tanggal mulai tidak boleh melebihi tanggal selesai.
- Rule wajib dipilih.
- `expiry_months` harus valid jika memilih DURATION.
- Tampilkan peringatan ketika mengubah periode yang sudah memiliki kalkulasi.
- Periode CLOSED tidak boleh digunakan untuk kalkulasi normal.

---

## 5.3 Halaman Aturan Poin

### Tujuan

Mengelola aturan perhitungan poin berdasarkan Sales Account.

### Endpoint

`GET /api/resource/loyalty_rule`

`POST /api/resource/loyalty_rule`

`GET /api/resource/loyalty_rule_detail`

### Tampilan List

- Kode Rule
- Nama Rule
- Metode pembulatan
- Status
- Jumlah detail
- Aksi

### Form Aturan Poin

**Informasi Utama**

- Nama/Kode Rule sesuai metadata backend
- Status ACTIVE / INACTIVE
- Metode kalkulasi, termasuk FLOOR sebagaimana didokumentasikan

**Detail Sales Account**

Tampilkan tabel:

| Sales Account | Standard Divider | Aksi |
| ------------- | ---------------- | ---- |
| Account A     | 100.000          | Edit |
| Account B     | 200.000          | Edit |

Nilai tabel di atas hanya ilustrasi.

### Ketentuan

- Divider harus lebih besar dari nol.
- Detail aturan harus disimpan melalui resource yang tersedia.
- Rule yang sudah digunakan tidak boleh diperlakukan sebagai konfigurasi bebas edit karena backend menerapkan aturan immutable.
- Tidak boleh ada asumsi bahwa setiap rule ACTIVE otomatis digunakan oleh periode.

Rule yang digunakan ditentukan melalui `loyalty_period.rule_id`.

---

## 5.4 Halaman Kalkulasi Poin

### Tujuan

Menjalankan perhitungan Loyalty dan memantau hasilnya.

### Struktur Halaman

Gunakan dua tab:

**Tab 1 – Batch Kalkulasi**

Daftar batch:

- Batch ID
- Trigger Type
- Status
- Total GP
- Progress
- Success
- Failed
- Need Review
- Incomplete
- Tanggal dijalankan
- Aksi Detail

**Tab 2 – Hasil Kalkulasi**

Daftar hasil kalkulasi per GP:

- Calculation Number
- Group Parent
- Periode
- Total Omzet
- Total Poin
- Status
- Tanggal Kalkulasi
- Aksi Detail / Recalculate

### A. Jalankan Kalkulasi Massal

Tombol: **Jalankan Kalkulasi**

Endpoint:

`POST /api/resource/loyalty_calculation/method/run_batch`

Body:

```json
{}
```

Backend mengembalikan HTTP 202 beserta `batch_id` dan `status_url`.

Frontend wajib:

1. Menampilkan informasi bahwa proses masuk antrean.
2. Mengambil `batch_id`.
3. Melakukan polling endpoint status batch.
4. Menampilkan progress.
5. Menghentikan polling pada status terminal.
6. Menampilkan ringkasan hasil kalkulasi.

Status batch:

- QUEUED
- RUNNING
- COMPLETED
- FAILED

Progress menggunakan `progress_done` dan `progress_total`.

### B. Kalkulasi Per Group Parent

Tombol: **Hitung Per GP**

Endpoint:

`POST /api/resource/loyalty_calculation/method/run_calculation`

Contoh:

```json
{
  "gpid": "GPTWC001",
  "period": "LOYALTY-2026"
}
```

Admin memilih GP dan periode sebelum menjalankan proses.

### C. Recalculate Per GP

Endpoint:

`POST /api/resource/loyalty_calculation/method/recalculate`

```json
{
  "calculation_id": 123
}
```

Tampilkan konfirmasi sebelum memproses.

### D. Recalculate Batch

Endpoint:

`POST /api/resource/loyalty_calculation/method/recalculate_batch`

```json
{
  "batch_id": 3,
  "all": false,
  "allow_closed_period": false
}
```

Pilihan:

- Hanya gagal/perlu review/belum lengkap (`all: false`)
- Semua kalkulasi (`all: true`)

Default harus `all: false`.

### Detail Kalkulasi

Tampilkan informasi header dan, jika datanya tersedia, rincian:

- Sales Account
- Omzet
- Divider
- Poin hasil kalkulasi
- GC / Branch
- BC yang berkontribusi
- Error atau warning

Data sumber sudah dapat diagregasi berdasarkan GC, cabang, dan sales account. Field `bc_refs` dapat berisi sejumlah kode Branch Customer.

Jangan mengasumsikan satu baris calculation source selalu mewakili satu BC.

---

## 5.5 Halaman Saldo Poin

### Tujuan

Admin dapat memeriksa saldo poin milik Group Parent.

### Endpoint

`POST /api/resource/loyalty_redemption/method/get_balance`

Contoh:

```json
{
  "gpid": "GPTWC001"
}
```

Alternatif:

```json
{
  "bcid": "TWCBGR001"
}
```

### Tampilan

Bagian atas menyediakan pencarian Group Parent atau Branch Customer.

Setelah memilih customer, tampilkan:

**Informasi Customer**

- Group Parent
- GPID
- GCID/BCID jika pencarian menggunakan konteks BC

**Summary Cards**

| Informasi      | Response Field    |
| -------------- | ----------------- |
| Total Poin     | `total_point`     |
| Poin Digunakan | `redeemed_point`  |
| Poin Reserved  | `reserved_point`  |
| Poin Tersedia  | `available_point` |

**Rincian Kantong Poin**

| Periode | Earned | Used | Reserved | Available | Berlaku Sampai | Status |
| ------- | ------ | ---- | -------- | --------- | -------------- | ------ |

Field berasal dari `buckets[]`.

### Ketentuan

- Bedakan poin belum ready dengan poin expired.
- Poin available harus menggunakan hasil backend.
- Admin tidak dapat mengubah saldo langsung.
- Kantong poin ditampilkan read-only.
- Tidak boleh menambahkan tombol hapus ledger.

---

# 6. Reward Management

## 6.1 Halaman Katalog Reward

### Tujuan

Mengelola seluruh hadiah yang dapat ditukarkan customer.

### Endpoint

`GET /api/resource/loyalty_reward`

`POST /api/resource/loyalty_reward`

`GET /api/resource/loyalty_reward/:id`

`PUT /api/resource/loyalty_reward/:id`

### Tampilan List

Gunakan table layout Epanel dengan kolom:

- Gambar
- Kode Reward
- Nama Reward
- Tipe
- Kategori
- Partner
- Poin Dibutuhkan
- Stok
- Approval
- Publikasi
- Status
- Aksi

### Filter

- Pencarian nama/kode
- Tipe Reward
- Kategori Reward
- Partner
- Status
- Public / Non-public
- Featured

### Aksi

- Tambah Reward
- Detail Reward
- Edit Reward
- Aktifkan/Nonaktifkan Reward

Reward yang sudah pernah diredeem tidak boleh dihapus. Gunakan status INACTIVE.

## 6.2 Form Tambah/Edit Reward

Gunakan halaman form dengan beberapa section atau tab untuk menghindari form terlalu panjang.

### Section A – Informasi Reward

- Reward Name (wajib)
- Short Description
- Description
- Terms & Conditions
- Fulfillment Instructions

### Section B – Gambar Reward

- Main Image
- Thumbnail Image
- Banner Image
- Gallery Images

Gallery menggunakan child table `images[]`.

Setiap gambar memiliki:

- Image
- Caption
- Sort Order
- Is Primary

Sediakan preview, tambah gambar, hapus gambar, dan pengaturan gambar utama.

### Section C – Klasifikasi Reward

- Reward Type (wajib)
- Reward Category
- Reward Partner

Pilihan harus diambil dari master.

Saat submit, nilai relasi `reward_type`, `reward_category`, dan `reward_partner` menggunakan primary key numerik.

### Section D – Konversi Poin

Field `conversion_type`:

- FIXED
- VALUE_BASED
- PER_POINT

Jika FIXED:

- Point Required

Jika VALUE_BASED atau PER_POINT:

- Conversion Rate
- Value Amount
- Value Unit
- Minimum Point
- Maximum Point

Frontend menampilkan field secara dinamis berdasarkan conversion type.

Perhitungan final tetap dilakukan backend.

### Section E – Fulfillment

Pilihan `fulfillment_type`:

- VOUCHER_CODE
- PHYSICAL
- POS_DISCOUNT
- MANUAL
- EXTERNAL

Jika VOUCHER_CODE, tampilkan:

- Voucher Prefix
- Voucher Valid Days

Jika EXTERNAL, tampilkan:

- External Provider

### Section F – Stok Reward

Field `stock_mode`:

| Mode      | Tampilan Form                     |
| --------- | --------------------------------- |
| GLOBAL    | Input kuota global                |
| BRANCH    | Tabel stok per cabang             |
| UNLIMITED | Tidak memerlukan pengaturan kuota |

Untuk mode BRANCH, tampilkan tabel:

| Branch | Quota | Used | Reserved | Available |
| ------ | ----- | ---- | -------- | --------- |

Data disimpan melalui child table `branch_stocks[]`.

`used_quota` dan `reserved_quota` bersifat read-only.

Jika BRANCH, wajib tersedia minimal satu cabang dengan kuota lebih besar dari nol.

### Section G – Limit Penukaran

- Per User Limit
- Daily Limit
- Monthly Limit
- Max Per Redemption

Nilai 0 mengikuti interpretasi backend sebagai tanpa batas.

### Section H – Approval

- Requires Approval
- Auto Complete
- Pending Expiry Hours

Jika `requires_approval = 1`, transaksi masuk PENDING dan menunggu keputusan admin.

Jika `auto_complete = 1`, sistem dapat menyelesaikan redemption secara otomatis sesuai alur backend.

### Section I – Publikasi

- Is Public
- Featured
- Sort Order
- Status

Status:

- DRAFT
- ACTIVE
- INACTIVE
- EXPIRED

Reward baru dapat ditampilkan dalam katalog customer ketika memenuhi persyaratan publikasi, validitas, dan ketersediaan yang diperiksa backend.

### Tombol Form

- Batal
- Simpan Draft
- Simpan Perubahan
- Publikasikan

Tombol Publikasikan harus melakukan penyimpanan dengan status ACTIVE dan `is_public = 1`, setelah validasi form berhasil.

---

## 6.3 Halaman Master Reward

Master Reward terdiri dari tiga tab.

### Tab A – Tipe Reward

Resource: `loyalty_reward_type`

Field:

- Type Name
- Code
- Description
- Fulfillment Type
- Default Conversion Type
- Default Requires Approval
- Icon
- Sort Order
- Disabled

### Tab B – Kategori Reward

Resource: `loyalty_reward_category`

Field:

- Category Name
- Slug
- Description
- Image
- Parent Category
- Sort Order
- Disabled

Kategori dapat memiliki kategori induk.

### Tab C – Partner Reward

Resource: `loyalty_reward_partner`

Field:

- Partner Name
- Code
- Description
- Logo
- Contact
- Terms
- Disabled

Seluruh master menggunakan CRUD standar framework.

---

# 7. Penukaran Reward

## 7.1 Halaman Redemption List

### Tujuan

Memungkinkan admin memantau dan memproses redemption customer.

### Endpoint

`POST /api/resource/loyalty_redemption/method/get_history`

Untuk kebutuhan daftar transaksi lintas seluruh customer, gunakan kemampuan list resource yang tersedia dan diizinkan bagi admin. Endpoint `get_history` yang didokumentasikan menerima konteks GPID atau BCID.

### Tampilan

**Summary dan Filter**

- Total transaksi
- Pending approval
- Approved
- Processing
- Completed
- Rejected / Cancelled / Failed

Ringkasan lintas seluruh GP hanya ditampilkan jika data agregat yang akurat tersedia.

Filter:

- Search
- Status
- Rentang tanggal
- Group Parent
- Reward

**Tabel Transaksi**

| Field           | Keterangan           |
| --------------- | -------------------- |
| Redemption Name | Nomor transaksi      |
| Customer        | Group Parent         |
| Reward          | Nama reward snapshot |
| Quantity        | Jumlah               |
| Point Used      | Total poin           |
| Status          | Status transaksi     |
| Created At      | Waktu redeem         |
| Action          | Detail / Proses      |

### Status Redemption

- PENDING
- APPROVED
- PROCESSING
- COMPLETED
- REJECTED
- CANCELLED
- EXPIRED
- FAILED

---

## 7.2 Detail Redemption

Klik transaksi membuka detail.

### Informasi Utama

- Redemption Number
- Group Parent
- Branch Customer (jika ada)
- Tanggal Redeem
- Status
- Jumlah poin digunakan
- Quantity

### Informasi Reward

Menggunakan snapshot yang tersimpan saat redemption:

- Reward Name
- Reward Code
- Reward Type
- Reward Image
- Fulfillment Type
- Point Required

### Informasi Fulfillment

Bergantung jenis reward:

**Voucher**

- Voucher Code
- Voucher Barcode
- Voucher Expiry

**Physical Reward**

- Shipping Recipient
- Shipping Phone
- Shipping Address
- Tracking Number

**External**

- External Reference

Tampilkan hanya field yang relevan dan tersedia.

### Histori Perubahan Status

Endpoint:

`POST /api/resource/loyalty_redemption/method/get_status_history`

Tampilkan timeline:

- Status sebelumnya
- Status baru
- Actor
- Tanggal
- Note
- Source

---

## 7.3 Approval Redemption

Jika status PENDING, admin dapat:

**Approve**

Endpoint:

`POST /api/resource/loyalty_redemption/method/approve`

```json
{
  "redemption_id": "RDM00001",
  "note": "Disetujui admin"
}
```

**Reject**

Endpoint:

`POST /api/resource/loyalty_redemption/method/reject`

```json
{
  "redemption_id": "RDM00001",
  "reason": "Reward tidak memenuhi ketentuan",
  "note": "Ditolak admin"
}
```

Reason wajib diisi ketika reject.

Setiap aksi harus memiliki dialog konfirmasi.

### Ketentuan

- Pending point sudah di-reserve.
- Approve menyelesaikan alokasi reserved menjadi used.
- Reject melepaskan reserved point.
- Frontend tidak boleh memodifikasi ledger.
- Status akhir mengikuti response backend.

---

## 7.4 Fulfillment Redemption

Aksi lanjutan:

| Aksi         | Method     | Perubahan Status                |
| ------------ | ---------- | ------------------------------- |
| Proses       | `process`  | APPROVED → PROCESSING           |
| Selesaikan   | `complete` | APPROVED/PROCESSING → COMPLETED |
| Batalkan     | `cancel`   | Mengikuti lifecycle backend     |
| Tandai Gagal | `fail`     | Mengikuti lifecycle backend     |

Aksi hanya ditampilkan ketika valid untuk status saat ini.

Untuk cancel dan fail, sediakan field alasan serta opsi refund sesuai payload yang diizinkan backend.

Operasi sensitif seperti cancel redemption COMPLETED dengan refund harus menggunakan konfirmasi tambahan.

---

# 8. Standar UI/UX

## 8.1 Design System

Halaman baru harus mengikuti struktur serta komponen Epanel yang sudah ada.

Ketentuan:

- Gunakan Next.js dan komponen UI existing.
- Gunakan warna utama maroon sesuai design system Epanel.
- Gunakan sidebar, header, breadcrumb, dan layout yang konsisten.
- Gunakan reusable table, modal, drawer, form, dan pagination.
- Mendukung desktop dan tablet.
- Status ditampilkan menggunakan badge dengan warna semantik yang konsisten.

Jangan membuat design system baru yang berbeda dari halaman Epanel lainnya.

## 8.2 Perilaku Umum

Setiap halaman harus memiliki:

- Loading state
- Empty state
- Error state
- Pagination
- Search atau filter yang sesuai
- Notifikasi berhasil/gagal
- Konfirmasi sebelum aksi sensitif
- Pencegahan double submit

### Penanganan Error

Frontend harus membaca error code dan error message backend.

Contoh:

- `INSUFFICIENT_POINT`
- `QUOTA_EXHAUSTED`
- `REWARD_INACTIVE`
- `REWARD_EXPIRED`
- `NEED_REVIEW`

Jangan selalu menganggap HTTP 200 atau `status: success` berarti operasi bisnis berhasil; periksa juga isi data dan `error_code` jika ada.

---

# 9. Integrasi API

## 9.1 Arsitektur

**Epanel Next.js → Existing API Client/Proxy → Goback Core API → Database**

Ketentuan:

- Gunakan authentication Epanel yang sudah berjalan.
- Jangan menyimpan internal API key dalam client browser.
- Jangan hardcode URL production pada komponen.
- Gunakan konfigurasi environment existing.
- Gunakan service/API layer untuk setiap resource.
- Normalisasi response dan error secara konsisten.

## 9.2 Service Layer

Rekomendasi pemisahan:

- `loyaltyPeriodService`
- `loyaltyRuleService`
- `loyaltyCalculationService`
- `loyaltyBalanceService`
- `loyaltyRewardService`
- `loyaltyMasterService`
- `loyaltyRedemptionService`

Penamaan serta lokasi file menyesuaikan struktur project saat implementasi.

## 9.3 Pemetaan Resource

| Resource                          | Mode Penggunaan              |
| --------------------------------- | ---------------------------- |
| loyalty_period                    | CRUD                         |
| loyalty_rule                      | CRUD sesuai proteksi backend |
| loyalty_rule_detail               | CRUD sesuai relasi           |
| loyalty_calculation_batch         | Read + custom methods        |
| loyalty_calculation               | Read + custom methods        |
| loyalty_calculation_detail        | Read Only                    |
| loyalty_calculation_source        | Read Only                    |
| loyalty_calculation_error         | Read Only                    |
| loyalty_point_ledger              | Read Only                    |
| loyalty_reward_type               | CRUD                         |
| loyalty_reward_category           | CRUD                         |
| loyalty_reward_partner            | CRUD                         |
| loyalty_reward                    | CRUD dengan proteksi         |
| loyalty_reward_image              | Child melalui Reward         |
| loyalty_reward_stock              | Child melalui Reward         |
| loyalty_redemption                | Read + lifecycle methods     |
| loyalty_redemption_detail         | Read Only                    |
| loyalty_redemption_status_history | Read Only                    |

---

# 10. Hak Akses

Integrasikan dengan mekanisme permission Epanel yang sudah tersedia.

Rekomendasi hak akses frontend:

| Aktivitas               | Viewer | Operator    | Admin        |
| ----------------------- | ------ | ----------- | ------------ |
| Lihat Dashboard         | Ya     | Ya          | Ya           |
| Lihat Saldo             | Ya     | Ya          | Ya           |
| Lihat Kalkulasi         | Ya     | Ya          | Ya           |
| Jalankan Kalkulasi      | Tidak  | Ya          | Ya           |
| Kelola Periode dan Rule | Tidak  | Tidak       | Ya           |
| Kelola Reward           | Tidak  | Ya          | Ya           |
| Lihat Redemption        | Ya     | Ya          | Ya           |
| Approve/Reject          | Tidak  | Sesuai izin | Ya           |
| Cancel/Refund           | Tidak  | Tidak       | Ya           |
| Cleanup History         | Tidak  | Tidak       | Admin khusus |

Role dan matriks di atas merupakan usulan desain, bukan klaim permission yang sudah disediakan backend.

Pemeriksaan authorization backend tetap wajib berlaku; menyembunyikan tombol frontend saja bukan kontrol keamanan yang cukup.

---

# 11. Acceptance Criteria

## Periode dan Rule

- Admin dapat membuat dan melihat periode.
- Admin dapat memilih rule yang akan digunakan pada periode.
- Pengaturan expiry dan point ready tersimpan.
- Frontend menangani penolakan perubahan rule atau periode oleh backend.

## Kalkulasi

- Admin dapat menjalankan kalkulasi massal.
- Batch ID berhasil dicatat pada state halaman.
- Progress polling tampil dengan benar.
- Polling berhenti pada COMPLETED/FAILED.
- Admin dapat melihat hasil kalkulasi per GP.
- Recalculate menggunakan endpoint yang benar.
- Tidak ada pemotongan atau penambahan saldo yang dilakukan frontend.

## Saldo Poin

- Admin dapat mencari GP/BC.
- Total, used, reserved, dan available sesuai response backend.
- Kantong expired dan not ready dapat dibedakan.
- Tidak tersedia aksi edit saldo manual.

## Reward

- Admin dapat membuat reward.
- Admin dapat mengunggah/mengatur gambar melalui mekanisme file existing yang kompatibel dengan backend.
- Relasi master dikirim menggunakan ID numerik.
- Form dinamis mengikuti conversion type, fulfillment type, dan stock mode.
- Child images serta branch stocks tersimpan.
- Used quota dan reserved quota tidak dapat diedit.
- Reward dapat dipublikasikan dan dinonaktifkan.

## Redemption

- Admin dapat melihat histori transaksi.
- Admin dapat melihat detail serta status history.
- Admin dapat approve/reject transaksi PENDING.
- Reject mewajibkan alasan.
- Admin dapat memproses dan menyelesaikan fulfillment.
- Semua tindakan menampilkan hasil aktual dari backend.
- UI diperbarui setelah operasi berhasil.

---

# 12. Tahapan Implementasi

| Fase | Modul                               | Prioritas |
| ---- | ----------------------------------- | --------- |
| 1    | Master Reward                       | P0        |
| 2    | Katalog Reward + Form Reward        | P0        |
| 3    | Redemption List + Detail + Approval | P0        |
| 4    | Periode Loyalty + Rule              | P0        |
| 5    | Kalkulasi Poin + Batch Monitoring   | P0        |
| 6    | Saldo Poin GP                       | P0        |
| 7    | Dashboard Loyalty                   | P1        |
| 8    | Penyempurnaan Audit dan Operasional | P1        |

P0 adalah fungsi utama yang dibutuhkan agar modul dapat dijalankan; P1 merupakan penyempurnaan operasional dan ringkasan.

---

# 13. Catatan Integrasi yang Perlu Diverifikasi

Sebelum implementasi, developer frontend perlu mengonfirmasi beberapa hal dari API nyata:

1. Field lengkap serta response list/detail setiap resource master.
2. Struktur pagination dan filter CRUD framework.
3. Mekanisme upload attachment yang sudah digunakan Epanel.
4. Endpoint atau pola list untuk redemption lintas seluruh GP.
5. Endpoint serta struktur data ringkasan agregat dashboard.
6. Bentuk response error dari seluruh custom method.
7. Lookup GP dan BC untuk form pencarian customer.
8. Field create/update lengkap untuk periode dan rule yang belum diperinci dalam README.
9. Perilaku penggantian atau penggabungan child table saat update Reward.
10. Mapping permission existing Epanel terhadap aksi Loyalty.

**Tidak boleh mengarang endpoint atau field yang belum tersedia.** Jika ada kebutuhan UI yang belum bisa dipenuhi API, tampilkan sebagai batasan integrasi untuk dikonfirmasi bersama tim backend.

---

# 14. Definition of Done

Pengembangan dinyatakan selesai jika:

- Seluruh halaman dalam scope dapat diakses melalui sidebar Loyalty.
- Form dan tabel mengikuti desain Epanel existing.
- Data terhubung ke API Goback Core.
- CRUD dan custom method yang digunakan telah diuji.
- Kalkulasi massal dapat dipantau sampai selesai.
- Saldo poin ditampilkan akurat.
- Reward dapat dikelola dan dipublikasikan.
- Redemption dapat diproses sesuai lifecycle.
- Tidak terdapat double submit atau perubahan saldo dari frontend.
- Loading, error, empty state, dan permission telah ditangani.
- Tidak diperlukan perubahan backend untuk fitur yang masuk scope dan didukung endpoint saat ini.

**Hasil akhir:** Epanel memiliki modul Loyalty Management terintegrasi untuk mengatur aturan poin, memonitor kalkulasi, mengelola katalog hadiah, memeriksa saldo Group Parent, dan memproses penukaran reward customer.

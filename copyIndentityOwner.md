# PRD — Copy Owner Identity dari GC ke GP

## 1. Ringkasan

Tambahkan fitur pada halaman **Group Parent (GP)** untuk membantu user menyalin data **Owner Identity / Identitas Pemilik** yang sebelumnya tersimpan pada **Group Customer (GC)** turunan.

Satu GP dapat memiliki lebih dari satu GC, sehingga sistem **tidak boleh otomatis menentukan GC sumber dan langsung menyimpan data ke GP**.

Fitur harus:

1. Mengambil daftar GC turunan dari GP yang sedang dibuka.
2. Menampilkan identitas pemilik dari masing-masing GC.
3. Membantu user melihat apakah data antar-GC sama atau berbeda.
4. Memungkinkan user memilih GC sumber secara manual.
5. Menampilkan preview data sebelum penyimpanan.
6. Hanya setelah user melakukan konfirmasi, data dimasukkan ke field owner identity GP.
7. Menggunakan API/update GP existing.

Fitur ini adalah **frontend-only**.

---

# 2. Constraint Utama

## WAJIB: Frontend Only

Implementasi hanya boleh dilakukan pada frontend.

DILARANG:

- mengubah backend Go
- membuat endpoint baru
- mengubah endpoint existing
- mengubah database
- menambah kolom database
- migration database
- mengubah model backend
- mengubah controller backend
- mengubah hooks
- mengubah workflow
- mengubah customer registration
- mengubah Customer Change Request
- mengubah logic GC
- mengubah logic GP pada server
- mengubah GoBack/SAGA
- membuat mekanisme auto-sync pada backend

Frontend hanya boleh menggunakan API existing.

Jika suatu informasi tidak tersedia dari API existing, **jangan membuat perubahan backend sebagai bagian task ini**.

---

# 3. Tujuan

Mempermudah migrasi data Owner Identity lama dari GC ke GP tanpa risiko salah memilih data ketika satu GP memiliki beberapa GC.

Fitur harus menjaga prinsip:

> User melihat dan menentukan data terlebih dahulu sebelum data dimasukkan ke GP.

Tidak boleh ada proses:

```text
Klik button
→ sistem pilih GC sendiri
→ langsung update GP
```

Harus:

```text
Klik Copy from GC
        ↓
Load seluruh GC turunan
        ↓
Tampilkan identitas pemilik
        ↓
User review
        ↓
User pilih GC sumber
        ↓
Preview
        ↓
User konfirmasi
        ↓
Isi/update GP
```

---

# 4. Lokasi Fitur

Halaman:

```text
Group Parent Detail / Edit
```

Pada section:

```text
Owner Identity / Identitas Pemilik
```

Tambahkan button:

```text
Copy from GC
```

Untuk Bahasa Indonesia:

```text
Salin dari GC
```

Gunakan mekanisme i18n existing.

Jangan hardcode label.

---

# 5. Field Owner Identity

Field yang akan dibandingkan dan disalin mengikuti field GP existing.

Minimal:

```text
owner_name
owner_phone
owner_email
owner_birth_place
owner_birth_date
```

Jika nama field aktual di project berbeda, gunakan nama field yang sudah ada pada type/model/frontend existing.

Jangan membuat field backend baru.

---

# 6. Flow Utama

## 6.1 User membuka GP

Contoh:

```text
GP00001
PT MAJU GROUP
```

GP mempunyai GC:

```text
GC00001
GC00002
GC00003
```

Pada section Owner Identity tampil button:

```text
[ Salin dari GC ]
```

---

# 7. Klik "Salin dari GC"

Saat button diklik:

Frontend mengambil seluruh GC yang memiliki hubungan dengan GP tersebut melalui API existing.

Contoh hubungan:

```text
GP00001
├── GC00001
├── GC00002
└── GC00003
```

Kemudian tampil modal.

Judul:

```text
Salin Identitas Pemilik dari GC
```

English:

```text
Copy Owner Identity from GC
```

---

# 8. Tampilan Modal

Modal harus menampilkan seluruh GC kandidat.

Contoh:

| Select | GC      | Customer / Company | Owner        | Phone     | Email          | Birth Place | Birth Date  |
| ------ | ------- | ------------------ | ------------ | --------- | -------------- | ----------- | ----------- |
| ○      | GC00001 | PT Maju Jaya       | Budi Santoso | 081234... | budi@email.com | Bogor       | 01 Jan 1980 |
| ○      | GC00002 | PT Maju Abadi      | Budi Santoso | 081234... | budi@email.com | Bogor       | 01 Jan 1980 |
| ○      | GC00003 | PT Maju Sentosa    | Andi Wijaya  | 081999... | andi@email.com | Bandung     | 02 Feb 1982 |

User harus bisa melihat data sebelum memilih.

---

# 9. Tidak Boleh Langsung Menulis ke GP

Ketika modal pertama dibuka:

```text
NO UPDATE
NO SAVE
NO POST
NO PATCH
NO PUT
```

ke GP.

Modal pertama hanya untuk:

```text
GET / READ
```

data existing.

Tidak ada perubahan data sampai user melakukan konfirmasi akhir.

---

# 10. Deteksi Data Identik

Frontend boleh melakukan analisis local terhadap data GC.

Contoh:

```text
GC00001
Budi Santoso
08123456789
budi@email.com
Bogor
1980-01-01

GC00002
Budi Santoso
08123456789
budi@email.com
Bogor
1980-01-01
```

Karena seluruh field identitas sama, tampilkan indikator:

```text
Identitas sama dengan GC lainnya
```

atau:

```text
Same owner identity
```

GC yang mempunyai data sama boleh dikelompokkan secara visual.

Contoh:

```text
✓ Data identik pada 2 GC

GC00001
GC00002
```

Namun jangan menghapus kemampuan user untuk melihat GC sumber.

---

# 11. Data Berbeda / Conflict

Jika data owner berbeda:

```text
GC00001 → Budi Santoso
GC00002 → Budi Santoso
GC00003 → Andi Wijaya
```

tampilkan informasi:

```text
⚠ Ditemukan perbedaan identitas pemilik pada GC turunan.
Silakan pilih GC yang akan digunakan sebagai sumber.
```

English:

```text
Different owner identities were found among child GCs.
Please select the GC to use as the source.
```

Tidak boleh otomatis menentukan GC.

---

# 12. Data Tidak Lengkap

Frontend harus memperlihatkan completeness data.

Contoh:

```text
GC00001
Owner Name       ✓
Phone            ✓
Email            -
Birth Place      -
Birth Date       -
```

Tampilkan misalnya:

```text
2 / 5 field terisi
```

GC lain:

```text
GC00002
5 / 5 field terisi
```

Boleh menampilkan badge:

```text
Most Complete
```

atau:

```text
Paling Lengkap
```

Tetapi:

**jangan otomatis memilih GC tersebut.**

Itu hanya bantuan visual bagi user.

---

# 13. Empty Value

Nilai berikut dianggap kosong:

```text
null
undefined
""
whitespace-only string
```

Frontend harus normalisasi untuk kebutuhan perbandingan.

Contoh:

```text
null
```

dan:

```text
""
```

dianggap sama-sama kosong.

---

# 14. Normalisasi untuk Comparison

Untuk mendeteksi data identik, frontend dapat melakukan normalisasi lokal.

Contoh:

## String

```text
trim whitespace
```

Opsional untuk comparison:

```text
lowercase email
```

Tetapi data asli jangan dimodifikasi hanya karena normalisasi comparison.

Contoh:

```text
"Budi Santoso "
```

dan:

```text
"Budi Santoso"
```

boleh dianggap sama untuk comparison.

Namun nilai yang ditampilkan tetap data aslinya.

---

# 15. Pemilihan GC

Gunakan single selection.

Contoh:

```text
( ) GC00001
(•) GC00002
( ) GC00003
```

Hanya satu GC yang dapat dipilih sebagai source.

Button:

```text
[ Batal ] [ Lanjutkan ]
```

Button `Lanjutkan` disabled sebelum GC dipilih.

---

# 16. Preview Sebelum Update

Setelah user memilih GC dan klik:

```text
Lanjutkan
```

jangan langsung update GP.

Tampilkan step preview/confirmation.

Contoh:

```text
Preview Owner Identity

Source GC
GC00002 — PT MAJU ABADI

Data yang akan dimasukkan ke GP:

Nama Pemilik
Budi Santoso

No. Telepon
08123456789

Email
budi@email.com

Tempat Lahir
Bogor

Tanggal Lahir
01 Januari 1980
```

Button:

```text
[ Kembali ]
[ Salin ke GP ]
```

English:

```text
[ Back ]
[ Copy to GP ]
```

---

# 17. Perbandingan dengan Data GP Existing

Jika GP sudah mempunyai Owner Identity, preview harus memperlihatkan:

```text
Current GP Value
vs
Selected GC Value
```

Contoh:

| Field       | GP Saat Ini | GC Terpilih    |
| ----------- | ----------- | -------------- |
| Owner Name  | Budi S.     | Budi Santoso   |
| Phone       | 08122222    | 08123456789    |
| Email       | -           | budi@email.com |
| Birth Place | Bogor       | Bogor          |
| Birth Date  | -           | 1980-01-01     |

Field yang berubah sebaiknya diberi indikator visual.

Contoh:

```text
Changed
```

atau highlight sesuai design system existing.

---

# 18. Konfirmasi Overwrite

Jika GP sudah memiliki data, tampilkan warning:

```text
Beberapa data Owner Identity pada GP sudah terisi.
Data dari GC yang dipilih akan menggantikan nilai tersebut.
```

User tetap harus klik:

```text
Salin ke GP
```

Tidak ada overwrite otomatis.

---

# 19. Proses Update

Setelah user klik:

```text
Salin ke GP
```

frontend menggunakan mekanisme update GP yang sudah existing.

Payload hanya mengubah field Owner Identity yang terkait.

Contoh konsep:

```json
{
  "owner_name": "Budi Santoso",
  "owner_phone": "08123456789",
  "owner_email": "budi@email.com",
  "owner_birth_place": "Bogor",
  "owner_birth_date": "1980-01-01"
}
```

Jangan mengirim perubahan field GP lain yang tidak berhubungan jika API existing memungkinkan partial update.

Gunakan helper/API client existing di project.

Jangan membuat API client baru kalau sudah tersedia.

---

# 20. Handling Empty Field dari GC

Rule untuk versi pertama:

**Data dari GC terpilih merepresentasikan source yang dipilih user.**

Tetapi jangan sampai field kosong dari GC secara tidak sengaja menghapus data GP tanpa user mengetahuinya.

Jika:

```text
GP:
owner_email = owner@company.com

GC:
owner_email = kosong
```

preview wajib jelas memperlihatkan:

```text
owner@company.com
→
Kosong
```

Jika mekanisme form existing lebih aman dengan hanya mengisi form terlebih dahulu sebelum save, gunakan mekanisme tersebut.

---

# 21. Preferred UX Jika GP Menggunakan Edit Form

Jika halaman GP sudah menggunakan mekanisme:

```text
Edit form
→ ubah field
→ Save
```

maka preferred implementation adalah:

```text
Copy from GC
        ↓
Pilih GC
        ↓
Preview
        ↓
Confirm
        ↓
Populate field GP pada frontend form
        ↓
BELUM disimpan ke server
        ↓
User melihat field GP
        ↓
User klik Save GP existing
```

Ini adalah opsi paling aman jika struktur frontend existing mendukungnya.

Dengan model ini:

```text
Copy from GC
```

hanya bertindak sebagai:

```text
form data helper
```

bukan direct API mutation.

### PRIORITAS

Jika memungkinkan tanpa merusak struktur existing, gunakan flow ini.

Artinya setelah klik:

```text
Salin ke GP
```

field form GP berubah, tetapi server belum berubah.

Server baru berubah ketika user menekan:

```text
Save
```

pada form GP existing.

---

# 22. Jika Form GP Existing Tidak Mendukung Populate Tanpa Save

Jika arsitektur halaman tidak memungkinkan populate form tanpa mekanisme update existing, frontend boleh menggunakan update GP existing setelah confirmation.

Tetapi tetap:

```text
Read GC
→ Manual Select
→ Preview
→ Explicit Confirmation
→ Existing GP Update
```

Tidak boleh langsung update saat GC dipilih.

---

# 23. State Modal

Minimal state:

```text
idle
loading
loaded
empty
error
selected
preview
saving
success
```

---

# 24. Loading State

Saat mengambil GC:

```text
Memuat data GC...
```

Gunakan loading component/skeleton existing.

Button tidak boleh bisa ditekan berulang selama loading.

---

# 25. No GC State

Jika GP tidak memiliki GC:

```text
Tidak ditemukan Group Customer untuk GP ini.
```

English:

```text
No Group Customer was found for this GP.
```

Tidak ada button copy/confirm.

---

# 26. GC Ada Tetapi Owner Identity Kosong

Jika GC tersedia tetapi semua owner identity kosong:

```text
Tidak ditemukan data identitas pemilik pada GC turunan.
```

Tampilkan GC bila berguna untuk diagnosis, tetapi disable action untuk GC yang sama sekali tidak mempunyai data owner.

---

# 27. Error State

Jika request GC gagal:

```text
Gagal mengambil data Group Customer.
Silakan coba lagi.
```

Button:

```text
Coba Lagi
```

Jangan menutup modal secara otomatis.

Jangan mengubah GP.

---

# 28. Success State

Jika flow melakukan API save langsung dan berhasil:

```text
Identitas pemilik berhasil disalin ke GP.
```

Kemudian refresh/revalidate GP menggunakan mekanisme existing.

Jika flow hanya populate form:

```text
Data dari GC telah dimasukkan ke form.
Periksa kembali lalu simpan GP untuk menerapkan perubahan.
```

---

# 29. UI Recommended

Desktop:

```text
┌─────────────────────────────────────────────────────────────────┐
│ Salin Identitas Pemilik dari GC                          [ X ] │
├─────────────────────────────────────────────────────────────────┤
│ ⚠ Pilih salah satu GC sebagai sumber identitas pemilik.        │
│                                                                 │
│ ○ GC00001 — PT MAJU JAYA                       5/5 Lengkap     │
│   Budi Santoso                                                  │
│   08123456789 · budi@email.com                                  │
│   Bogor · 01 Jan 1980                                          │
│                                                                 │
│ ○ GC00002 — PT MAJU ABADI                      3/5 Terisi      │
│   Budi Santoso                                                  │
│   08123456789 · -                                               │
│   Bogor · -                                                     │
│                                                                 │
│ ○ GC00003 — PT MAJU SENTOSA                    5/5 Lengkap     │
│   Andi Wijaya                                                   │
│   08199999999 · andi@email.com                                  │
│   Bandung · 02 Feb 1982                                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                      [ Batal ] [ Lanjutkan ]   │
└─────────────────────────────────────────────────────────────────┘
```

---

# 30. Preview Recommended

````text
┌─────────────────────────────────────────────────────┐
│ Preview Identitas Pemilik                           │
├─────────────────────────────────────────────────────┤
│ Source                                              │
│ GC00001 — PT MAJU JAYA                              │
│                                                     │
│                     GP Saat Ini      Dari GC         │
│ Owner Name          -                 Budi Santoso   │
│ Phone               -                 08123456789    │
│ Email               -                 budi@email.com │
│ Birth Place         -                 Bogor          │
│ Birth Date          -                 01 Jan 1980    │
│                                                     │
├─────────────────────────────────────────────────────┤
│                         [ Kembali ] [ Salin

# Revisi Flow Utama — Copy Owner Identity dari GC

## Trigger Fitur

Fitur hanya boleh berjalan setelah user secara manual menekan button:

**Indonesia**
`Salin Identitas Pemilik dari GC`

**English**
`Copy Owner Identity from GC`

Button ditempatkan pada halaman detail/edit **Group Parent (GP)** di area Owner Identity.

Konsep trigger harus mengikuti pola fitur **Sync Identity Attachment** yang sudah ada.

Tidak boleh ada proses otomatis pada:

- page load
- membuka detail GP
- membuka edit GP
- refresh halaman
- setelah customer registration
- setelah GC berubah
- setelah GP berubah
- setelah workflow berubah

Tidak boleh ada background process atau auto-sync.

---

# Flow Final

```text
User membuka GP
        ↓
Tidak terjadi apa-apa
        ↓
User klik "Salin Identitas Pemilik dari GC"
        ↓
BARU frontend mengambil GC turunan GP
        ↓
Frontend membaca Owner Identity setiap GC
        ↓
Modal ditampilkan
        ↓
User review data
        ↓
User pilih GC sumber
        ↓
Preview data
        ↓
User konfirmasi
        ↓
Data Owner Identity dimasukkan ke GP
````

Dengan kata lain:

```text
CLICK BUTTON
= TRIGGER SELURUH PROSES
```

Sebelum button diklik:

```text
NO FETCH KHUSUS FITUR
NO CHECK
NO COMPARE
NO COPY
NO UPDATE
NO SYNC
```

---

# Behavior Button

Contoh halaman GP:

```text
Owner Identity
────────────────────────────

Nama Pemilik   : -
No. Telepon    : -
Email          : -
Tempat Lahir   : -
Tanggal Lahir  : -

[ Salin Identitas Pemilik dari GC ]
```

Tidak perlu secara otomatis mencari GC saat halaman dibuka.

Ketika user klik button:

```text
[ Salin Identitas Pemilik dari GC ]
                ↓
           loading
                ↓
       fetch GC turunan
                ↓
       tampilkan modal
```

---

# Setelah Button Diklik

Frontend menggunakan API existing untuk mendapatkan GC yang mempunyai hubungan dengan GP aktif.

Contoh:

```text
GP00001

Child GC:
GC00001
GC00002
GC00003
```

Owner Identity dari masing-masing GC kemudian ditampilkan di modal.

---

# Jika Hanya Ada 1 GC

Walaupun hanya ditemukan satu GC, **jangan langsung memasukkan data ke GP**.

Tetap tampilkan preview.

Contoh:

```text
Salin Identitas Pemilik dari GC

Source:
GC00001 — PT MAJU JAYA

Nama Pemilik   Budi Santoso
Phone          08123456789
Email          budi@email.com
Tempat Lahir   Bogor
Tanggal Lahir  01 Januari 1980

[ Batal ] [ Salin ke GP ]
```

User tetap harus melakukan konfirmasi.

---

# Jika Ada Banyak GC

Jika:

```text
GP00001
├── GC00001
├── GC00002
└── GC00003
```

setelah button diklik tampilkan seluruh kandidat.

Contoh:

```text
Pilih sumber identitas pemilik

○ GC00001 — PT MAJU JAYA
  Budi Santoso
  08123456789
  budi@email.com
  Bogor, 01 Jan 1980

○ GC00002 — PT MAJU ABADI
  Budi Santoso
  08123456789
  budi@email.com
  Bogor, 01 Jan 1980

○ GC00003 — PT MAJU SENTOSA
  Andi Wijaya
  08199999999
  andi@email.com
  Bandung, 02 Feb 1982

[ Batal ] [ Lanjutkan ]
```

User memilih satu GC secara manual.

Tidak boleh otomatis menentukan source.

---

# Jika Data Beberapa GC Sama

Frontend boleh memberikan informasi:

```text
GC00001 dan GC00002 memiliki identitas pemilik yang sama.
```

Tetapi proses tetap terjadi **setelah button diklik**.

Tidak ada pre-check sebelum user menjalankan fitur.

---

# Jika Data Berbeda

Tampilkan warning:

```text
Ditemukan identitas pemilik yang berbeda pada GC turunan.
Silakan pilih GC yang akan digunakan sebagai sumber.
```

Jangan menentukan berdasarkan:

- GC pertama
- ID terkecil
- GC terbaru
- GC terlama
- GC aktif
- data paling lengkap

Semua tetap keputusan user.

---

# Preview Sebelum Copy

Setelah user memilih GC:

```text
GC00002
```

tampilkan step kedua:

```text
Preview Identitas Pemilik

Source
GC00002 — PT MAJU ABADI

Nama Pemilik
Budi Santoso

No. Telepon
08123456789

Email
budi@email.com

Tempat Lahir
Bogor

Tanggal Lahir
01 Januari 1980

[ Kembali ] [ Salin ke GP ]
```

Belum ada perubahan ke GP pada tahap ini.

---

# Jika GP Sudah Memiliki Data

Preview harus menampilkan perbandingan.

```text
                     GP Saat Ini       Dari GC

Nama Pemilik         Budi S.           Budi Santoso
No. Telepon          08122222          08123456789
Email                -                 budi@email.com
Tempat Lahir         Bogor             Bogor
Tanggal Lahir        -                 1980-01-01
```

Dengan warning:

```text
Data yang sudah terdapat pada GP dapat berubah jika proses dilanjutkan.
```

---

# Konfirmasi Final

Hanya ketika user menekan:

```text
[ Salin ke GP ]
```

data boleh dimasukkan ke field GP.

---

# Preferred Behavior

Karena fitur ini analog dengan **Sync Identity Attachment**, gunakan pattern/component/UX yang sudah digunakan pada fitur tersebut jika memungkinkan.

Namun Owner Identity memiliki tambahan:

```text
Sync Identity Attachment:
Button
→ fetch/check
→ sync
```

Sedangkan Owner Identity:

```text
Copy Owner Identity:
Button
→ fetch/check
→ jika banyak GC tampilkan pilihan
→ review
→ confirm
→ copy
```

Jadi button tetap menjadi satu-satunya trigger.

---

# Frontend Only

Task tetap **frontend-only**.

Dilarang mengubah:

- backend Go
- database
- migration
- endpoint
- controller
- model backend
- workflow
- hook
- registration
- CCR
- SAGA
- RabbitMQ

Gunakan API existing saja.

---

# Prinsip Penting untuk Codex

Implementasi jangan membuat mekanisme seperti:

```ts
useEffect(() => {
  loadGCAndCheckOwnerIdentity();
}, [gpId]);
```

jika fungsi tersebut hanya diperlukan untuk fitur ini.

Yang diinginkan adalah:

```ts
const handleCopyOwnerIdentity = async () => {
  // baru fetch GC setelah button ditekan
};
```

Secara konsep:

```text
PAGE LOAD
→ nothing

BUTTON CLICK
→ start feature
```

Ini requirement penting.

---

# Acceptance Criteria Tambahan

### AC-01

Saat halaman GP pertama kali dibuka, fitur tidak melakukan fetch/check khusus Owner Identity GC.

### AC-02

Seluruh proses fitur baru dimulai setelah user klik button.

### AC-03

Button menjadi satu-satunya trigger fungsi.

### AC-04

Tidak ada auto-sync atau auto-copy.

### AC-05

Jika satu GC ditemukan, tetap membutuhkan review/confirmation.

### AC-06

Jika banyak GC ditemukan, user memilih source secara manual.

### AC-07

Memilih GC belum mengubah GP.

### AC-08

Preview belum mengubah GP.

### AC-09

GP hanya berubah setelah user melakukan explicit final confirmation.

### AC-10

Tidak ada perubahan backend.

REVISI
Ubah workflow Copy Owner Identity agar tersedia sebagai checker/sync utility pada level daftar GP, mengikuti pola existing Check Identity Attachment atau Check Customer Contact. Implementasi tetap frontend-only dan menggunakan API existing.
Fitur hanya berjalan ketika user menekan tombol Check Owner Identity. Jangan melakukan pemeriksaan otomatis pada page load.
Setelah tombol ditekan, frontend mengambil GP dan GC turunannya kemudian melakukan analisis lokal terhadap field owner identity.
Setiap GP diklasifikasikan menjadi:

- ready: hanya terdapat satu unique owner identity yang valid. Termasuk kondisi satu GP memiliki beberapa GC tetapi seluruh GC memiliki owner identity yang identik.
- need_review: terdapat lebih dari satu unique owner identity pada GC turunan.
- no_data: tidak ditemukan owner identity yang dapat digunakan.
- already_same: owner identity GP sudah sama dengan identity dari GC.
- gp_different: GP sudah mempunyai owner identity tetapi nilainya berbeda dengan candidate identity dari GC.
  Setelah proses check, tampilkan hasil dalam modal/table dan jangan melakukan update GP secara otomatis.
  User dapat menjalankan Sync Ready untuk GP berstatus ready setelah explicit confirmation.
  GP berstatus need_review dilarang masuk bulk sync. User harus membuka action Review, melihat seluruh GC beserta owner identity-nya, memilih GC secara manual, melihat preview, kemudian melakukan explicit sync untuk GP tersebut.
  GP berstatus gp_different juga tidak boleh otomatis overwrite. User harus melakukan review manual dengan perbandingan nilai GP saat ini dan nilai GC.
  Setelah bulk sync selesai, data need_review, gp_different, dan no_data tetap ditampilkan agar user dapat menyelesaikan exception satu per satu.
  Jangan menghapus fitur tombol Copy Owner Identity pada GP Detail yang sudah dibuat. Pertahankan sebagai alternatif untuk melakukan check/copy terhadap satu GP. Checker global adalah workflow tambahan untuk memproses banyak GP dengan lebih efisien.
  Tidak boleh ada perubahan backend, endpoint, database, schema, workflow, hook, registration, atau CCR.

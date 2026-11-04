# PRD — Export Item Excel dengan Informasi Cabang

**Project:** Epanel Ekaplus Admin  
**Platform:** Web — Next.js / TypeScript  
**Backend:** Golang (Existing API)  
**Module:** Item Management  
**Feature:** Export Item with Branches  
**Priority:** Medium  
**Scope:** Frontend Only  
**Status:** Ready for Development

---

## 1. Background

Pada halaman Item Epanel, administrator membutuhkan fitur export seluruh data item ke Excel, lengkap dengan informasi cabang tempat item tersebut terdaftar.

Saat ini data berasal dari tiga resource berbeda:

1. `item` — Master data item.
2. `item_branches` — Relasi item dengan cabang.
3. `branch` — Master data cabang.

Ketiga data tersebut sudah dapat diexport menggunakan API Golang yang tersedia.

Namun, file export belum secara otomatis menampilkan daftar nama cabang pada setiap item.

Fitur baru harus menggabungkan ketiga data tersebut menjadi satu workbook Excel.

**Tidak diperbolehkan membuat atau memodifikasi endpoint pada backend Golang.**

## 2. Objectives

Implementasikan tombol **Export Excel** di halaman Item Epanel dengan kemampuan:

- Mengambil data dari tiga API export existing.
- Mengunduh dan membaca response XLSX.
- Menghubungkan item dengan cabang berdasarkan ID.
- Menambahkan kolom `item branches` pada sheet `item`.
- Menggabungkan ketiga resource menjadi satu file Excel.
- Mendownload hasil Excel secara otomatis.
- Mempertahankan seluruh kolom asli hasil export.
- Menampilkan loading dan error handling.

Proses harus dilakukan melalui aplikasi Next.js tanpa perubahan backend Golang.

## 3. Scope

### In Scope

- Menambahkan tombol Export Excel pada halaman Item.
- Integrasi API export existing.
- Parsing file Excel.
- Mapping relasi item dan cabang.
- Generate workbook Excel.
- Download otomatis.
- Handling loading, error, dan data tidak ditemukan.

### Out of Scope

- Modifikasi database.
- Pembuatan API Golang baru.
- Perubahan endpoint Golang.
- Penambahan field pada database item.
- Penyimpanan hasil export ke database.
- Perubahan proses import item.
- Perubahan halaman Branch Management.

## 4. API Integration

Gunakan API export yang sudah tersedia.

**Base URL:**

`https://api-ekaplus.ekatunggal.com`

### API 1 — Export Item

```http
POST /api/resource/item/export?spec={"fields":["*"]}
```

### API 2 — Export Item Branches

```http
POST /api/resource/item_branches/export?spec={"fields":["*"]}
```

### API 3 — Export Branch

```http
POST /api/resource/branch/export?spec={"fields":["*"]}
```

Ketiga API menggunakan parameter:

```json
{
  "fields": ["*"]
}
```

**Ketentuan API:**

- Gunakan HTTP POST.
- Ikuti mekanisme Authorization existing pada Epanel.
- Encode parameter `spec` menggunakan `URLSearchParams` atau `encodeURIComponent`.
- Response berupa file binary XLSX.
- Jangan melakukan `response.json()` terhadap file export.
- Gunakan `response.arrayBuffer()` atau `response.blob()`.
- Jangan membuat endpoint Golang baru.
- Jangan mengubah kontrak API existing.

Contoh request:

```typescript
const spec = JSON.stringify({
  fields: ["*"],
});

const url =
  `${API_BASE_URL}/api/resource/item/export` +
  `?spec=${encodeURIComponent(spec)}`;

const response = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

if (!response.ok) {
  throw new Error("Gagal export item");
}

const arrayBuffer = await response.arrayBuffer();
```

**Catatan:** Contoh Authorization harus disesuaikan dengan implementasi autentikasi existing. Jangan mengasumsikan seluruh API menggunakan Bearer Token jika project menggunakan mekanisme lain.

## 5. Data Relationships

### 5.1 Master Item

Resource: `item`

Primary Key:

`item.id`

Field lainnya wajib tetap dipertahankan sesuai response export.

### 5.2 Item Branches

Resource: `item_branches`

Field relasi:

- `parent_id`
- `branch`
- `parent_type` (jika tersedia)

Relationship:

`item_branches.parent_id = item.id`

### 5.3 Branch

Resource: `branch`

Field:

- `id`
- `city`

Relationship:

`item_branches.branch = branch.id`

Nama cabang yang ditampilkan pada export menggunakan field `branch.city`, sesuai contoh Excel.

### 5.4 Relationship Diagram

```text
ITEM
└── id
    │
    │ 1 : N
    ▼
ITEM_BRANCHES
├── parent_id → item.id
└── branch    → branch.id
                    │
                    ▼
                  BRANCH
                  ├── id
                  └── city
```

Satu item dapat terdaftar pada lebih dari satu cabang.

## 6. User Interface

### 6.1 Lokasi Tombol

Tambahkan tombol pada header halaman Item Management, mengikuti desain dan komponen Epanel existing.

Label:

**Export Excel**

Icon:

`Download` atau `FileSpreadsheet` dari icon library project.

Posisi:

Di area action toolbar halaman Item, bersama tombol action existing.

Jangan mengubah struktur layout halaman secara keseluruhan.

### 6.2 Button State

| State   | Label        | Behavior                  |
| ------- | ------------ | ------------------------- |
| Default | Export Excel | Bisa diklik               |
| Loading | Exporting... | Disabled                  |
| Success | Export Excel | File terdownload          |
| Error   | Export Excel | Muncul error notification |

Pada saat export sedang berjalan, tombol harus disabled untuk mencegah multiple requests.

Gunakan toast notification existing.

### 6.3 User Flow

```text
User membuka halaman Item
        ↓
Klik Export Excel
        ↓
Button Loading
        ↓
Request 3 API Export
        ↓
Validasi HTTP Response
        ↓
Parse XLSX
        ↓
Validasi Worksheet dan Field
        ↓
Mapping Item ↔ Item Branches ↔ Branch
        ↓
Generate Excel Gabungan
        ↓
Download File
        ↓
Toast Success
        ↓
Button kembali normal
```

Jika salah satu API gagal, hentikan proses dan tampilkan error yang jelas.

## 7. Excel Output Specification

### 7.1 Filename

Gunakan format:

`item_export_YYYY-MM-DD.xlsx`

Contoh:

`item_export_2026-11-04.xlsx`

### 7.2 Workbook Structure

Hasil akhir wajib memiliki tiga worksheet:

| Sheet           | Isi                                     |
| --------------- | --------------------------------------- |
| `item`          | Seluruh data item + kolom item branches |
| `branch`        | Master data branch asli                 |
| `item_branches` | Data relasi item-branch asli            |

Kolom dari file original tidak boleh dihapus atau diubah namanya.

### 7.3 New Column

Pada worksheet `item`, tambahkan kolom baru paling kanan:

`item branches`

Nilai merupakan daftar kota dari cabang-cabang yang terhubung.

Format disimpan sebagai teks di dalam satu sel Excel.

Contoh:

```text
Palu, Semarang , Samarinda, Bogor, Sidoarjo
```

Jika hanya memiliki satu cabang:

```text
Bogor
```

Jika tidak memiliki cabang:

```text

```

### 7.4 Rules

1. Pertahankan seluruh item dari export master item.
2. Tidak boleh menghapus item yang `disabled = 1`.
3. Jangan hanya mengambil item yang muncul pada `item_branches`.
4. Item tanpa relasi cabang tetap harus muncul.
5. Jangan melakukan join menggunakan `item_code`.
6. Gunakan `item.id` dan `parent_id`.
7. Hilangkan nama cabang duplikat.
8. Gunakan nama kota dari `branch.city`.
9. Pertahankan urutan data item asli.
10. Urutan nama cabang mengikuti kemunculan pertama pada data relasi.
11. Jangan menggunakan placeholder atau nilai dummy untuk cabang yang tidak ditemukan.
12. Jika field `parent_type` tersedia, hanya gunakan relasi yang sesuai tipe item. Normalisasi nama tipenya berdasarkan nilai yang benar-benar digunakan API, bukan asumsi hardcoded `item`.
13. Jangan mengubah kolom asli pada sheet `branch` dan `item_branches`.

## 8. Data Processing Logic

### Step 1 — Download Source Files

Panggil ketiga endpoint export.

Boleh menggunakan `Promise.all` untuk mengambil data secara paralel.

### Step 2 — Parse XLSX

Gunakan library XLSX yang kompatibel dengan project, misalnya `exceljs`.

Jika belum terinstall, tambahkan dependency sesuai package manager existing.

Baca worksheet utama dari masing-masing file.

Jangan mengasumsikan bahwa nama worksheet selalu sama dengan nama resource jika belum diverifikasi.

### Step 3 — Create Branch Map

Buat map:

```typescript
Map<branchId, city>;
```

Contoh:

```typescript
"56" => "Bogor"
```

Gunakan `String()` untuk normalisasi ID agar ID numeric dan string tetap cocok.

### Step 4 — Create Item Branch Map

Iterasi seluruh data `item_branches`.

Cari nama kota berdasarkan field `branch`.

Kelompokkan berdasarkan `parent_id`.

Gunakan `Set<string>` untuk menghindari nama kota duplikat.

Contoh:

```typescript
"22027" => Set(["Bogor", "Sidoarjo"])
```

### Step 5 — Merge Item Data

Iterasi seluruh data item.

Cari kumpulan cabang berdasarkan `item.id`.

Tambahkan satu kolom di paling kanan:

```typescript
"item branches": JSON.stringify(branches)
```

Jika tidak ditemukan:

```typescript
"item branches": "[]"
```

### Step 6 — Generate Workbook

Buat workbook dengan tiga worksheet sesuai output specification.

Pertahankan urutan kolom dari file original.

Tambahkan kolom baru hanya pada sheet `item`.

Aktifkan AutoFilter, freeze header, dan atur lebar kolom baru agar mudah dibaca, selama tidak mengubah konten asli.

### Step 7 — Download

Generate file XLSX dan jalankan download dari browser.

Gunakan browser file download mechanism yang sudah digunakan project, bila tersedia.

Setelah berhasil, tampilkan notifikasi:

`Export item berhasil. File Excel telah diunduh.`

## 9. Architecture

**Keputusan: Frontend Only, Backend Golang Tidak Diubah.**

Gunakan struktur project Next.js existing.

Untuk implementasi yang aman, rekomendasinya:

```text
Next.js Item Page
       │
       ▼
Export Button Handler
       │
       ▼
Next.js Existing Auth / API Layer
       │
       ▼
Golang Existing Export APIs (3)
       │
       ▼
XLSX Response
       │
       ▼
Excel Processing Utility
       │
       ▼
Merged XLSX
       │
       ▼
Browser Download
```

Jika Epanel menggunakan HTTP client existing (Axios wrapper, fetch client, service layer), gunakan kembali mekanisme tersebut.

Jika autentikasi mengandalkan cookie HttpOnly atau secret server-side, proses request API dan penggabungan XLSX dapat dilakukan menggunakan Next.js Route Handler internal.

**Route Handler Next.js bukan endpoint Golang baru dan tidak memerlukan perubahan backend utama.**

Jangan membuat route internal baru jika infrastruktur API existing sudah dapat menangani request dan file download dengan aman.

Jangan mengekspos API token rahasia kepada browser.

## 10. Error Handling

| Kondisi                             | Expected Behavior                            |
| ----------------------------------- | -------------------------------------------- |
| API item gagal                      | Export dibatalkan                            |
| API item_branches gagal             | Export dibatalkan                            |
| API branch gagal                    | Export dibatalkan                            |
| HTTP 401/403                        | Gunakan handling authentication existing     |
| HTTP 500                            | Tampilkan error server                       |
| Response bukan XLSX valid           | Export dibatalkan                            |
| File Excel kosong                   | Tampilkan error sesuai resource              |
| Header/kolom relasi wajib tidak ada | Export dibatalkan                            |
| Item tanpa relasi cabang            | Isi `[]`                                     |
| Branch ID tidak ditemukan           | Catat warning, jangan buat nama cabang palsu |
| Export diklik berulang              | Hanya satu proses export aktif               |

Untuk relasi cabang yang tidak ditemukan, tampilkan warning setelah export jika file masih dapat dibuat, misalnya:

`Export selesai, tetapi ditemukan 3 relasi cabang yang tidak memiliki master branch.`

Log detail error untuk debugging tanpa menampilkan token atau data sensitif.

## 11. Performance Requirements

Export harus mampu memproses data ribuan hingga puluhan ribu item.

Ketentuan:

- Gunakan `Map` untuk lookup.
- Hindari nested loop item × item_branches.
- Jangan melakukan API request per item.
- Setiap resource cukup diambil satu kali.
- Gunakan `Promise.all` untuk request paralel jika cocok dengan API client.
- Jangan melakukan render data Excel ke React state.
- Gunakan processing utility terpisah dari komponen UI.
- Pastikan cleanup resource download seperti object URL setelah digunakan.

Target kompleksitas proses join:

`O(items + itemBranches + branches)`

Jika browser mengalami masalah memori untuk file besar, gunakan Route Handler Next.js sebagai opsi pemrosesan server-side.

## 12. Security Requirements

- Seluruh request harus mengikuti session dan permission existing.
- Jangan hardcode API token.
- Jangan menyimpan workbook ke localStorage.
- Jangan log header Authorization.
- Jangan mengubah data pada database.
- Jangan memanggil endpoint create/update/delete.
- Jangan menggunakan data yang belum divalidasi sebagai nama sheet atau formula Excel.
- Pastikan nilai yang ditulis sebagai konten sel tidak dieksekusi sebagai formula.

## 13. Acceptance Criteria

Fitur dianggap selesai jika:

- [ ] Tombol Export Excel tersedia pada halaman Item.
- [ ] UI mengikuti design system Epanel existing.
- [ ] Tiga API Golang existing berhasil dipanggil menggunakan POST.
- [ ] Response binary XLSX berhasil diproses.
- [ ] Hasil download berbentuk satu file Excel.
- [ ] Workbook memiliki sheet `item`, `branch`, dan `item_branches`.
- [ ] Semua kolom original tetap tersedia.
- [ ] Sheet `item` memiliki kolom tambahan `item branches`.
- [ ] Relasi menggunakan `item.id = item_branches.parent_id`.
- [ ] Relasi cabang menggunakan `item_branches.branch = branch.id`.
- [ ] Nama cabang berasal dari field `branch.city`.
- [ ] Item dengan banyak cabang menampilkan seluruh nama cabang unik.
- [ ] Item tanpa cabang menampilkan `[]`.
- [ ] Semua item tetap diexport termasuk disabled.
- [ ] Loading, error handling, dan notification berjalan.
- [ ] File dapat dibuka di Microsoft Excel.
- [ ] Tidak ada perubahan backend Golang maupun schema database.

## 14. Implementation Instructions for Codex

Sebelum implementasi, lakukan inspeksi project Epanel:

1. Temukan halaman Item Management existing.
2. Identifikasi component toolbar dan action button existing.
3. Identifikasi HTTP client, authentication, serta environment configuration.
4. Identifikasi mekanisme file export/download yang sudah dipakai.
5. Periksa package Excel yang sudah tersedia.
6. Gunakan struktur folder, naming, dan UI design system existing.

Setelah inspeksi:

- Implementasikan fitur dengan perubahan seminimal mungkin.
- Pisahkan parsing dan merging Excel dari komponen halaman Item.
- Gunakan TypeScript types untuk setiap resource.
- Jangan refactor halaman lain yang tidak terkait.
- Jangan mengubah API Golang.
- Jangan mengubah API contract existing.
- Jangan mengubah fitur import, edit, delete, pagination, atau filter Item.
- Jangan menambahkan opsi export hanya data yang sedang tampil di halaman; export harus menggunakan seluruh data dari API.
- Jalankan typecheck, lint, dan build jika tersedia.
- Tambahkan pengujian untuk relasi multi-cabang, tanpa cabang, duplikasi, dan missing branch.

**Deliverables:**

1. Tombol Export Excel berfungsi pada halaman Item.
2. Integrasi tiga endpoint export existing.
3. Utility parsing dan penggabungan XLSX.
4. Download workbook tiga worksheet.
5. Error handling.
6. Ringkasan file yang diubah beserta hasil validasi.

---

## 15. Final Expected Result

Ketika admin membuka halaman Item Epanel dan klik **Export Excel**, aplikasi akan menghasilkan:

**`item_export_2026-11-04.xlsx`**

Berisi:

- Sheet `item`: seluruh data master item dengan tambahan satu kolom daftar nama cabang.
- Sheet `branch`: seluruh data master branch.
- Sheet `item_branches`: seluruh relasi item-branch.

Kolom `item branches` menampilkan nama-nama cabang dalam format text:

```text
Palu, Semarang, Samarinda, Bogor, Sidoarjo
```

Tidak diperlukan perubahan pada backend Golang, database, maupun endpoint export existing.

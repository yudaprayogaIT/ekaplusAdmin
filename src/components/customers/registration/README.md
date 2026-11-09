# Panduan Approve Customer Register

Approval Customer Register berada di `/customers/registrations`. Tombol Approve hanya digunakan untuk dokumen berstatus `Draft` atau `Request`; kontrol Edit, Reject, Resync, dan Rollback tetap mengikuti permission yang sudah ada. Resync/Rollback tetap khusus role `administrator`.

## Alur approval yang diimplementasikan

Modal approval menggunakan satu halaman scroll, bukan wizard. Admin menyusun hierarki berikut dengan pola **search first**:

1. National Brand (NB): pilih existing, buat draft baru, atau tanpa NB.
2. Group Parent (GP): pilih existing yang relasi NB-nya cocok, atau buat draft baru.
3. Group Customer (GC): pilih existing di bawah GP existing, atau buat draft baru.
4. Branch Customer (BC): nama dihitung otomatis sebagai `<GC name> - <kode branch>` dan di-resolve oleh Saga.

Tombol `Buat ... Baru` dan `Gunakan Nama Ini` hanya mengubah state lokal. Search, pilih, edit draft, Batal, dan menutup modal tidak melakukan POST master.

Mengganti parent akan mereset child yang tidak lagi kompatibel. GP baru mengharuskan GC baru. Nama BC selalu mengikuti GC dan kode branch terbaru.

## Commit Approve

Saat admin mengonfirmasi `Commit Approve`, frontend menjalankan proses berikut secara berurutan:

```text
Preflight GET
  → resolve/create NB
  → resolve/create GP (nbid hasil NB)
  → resolve/create GC (gpid hasil GP)
  → hitung nama BC dari GC + kode branch dan tandai resolusi Saga
  → PUT customer_register
```

Endpoint existing yang digunakan:

| Operasi | Endpoint |
| --- | --- |
| GET/POST NB | `/api/resource/national_brand` |
| GET/POST GP | `/api/resource/group_parent` |
| GET/POST GC | `/api/resource/group_customer` |
| GET kode branch | `/api/resource/branch` |
| GET/PUT registrasi | `/api/resource/customer_register/:id` |

Modal tidak melakukan search atau POST BC. Kode branch diambil dari field `branch.name` (contoh `SDA`), bukan nama panjang branch. `bcid` dikirim `null`; Branch Customer dengan pola nama seperti `ABC TK - SDA` dibuat atau di-resolve oleh alur sinkronisasi/Saga yang sudah tersedia. Dengan demikian BC tidak dibuat di dua tempat.

Payload PUT mempertahankan field existing: `docstatus=1`, `status=Syncing`, owner, relasi NB/GP/GC/BC, payment method/account, tax/NPWP, ERP customer group, notes, sales team, dan shipping address. Payload GC tetap membawa credit policy, identitas owner, dan data perusahaan.

## Validasi dan duplikasi

Sebelum POST, preflight melakukan GET ulang untuk:

- memastikan registrasi masih Draft/Request dan belum Submitted;
- memastikan master existing masih tersedia;
- memvalidasi relasi NB → GP → GC → BC serta branch;
- menolak nama identik pada parent yang sama;
- membedakan kegagalan GET dari hasil kosong.

Pemeriksaan frontend mengurangi risiko duplikasi, tetapi tidak menggantikan constraint/validasi backend dalam kondisi concurrent.

## Partial failure dan retry

Setiap ID yang berhasil di-resolve disimpan dalam checkpoint `sessionStorage` dengan TTL 24 jam. Checkpoint hanya berisi ID, daftar stage, status, timestamp, registration ID, dan hash fingerprint draft; token, dokumen identitas, NPWP, dan payload registrasi tidak disimpan.

Contoh: jika GP berhasil dibuat tetapi POST GC gagal, `Coba Lanjutkan` memakai `gpid` checkpoint dan melanjutkan dari GC tanpa POST GP ulang. Setelah sebagian operasi berhasil, draft dikunci agar checkpoint tidak diterapkan ke hierarki lain.

Jika POST/PUT mengalami timeout atau network error, hasilnya dianggap `unknown`. Retry otomatis diblokir. Tombol `Periksa Status` melakukan GET:

- untuk master, mencari kecocokan nama exact dan parent exact serta hanya menerima satu hasil unik;
- untuk PUT registrasi, memeriksa `docstatus` server sebelum memutuskan apakah submit sudah terjadi.

Checkpoint browser bersifat best-effort dan tidak memberi jaminan exactly-once. Draft berbeda dari fingerprint checkpoint diblokir dan membutuhkan rekonsiliasi manual. Frontend tidak menghapus master parsial secara otomatis.

## Status setelah approval

| Field | Nilai | Arti |
| --- | --- | --- |
| `docstatus` | `1` | Approval sudah Submitted/locked. |
| `status` | `Syncing` | Sinkronisasi sedang berjalan. |
| `saga_status` | hingga `completed` | Status proses ERP/CRM/Ekaplus yang terpisah. |

Pesan sukses modal adalah “approval berhasil dikirim — sinkronisasi berjalan”. Pesan ini tidak mengklaim customer sudah berhasil dibuat di ERP. Keberhasilan akhir diperiksa dari `saga_status=completed`, ID integrasi, dan error sinkronisasi pada detail registrasi.

## Demo mode

Demo/tour tetap menampilkan flow approval tetapi tidak menjalankan POST atau PUT aktual.

## Keterbatasan

- API tidak menyediakan endpoint approval transaksional/idempotency key, sehingga master parsial masih mungkin tertinggal setelah kegagalan antar-request.
- Tidak ada rollback otomatis master dan tidak ada jaminan exactly-once lintas browser/user.
- Verifikasi timeout hanya dapat dilanjutkan jika GET menemukan satu entitas exact dengan relasi parent yang benar; hasil ambigu harus diperiksa manual.
- Kesuksesan submit tidak berarti Saga selesai.

## Referensi

- `ApproveRegistrationModal.tsx`: draft UI, preflight, orchestration, checkpoint, dan retry.
- `CustomerRegistrationList.tsx`: list, refresh, Resync/Rollback.
- `RegistrationDetailModal.tsx`: detail dan status Saga.
- `src/config/api.ts`: konfigurasi endpoint existing.

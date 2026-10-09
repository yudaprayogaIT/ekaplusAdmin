# PRD – Manual Sync Customer Register Identity Attachment ke Group Parent

## 1. Objective

Tambahkan fitur **manual maintenance/sync** di frontend Ekaplus Admin untuk memperbaiki data lama:

```text
Customer Register.identity_attachment
                ↓
Group Parent.identity_attachment
```

Fitur ini hanya berjalan ketika user secara eksplisit menekan tombol sync/check.

## CRITICAL RULE

Fitur ini **TIDAK BOLEH** dipanggil otomatis dari:

```text
Customer Register Approval
Create Customer Register
Update Customer Register
Submit Customer Register
RegistrationDetailModal open
Page load
Create Group Parent
Create Group Customer
Create Branch Customer
```

Flow Customer Register existing harus tetap 100% sama.

---

# 2. Reference Existing Feature

Gunakan pola existing:

```text
Check Customer Contact
```

Existing implementation yang perlu dijadikan referensi:

```text
src/components/customers/CustomerOverviewPage.tsx

src/utils/generateCustomerContacts.ts

src/components/customers/MissingCustomerContactModal.tsx
```

Existing flow:

```text
User klik "Check Customer Contact"
        ↓
scanMissingCustomerContacts()
        ↓
modal dibuka
        ↓
hasil scan ditampilkan
        ↓
user klik Generate
        ↓
re-check data
        ↓
generateMissingCustomerContacts()
```

Identity Attachment Sync harus mengikuti konsep serupa.

---

# 3. Desired UX

Tambahkan button maintenance baru pada halaman yang sama dengan:

```text
Check Customer Contact
```

Contoh label:

```text
Check Identity Attachment
```

atau jika konsisten dengan UI:

```text
Sync Identity Attachment
```

Recommended flow:

```text
User klik Check Identity Attachment
          ↓
Frontend scan Customer Register
          ↓
Cari Customer Register yang:
- memiliki identity_attachment
- memiliki Group Parent valid
          ↓
GET Group Parent terkait
          ↓
Klasifikasikan data
          ↓
Tampilkan modal hasil scan
          ↓
User review
          ↓
Klik "Sync X Attachment"
          ↓
Confirmation
          ↓
Re-check setiap GP
          ↓
PUT hanya GP yang attachment-nya masih kosong
```

Tidak ada perubahan otomatis sebelum user menekan tombol Sync.

---

# 4. Do Not Modify Customer Register Flow

Jangan mengubah:

```text
ApproveRegistrationModal.tsx
```

untuk menjalankan sync.

Jangan tambahkan:

```ts
await syncIdentity...
```

setelah approval.

Jangan mengubah proses:

```text
create GP
create GC
create BC
approve
submit
```

Fitur ini merupakan **maintenance tool terpisah**.

---

# 5. Source Data

Source utama:

```text
Customer Register
```

Field yang diperlukan minimal:

```text
id
name
gpid
gp_manual
identity_attachment
status/workflow state jika diperlukan
```

Gunakan struktur actual Customer Registration existing.

Pastikan scan menggunakan Customer Register yang relevan saja.

Jika existing business rule mensyaratkan hanya registration yang sudah approved/selesai, gunakan status/workflow state existing sebagai filter.

Jangan menebak nama workflow state. Inspect implementasi existing terlebih dahulu.

---

# 6. Resolve Group Parent

Group Parent harus ditentukan berdasarkan ID.

Prioritas:

```ts
registration.gp_id ?? registration.master_links?.gp_id;
```

atau raw API equivalent seperti:

```ts
registration.gpid;
```

sesuai layer yang sedang digunakan.

## Jangan resolve menggunakan:

```text
gp_manual
gp_name
nama perusahaan
nama owner
```

`gp_manual` hanya informasi bahwa GP awalnya dibuat secara manual.

Setelah approval berhasil, target sebenarnya harus menggunakan Group Parent ID.

---

# 7. Scan Classification

Setiap Customer Register yang mempunyai `identity_attachment` harus diklasifikasikan.

Gunakan status internal seperti:

```ts
type IdentityAttachmentScanAction =
  | "ready"
  | "already_synced"
  | "conflict"
  | "missing_group_parent";
```

---

## A. Ready

Customer Register:

```text
identity_attachment = ATTACH-A
gpid = 100
```

Group Parent:

```text
identity_attachment = null
```

Result:

```text
ready
```

Data ini boleh disinkronkan.

---

## B. Already Synced

Customer Register:

```text
identity_attachment = ATTACH-A
```

Group Parent:

```text
identity_attachment = ATTACH-A
```

Result:

```text
already_synced
```

Tidak perlu PUT.

---

## C. Conflict

Customer Register:

```text
identity_attachment = ATTACH-B
```

Group Parent:

```text
identity_attachment = ATTACH-A
```

Result:

```text
conflict
```

## Jangan overwrite.

Data conflict hanya ditampilkan untuk review.

---

## D. Missing Group Parent

Customer Register mempunyai attachment tetapi tidak mempunyai GP ID valid.

Result:

```text
missing_group_parent
```

Tidak boleh sync.

Jangan mencari GP berdasarkan `gp_manual`.

---

# 8. Scan Result

Contoh structure:

```ts
export interface IdentityAttachmentScanRow {
  customerRegisterId: number;
  customerRegisterCode: string;

  gpid: number | null;
  gpCode?: string;
  gpName?: string;

  customerRegisterAttachment: string;

  groupParentAttachment?: string | null;

  action: "ready" | "already_synced" | "conflict" | "missing_group_parent";
}
```

Scan result:

```ts
export interface IdentityAttachmentScanResult {
  scannedAt: string;

  rows: IdentityAttachmentScanRow[];

  total: number;
  ready: number;
  alreadySynced: number;
  conflict: number;
  missingGroupParent: number;
}
```

---

# 9. Utility File

Buat utility baru, misalnya:

```text
src/utils/syncIdentityAttachments.ts
```

Gunakan naming convention existing jika ada yang lebih sesuai.

Export minimal:

```ts
scanCustomerRegisterIdentityAttachments(...)
```

dan:

```ts
syncCustomerRegisterIdentityAttachments(...)
```

Konsepnya mengikuti:

```text
scanMissingCustomerContacts()
generateMissingCustomerContacts()
```

yang sudah ada.

---

# 10. Scan Function

Signature contoh:

```ts
export async function scanCustomerRegisterIdentityAttachments({
  token,
  roleName,
}: {
  token: string;
  roleName: string | null | undefined;
}): Promise<IdentityAttachmentScanResult>;
```

Jika Check Customer Contact existing dibatasi administrator, gunakan permission pattern yang sama jika memang fitur maintenance ini ditempatkan bersama maintenance tools tersebut.

Jangan membuat mekanisme permission baru jika existing helper dapat digunakan.

---

# 11. Important Scan Optimization

Jangan mengambil seluruh detail GP satu per satu jika API query existing bisa mengambil field relasi yang dibutuhkan secara efisien.

Inspect kemampuan Goback query existing terlebih dahulu.

Namun correctness lebih penting daripada premature optimization.

Field utama yang diperlukan:

```text
Customer Register:
id
name
gpid
identity_attachment

Group Parent:
id
name
gp_name
identity_attachment
```

---

# 12. Manual Sync Function

Contoh:

```ts
export async function syncCustomerRegisterIdentityAttachments({
  token,
  roleName,
  scanResult,
  onProgress,
}: {
  token: string;
  roleName: string | null | undefined;
  scanResult: IdentityAttachmentScanResult;
  onProgress?: (progress: IdentityAttachmentSyncProgress) => void;
}): Promise<IdentityAttachmentSyncResult>;
```

Hanya row dengan:

```text
action === "ready"
```

yang boleh diproses.

---

# 13. Mandatory Re-check Before PUT

Ini penting.

Walaupun hasil scan sebelumnya mengatakan:

```text
GP.identity_attachment = null
```

sebelum PUT lakukan GET/check ulang GP.

Flow:

```text
scan:
GP empty
   ↓
user membaca modal selama beberapa menit
   ↓
klik Sync
   ↓
GET GP lagi
   ↓
cek kondisi terbaru
```

Baru lakukan PUT jika attachment masih kosong.

Ini mengikuti filosofi existing Customer Contact generator yang mengecek relasi ulang sebelum POST.

---

# 14. Re-check Rules

Sebelum setiap PUT:

### GP masih kosong

```text
GP attachment = null
```

→ PUT attachment dari Customer Register.

### GP sekarang sudah sama

```text
GP attachment == CR attachment
```

→ skip sebagai:

```text
already_synced
```

### GP sekarang sudah berbeda

```text
GP attachment != CR attachment
```

→ skip sebagai:

```text
conflict
```

## Tidak boleh overwrite.

---

# 15. PUT Group Parent

Gunakan existing API helper.

Reference pola dari:

```text
GPDetailModal.tsx
```

Concept:

```ts
await apiFetch(
  getResourceUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, gpid),
  {
    method: "PUT",
    body: JSON.stringify({
      identity_attachment: customerRegisterAttachment,
    }),
    cache: "no-store",
  },
  token,
);
```

Jangan membuat endpoint backend baru.

---

# 16. Normalization

Normalize attachment sebelum comparison:

```ts
function normalizeAttachment(value?: string | null): string | null {
  const normalized = value?.trim();

  return normalized || null;
}
```

Sehingga:

```text
null
""
" "
```

semuanya dianggap kosong.

---

# 17. Sync Result

Contoh:

```ts
export interface IdentityAttachmentSyncResult {
  updated: number;

  alreadySynced: number;

  conflict: number;

  skippedMissingGroupParent: number;

  failed: Array<{
    customerRegisterId: number;
    customerRegisterCode: string;
    gpid?: number;
    message: string;
  }>;
}
```

---

# 18. Progress

Karena bisa memproses banyak registration, gunakan progress seperti existing Contact Generator.

Contoh:

```ts
export interface IdentityAttachmentSyncProgress {
  completed: number;
  total: number;
  label: string;
}
```

UI:

```text
Memproses CR-000123

13 / 57
████████░░░░░
```

---

# 19. Modal

Buat component baru, misalnya:

```text
src/components/customers/IdentityAttachmentSyncModal.tsx
```

Gunakan desain/pattern dari:

```text
MissingCustomerContactModal.tsx
```

Modal harus menampilkan summary:

```text
Total ditemukan        120
Siap Sync               35
Sudah sama              70
Conflict                12
GP tidak ditemukan       3
```

---

# 20. Modal Tabs

Recommended tabs:

```text
Siap Sync
Sudah Sinkron
Conflict
Bermasalah
```

Minimal tabel:

```text
Customer Register
Group Parent
Attachment Customer Register
Attachment Group Parent
Status
```

Attachment dapat berupa link/preview mengikuti attachment component/helper existing.

Jangan membuat file viewer baru jika project sudah mempunyai cara membuka attachment.

---

# 21. Sync Button

Button utama:

```text
Sync 35 Attachment
```

Disable apabila:

```text
ready === 0
```

Klik button tidak langsung PUT.

Tampilkan ConfirmDialog mengikuti existing Customer Contact flow.

---

# 22. Confirmation

Gunakan existing:

```text
ConfirmDialog
```

Contoh:

```text
Sync Identity Attachment

Sinkronkan identity attachment untuk 35 Group Parent
yang attachment-nya masih kosong?

Data Group Parent yang sudah memiliki attachment
tidak akan ditimpa.
```

Buttons:

```text
Batal
Ya, Sync
```

---

# 23. After Sync

Setelah selesai tampilkan result:

```text
Sync selesai

Berhasil              31
Sudah terisi           2
Conflict               1
Gagal                  1
```

Sediakan:

```text
Cek Ulang
```

seperti modal Check Customer Contact.

`Cek Ulang` menjalankan scan ulang dari API.

---

# 24. CustomerOverviewPage Integration

Integrasikan feature di area maintenance yang sekarang memiliki:

```text
Check Customer Contact
```

Tambahkan state serupa:

```ts
identityCheckOpen;
isScanningIdentity;
identityScanResult;
identityScanError;
isSyncingIdentity;
identitySyncResult;
identitySyncProgress;
```

Handlers:

```ts
handleCheckIdentityAttachments();
```

dan:

```ts
handleSyncIdentityAttachments();
```

Jangan mencampurkan logic API besar langsung ke component.

Component hanya orchestrate UI.

Scan/sync logic tetap di utility.

---

# 25. Button Behavior

Ketika user klik:

```text
Check Identity Attachment
```

jalankan:

```text
set modal open
set scanning
scanCustomerRegisterIdentityAttachments()
show result
```

## Tidak melakukan PUT saat Check.

PUT hanya dilakukan ketika user kemudian memilih:

```text
Sync X Attachment
```

dan menyetujui confirmation.

---

# 26. Customer Register Approval Must Remain Untouched

Codex harus memastikan tidak ada perubahan pada behavior:

```text
ApproveRegistrationModal
RegistrationDetailModal
CustomerRegistrationList
```

kecuali import/type adjustment benar-benar diperlukan untuk compile.

Terutama jangan melakukan:

```ts
syncIdentityAttachment...
```

dari approval.

---

# 27. Group Parent Existing Attachment Policy

Policy final:

```text
GP kosong
→ boleh diisi

GP sudah sama
→ skip

GP berbeda
→ conflict

GP existing berbeda
→ NEVER AUTO OVERWRITE
```

Tidak ada konsep:

```text
attachment Customer Register terbaru menang
```

Tidak ada konsep:

```text
last registration wins
```

---

# 28. gp_manual Rule

`gp_manual` bukan target lookup.

Contoh:

```text
gp_manual = PT ABC
gpid = 123
```

gunakan:

```text
123
```

Jika:

```text
gp_manual = PT ABC
gpid = null
```

status:

```text
missing_group_parent
```

Jangan query Group Parent berdasarkan:

```text
PT ABC
```

---

# 29. No Backend Changes

Tidak boleh melakukan perubahan:

```text
Go backend
Database
Schema
API route
Approval backend
Customer Register hook
Group Parent hook
```

Gunakan REST resource API existing.

---

# 30. Type Updates

Pastikan:

```text
src/types/customer.ts
```

mempunyai:

```ts
GroupParent.identity_attachment?: string | null;
GroupParent.identity_number?: string | null;
```

Dan:

```ts
GroupParentApiResponse.identity_attachment?: string | null;
GroupParentApiResponse.identity_number?: string | null;
```

Gunakan type yang tepat.

Hindari `any`.

---

# 31. Files Expected

Kemungkinan file baru:

```text
src/utils/syncIdentityAttachments.ts

src/components/customers/IdentityAttachmentSyncModal.tsx
```

File existing yang kemungkinan berubah:

```text
src/components/customers/CustomerOverviewPage.tsx

src/types/customer.ts
```

`customerRegistration.ts` hanya diubah bila type existing belum mencakup field yang benar-benar dibutuhkan.

## Jangan mengubah approval modal.

---

# 32. Acceptance Test

## Test A

```text
CR attachment = kosong
```

Expected:

```text
tidak masuk kandidat sync
```

---

## Test B

```text
CR attachment = A
GP attachment = kosong
```

Scan:

```text
ready
```

Setelah klik Sync:

```text
GP attachment = A
updated = 1
```

---

## Test C

```text
CR attachment = A
GP attachment = A
```

Expected:

```text
already_synced
```

Tidak ada PUT.

---

## Test D

```text
CR attachment = B
GP attachment = A
```

Expected:

```text
conflict
```

Tidak ada PUT.

---

## Test E

```text
CR attachment = A
gpid = null
```

Expected:

```text
missing_group_parent
```

Tidak ada lookup berdasarkan `gp_manual`.

---

## Test F – Race Condition

Saat scan:

```text
GP attachment = kosong
```

Sebelum user klik sync seseorang mengisi:

```text
GP attachment = B
```

Saat sync melakukan re-check.

Expected:

```text
conflict
```

Tidak overwrite B.

---

## Test G – Manual Trigger Only

Approve Customer Register baru.

Expected:

```text
tidak ada request sync attachment
```

Open registration detail.

Expected:

```text
tidak ada request sync attachment
```

Reload page.

Expected:

```text
tidak ada request sync attachment
```

Hanya klik:

```text
Check Identity Attachment
```

yang menjalankan scanner.

Hanya klik:

```text
Sync X Attachment
```

yang menjalankan PUT.

---

# 33. Validation

Jalankan validation command berdasarkan `package.json`.

Minimal TypeScript check/build yang tersedia.

Pastikan perubahan tidak menghasilkan regression pada:

```text
Customer Overview
Check Customer Contact
Customer Register
Approval Customer Register
GP Detail
GC Detail
BC Detail
```

---

# 34. Definition of Done

Fitur dianggap selesai apabila:

- Ada tombol manual Check/Sync Identity Attachment.
- Tidak ada automatic sync.
- Customer Register approval existing tidak berubah.
- Scan dapat menemukan CR attachment yang belum masuk GP.
- Hanya GP kosong yang menjadi kandidat sync.
- GP yang sudah sama tidak di-update.
- GP berbeda ditandai conflict.
- Conflict tidak di-overwrite.
- GP dire-check tepat sebelum PUT.
- Ada modal review sebelum sync.
- Ada confirmation sebelum PUT.
- Ada progress saat sync.
- Ada hasil jumlah sukses/skip/conflict/error.
- Ada tombol Cek Ulang.
- Tidak ada backend changes.
- Existing Check Customer Contact tetap berfungsi.
- Typecheck/build existing tetap lulus.

---

# 35. Codex Implementation Instruction

Sebelum coding, inspect terlebih dahulu:

```text
src/components/customers/CustomerOverviewPage.tsx
src/components/customers/MissingCustomerContactModal.tsx
src/utils/generateCustomerContacts.ts

src/components/customers/registration/*
src/components/group_parent atau GP detail related file

src/types/customer.ts
src/types/customerRegistration.ts

API_CONFIG
apiFetch
getResourceUrl
getQueryUrl
ConfirmDialog
attachment preview/open helper existing
```

Gunakan **Check Customer Contact sebagai pattern utama**.

Jangan refactor besar.

Jangan mengubah Customer Register workflow.

Jangan memasang sync pada approval.

Implementasi harus berupa maintenance feature yang hanya berjalan atas tindakan eksplisit user.

Setelah selesai laporkan:

1. file baru;
2. file berubah;
3. cara scanner menentukan kandidat;
4. cara re-check sebelum PUT;
5. behavior conflict;
6. hasil typecheck/lint/build;
7. confirmation bahwa approval flow Customer Register tidak dimodifikasi.

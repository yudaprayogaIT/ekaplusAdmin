# PRD — Loyalty Point Epanel

## 1. Tujuan

Implementasikan modul **Loyalty Point** pada Epanel untuk kebutuhan admin dalam:

- melihat saldo point Group Parent,
- melihat histori dan detail perhitungan point,
- memonitor hasil kalkulasi massal,
- menangani kalkulasi bermasalah,
- melakukan recalculate,
- melihat dan memproses redemption,
- mengatur period, rule, divider, dan reward.

Modul harus mengikuti design system, layout, component, routing, permission, table, pagination, filter, modal, toast, loading state, dan API pattern yang sudah digunakan pada project Epanel existing.

Jangan membuat style atau component baru jika component existing masih bisa digunakan.

---

# 2. Konsep Bisnis Utama

Point hanya dimiliki oleh:

**Group Parent / GP**

Group Customer dan Branch Customer tidak memiliki saldo point sendiri.

Sumber omzet berasal dari seluruh Branch Customer di bawah GP dengan hierarchy:

```text
Group Parent
  ↓
Group Customer
  ↓
Branch Customer
```

Perhitungan point:

```text
Point = Omzet per Sales Account / Standard Divider
```

Contoh:

```text
Sales Account: Accessories
Omzet: Rp1.280.000
Standard Divider: Rp10.000

Point:
1.280.000 / 10.000 = 128 Point
```

Hasil point disimpan dalam ledger/bucket berdasarkan period.

Point dapat:

- available,
- reserved,
- used,
- expired,
- belum ready digunakan.

---

# 3. Lokasi Menu

Tambahkan menu:

```text
Customer
  └── Loyalty Point
```

Jangan membuat seluruh resource loyalty menjadi menu sidebar terpisah.

Semua fungsi loyalty dikelola dalam satu modul.

Route utama:

```text
/customer/loyalty-point
```

Suggested routes:

```text
/customer/loyalty-point
/customer/loyalty-point/customers
/customer/loyalty-point/customers/[gpid]

/customer/loyalty-point/calculations
/customer/loyalty-point/calculations/[batchId]

/customer/loyalty-point/redemptions
/customer/loyalty-point/redemptions/[id]

/customer/loyalty-point/settings/periods
/customer/loyalty-point/settings/rules
/customer/loyalty-point/settings/rewards
```

Sesuaikan dengan routing pattern project existing.

---

# 4. Struktur Halaman Utama

Pada halaman:

```text
Customer > Loyalty Point
```

gunakan tab:

```text
Overview
Customer Points
Calculation
Redemption
Settings
```

Gunakan tab component existing jika tersedia.

State tab harus tetap konsisten saat reload jika routing existing mendukung nested route.

---

# 5. Overview

## Tujuan

Memberikan ringkasan kondisi Loyalty Point secara keseluruhan.

Admin harus langsung mengetahui:

- berapa point yang tersedia,
- berapa GP yang memiliki point,
- berapa point reserved,
- berapa redemption pending,
- apakah ada kalkulasi bermasalah.

---

## KPI Card

Tampilkan:

### Total Available Point

Jumlah seluruh point yang saat ini bisa digunakan.

### GP With Point

Jumlah Group Parent yang memiliki saldo.

### Reserved Point

Point yang sedang di-reserve karena redemption pending.

### Redeemed Point

Jumlah point yang sudah digunakan.

### Pending Redemption

Jumlah redemption berstatus:

```text
PENDING
```

### Calculation Issues

Jumlah kalkulasi dengan status:

```text
FAILED
NEED_REVIEW
INCOMPLETE
```

Gunakan card component yang sudah ada di Epanel.

---

# 6. Active Loyalty Period

Di halaman Overview tampilkan active/current period.

Contoh:

```text
Loyalty 2026

01 Jan 2026 - 31 Dec 2026

Status:
OPEN

Point Ready:
IMMEDIATE

Expiry:
NEVER
```

Field yang relevan:

```text
name
date_from
date_to
status
expiry_mode
expiry_months
point_ready
```

Expiry mode:

```text
NEVER
DURATION
PERIOD_END
```

Point ready:

```text
IMMEDIATE
AFTER_PERIOD_END
```

Gunakan label yang mudah dipahami user.

Contoh:

```text
NEVER
Tidak pernah kedaluwarsa

DURATION
Berlaku terbatas

PERIOD_END
Berakhir bersama periode
```

---

# 7. Last Calculation Batch

Overview harus menampilkan batch kalkulasi terbaru.

Contoh:

```text
Batch #102

23 Oct 2026 00:00 WIB

Total GP       1,248
Success        1,220
Need Review       14
Incomplete         8
Failed             6
```

Action:

```text
View Calculation
```

Klik menuju detail batch.

---

# 8. Customer Points

Route:

```text
/customer/loyalty-point/customers
```

Tujuan:

Melihat saldo point berdasarkan Group Parent.

---

## Table

Kolom:

```text
Group Parent
Total Point
Reserved
Available
Expiring Soon
Status
Action
```

Contoh:

```text
GPTWC001
TWC Furniture Group

Total Point:
18,500

Reserved:
2,000

Available:
16,500
```

Action:

```text
View Detail
```

---

# 9. Search dan Filter Customer Points

Search mendukung:

```text
GP Code
GP Name
```

Filter:

```text
Period
Has Point
Has Reserved Point
Expiring Soon
```

Gunakan pagination existing.

Jangan load seluruh GP sekaligus jika resource API sudah mendukung pagination.

---

# 10. Customer Point Detail

Route:

```text
/customer/loyalty-point/customers/[gpid]
```

Header:

```text
GPTWC001
TWC Furniture Group
```

Tampilkan summary cards:

```text
Total Earned
Used
Reserved
Available
```

Contoh:

```text
Total Earned    25,000
Used             5,000
Reserved         1,500
Available       18,500
```

---

# 11. Customer Detail Tabs

Gunakan tabs:

```text
Point Balance
Calculation History
Redemption History
```

---

# 12. Point Balance / Bucket

Gunakan API balance.

Endpoint:

```text
POST /api/resource/loyalty_redemption/method/get_balance
```

Payload:

```json
{
  "gpid": "GPTWC001"
}
```

API juga mendukung:

```json
{
  "bcid": "TWCBGR001"
}
```

Tetapi untuk Epanel GP detail gunakan `gpid`.

Response utama:

```text
total_point
redeemed_point
reserved_point
available_point
buckets
```

Bucket memiliki:

```text
ledger_id
period_id
period_name
earned_point
used_point
reserved_point
available_point
valid_from
valid_to
expired
ready
```

---

# 13. Tampilan Point Bucket

Jangan tampilkan istilah teknis seperti:

```text
loyalty_point_ledger
ledger_id
```

kepada user utama.

Tampilkan sebagai:

```text
Point Balance
```

atau:

```text
Point Allocation
```

Contoh table:

| Period | Earned | Used | Reserved | Available | Valid Until | Status |
| ------ | -----: | ---: | -------: | --------: | ----------- | ------ |

Status mapping:

Jika:

```text
expired = true
```

tampilkan:

```text
Expired
```

Jika:

```text
ready = false
```

tampilkan:

```text
Not Ready
```

Jika:

```text
ready = true
expired = false
```

tampilkan:

```text
Available
```

Jika `valid_to` kosong:

```text
No Expiry
```

---

# 14. Calculation History Customer

Tampilkan seluruh hasil kalkulasi GP.

Kolom:

```text
Calculation
Period
Date
Total Omzet
Point
Status
Action
```

Status:

```text
SUCCESS
INCOMPLETE
NEED_REVIEW
FAILED
```

Action:

```text
View Detail
```

---

# 15. Calculation Detail

Saat user membuka calculation:

Header:

```text
CALC00211
```

Tampilkan:

```text
Period
Calculation Date
Status
Total Omzet
Total Point
```

Contoh:

```text
Period
Loyalty 2026

Calculation Date
23 Oct 2026 00:03

Status
SUCCESS

Total Omzet
Rp178.979.000

Point Earned
17.892
```

---

# 16. Detail Pembelian / Calculation Detail

Gunakan data:

```text
loyalty_calculation_detail
```

Tampilkan sebagai:

```text
Detail Pembelian
```

atau:

```text
Point Calculation Detail
```

Kolom:

```text
Sales Account
Omzet
Standard Divider
Point
```

Contoh:

| Sales Account |        Omzet |  Divider | Point |
| ------------- | -----------: | -------: | ----: |
| Accessories   |  Rp1.280.000 | Rp10.000 |   128 |
| Foam          | Rp35.000.000 | Rp10.000 | 3.500 |
| Spring        | Rp22.500.000 | Rp10.000 | 2.250 |

Gunakan currency formatter Indonesia:

```text
Rp1.280.000
```

Gunakan point formatter:

```text
17.892 Point
```

---

# 17. Data yang DILARANG Ditampilkan

Pada UI Customer Point jangan tampilkan:

```text
gross_profit
gp_percent
```

meskipun terdapat pada response/API.

Informasi tersebut bersifat internal dan tidak diperlukan pada halaman Loyalty Point.

UI calculation cukup menampilkan:

```text
Sales Account
Omzet
Divider
Point
```

---

# 18. Calculation Module

Route:

```text
/customer/loyalty-point/calculations
```

Tujuan:

Monitoring seluruh batch kalkulasi loyalty.

---

# 19. Calculation Batch Table

Kolom:

```text
Batch
Period
Trigger
Started At
Finished At
Total
Success
Need Review
Incomplete
Failed
Status
Action
```

Action:

```text
View Detail
```

---

# 20. Calculation Batch Detail

Route:

```text
/customer/loyalty-point/calculations/[batchId]
```

Header:

```text
Calculation Batch #102
```

Summary cards:

```text
Total
Success
Need Review
Incomplete
Failed
```

---

# 21. GP Calculation Table

Di bawah summary tampilkan:

```text
GP
Customer Name
Status
Total Omzet
Point
Issue
Recalculated At
Action
```

Status:

```text
SUCCESS
NEED_REVIEW
INCOMPLETE
FAILED
```

Action:

```text
View
Recalculate
```

---

# 22. Calculation Error

Jika status bukan SUCCESS, tampilkan error dari:

```text
loyalty_calculation_error
```

Contoh:

```text
Missing standard divider for sales account Accessories
```

User harus bisa memahami alasan kegagalan tanpa membuka database/log server.

---

# 23. Recalculate Individual

Endpoint:

```text
POST /api/resource/loyalty_calculation/method/recalculate
```

Payload:

```json
{
  "calculation_id": 123
}
```

atau:

```json
{
  "name": "CALC00614"
}
```

Button:

```text
Recalculate
```

Sebelum submit gunakan confirmation modal.

Contoh:

```text
Recalculate Point?

Point untuk customer ini akan dihitung ulang menggunakan konfigurasi dan data terbaru.

Continue?
```

---

# 24. Recalculate Batch Issues

Endpoint:

```text
POST /api/resource/loyalty_calculation/method/recalculate_batch
```

Default gunakan:

```json
{
  "batch_id": 102,
  "all": false
}
```

Button label:

```text
Recalculate Issues
```

Jangan gunakan `all: true` sebagai default.

Karena `all:false` hanya memproses:

```text
FAILED
NEED_REVIEW
INCOMPLETE
```

Sebelum submit tampilkan confirmation modal.

---

# 25. Force Recalculate All

Jika dibutuhkan, letakkan sebagai secondary / advanced action:

```text
Recalculate All
```

Payload:

```json
{
  "batch_id": 102,
  "all": true
}
```

Berikan warning karena calculation yang sudah SUCCESS juga akan dihitung ulang.

Jika permission system mendukung, batasi action ini untuk role tinggi / Super Admin.

---

# 26. Run New Batch

Endpoint:

```text
POST /api/resource/loyalty_calculation/method/run_batch
```

Payload:

```json
{}
```

Action:

```text
Run Calculation
```

Gunakan confirmation modal:

```text
Run Loyalty Calculation?

System will calculate point for all eligible Group Parents.
```

Jangan auto-trigger saat membuka halaman.

---

# 27. Redemption Module

Route:

```text
/customer/loyalty-point/redemptions
```

Tujuan:

Melihat seluruh transaksi penukaran point.

---

# 28. Redemption Summary

Tampilkan KPI:

```text
Pending Approval
Approved
Rejected
Total Point Redeemed
```

---

# 29. Redemption Table

Kolom:

```text
Redemption
Group Parent
Branch Customer
Reward
Quantity
Point Used
Created At
Completed At
Status
Action
```

Status:

```text
PENDING
APPROVED
REJECTED
```

---

# 30. Redemption Detail

Route:

```text
/customer/loyalty-point/redemptions/[id]
```

Tampilkan:

```text
Redemption Number
Group Parent
Branch Customer
Reward
Reward Type
Quantity
Point Used
Created At
Completed At
Status
```

Gunakan reward snapshot dari redemption jika tersedia.

Jangan selalu membaca data reward terbaru karena reward dapat berubah setelah redemption.

---

# 31. Approval Redemption

Jika:

```text
status = PENDING
```

tampilkan:

```text
Approve
Reject
```

Approve endpoint:

```text
POST /api/resource/loyalty_redemption/method/approve
```

Payload:

```json
{
  "redemption_id": "RDM00006"
}
```

Reject:

```text
POST /api/resource/loyalty_redemption/method/reject
```

Payload:

```json
{
  "redemption_id": "RDM00006"
}
```

Gunakan confirmation dialog untuk kedua action.

---

# 32. Behavior Reserved Point

Saat redemption membutuhkan approval:

```text
Point tidak langsung dianggap used.
```

Point akan:

```text
reserved
```

Jika approved:

```text
reserved → used
```

Jika rejected:

```text
reserved → available kembali
```

UI harus refresh balance setelah approve/reject.

---

# 33. Settings

Route:

```text
/customer/loyalty-point/settings
```

Subtab:

```text
Periods
Point Rules
Rewards
```

---

# 34. Loyalty Period

Resource:

```text
loyalty_period
```

Tampilkan table:

```text
Name
Date From
Date To
Expiry Mode
Expiry Months
Point Ready
Status
Action
```

Action mengikuti CRUD API framework existing.

---

# 35. Period Form

Field utama:

```text
Name
Date From
Date To
Expiry Mode
Expiry Months
Point Ready
Status
```

Jika:

```text
expiry_mode = DURATION
```

baru tampilkan:

```text
expiry_months
```

Jika bukan DURATION, field expiry_months disembunyikan atau disabled sesuai standard form project.

---

# 36. Point Rules

Resource:

```text
loyalty_rule
```

Rule mempunyai detail:

```text
loyalty_rule_detail
```

Tampilan:

```text
Rule Name
Status
Valid Period / Date
Action
```

Klik rule membuka detail.

---

# 37. Rule Detail

Tampilkan table:

```text
Sales Account
Standard Divider
Status
Action
```

Gunakan bahasa yang mudah dipahami.

Contoh helper text:

```text
Setiap Rp10.000 omzet dari Accessories menghasilkan 1 Point.
```

Jangan expose istilah teknis yang tidak diperlukan.

---

# 38. Reward Settings

Resource:

```text
loyalty_reward
```

Tampilkan:

```text
Reward Name
Reward Type
Point Required
Quota
Remaining Quota
Valid From
Valid To
Requires Approval
Status
Action
```

Reward yang sudah pernah digunakan jangan hard delete.

Gunakan:

```text
ACTIVE
INACTIVE
```

sesuai field backend.

---

# 39. Redeem Action dari Epanel

Jika Epanel memang akan dipakai admin untuk redeem manual, gunakan endpoint:

```text
POST /api/resource/loyalty_redemption/method/redeem
```

Payload:

```json
{
  "reward": "RWD00001",
  "gpid": "GPTWC001",
  "quantity": 1,
  "idempotency_key": "generated-unique-key"
}
```

Jika redeem berdasarkan BC:

```json
{
  "reward": "RWD00001",
  "bcid": "TWCBGR001",
  "quantity": 1,
  "idempotency_key": "generated-unique-key"
}
```

`idempotency_key` wajib dibuat unique oleh frontend/backend layer agar double-click tidak memotong saldo dua kali.

Gunakan UUID.

---

# 40. Error Handling Redemption

Business error bisa datang dalam data response, contoh:

```text
INSUFFICIENT_POINT
QUOTA_EXHAUSTED
REWARD_INACTIVE
REWARD_EXPIRED
```

Jangan hanya mengecek HTTP status.

Periksa juga:

```text
data.error_code
data.error_message
```

Jika ada error_code, tampilkan error_message sebagai toast/alert.

---

# 41. Status Color

Gunakan semantic color project existing.

Suggested mapping:

```text
SUCCESS / APPROVED / ACTIVE / AVAILABLE
→ success

PENDING / NEED_REVIEW / RESERVED
→ warning

INCOMPLETE
→ secondary warning

FAILED / REJECTED / EXPIRED
→ danger

NOT READY
→ neutral
```

Jangan hardcode warna jika project sudah memiliki status badge component.

---

# 42. Loading State

Semua API call wajib memiliki:

```text
loading
success
empty
error
```

Gunakan:

- skeleton jika pattern existing menggunakan skeleton,
- spinner jika existing menggunakan spinner.

Jangan tampilkan table kosong selama API masih loading.

---

# 43. Empty State

Contoh:

Customer Points:

```text
No Loyalty Point Data

No Group Parent currently has point balance.
```

Calculation:

```text
No Calculation Yet
```

Redemption:

```text
No Redemption Found
```

Gunakan Empty State component existing.

---

# 44. Confirmation Modal

Gunakan confirmation modal existing untuk action:

```text
Run Calculation
Recalculate
Recalculate Batch
Approve Redemption
Reject Redemption
Deactivate Reward
```

Action berbahaya tidak boleh langsung execute dari satu click.

---

# 45. Refresh Data

Setelah action:

```text
Run Calculation
Recalculate
Approve
Reject
Redeem
Update Rule
Update Period
Update Reward
```

refresh data terkait.

Hindari full page reload jika project existing memakai state/query cache.

---

# 46. Permission

Ikuti permission system Epanel existing.

Minimum separation:

```text
Read Loyalty
Manage Loyalty Settings
Run Calculation
Approve Redemption
```

Jika sistem saat ini belum granular, gunakan role/permission existing yang paling dekat.

Jangan bypass middleware atau permission existing.

---

# 47. API Pattern

Gunakan API helper / API client existing.

Jangan membuat fetch/axios client baru jika project sudah memiliki abstraction.

Backend pattern:

```text
REST CRUD:
GET /api/resource/{resource}
GET /api/resource/{resource}/{id}
POST /api/resource/{resource}
PUT /api/resource/{resource}/{id}
DELETE /api/resource/{resource}/{id}
```

Custom method:

```text
POST /api/resource/{resource}/method/{method}
```

---

# 48. API Utama

## Balance

```text
POST /api/resource/loyalty_redemption/method/get_balance
```

## Redemption History

```text
POST /api/resource/loyalty_redemption/method/get_history
```

## Redeem

```text
POST /api/resource/loyalty_redemption/method/redeem
```

## Approve

```text
POST /api/resource/loyalty_redemption/method/approve
```

## Reject

```text
POST /api/resource/loyalty_redemption/method/reject
```

## Run One Calculation

```text
POST /api/resource/loyalty_calculation/method/run_calculation
```

## Run Batch

```text
POST /api/resource/loyalty_calculation/method/run_batch
```

## Recalculate

```text
POST /api/resource/loyalty_calculation/method/recalculate
```

## Recalculate Batch

```text
POST /api/resource/loyalty_calculation/method/recalculate_batch
```

---

# 49. Calculation Status

Support:

```text
SUCCESS
INCOMPLETE
NEED_REVIEW
FAILED
```

Jangan menganggap hanya SUCCESS dan FAILED.

---

# 50. Redemption Status

Support:

```text
PENDING
APPROVED
REJECTED
```

---

# 51. Maintenance

Backend memiliki endpoint cleanup seperti:

```text
cleanup_batch
cleanup_old_batches
cleanup_orphan_calculations
```

Untuk phase awal:

**Jangan tampilkan fitur cleanup pada halaman utama Loyalty Point.**

Jika nanti dibutuhkan, letakkan pada:

```text
Settings > Advanced
```

dan batasi hanya Super Admin.

Semua cleanup harus default:

```json
{
  "dry_run": true
}
```

Jangan menyediakan destructive cleanup tanpa simulasi.

---

# 52. Security

Jangan expose:

```text
X-Internal-Key
goback-secret-cli-key
```

ke client/browser.

Frontend harus memakai mekanisme auth existing Epanel.

Jika API perlu internal key, request harus diproxy lewat server-side/backend layer existing.

Jangan simpan secret dalam client-side environment variable.

---

# 53. Formatting

## Currency

Gunakan:

```text
Rp1.280.000
Rp178.979.000
```

Tanpa decimal kecuali diperlukan.

## Point

Gunakan:

```text
128 Point
17.892 Point
```

## Date

Gunakan format Epanel existing.

Jika belum ada standard:

```text
23 Oct 2026
23 Oct 2026 09:30
```

atau localization Bahasa Indonesia jika project memang menggunakan locale ID.

---

# 54. Responsive

Prioritas Epanel adalah desktop admin.

Tetapi halaman tidak boleh rusak pada tablet/small desktop.

Untuk table panjang:

- gunakan horizontal scroll,
- jangan memaksa seluruh kolom menjadi sangat sempit,
- action tetap dapat diakses.

---

# 55. Component Reuse

Sebelum membuat component baru, inspect existing:

```text
Card
DataTable
Pagination
Tabs
Badge
Modal
Confirmation Modal
Form
Select
Date Picker
Toast
Breadcrumb
Page Header
Search Input
Filter
Empty State
Loading
```

Reuse existing component sebanyak mungkin.

---

# 56. Development Order

Implementasikan secara bertahap.

## Phase 1

```text
Menu Loyalty Point
Overview
Customer Points
Customer Point Detail
Point Balance
Calculation History
Calculation Detail
```

## Phase 2

```text
Calculation Batch
Batch Detail
Calculation Error
Individual Recalculate
Batch Recalculate
Run Calculation
```

## Phase 3

```text
Redemption List
Redemption Detail
Approve
Reject
```

## Phase 4

```text
Period Settings
Point Rule
Rule Detail
Reward Settings
```

## Phase 5

Jika memang diperlukan:

```text
Advanced Maintenance
Cleanup
```

---

# 57. Acceptance Criteria

Implementasi dianggap selesai jika:

1. Menu Loyalty Point tersedia di Customer.
2. Admin dapat melihat saldo GP.
3. Saldo memperlihatkan total, used, reserved, available.
4. Admin dapat melihat bucket berdasarkan period.
5. Admin dapat melihat histori calculation.
6. Detail calculation memperlihatkan:
   - sales account,
   - omzet,
   - divider,
   - point.
7. Gross Profit dan GP Percent tidak ditampilkan.
8. Admin dapat melihat batch calculation.
9. Status SUCCESS, NEED_REVIEW, INCOMPLETE, FAILED tampil dengan benar.
10. Admin dapat melihat error kalkulasi.
11. Admin dapat recalculate calculation tertentu.
12. Admin dapat recalculate calculation bermasalah dalam batch.
13. Admin dapat melihat redemption.
14. Admin dapat approve/reject redemption pending.
15. Reserved point berubah sesuai hasil approval.
16. Admin dapat mengelola period.
17. Admin dapat mengelola rule dan standard divider.
18. Admin dapat mengelola reward.
19. API menggunakan client/auth abstraction existing.
20. Tidak ada internal secret yang diexpose ke browser.
21. Semua action memiliki loading/error/success feedback.
22. UI konsisten dengan design system Epanel existing.
23. Tidak membuat duplicate component jika component existing dapat digunakan.

---

# 58. Instruksi Penting untuk Codex

Sebelum coding:

1. Baca struktur project Epanel terlebih dahulu.
2. Identifikasi:
   - framework/version,
   - routing,
   - sidebar,
   - layout,
   - API client,
   - auth,
   - permission,
   - table component,
   - pagination,
   - modal,
   - form,
   - toast,
   - style/design system.
3. Ikuti pola existing.
4. Jangan refactor modul unrelated.
5. Jangan mengganti design system global.
6. Jangan membuat dependency baru kecuali benar-benar diperlukan.
7. Pastikan perubahan tidak merusak halaman existing.
8. Setelah implementasi jalankan lint/typecheck/build/test yang tersedia.
9. Laporkan:
   - file yang dibuat,
   - file yang diubah,
   - endpoint yang digunakan,
   - asumsi yang dibuat,
   - bagian backend yang masih kurang jika ditemukan.

Backend README Loyalty Point adalah source of truth untuk nama resource, endpoint, status, dan business logic.

Frontend tidak boleh mengubah business logic loyalty yang sudah ditangani backend.

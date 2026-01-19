# Customer Registration Approval & Rejection Workflow

**EKA+ Web Admin - Sistem Persetujuan Registrasi Customer**

> 📋 Dokumentasi lengkap untuk approval/rejection workflow dan pengelolaan GP/GC/BC (Global Party, Global Customer, Branch Customer)

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [GP/GC/BC Hierarchy](#gpgcbc-hierarchy)
3. [Approval Workflow](#approval-workflow)
4. [Rejection Workflow](#rejection-workflow)
5. [Auto-Creation Logic](#auto-creation-logic)
6. [API Endpoints](#api-endpoints)
7. [Status Values](#status-values)
8. [File Structure](#file-structure)
9. [Testing Guide](#testing-guide)
10. [Future Enhancements](#future-enhancements)

---

## Overview

Sistem **Customer Registration Approval** memungkinkan admin untuk:

- ✅ **Approve** registrasi customer baru dengan auto-create GP/GC/BC
- ❌ **Reject** registrasi dengan alasan yang jelas
- 🔍 **Check GP existence** sebelum membuat data baru
- 🔗 **Link to existing GP** atau create new GP
- 📊 **Track approval history** dengan metadata lengkap

### Key Features

- **Two-Step Approval Wizard** - Cek GP → Konfirmasi
- **Smart GP Detection** - Hindari duplikasi data
- **Auto-Generate IDs** - GP ID, GC ID, BC ID otomatis
- **Audit Trail** - Track who approved/rejected and when
- **Predefined Rejection Reasons** - 5 alasan standar + notes

---

## GP/GC/BC Hierarchy

### Relationship Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CUSTOMER HIERARCHY                    │
└─────────────────────────────────────────────────────────┘

        ┌──────────────────┐
        │  Global Party    │  ← Company-level entity
        │      (GP)        │     (e.g., "PT Maju Jaya")
        └────────┬─────────┘
                 │
                 │ 1:N
                 ▼
        ┌──────────────────┐
        │ Global Customer  │  ← Customer entity per company
        │      (GC)        │     (e.g., "PT Maju Jaya")
        └────────┬─────────┘
                 │
                 │ 1:N
                 ▼
        ┌──────────────────┐
        │ Branch Customer  │  ← Customer per branch location
        │      (BC)        │     (e.g., "PT Maju Jaya - Jakarta")
        └──────────────────┘
                 │
                 │ M:1
                 ▼
        ┌──────────────────┐
        │     Branch       │  ← EKA+ Branch (Jakarta, Surabaya, etc.)
        │                  │
        └──────────────────┘
```

### Entity Descriptions

| Entity | Description | Example | Purpose |
|--------|-------------|---------|---------|
| **GP** | Global Party - Represents the company/business entity | "PT Maju Jaya" | Top-level grouping for all customers from same company |
| **GC** | Global Customer - Customer at company level | "PT Maju Jaya" | Represents the company as a customer |
| **BC** | Branch Customer - Customer at branch level | "PT Maju Jaya - Jakarta" | Represents customer at specific branch location |

### Relationship Rules

- **1 GP : N GC** - One company can have multiple global customers
- **1 GC : N BC** - One global customer can have multiple branch customers
- **1 BC : 1 Branch** - Each branch customer is tied to one EKA+ branch
- **Auto-linking** - GC links to GP, BC links to GC and Branch

---

## Approval Workflow

### Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  APPROVAL WORKFLOW (2 STEPS)                    │
└─────────────────────────────────────────────────────────────────┘

  START
    │
    ▼
┌─────────────────────┐
│ Registration Status │
│   status: pending   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Admin clicks        │
│  "APPROVE" button   │
└──────────┬──────────┘
           │
           ▼
╔═══════════════════════════════════════════════════════╗
║                    STEP 1: GP NAME                    ║
╚═══════════════════════════════════════════════════════╝
           │
           ▼
┌─────────────────────┐
│ Input GP Name       │
│ (pre-filled with    │
│  company name)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Click "Cek & Lanjut"│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ API: Check GP       │
│ Existence           │
└──────────┬──────────┘
           │
           ├─────────┬─────────┐
           │         │         │
      GP TIDAK    GP ADA    ERROR
       EXIST      EXIST
           │         │         │
           ▼         ▼         ▼
╔═══════════════════════════════════════════════════════╗
║               STEP 2: CONFIRMATION                    ║
╚═══════════════════════════════════════════════════════╝
           │
           ▼
    ┌──────────────────────────────────────┐
    │  GP TIDAK ADA                        │
    │  ✅ "GP Belum Ada - Akan Dibuat Baru"│
    │                                      │
    │  Preview:                            │
    │  • GP: [nama] (Buat Baru)           │
    │  • GC: [company] (Buat Baru)        │
    │  • BC: [company - city] (Buat Baru) │
    └──────────────────┬───────────────────┘
                       │
                       ▼
    ┌──────────────────────────────────────┐
    │  GP SUDAH ADA                        │
    │  ⚠️  "GP Sudah Ada di Database"      │
    │                                      │
    │  Pilih tindakan:                     │
    │  ○ Link ke GP existing (Recommended)│
    │  ○ Buat GP baru (kembali ke Step 1) │
    │                                      │
    │  Preview:                            │
    │  • GP: [nama] (Link Existing)       │
    │  • GC: [company] (Buat Baru)        │
    │  • BC: [company - city] (Buat Baru) │
    └──────────────────┬───────────────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │ Click "Approve        │
           │  Registrasi"          │
           └───────────┬───────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │ API: Submit Approval  │
           │ Create GP/GC/BC       │
           │ Update Registration   │
           └───────────┬───────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │ ✅ SUCCESS            │
           │ status: approved      │
           │ gp_id, gc_id, bc_id   │
           │ filled                │
           └───────────────────────┘
                       │
                       ▼
                     END
```

### Step-by-Step Guide

#### STEP 1: GP Name Input & Check

1. **Admin opens detail modal** dari customer registration dengan status "pending"
2. **Click button "Approve"** di footer modal
3. **ApproveRegistrationModal opens** (two-step wizard)
4. **Input GP Name:**
   - Field pre-filled dengan nama company dari registrasi
   - Admin bisa edit nama jika perlu
   - Contoh: "PT Maju Jaya"
5. **Click "Cek & Lanjut"**
6. **System checks GP existence:**
   - Call API endpoint: `/api/method/customer_registration.check_gp`
   - Query database `ekatalog_global_party` untuk nama yang sama
   - Return: `{ exists: boolean, gp_id: number | null }`

#### STEP 2: Confirmation & Preview

**Scenario A: GP Belum Ada**

```
┌────────────────────────────────────────────────────────┐
│ ✅ GP Belum Ada - Akan Dibuat Baru                     │
│                                                        │
│ GP dengan nama "PT Maju Jaya" belum terdaftar.        │
│ Sistem akan membuat GP baru secara otomatis.          │
└────────────────────────────────────────────────────────┘

Preview Data yang Akan Dibuat:
┌─────────────────────────────────────────────────────┐
│ GP │ PT Maju Jaya                    │ Buat Baru   │
│ GC │ PT Maju Jaya                    │ Buat Baru   │
│ BC │ PT Maju Jaya - Jakarta          │ Buat Baru   │
└─────────────────────────────────────────────────────┘
```

**Scenario B: GP Sudah Ada**

```
┌────────────────────────────────────────────────────────┐
│ ⚠️  GP Sudah Ada di Database                           │
│                                                        │
│ GP dengan nama "PT Maju Jaya" sudah terdaftar (ID: #1)│
│ Pilih tindakan:                                        │
│                                                        │
│ ● Link ke GP yang sudah ada (Recommended)             │
│   Hubungkan registrasi ini ke GP yang sudah ada       │
│                                                        │
│ ○ Buat GP baru dengan nama berbeda                    │
│   Kembali ke step 1 untuk mengubah nama GP            │
└────────────────────────────────────────────────────────┘

Preview Data yang Akan Dibuat:
┌─────────────────────────────────────────────────────┐
│ GP │ PT Maju Jaya                    │ Link Existing│
│ GC │ PT Maju Jaya                    │ Buat Baru    │
│ BC │ PT Maju Jaya - Jakarta          │ Buat Baru    │
└─────────────────────────────────────────────────────┘
```

7. **Admin review preview** dan pastikan data sudah benar
8. **Click "Approve Registrasi"**
9. **System processes approval:**
   - Create GP record (if needed)
   - Create GC record (always)
   - Create BC record (always)
   - Update registration status to "approved"
   - Save metadata (gp_id, gc_id, bc_id, approved_at, approved_by)
10. **Success message displayed**
11. **All modals close** dan list refresh

### Code References

**ApproveRegistrationModal Component:**
- File: `src/components/customers/registration/ApproveRegistrationModal.tsx`
- Two-step wizard implementation (line 40: step state)
- GP check logic (line 62-98: handleCheckGP)
- Submit approval (line 100-149: handleSubmitApproval)

**Integration in List:**
- File: `src/components/customers/registration/CustomerRegistrationList.tsx`
- Approve handler (line 406-411: handleApprove)
- Modal rendering (line 715-720: ApproveRegistrationModal)

---

## Rejection Workflow

### Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  REJECTION WORKFLOW                     │
└─────────────────────────────────────────────────────────┘

  START
    │
    ▼
┌─────────────────────┐
│ Registration Status │
│   status: pending   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Admin clicks        │
│  "REJECT" button    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│ RejectRegistrationModal opens               │
│                                             │
│ 1. Select Rejection Reason (Required)      │
│    Dropdown with 5 predefined reasons      │
│                                             │
│ 2. Add Notes (Optional)                    │
│    Textarea for additional explanation     │
└──────────┬──────────────────────────────────┘
           │
           ▼
┌─────────────────────┐
│ Click "Reject       │
│  Registrasi"        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ API: Submit Reject  │
│ Update Registration │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ ❌ REJECTED         │
│ status: rejected    │
│ reason & notes saved│
└─────────────────────┘
           │
           ▼
         END
```

### Rejection Reasons

| Code | Label (Indonesian) | Use Case |
|------|-------------------|----------|
| `incomplete_data` | Data tidak lengkap | Missing required fields (KTP, NPWP, address, etc.) |
| `invalid_document` | Dokumen tidak valid | Fake/invalid documents, expired ID, etc. |
| `fake_customer` | Customer siluman/iseng | Spam registration, fake customer |
| `duplicate_gp` | GP name sudah ada | Duplicate company after GP check (conflict) |
| `other` | Lainnya | Other reasons not covered above |

### Step-by-Step Guide

1. **Admin opens detail modal** dari customer registration dengan status "pending"
2. **Click button "Reject"** di footer modal
3. **RejectRegistrationModal opens**
4. **Select rejection reason** dari dropdown (required):
   - Data tidak lengkap
   - Dokumen tidak valid
   - Customer siluman/iseng
   - GP name sudah ada
   - Lainnya
5. **Add optional notes** di textarea (optional but recommended):
   - Penjelasan lebih detail tentang alasan reject
   - Guidance untuk customer jika ingin submit ulang
   - Contoh: "KTP tidak jelas, mohon upload ulang dengan resolusi lebih baik"
6. **Click "Reject Registrasi"**
7. **System processes rejection:**
   - Update registration status to "rejected"
   - Save rejection_reason (code)
   - Save rejection_notes (if provided)
   - Save rejected_at (timestamp)
   - Save rejected_by (admin user ID)
8. **Success message displayed**
9. **Modal closes** dan list refresh

### Code References

**RejectRegistrationModal Component:**
- File: `src/components/customers/registration/RejectRegistrationModal.tsx`
- Rejection reasons constant (line 7: REJECTION_REASONS from types)
- Form validation (line 40-44: check reason selected)
- Submit rejection (line 39-88: handleSubmit)

**Rejection Reasons Definition:**
- File: `src/types/customerRegistration.ts`
- Line 72-78: REJECTION_REASONS array

**Integration in List:**
- File: `src/components/customers/registration/CustomerRegistrationList.tsx`
- Reject handler (line 413-418: handleReject)
- Modal rendering (line 722-727: RejectRegistrationModal)

---

## Auto-Creation Logic

### How IDs are Generated

Saat approval diproses, sistem akan create records dengan **auto-increment IDs**:

```typescript
// STEP 1: Create or Link GP
if (createNewGP) {
  // Create new GP record
  const newGP = await createGlobalParty({
    name: gpName,
    created_by: adminUserId,
    created_at: new Date().toISOString(),
    disabled: 0
  });
  gp_id = newGP.id;  // Auto-incremented by database
} else {
  // Use existing GP
  gp_id = existingGPId;
}

// STEP 2: Create GC (always new)
const newGC = await createGlobalCustomer({
  name: companyName,
  gp_id: gp_id,  // Link to GP
  created_by: adminUserId,
  created_at: new Date().toISOString(),
  disabled: 0
});
gc_id = newGC.id;  // Auto-incremented by database

// STEP 3: Create BC (always new)
const newBC = await createBranchCustomer({
  name: `${companyName} - ${branchCity}`,
  gc_id: gc_id,  // Link to GC
  branch_id: registration.branch_id,  // Link to Branch
  created_by: adminUserId,
  created_at: new Date().toISOString(),
  disabled: 0
});
bc_id = newBC.id;  // Auto-incremented by database

// STEP 4: Update Registration
await updateRegistration({
  id: registrationId,
  status: "approved",
  gp_id: gp_id,
  gp_name: gpName,
  gc_id: gc_id,
  gc_name: companyName,
  bc_id: bc_id,
  bc_name: `${companyName} - ${branchCity}`,
  approved_at: new Date().toISOString(),
  approved_by: adminUserId
});
```

### Naming Conventions

| Entity | Name Format | Example |
|--------|-------------|---------|
| **GP** | Company name (from input, admin can edit) | "PT Maju Jaya" |
| **GC** | Company name (auto from registration) | "PT Maju Jaya" |
| **BC** | Company name + " - " + Branch city | "PT Maju Jaya - Jakarta" |

### Database Tables

```sql
-- Global Party
CREATE TABLE ekatalog_global_party (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255),
  disabled TINYINT DEFAULT 0
);

-- Global Customer
CREATE TABLE ekatalog_global_customer (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  gp_id INT NOT NULL,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255),
  disabled TINYINT DEFAULT 0,
  FOREIGN KEY (gp_id) REFERENCES ekatalog_global_party(id)
);

-- Branch Customer
CREATE TABLE ekatalog_branch_customer (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  gc_id INT NOT NULL,
  branch_id INT NOT NULL,
  created_at DATETIME,
  created_by VARCHAR(255),
  updated_at DATETIME,
  updated_by VARCHAR(255),
  disabled TINYINT DEFAULT 0,
  FOREIGN KEY (gc_id) REFERENCES ekatalog_global_customer(id),
  FOREIGN KEY (branch_id) REFERENCES ekatalog_branch(id)
);
```

---

## API Endpoints

### Backend API Specifications (Goback)

All endpoints use Frappe REST API format with authentication token.

#### 1. Check GP Existence

**Endpoint:** `GET /api/method/customer_registration.check_gp`

**Query Parameters:**
```
?gp_name=PT%20Maju%20Jaya
```

**Response:**
```json
{
  "message": {
    "exists": true,
    "gp_id": 1,
    "gp_name": "PT Maju Jaya"
  }
}
```

#### 2. Approve Registration

**Endpoint:** `POST /api/method/customer_registration.approve`

**Request Body:**
```json
{
  "registration_id": 123,
  "gp_name": "PT Maju Jaya",
  "create_new_gp": true,
  "existing_gp_id": null,
  "gc_name": "PT Maju Jaya",
  "bc_name": "PT Maju Jaya - Jakarta"
}
```

**Response:**
```json
{
  "message": {
    "success": true,
    "registration": {
      "id": 123,
      "status": "approved",
      "gp_id": 15,
      "gp_name": "PT Maju Jaya",
      "gc_id": 42,
      "gc_name": "PT Maju Jaya",
      "bc_id": 88,
      "bc_name": "PT Maju Jaya - Jakarta",
      "approved_at": "2026-01-01T12:34:56.000Z",
      "approved_by": "admin@example.com"
    }
  }
}
```

#### 3. Reject Registration

**Endpoint:** `POST /api/method/customer_registration.reject`

**Request Body:**
```json
{
  "registration_id": 124,
  "reason_code": "incomplete_data",
  "notes": "KTP tidak jelas, mohon upload ulang"
}
```

**Response:**
```json
{
  "message": {
    "success": true,
    "registration": {
      "id": 124,
      "status": "rejected",
      "rejection_reason": "incomplete_data",
      "rejection_notes": "KTP tidak jelas, mohon upload ulang",
      "rejected_at": "2026-01-01T12:35:00.000Z",
      "rejected_by": "admin@example.com"
    }
  }
}
```

#### 4. Get Global Parties

**Endpoint:** `GET /api/resource/ekatalog_global_party`

**Query Parameters:**
```
?fields=["id","name","disabled"]
&filters=[["disabled","=",0]]
&limit_page_length=999
```

#### 5. Get Global Customers

**Endpoint:** `GET /api/resource/ekatalog_global_customer`

**Query Parameters:**
```
?fields=["id","name","gp_id","disabled"]
&filters=[["disabled","=",0]]
&limit_page_length=999
```

#### 6. Get Branch Customers

**Endpoint:** `GET /api/resource/ekatalog_branch_customer`

**Query Parameters:**
```
?fields=["id","name","gc_id","branch_id","disabled"]
&filters=[["disabled","=",0]]
&limit_page_length=999
```

### API Configuration

**File:** `src/config/api.ts`

```typescript
ENDPOINTS: {
  // Customer Registration Actions
  CUSTOMER_REGISTER_CHECK_GP: "/api/method/customer_registration.check_gp",
  CUSTOMER_REGISTER_APPROVE: "/api/method/customer_registration.approve",
  CUSTOMER_REGISTER_REJECT: "/api/method/customer_registration.reject",

  // GP/GC/BC Resources
  GLOBAL_PARTY: "/api/resource/ekatalog_global_party",
  GLOBAL_CUSTOMER: "/api/resource/ekatalog_global_customer",
  BRANCH_CUSTOMER: "/api/resource/ekatalog_branch_customer",
}
```

---

## Status Values

### Customer Registration Status

All status values are **lowercase** in the database and code:

| Status | Display Label | Description | Color Theme |
|--------|---------------|-------------|-------------|
| `draft` | Pending | Initial submission, not yet submitted | Yellow |
| `pending` | Pending | Submitted, waiting for admin approval | Yellow |
| `approved` | Approved | Admin has approved the registration | Green |
| `rejected` | Rejected | Admin has rejected the registration | Red |

### Important Notes

1. **Draft = Pending in UI:**
   - Both "draft" and "pending" are treated as actionable (buttons show)
   - Display label for both is "Pending" (capitalized)
   - Statistics count includes both draft + pending

2. **Status Conversion:**
   ```typescript
   // API returns capitalized, convert to lowercase
   status: apiData.status.toLowerCase() as "pending" | "approved" | "rejected" | "draft"
   ```

3. **Button Visibility Logic:**
   ```typescript
   // Show approve/reject buttons for draft OR pending
   {(registration.status === "pending" || registration.status === "draft") && (
     <ApproveButton />
     <RejectButton />
   )}
   ```

4. **Approved/Rejected Display:**
   ```typescript
   // Show approval info for approved status
   {registration.status === "approved" && registration.gp_name && (
     <ApprovalInfoBanner />
   )}

   // Show rejection info for rejected status
   {registration.status === "rejected" && registration.rejection_reason && (
     <RejectionInfoBanner />
   )}
   ```

### Type Definitions

**File:** `src/types/customerRegistration.ts`

```typescript
export interface CustomerRegistration {
  // ... other fields

  status: 'pending' | 'approved' | 'rejected' | 'draft';

  // Approval metadata (populated when status = 'approved')
  gp_id?: number;
  gp_name?: string;
  gc_id?: number;
  gc_name?: string;
  bc_id?: number;
  bc_name?: string;
  approved_at?: string;
  approved_by?: string;

  // Rejection metadata (populated when status = 'rejected')
  rejection_reason?: string;
  rejection_notes?: string;
  rejected_at?: string;
  rejected_by?: string;
}
```

---

## File Structure

### Component Organization

```
src/
├── components/
│   ├── customers/
│   │   └── registration/
│   │       ├── ApproveRegistrationModal.tsx     # Two-step approval wizard
│   │       ├── RejectRegistrationModal.tsx      # Rejection modal with reasons
│   │       ├── RegistrationDetailModal.tsx      # Detail view + action buttons
│   │       ├── CustomerRegistrationList.tsx     # Main list view
│   │       └── RegistrationCard.tsx             # Individual card component
│   ├── gp/
│   │   ├── GPList.tsx                           # Global Party list
│   │   ├── GPCard.tsx                           # GP card component
│   │   └── GPDetailModal.tsx                    # GP detail modal
│   ├── gc/
│   │   ├── GCList.tsx                           # Global Customer list
│   │   ├── GCCard.tsx                           # GC card component
│   │   └── GCDetailModal.tsx                    # GC detail modal
│   └── bc/
│       ├── BCList.tsx                           # Branch Customer list
│       ├── BCCard.tsx                           # BC card component
│       └── BCDetailModal.tsx                    # BC detail modal
├── types/
│   ├── customerRegistration.ts                  # Registration types & constants
│   └── customer.ts                              # GP/GC/BC types
├── data/
│   ├── mockGlobalParties.ts                     # Static GP data (10 records)
│   ├── mockGlobalCustomers.ts                   # Static GC data (11 records)
│   └── mockBranchCustomers.ts                   # Static BC data (12 records)
├── config/
│   ├── api.ts                                   # API endpoints configuration
│   └── filterFields.ts                          # Filter field definitions
└── app/
    ├── customers/
    │   └── registration/
    │       └── page.tsx                         # Registration page route
    ├── gp/
    │   └── page.tsx                             # GP page route
    ├── gc/
    │   └── page.tsx                             # GC page route
    └── bc/
        └── page.tsx                             # BC page route
```

### Key Files Reference

| File | Lines | Purpose |
|------|-------|---------|
| `ApproveRegistrationModal.tsx` | 509 | Two-step wizard for approval, GP check, preview |
| `RejectRegistrationModal.tsx` | 218 | Rejection modal with predefined reasons |
| `RegistrationDetailModal.tsx` | 650+ | Detail view with approve/reject buttons |
| `CustomerRegistrationList.tsx` | 750+ | Main list with search, filter, sort, pagination |
| `customerRegistration.ts` | 95 | Type definitions & rejection reasons |
| `customer.ts` | 45 | GP/GC/BC type definitions |
| `api.ts` | 100+ | API endpoint configuration |

---

## Testing Guide

### Manual Testing Checklist

#### ✅ Approve Workflow Testing

**1. Open Registration Detail Modal**
- [ ] Navigate to Customer Registration page
- [ ] Find a registration with status "Pending"
- [ ] Click card to open detail modal
- [ ] Verify "Approve" and "Reject" buttons are visible

**2. Test GP Check - Tidak Exist**
- [ ] Click "Approve" button
- [ ] Verify ApproveRegistrationModal opens (Step 1)
- [ ] GP Name field is pre-filled with company name
- [ ] Edit GP name to something unique (e.g., "Test Company ABC")
- [ ] Click "Cek & Lanjut"
- [ ] Wait for API check (simulated delay)
- [ ] Verify Step 2 shows: "✅ GP Belum Ada - Akan Dibuat Baru"
- [ ] Verify preview shows all 3 entities (GP, GC, BC) as "Buat Baru"

**3. Test GP Check - Sudah Exist**
- [ ] Click "Kembali" to go back to Step 1
- [ ] Edit GP name to "PT Maju Jaya" (simulated existing GP)
- [ ] Click "Cek & Lanjut"
- [ ] Verify Step 2 shows: "⚠️ GP Sudah Ada di Database"
- [ ] Verify 2 radio options are shown
- [ ] Select "Link ke GP yang sudah ada"
- [ ] Verify preview shows GP as "Link Existing"

**4. Test Approval Submit**
- [ ] Click "Approve Registrasi"
- [ ] Wait for processing (simulated delay)
- [ ] Verify success alert is shown
- [ ] Verify modal closes
- [ ] Verify list refreshes
- [ ] Find the approved registration
- [ ] Verify status badge shows "Approved" (green)
- [ ] Open detail modal again
- [ ] Verify approval info is displayed instead of buttons

#### ❌ Reject Workflow Testing

**1. Open Rejection Modal**
- [ ] Open a registration with status "Pending"
- [ ] Click "Reject" button
- [ ] Verify RejectRegistrationModal opens
- [ ] Verify company name is shown in warning banner

**2. Test Rejection Reasons**
- [ ] Click dropdown "Alasan Reject"
- [ ] Verify 5 options are available:
  - [ ] Data tidak lengkap
  - [ ] Dokumen tidak valid
  - [ ] Customer siluman/iseng
  - [ ] GP name sudah ada
  - [ ] Lainnya

**3. Test Form Validation**
- [ ] Leave reason empty, click "Reject Registrasi"
- [ ] Verify error message: "Silakan pilih alasan reject"
- [ ] Select a reason
- [ ] Verify error clears

**4. Test Rejection Submit**
- [ ] Select reason: "Data tidak lengkap"
- [ ] Add notes: "KTP tidak jelas, mohon upload ulang"
- [ ] Click "Reject Registrasi"
- [ ] Wait for processing
- [ ] Verify success alert is shown
- [ ] Verify modal closes
- [ ] Verify list refreshes
- [ ] Find the rejected registration
- [ ] Verify status badge shows "Rejected" (red)
- [ ] Open detail modal again
- [ ] Verify rejection info is displayed instead of buttons

#### 📊 Status Visibility Testing

**Test with Different Status Values:**

| Status | Buttons Visible? | Info Display |
|--------|-----------------|--------------|
| `pending` | ✅ Yes (Approve + Reject) | None |
| `draft` | ✅ Yes (Approve + Reject) | None |
| `approved` | ❌ No | Approval info banner with GP/GC/BC names |
| `rejected` | ❌ No | Rejection info banner with reason & notes |

#### 🔍 GP/GC/BC Pages Testing

**1. Global Party (GP) Page**
- [ ] Navigate to `/gp`
- [ ] Verify statistics cards (Total, Active, Disabled)
- [ ] Test search functionality
- [ ] Test sort by name, created_at
- [ ] Test pagination (10 items per page)
- [ ] Click a GP card to open detail modal
- [ ] Verify all GP info is displayed

**2. Global Customer (GC) Page**
- [ ] Navigate to `/gc`
- [ ] Verify GC cards show linked GP name
- [ ] Test search (GC name and GP name)
- [ ] Test sort functionality
- [ ] Open detail modal
- [ ] Verify linked GP info is shown

**3. Branch Customer (BC) Page**
- [ ] Navigate to `/bc`
- [ ] Verify BC cards show GP + GC + Branch info
- [ ] Test search (BC, GC, GP, branch name, city)
- [ ] Test sort functionality
- [ ] Open detail modal
- [ ] Verify full hierarchy (BC → GC → GP → Branch) is shown

### TypeScript Compilation Test

```bash
npx tsc --noEmit
```

Expected: No errors in customer registration or GP/GC/BC files

### Console Testing

Open browser console and verify:
- [ ] No error messages during modal operations
- [ ] Event dispatches work correctly:
  - [ ] `ekatalog:customer_registrations_update` fired after approval/rejection
  - [ ] `ekatalog:gp_update` fired after approval
  - [ ] `ekatalog:gc_update` fired after approval
  - [ ] `ekatalog:bc_update` fired after approval

---

## Future Enhancements

### ⏳ Planned Improvements

1. **Real API Integration**
   - Currently using simulation (setTimeout + console.log)
   - Need to implement actual API calls to Goback backend
   - Files to update:
     - `ApproveRegistrationModal.tsx` (line 72, 110)
     - `RejectRegistrationModal.tsx` (line 57)

2. **GP Duplicate Prevention**
   - Add server-side validation to prevent duplicate GP creation
   - Show proper error if GP already exists after confirmation

3. **Bulk Approval/Rejection**
   - Allow admin to select multiple registrations
   - Batch process approve/reject with same reason

4. **Email Notifications**
   - Send email to customer when registration is approved
   - Send email with rejection reason when rejected
   - Template customization per rejection reason

5. **Approval History Log**
   - Detailed log of all approval/rejection actions
   - Track changes (who approved, when, what data was created)
   - Audit trail for compliance

6. **GP Smart Suggestions**
   - Auto-suggest similar GP names when checking
   - Fuzzy matching for company name variations
   - "Did you mean...?" functionality

7. **Customer Notification Dashboard**
   - Allow customers to view their registration status
   - Real-time updates when approved/rejected
   - Chat/comment system for clarification

8. **Advanced Filtering**
   - Filter registrations by date range
   - Filter by rejection reason
   - Filter by approver (admin)

### 🚀 Performance Optimizations

1. **Lazy Loading**
   - Load modals only when needed
   - Code splitting for better performance

2. **Caching**
   - Cache GP existence check results
   - Reduce redundant API calls

3. **Optimistic UI Updates**
   - Show success immediately
   - Revert if API fails

---

## 📞 Support & Contact

For questions or issues related to this workflow:

1. **Technical Issues** - Check console for error messages
2. **Feature Requests** - Create issue in project repository
3. **Bug Reports** - Include steps to reproduce + screenshots

---

## 📝 Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-01 | 1.0 | Initial implementation with simulation mode |
| TBD | 2.0 | Real API integration with Goback backend |

---

**Last Updated:** 2026-01-01
**Author:** EKA+ Development Team
**Status:** ✅ Active (Simulation Mode) → ⏳ Pending (Real API Integration)

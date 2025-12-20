# Panduan Migrasi dari JSON Local ke SQL API

Dokumentasi ini menjelaskan langkah-langkah lengkap untuk migrasi komponen dari penyimpanan JSON local (localStorage) ke SQL API.

## Daftar Isi
1. [Persiapan](#persiapan)
2. [Struktur Type Definitions](#struktur-type-definitions)
3. [Konfigurasi API](#konfigurasi-api)
4. [Migrasi List Component](#migrasi-list-component)
5. [Migrasi Add/Edit Modal](#migrasi-addedit-modal)
6. [Migrasi Card Component](#migrasi-card-component)
7. [Migrasi Detail Modal](#migrasi-detail-modal)
8. [Checklist Migrasi](#checklist-migrasi)
9. [Common Issues](#common-issues)

---

## Persiapan

### 1. Format API Response
API harus mengembalikan response dengan format standar berikut:

```typescript
// GET /api/resource/ekatalog_xxxx
{
  "status": "success",
  "code": "200",
  "message": "Data retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Nama Item",
      // ... field lainnya
      "docstatus": 0,
      "status": "Draft",
      "disabled": 0,
      "created_at": "2025-01-10T12:00:00Z",
      "updated_at": "2025-01-10T12:00:00Z",
      "created_by": 1,
      "updated_by": 1,
      "owner": 1
    }
  ],
  "meta": {}
}
```

### 2. File Upload Response
Untuk upload file, API akan menerima FormData dengan file sebagai salah satu field, dan mengembalikan UUID:

```typescript
// POST/PUT dengan FormData
FormData {
  "name": "Nama Item",
  "image": File | "uuid-string-if-not-changed",
  // ... field lainnya
}

// Response akan berisi UUID untuk file yang diupload
{
  "data": {
    "id": 1,
    "image": "d9c97314-6f1f-49c5-9298-d663ec14bfae"
  }
}
```

File dapat diakses di: `http://192.168.101.214:8000/files/{uuid}`

---

## Struktur Type Definitions

### 1. Type untuk List Component
Buat type yang sesuai dengan response API dan kebutuhan UI:

```typescript
// Contoh: BranchList.tsx
type Branch = {
  id: number;
  name: string;
  branch_name: string;  // Field dari API
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  manager?: string;
  description?: string;
  image?: string;  // URL lengkap: http://192.168.101.214:8000/files/{uuid}
  docstatus: number;
  status: string;
  disabled: number;
  created_at?: string;
  updated_at?: string;
};

// Type untuk API Response
type BranchAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: Array<{
    id: number;
    name: string;
    branch_name: string;
    city: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    manager: string | null;
    description: string | null;
    image: string | null;  // UUID dari API
    docstatus: number;
    status: string;
    disabled: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
    owner: number;
  }>;
  meta: Record<string, unknown>;
};
```

### 2. Type untuk Relasi (Jika Ada)
Jika komponen memiliki relasi dengan komponen lain (seperti Category yang memiliki Type):

```typescript
// CategoryList.tsx
type Category = {
  id: number;
  name: string;
  category_name: string;
  item_type: number;  // ID dari type (dari API)
  type: {             // Object untuk UI
    id: number;
    name: string;
  };
  // ... field lainnya
};

type CategoryType = {
  id: number;
  name: string;
  type_name: string;
  // ... field lainnya
};
```

**PENTING:**
- `item_type` adalah field dari API (number/ID)
- `type` adalah object yang dibentuk di frontend untuk keperluan UI
- Type relasi harus di-load terlebih dahulu sebelum mapping categories

---

## Konfigurasi API

### 1. Tambahkan Endpoint di `src/config/api.ts`

```typescript
export const API_CONFIG = {
  BASE_URL: "http://192.168.101.214:8000/api",
  FILE_BASE_URL: "http://192.168.101.214:8000/files",
  ENDPOINTS: {
    // ... endpoints lain
    YOUR_RESOURCE: "/resource/ekatalog_xxxx",  // Tambahkan endpoint baru
  },
};
```

### 2. Helper Functions Sudah Tersedia
Gunakan helper functions yang sudah ada:

```typescript
import {
  getQueryUrl,        // Untuk GET dengan query params
  getResourceUrl,     // Untuk POST/PUT/DELETE dengan ID
  getAuthHeaders,     // Headers untuk JSON request
  getAuthHeadersFormData,  // Headers untuk FormData (upload file)
  getFileUrl,         // Convert UUID ke full URL
  API_CONFIG,
} from "@/config/api";
```

---

## Migrasi List Component

### Step 1: Import Dependencies

```typescript
import { useAuth } from "@/contexts/AuthContext";
import {
  getQueryUrl,
  getResourceUrl,
  getAuthHeaders,
  getFileUrl,
  API_CONFIG,
} from "@/config/api";
```

### Step 2: Update Type Definitions
Definisikan type sesuai struktur di atas (lihat [Struktur Type Definitions](#struktur-type-definitions))

### Step 3: Update Load Function

**SEBELUM (JSON Local):**
```typescript
useEffect(() => {
  const raw = localStorage.getItem(SNAP_KEY);
  const list = raw ? JSON.parse(raw) : [];
  setBranches(list);
}, []);
```

**SESUDAH (API):**
```typescript
useEffect(() => {
  if (!isAuthenticated || !token) return;

  let cancelled = false;

  async function load() {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error("Not authenticated");
      }

      const headers = getAuthHeaders(token);

      // Load data from API
      const url = getQueryUrl(API_CONFIG.ENDPOINTS.YOUR_RESOURCE, {
        fields: ["*"]
      });

      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers,
      });

      if (res.ok) {
        const response = (await res.json()) as YourAPIResponse;
        if (!cancelled) {
          // Map API response to frontend type
          const mappedData: YourType[] = response.data.map((item) => ({
            id: item.id,
            name: item.name,
            your_field: item.your_field,
            image: getFileUrl(item.image),  // Convert UUID to full URL
            description: item.description || undefined,
            docstatus: item.docstatus,
            status: item.status,
            disabled: item.disabled,
            created_at: item.created_at,
            updated_at: item.updated_at,
          }));

          console.log("Loaded data:", mappedData);
          setYourData(mappedData);

          // Optional: Save to localStorage as cache
          try {
            localStorage.setItem(SNAP_KEY, JSON.stringify(mappedData));
          } catch {}
        }
      } else {
        if (!cancelled) {
          if (res.status === 401) {
            setError("Session expired. Silakan login kembali.");
          } else {
            setError(`Failed to fetch data (${res.status})`);
          }
        }
      }
    } catch (err: unknown) {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : String(err));
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  load();
  return () => { cancelled = true; };
}, [isAuthenticated, token]);
```

### Step 4: Untuk Komponen dengan Relasi

Jika komponen Anda memiliki relasi (seperti Category → Type):

```typescript
useEffect(() => {
  if (!isAuthenticated || !token) return;
  let cancelled = false;

  async function load() {
    try {
      setLoading(true);
      const headers = getAuthHeaders(token);

      // 1. Load relasi terlebih dahulu (contoh: types)
      const typesUrl = getQueryUrl(API_CONFIG.ENDPOINTS.TYPE, { fields: ["*"] });
      const typesRes = await fetch(typesUrl, { method: "GET", headers });

      let mappedTypes: CategoryType[] = [];
      if (typesRes.ok) {
        const typesResponse = (await typesRes.json()) as TypeAPIResponse;
        if (!cancelled) {
          mappedTypes = typesResponse.data.map((item) => ({
            id: item.id,
            name: item.name,
            type_name: item.type_name,
          }));
          setTypes(mappedTypes);
        }
      }

      // 2. Load data utama dan map dengan relasi
      const dataUrl = getQueryUrl(API_CONFIG.ENDPOINTS.CATEGORY, { fields: ["*"] });
      const dataRes = await fetch(dataUrl, { method: "GET", headers });

      if (dataRes.ok) {
        const response = (await dataRes.json()) as CategoryAPIResponse;
        if (!cancelled) {
          const mappedData: Category[] = response.data
            .filter((item) => {
              // Filter item yang tidak punya relasi valid
              const typeExists = mappedTypes.some(t => t.id === item.item_type);
              if (!typeExists) {
                console.warn(`Item ${item.name} has invalid item_type: ${item.item_type}`);
              }
              return typeExists;
            })
            .map((item) => {
              // Map relasi ke object
              const typeObj = mappedTypes.find(t => t.id === item.item_type)!;

              return {
                id: item.id,
                name: item.name,
                item_type: item.item_type,
                type: { id: typeObj.id, name: typeObj.name },
                // ... field lainnya
              };
            });

          setCategories(mappedData);
        }
      }
    } catch (err) {
      if (!cancelled) setError(err instanceof Error ? err.message : String(err));
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  load();
  return () => { cancelled = true; };
}, [isAuthenticated, token]);
```

### Step 5: Update Reload Handler

**SEBELUM:**
```typescript
useEffect(() => {
  function handler() {
    const raw = localStorage.getItem(SNAP_KEY);
    const list = raw ? JSON.parse(raw) : [];
    setBranches(list);
  }
  window.addEventListener("ekatalog:branches_update", handler);
  return () => window.removeEventListener("ekatalog:branches_update", handler);
}, []);
```

**SESUDAH:**
```typescript
useEffect(() => {
  async function handler() {
    if (!isAuthenticated || !token) return;

    try {
      const url = getQueryUrl(API_CONFIG.ENDPOINTS.YOUR_RESOURCE, { fields: ["*"] });
      const headers = getAuthHeaders(token);

      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers,
      });

      if (res.ok) {
        const response = (await res.json()) as YourAPIResponse;
        const mappedData: YourType[] = response.data.map((item) => ({
          // ... mapping sama seperti di load function
        }));

        setYourData(mappedData);
        localStorage.setItem(SNAP_KEY, JSON.stringify(mappedData));
      }
    } catch (error) {
      console.error("Failed to reload:", error);
    }
  }

  window.addEventListener("ekatalog:your_resource_update", handler);
  return () => window.removeEventListener("ekatalog:your_resource_update", handler);
}, [isAuthenticated, token]);  // Tambahkan dependencies
```

### Step 6: Update DELETE Operation

**SEBELUM:**
```typescript
function promptDelete(item: YourType) {
  setConfirmTitle("Hapus Item");
  setConfirmDesc(`Yakin ingin menghapus "${item.name}"?`);
  actionRef.current = () => {
    const next = items.filter((x) => x.id !== item.id);
    setItems(next);
    saveSnapshot(next);
  };
  setConfirmOpen(true);
}
```

**SESUDAH:**
```typescript
function promptDelete(item: YourType) {
  setConfirmTitle("Hapus Item");
  setConfirmDesc(`Yakin ingin menghapus "${item.name}"?`);
  actionRef.current = async () => {
    try {
      if (!token) {
        throw new Error("Not authenticated");
      }

      const headers = getAuthHeaders(token);
      const response = await fetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.YOUR_RESOURCE, item.id),
        {
          method: "DELETE",
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to delete (${response.status})`
        );
      }

      console.log("Deleted successfully");

      // Remove from local state
      const next = items.filter((x) => x.id !== item.id);
      setItems(next);
      saveSnapshot(next);
    } catch (err: unknown) {
      console.error("Failed to delete:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    }
  };
  setConfirmOpen(true);
}
```

---

## Migrasi Add/Edit Modal

### Step 1: Import Dependencies

```typescript
import { useAuth } from "@/contexts/AuthContext";
import {
  getResourceUrl,
  getAuthHeadersFormData,
  API_CONFIG,
} from "@/config/api";
```

### Step 2: Update Type Definition

**PENTING:** Jika modal ini digunakan oleh List component, **import type dari List component** untuk menghindari type mismatch:

```typescript
// AddYourModal.tsx
import { YourType } from "./YourList";  // Import dari List component

// Jangan definisikan type baru di sini!
```

Atau jika ingin mendefinisikan sendiri, pastikan **PERSIS SAMA** dengan type di List, Card, dan Detail:

```typescript
type YourType = {
  id: number;
  name: string;
  your_field: string;
  // ... HARUS SAMA PERSIS dengan List/Card/Detail
};
```

### Step 3: Update State Variables

**SEBELUM:**
```typescript
const [imagePath, setImagePath] = useState("");
const [imageFile, setImageFile] = useState<File | null>(null);
```

**SESUDAH:**
```typescript
const { token: authToken } = useAuth();
const [imageUuid, setImageUuid] = useState("");  // Ubah dari imagePath
const [imageFile, setImageFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);
const [saving, setSaving] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Step 4: Update Initialization useEffect

```typescript
useEffect(() => {
  setError(null);
  if (initial) {
    setName(initial.name ?? "");
    setYourField(initial.your_field ?? "");

    // Extract UUID from full URL if present
    const imageUrl = initial.image ?? "";
    const imageUuidMatch = imageUrl.match(/\/files\/(.+)$/);
    const imageUuidExtracted = imageUuidMatch ? imageUuidMatch[1] : imageUrl;
    setImageUuid(imageUuidExtracted);
    setImagePreview(initial.image || null);
    setImageFile(null);
  } else {
    setName("");
    setYourField("");
    setImageUuid("");
    setImagePreview(null);
    setImageFile(null);
  }
}, [initial, open]);
```

### Step 5: Update File Preview

```typescript
// Image file preview
useEffect(() => {
  if (!imageFile) return;
  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result as string);
  };
  reader.readAsDataURL(imageFile);
}, [imageFile]);
```

### Step 6: Tambahkan Keyboard Shortcuts

```typescript
// Keyboard shortcuts (Ctrl+S dan Esc)
useEffect(() => {
  if (!open) return;

  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl+S or Cmd+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      if (!saving) {
        const form = document.querySelector("form");
        if (form) {
          form.requestSubmit();
        }
      }
    }
    // Escape to cancel
    if (e.key === "Escape") {
      e.preventDefault();
      if (!saving) {
        onClose();
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [open, saving, onClose]);
```

### Step 7: Update Submit Function

**SEBELUM (JSON):**
```typescript
async function submit(e: React.FormEvent) {
  e.preventDefault();
  setSaving(true);

  const payload = {
    name: name.trim(),
    your_field: yourField.trim(),
    image: imagePath,
  };

  const raw = localStorage.getItem(SNAP_KEY);
  let list = raw ? JSON.parse(raw) : [];

  if (initial && initial.id) {
    list = list.map((x) => (x.id === initial.id ? { ...x, ...payload } : x));
  } else {
    const maxId = list.reduce((m, it) => Math.max(m, it.id || 0), 0);
    list.push({ id: maxId + 1, ...payload });
  }

  localStorage.setItem(SNAP_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("ekatalog:your_update"));

  setSaving(false);
  onClose();
}
```

**SESUDAH (API dengan FormData):**
```typescript
async function submit(e: React.FormEvent) {
  e.preventDefault();
  setSaving(true);
  setError(null);

  try {
    if (!authToken) {
      throw new Error("Not authenticated");
    }

    // Prepare FormData - send file directly with data
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("your_field_name", name.trim());  // Sesuaikan dengan field API
    formData.append("your_field", yourField.trim() || "");
    formData.append("status", "Draft");
    formData.append("docstatus", "0");
    formData.append("disabled", "0");

    // Handle file upload
    // If new file, send the file object
    // If no new file but has UUID, send the UUID string
    if (imageFile) {
      formData.append("image", imageFile);  // File object
    } else if (imageUuid) {
      formData.append("image", imageUuid.trim());  // UUID string
    }

    const headers = getAuthHeadersFormData(authToken);

    let response;

    if (initial && initial.id) {
      // UPDATE existing item
      response = await fetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.YOUR_RESOURCE, initial.id),
        {
          method: "PUT",
          headers,
          body: formData,
        }
      );
    } else {
      // CREATE new item
      response = await fetch(getResourceUrl(API_CONFIG.ENDPOINTS.YOUR_RESOURCE), {
        method: "POST",
        headers,
        body: formData,
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to save (${response.status})`
      );
    }

    const result = await response.json();
    console.log("Saved successfully:", result);

    // Trigger reload in List component
    window.dispatchEvent(new Event("ekatalog:your_resource_update"));

    setSaving(false);
    onClose();
  } catch (err: unknown) {
    console.error("Failed to save:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    setError(errorMessage);
    setSaving(false);
  }
}
```

### Step 8: Update Modal Header (Tambah Keyboard Hint)

```typescript
<div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-white relative overflow-hidden">
  {/* ... decorations ... */}

  <div className="relative flex items-center justify-between">
    <div>
      <h3 className="text-2xl font-bold mb-1">
        {initial ? "Edit Item" : "Tambah Item Baru"}
      </h3>
      <p className="text-red-100 text-sm">
        {initial ? "Perbarui informasi" : "Lengkapi form untuk menambahkan"}
      </p>
      <p className="text-red-200 text-xs mt-1 opacity-80">
        💡 Tekan{" "}
        <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
          Ctrl+S
        </kbd>{" "}
        untuk simpan atau{" "}
        <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
          Esc
        </kbd>{" "}
        untuk batal
      </p>
    </div>
    <button
      onClick={onClose}
      disabled={saving}
      className="p-2 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaTimes className="w-6 h-6" />
    </button>
  </div>
</div>
```

### Step 9: Update Form - Tambah Error Message

```typescript
<form onSubmit={submit} className="p-6 space-y-6">
  {/* Error Message */}
  {error && (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
      <p className="text-sm text-red-600 font-medium">{error}</p>
    </div>
  )}

  {/* Form fields */}
  {/* ... */}
</form>
```

### Step 10: Update File Upload Section

```typescript
<label className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition-all group hover:border-red-500 hover:bg-red-50">
  <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors bg-gray-100 group-hover:bg-red-100">
    <FaImage className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
  </div>
  <div className="text-center">
    <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
      Upload Gambar
    </span>
    <p className="text-xs text-gray-500 mt-1">PNG, JPG (Max 5MB)</p>
  </div>
  <input
    type="file"
    accept="image/*"
    className="hidden"
    disabled={saving}
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError("Ukuran gambar terlalu besar. Maksimal 5MB");
          return;
        }
        setImageFile(file);
        setError(null);
      }
    }}
  />
</label>

{/* Preview */}
{imagePreview && (
  <div className="relative w-full h-32 bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
    <div className="absolute top-2 right-2 z-10">
      <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
        <FaCheckCircle className="w-4 h-4" />
      </div>
    </div>
    <Image
      src={imagePreview}
      alt="preview"
      width={1000}
      height={1000}
      unoptimized
      className="object-cover w-full h-full"
    />
    {imageFile && (
      <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs truncate">
        {imageFile.name}
      </div>
    )}
  </div>
)}
```

### Step 11: Update Action Buttons (Disable saat Saving)

```typescript
<div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
  <button
    type="button"
    onClick={onClose}
    disabled={saving}
    className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Batal
  </button>
  <button
    type="submit"
    disabled={saving}
    className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
  >
    {saving ? (
      <>
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span>Menyimpan...</span>
      </>
    ) : (
      <span>{initial ? "Simpan Perubahan" : "Tambah Item"}</span>
    )}
  </button>
</div>
```

---

## Migrasi Card Component

### Update Type Definition

Card component harus memiliki **type yang sama persis** dengan List component.

**OPSI 1 (Recommended): Import dari List**
```typescript
// YourCard.tsx
import { YourType } from "./YourList";

export default function YourCard({
  item,
  viewMode = 'grid',
  onEdit,
  onDelete,
  onView,
}: {
  item: YourType;
  viewMode?: 'grid' | 'list';
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}) {
  // ...
}
```

**OPSI 2: Copy persis sama**
```typescript
// Jika tidak mau import, copy type yang PERSIS SAMA
type YourType = {
  id: number;
  name: string;
  your_field: string;
  // ... HARUS IDENTIK dengan List
};
```

### Update Image Component

Tambahkan `unoptimized` prop untuk external images:

```typescript
<Image
  src={item.image}
  alt={item.name}
  width={400}
  height={300}
  unoptimized  // PENTING untuk external images
  onError={() => setImageError(true)}
  className="w-full h-48 object-cover"
/>
```

---

## Migrasi Detail Modal

### Update Type Definition

Detail modal juga harus menggunakan **type yang sama persis**:

```typescript
// YourDetailModal.tsx
import { YourType } from "./YourList";

export default function YourDetailModal({
  open,
  onClose,
  item,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  item?: YourType | null;
  onEdit?: (item: YourType) => void;
  onDelete?: (item: YourType) => void;
}) {
  // ...
}
```

### Update Image Display

```typescript
{item.image && (
  <Image
    src={item.image}
    alt={item.name}
    width={600}
    height={400}
    unoptimized  // PENTING
    className="w-full h-64 object-cover rounded-xl"
  />
)}
```

---

## Checklist Migrasi

Gunakan checklist ini untuk memastikan migrasi lengkap:

### Persiapan
- [ ] Endpoint API sudah ditambahkan di `src/config/api.ts`
- [ ] API response format sudah sesuai standar
- [ ] Testing API di Postman berhasil (GET, POST, PUT, DELETE)

### List Component
- [ ] Import dependencies (`useAuth`, API helpers)
- [ ] Type definitions dibuat sesuai API response
- [ ] `useEffect` load function diupdate dengan API call
- [ ] `useEffect` reload handler diupdate dengan API call
- [ ] DELETE operation diupdate dengan API call
- [ ] Mapping UUID ke full URL untuk images dengan `getFileUrl()`
- [ ] Error handling ditambahkan (401, network errors, etc)
- [ ] Loading state ditambahkan

### Add/Edit Modal
- [ ] Import type dari List component (atau definisi yang sama persis)
- [ ] Import `useAuth` dan API helpers
- [ ] State variables diupdate (`imageUuid`, `imagePreview`, `error`)
- [ ] Initialization useEffect extract UUID dari full URL
- [ ] File preview useEffect ditambahkan
- [ ] Keyboard shortcuts ditambahkan (Ctrl+S, Esc)
- [ ] Submit function diubah menggunakan FormData
- [ ] File upload: kirim File object atau UUID string
- [ ] Header modal ditambahkan keyboard hint
- [ ] Error message display ditambahkan
- [ ] File upload validation ditambahkan (max 5MB)
- [ ] Action buttons disabled saat saving
- [ ] Trigger reload event setelah save berhasil

### Card Component
- [ ] Type definition sama persis dengan List
- [ ] Image component ada `unoptimized` prop

### Detail Modal
- [ ] Type definition sama persis dengan List
- [ ] Image display ada `unoptimized` prop

### Testing
- [ ] CREATE: Bisa tambah data baru dengan/tanpa upload image
- [ ] READ: Data tampil dengan benar, images load
- [ ] UPDATE: Bisa edit data dengan/tanpa ganti image
- [ ] DELETE: Bisa hapus data
- [ ] Error handling: Error messages tampil dengan jelas
- [ ] Keyboard shortcuts: Ctrl+S save, Esc cancel
- [ ] File validation: File > 5MB ditolak
- [ ] Loading states: Loading spinner tampil saat operasi
- [ ] Relasi (jika ada): Data relasi ter-mapping dengan benar

---

## Common Issues

### 1. Type Mismatch Errors

**Error:**
```
Type 'YourType' is not assignable to type 'YourType'.
Two different types with this name exist, but they are unrelated.
```

**Solusi:**
- Pastikan type di List, Card, Detail, dan Modal **PERSIS SAMA**
- Gunakan import dari satu sumber: `import { YourType } from "./YourList"`
- Cek semua fields: `category_name`, `item_type`, dll harus ada di semua definisi

### 2. Image Not Displaying

**Error:**
```
hostname "192.168.101.214" is not configured under images in your next.config.js
```

**Solusi:**
Sudah dikonfigurasi di `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.101.214",
        port: "8000",
        pathname: "/files/**",
      },
    ],
  },
};
```

Pastikan juga ada `unoptimized` prop:
```typescript
<Image src={image} alt="..." unoptimized />
```

### 3. Upload Failed (404)

**Problem:** File diupload ke endpoint terpisah (`/upload`) yang tidak ada.

**Solusi:**
- **JANGAN** upload file ke endpoint terpisah
- Kirim file langsung dalam FormData bersama data lain:
```typescript
const formData = new FormData();
formData.append("name", name);
formData.append("image", imageFile);  // File object, bukan URL

// POST/PUT ke endpoint resource utama
fetch(getResourceUrl(API_CONFIG.ENDPOINTS.YOUR_RESOURCE), {
  method: "POST",
  headers: getAuthHeadersFormData(token),
  body: formData,
});
```

### 4. FormData Not Sending

**Problem:** API menerima empty request atau file tidak terkirim.

**Solusi:**
- Pastikan menggunakan `getAuthHeadersFormData()`, **BUKAN** `getAuthHeaders()`
- `getAuthHeadersFormData()` tidak set `Content-Type` (browser set otomatis dengan boundary)
```typescript
const headers = getAuthHeadersFormData(token);  // ✅ Correct
// JANGAN:
const headers = getAuthHeaders(token);  // ❌ Wrong for FormData
```

### 5. "c.type is possibly undefined"

**Problem:** Relasi tidak ter-map dengan benar.

**Solusi:**
```typescript
// 1. Load parent data dulu
const types = await loadTypes();

// 2. Filter item yang tidak punya relasi valid
const mappedData = response.data
  .filter((item) => {
    const typeExists = types.some(t => t.id === item.item_type);
    if (!typeExists) {
      console.warn(`Invalid relation for ${item.name}`);
    }
    return typeExists;
  })
  .map((item) => {
    const typeObj = types.find(t => t.id === item.item_type)!;
    return {
      ...item,
      type: { id: typeObj.id, name: typeObj.name },
    };
  });

// 3. Type definition: type harus required, bukan optional
type YourType = {
  item_type: number;
  type: {  // Required, bukan type?:
    id: number;
    name: string;
  };
};
```

### 6. Image UUID vs Full URL

**Problem:** API mengembalikan UUID tapi UI butuh full URL.

**Solusi:**
```typescript
// Saat mapping response API:
const mappedData = response.data.map((item) => ({
  ...item,
  image: getFileUrl(item.image),  // Convert UUID to full URL
}));

// Saat edit, extract UUID dari full URL:
const imageUrl = initial.image ?? "";
const imageUuidMatch = imageUrl.match(/\/files\/(.+)$/);
const imageUuid = imageUuidMatch ? imageUuidMatch[1] : imageUrl;

// Saat save:
if (imageFile) {
  formData.append("image", imageFile);  // New file
} else if (imageUuid) {
  formData.append("image", imageUuid);  // Keep existing UUID
}
```

### 7. Keyboard Shortcuts Not Working

**Problem:** Ctrl+S tidak save, Esc tidak cancel.

**Solusi:**
```typescript
useEffect(() => {
  if (!open) return;  // PENTING: Hanya aktif saat modal open

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();  // PENTING: Prevent browser save
      if (!saving) {
        const form = document.querySelector("form");
        if (form) {
          form.requestSubmit();  // Trigger form submit
        }
      }
    }
    if (e.key === "Escape") {
      e.preventDefault();
      if (!saving) {
        onClose();
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [open, saving, onClose]);  // Dependencies harus lengkap
```

---

## Best Practices

### 1. Konsistensi Naming

Gunakan naming yang konsisten:
```typescript
// API Endpoint
ENDPOINTS: {
  BRANCH: "/resource/ekatalog_branch",
  TYPE: "/resource/ekatalog_type",
  CATEGORY: "/resource/ekatalog_category",
}

// Event names
"ekatalog:branches_update"
"ekatalog:types_update"
"ekatalog:categories_update"

// LocalStorage keys
"ekatalog_branches_snapshot"
"ekatalog_types_snapshot"
"ekatalog_categories_snapshot"
```

### 2. Error Handling

Selalu tangani berbagai jenis error:
```typescript
try {
  // API call
} catch (err: unknown) {
  if (!cancelled) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    setError(errorMessage);
  }
}

// Check response status
if (res.status === 401) {
  setError("Session expired. Silakan login kembali.");
} else if (res.status === 403) {
  setError("Anda tidak memiliki akses.");
} else {
  setError(`Failed to fetch data (${res.status})`);
}
```

### 3. Loading States

Berikan feedback visual saat loading:
```typescript
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);

// Di UI:
{loading && <div>Loading...</div>}
{saving && <div>Saving...</div>}

// Disable buttons saat loading/saving
<button disabled={saving || loading}>Submit</button>
```

### 4. Optimistic Updates vs Reload

**Optimistic Update (untuk UX lebih baik):**
```typescript
// Update UI dulu, rollback jika error
const optimisticData = [...items, newItem];
setItems(optimisticData);

try {
  await saveToAPI(newItem);
} catch (error) {
  setItems(items);  // Rollback
  setError("Failed to save");
}
```

**Reload dari API (untuk data consistency):**
```typescript
// Save dulu, reload dari API
await saveToAPI(newItem);
window.dispatchEvent(new Event("ekatalog:reload"));  // Trigger reload
```

Pilih sesuai kebutuhan. Untuk aplikasi ini, kami menggunakan **reload dari API** untuk ensure consistency.

### 5. Caching dengan localStorage

Gunakan localStorage sebagai cache untuk faster initial load:
```typescript
// Load from cache first
const cached = localStorage.getItem(SNAP_KEY);
if (cached) {
  setItems(JSON.parse(cached));
}

// Then fetch from API
const fresh = await fetchFromAPI();
setItems(fresh);
localStorage.setItem(SNAP_KEY, JSON.stringify(fresh));
```

---

## Contoh Lengkap: Migrasi Product

Berikut contoh lengkap migrasi komponen "Product":

### 1. API Config
```typescript
// src/config/api.ts
ENDPOINTS: {
  // ... existing
  PRODUCT: "/resource/ekatalog_product",
}
```

### 2. ProductList.tsx Type
```typescript
type Product = {
  id: number;
  name: string;
  product_name: string;
  sku: string;
  price: number;
  category_id: number;
  category: {
    id: number;
    name: string;
  };
  image?: string;
  description?: string;
  stock: number;
  docstatus: number;
  status: string;
  disabled: number;
  created_at?: string;
  updated_at?: string;
};

type ProductAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: Array<{
    id: number;
    name: string;
    product_name: string;
    sku: string;
    price: number;
    category_id: number;
    image: string | null;
    description: string | null;
    stock: number;
    docstatus: number;
    status: string;
    disabled: number;
    created_at: string;
    updated_at: string;
  }>;
  meta: Record<string, unknown>;
};
```

### 3. ProductList.tsx Load
```typescript
useEffect(() => {
  if (!isAuthenticated || !token) return;
  let cancelled = false;

  async function load() {
    try {
      setLoading(true);
      const headers = getAuthHeaders(token);

      // Load categories first
      const categoriesUrl = getQueryUrl(API_CONFIG.ENDPOINTS.CATEGORY, { fields: ["*"] });
      const categoriesRes = await fetch(categoriesUrl, { method: "GET", headers });

      let categories: Category[] = [];
      if (categoriesRes.ok) {
        const catResponse = await categoriesRes.json();
        categories = catResponse.data.map(c => ({ id: c.id, name: c.name }));
        setCategories(categories);
      }

      // Load products
      const productsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT, { fields: ["*"] });
      const productsRes = await fetch(productsUrl, { method: "GET", headers });

      if (productsRes.ok) {
        const response = await productsRes.json() as ProductAPIResponse;
        if (!cancelled) {
          const mappedProducts: Product[] = response.data
            .filter(item => categories.some(c => c.id === item.category_id))
            .map(item => {
              const cat = categories.find(c => c.id === item.category_id)!;
              return {
                id: item.id,
                name: item.name,
                product_name: item.product_name,
                sku: item.sku,
                price: item.price,
                category_id: item.category_id,
                category: { id: cat.id, name: cat.name },
                image: getFileUrl(item.image),
                description: item.description || undefined,
                stock: item.stock,
                docstatus: item.docstatus,
                status: item.status,
                disabled: item.disabled,
                created_at: item.created_at,
                updated_at: item.updated_at,
              };
            });

          setProducts(mappedProducts);
          localStorage.setItem("ekatalog_products_snapshot", JSON.stringify(mappedProducts));
        }
      }
    } catch (err) {
      if (!cancelled) setError(err instanceof Error ? err.message : String(err));
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  load();
  return () => { cancelled = true; };
}, [isAuthenticated, token]);
```

### 4. AddProductModal.tsx
```typescript
import { Product } from "./ProductList";

export default function AddProductModal({ ... }) {
  const { token: authToken } = useAuth();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [imageUuid, setImageUuid] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ... useEffect for initialization, preview, keyboard shortcuts ...

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!authToken) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("product_name", name.trim());
      formData.append("sku", sku.trim());
      formData.append("price", price);
      formData.append("category_id", String(categoryId));
      formData.append("stock", "0");
      formData.append("status", "Draft");
      formData.append("docstatus", "0");
      formData.append("disabled", "0");

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imageUuid) {
        formData.append("image", imageUuid.trim());
      }

      const headers = getAuthHeadersFormData(authToken);
      const url = initial?.id
        ? getResourceUrl(API_CONFIG.ENDPOINTS.PRODUCT, initial.id)
        : getResourceUrl(API_CONFIG.ENDPOINTS.PRODUCT);

      const response = await fetch(url, {
        method: initial?.id ? "PUT" : "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to save (${response.status})`);
      }

      window.dispatchEvent(new Event("ekatalog:products_update"));
      setSaving(false);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setSaving(false);
    }
  }

  // ... return JSX
}
```

---

## Summary

Migrasi dari JSON local ke API memerlukan perubahan di beberapa layer:

1. **API Config**: Tambahkan endpoint baru
2. **Type Definitions**: Buat type untuk API response dan frontend
3. **List Component**:
   - Load data dari API
   - Handle relasi jika ada
   - Update DELETE operation
4. **Add/Edit Modal**:
   - Gunakan FormData untuk semua request
   - Upload file langsung dengan data
   - Tambahkan keyboard shortcuts
5. **Card & Detail**: Pastikan type konsisten, tambahkan `unoptimized` untuk images

**Key Points:**
- Semua input/edit **WAJIB menggunakan FormData**
- File diupload **bersamaan dengan data**, bukan terpisah
- Type definitions harus **konsisten** di semua component
- UUID dari API di-convert ke full URL dengan `getFileUrl()`
- Saat edit tanpa ganti file, kirim UUID string (bukan File object)

Ikuti checklist dan best practices di atas untuk memastikan migrasi berjalan lancar! 🚀

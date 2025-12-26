# Client-Side Sorting Workaround - Temporary Solution ⚠️

## Masalah

Backend Goback API **tidak support** parameter `order_by` dengan benar (2025-12-26). Meskipun format sudah benar sesuai dokumentasi Goback:

```typescript
order_by: ["field_name ASC"]  // atau ["field_name DESC"]
```

Data yang dikembalikan dari API tetap **tidak ter-sort**.

**User feedback**: "ternyata salah dari backendnya"

## Solusi Sementara

Karena backend masih bermasalah, sementara waktu menggunakan **client-side sorting** (sorting di browser menggunakan JavaScript).

⚠️ **PENTING**: Ini adalah solusi **SEMENTARA**. Ketika backend sudah diperbaiki, **UNCOMMENT** kode server-side sorting yang sudah ditandai dengan TODO.

## Perubahan File

### 1. [src/components/items/ItemList.tsx](src/components/items/ItemList.tsx)

#### Line 130-135: Comment out sort parameters dari function signature
```typescript
async function loadAllData(
  filterTriples: FilterTriple[] = []
  // TODO: UNCOMMENT WHEN BACKEND SUPPORTS ORDER_BY
  // sort_by?: SortField,
  // sort_order?: SortDirection
): Promise<Item[]> {
```

#### Line 151-160: Comment out server-side order_by dengan TODO marker
```typescript
// ============================================================================
// TODO: UNCOMMENT KETIKA BACKEND SUDAH FIX ORDER_BY
// Backend saat ini belum support order_by dengan benar (2025-12-26)
// Sementara menggunakan client-side sorting (lihat line ~530)
// ============================================================================
// if (sort_by && sort_order) {
//   // Goback requires order_by as ARRAY with UPPERCASE direction
//   itemSpec.order_by = [`${sort_by} ${sort_order.toUpperCase()}`];
// }
// ============================================================================
```

#### Line 249-252: Update API calls tanpa sort parameters
```typescript
console.log("[ItemList] Loading data (client-side sort):", sortField, sortDirection);
// TODO: UNCOMMENT WHEN BACKEND SUPPORTS ORDER_BY
// const mappedItems = await loadAllData(filters, sortField, sortDirection);
const mappedItems = await loadAllData(filters);
```

#### Line 530-568: Tambah client-side sorting logic
```typescript
// ============================================================================
// TODO: HAPUS CLIENT-SIDE SORTING INI KETIKA BACKEND SUDAH FIX ORDER_BY
// Sementara menggunakan client-side sorting karena backend belum support (2025-12-26)
// ============================================================================
// Client-side sorting (temporary until backend supports order_by)
filteredItems = [...filteredItems].sort((a, b) => {
  let aVal: string | number;
  let bVal: string | number;

  switch (sortField) {
    case "item_name":
      aVal = a.item_name.toLowerCase();
      bVal = b.item_name.toLowerCase();
      break;
    case "item_code":
      aVal = a.item_code.toLowerCase();
      bVal = b.item_code.toLowerCase();
      break;
    case "item_category":
      aVal = a.category.toLowerCase();
      bVal = b.category.toLowerCase();
      break;
    case "created_at":
      aVal = new Date(a.created_at || 0).getTime();
      bVal = new Date(b.created_at || 0).getTime();
      break;
    case "updated_at":
      aVal = new Date(a.updated_at || 0).getTime();
      bVal = new Date(b.updated_at || 0).getTime();
      break;
    default:
      return 0;
  }

  if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
  if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
  return 0;
});
// ============================================================================
```

### 2. [src/components/products/ProductList.tsx](src/components/products/ProductList.tsx)

#### Line 101-106: Comment out sort parameters dari function signature
```typescript
async function loadAllData(
  filterTriples: FilterTriple[] = []
  // TODO: UNCOMMENT WHEN BACKEND SUPPORTS ORDER_BY
  // sort_by?: SortField,
  // sort_order?: SortDirection
): Promise<{
```

#### Line 174-183: Comment out server-side order_by dengan TODO marker
```typescript
// ============================================================================
// TODO: UNCOMMENT KETIKA BACKEND SUDAH FIX ORDER_BY
// Backend saat ini belum support order_by dengan benar (2025-12-26)
// Sementara menggunakan client-side sorting (lihat line ~440)
// ============================================================================
// if (sort_by && sort_order) {
//   // Goback requires order_by as ARRAY with UPPERCASE direction
//   productSpec.order_by = [`${sort_by} ${sort_order.toUpperCase()}`];
// }
// ============================================================================
```

#### Line 263-268: Update API calls tanpa sort parameters
```typescript
console.log("[ProductList] Loading data (client-side sort):", sortField, sortDirection);
// TODO: UNCOMMENT WHEN BACKEND SUPPORTS ORDER_BY
// const { categoriesData, itemsData, productsWithVariants } =
//   await loadAllData(filterTriples, sortField, sortDirection);
const { categoriesData, itemsData, productsWithVariants } =
  await loadAllData(filterTriples);
```

#### Line 448-486: Tambah client-side sorting logic
```typescript
// ============================================================================
// TODO: HAPUS CLIENT-SIDE SORTING INI KETIKA BACKEND SUDAH FIX ORDER_BY
// Sementara menggunakan client-side sorting karena backend belum support (2025-12-26)
// ============================================================================
// Client-side sorting (temporary until backend supports order_by)
filteredProducts = [...filteredProducts].sort((a, b) => {
  let aVal: string | number;
  let bVal: string | number;

  switch (sortField) {
    case "product_name":
      aVal = a.name.toLowerCase();
      bVal = b.name.toLowerCase();
      break;
    case "item_category":
      aVal = a.itemCategory?.name?.toLowerCase() || "";
      bVal = b.itemCategory?.name?.toLowerCase() || "";
      break;
    case "created_at":
      aVal = new Date(a.created_at || 0).getTime();
      bVal = new Date(b.created_at || 0).getTime();
      break;
    case "updated_at":
      aVal = new Date(a.updated_at || 0).getTime();
      bVal = new Date(b.updated_at || 0).getTime();
      break;
    case "hot_deals":
      aVal = a.isHotDeals ? 1 : 0;
      bVal = b.isHotDeals ? 1 : 0;
      break;
    default:
      return 0;
  }

  if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
  if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
  return 0;
});
// ============================================================================
```

## Cara Mengembalikan Server-Side Sorting

Ketika backend sudah diperbaiki dan support `order_by`, ikuti langkah berikut:

### Untuk ItemList.tsx:

1. **Line 132-134**: UNCOMMENT sort parameters
   ```typescript
   async function loadAllData(
     filterTriples: FilterTriple[] = [],
     sort_by?: SortField,  // ← UNCOMMENT ini
     sort_order?: SortDirection  // ← UNCOMMENT ini
   ): Promise<Item[]> {
   ```

2. **Line 151-160**: UNCOMMENT server-side order_by
   ```typescript
   if (sort_by && sort_order) {
     itemSpec.order_by = [`${sort_by} ${sort_order.toUpperCase()}`];
   }
   ```

3. **Line 249-252**: UNCOMMENT loadAllData call dengan parameters
   ```typescript
   const mappedItems = await loadAllData(filters, sortField, sortDirection);
   ```

4. **Line 530-568**: HAPUS SELURUH client-side sorting block

### Untuk ProductList.tsx:

1. **Line 104-105**: UNCOMMENT sort parameters
   ```typescript
   async function loadAllData(
     filterTriples: FilterTriple[] = [],
     sort_by?: SortField,  // ← UNCOMMENT ini
     sort_order?: SortDirection  // ← UNCOMMENT ini
   ): Promise<{
   ```

2. **Line 174-183**: UNCOMMENT server-side order_by
   ```typescript
   if (sort_by && sort_order) {
     productSpec.order_by = [`${sort_by} ${sort_order.toUpperCase()}`];
   }
   ```

3. **Line 263-268**: UNCOMMENT loadAllData call dengan parameters
   ```typescript
   const { categoriesData, itemsData, productsWithVariants } =
     await loadAllData(filterTriples, sortField, sortDirection);
   ```

4. **Line 448-486**: HAPUS SELURUH client-side sorting block

## Perbedaan Client-Side vs Server-Side Sorting

### Client-Side Sorting (Saat ini):
✅ **Kelebihan**:
- Sorting tetap berfungsi meskipun backend bermasalah
- Response time lebih cepat (tidak perlu fetch ulang dari API)

❌ **Kekurangan**:
- Hanya sort data yang sudah di-load (jika ada pagination di API, data tidak lengkap)
- Memory usage lebih tinggi di browser
- Tidak efisien untuk dataset besar

### Server-Side Sorting (Target):
✅ **Kelebihan**:
- Database melakukan sorting (lebih efisien untuk dataset besar)
- Mendukung pagination dengan benar
- Memory usage lebih rendah di browser

❌ **Kekurangan**:
- Bergantung pada backend support
- Setiap perubahan sort memerlukan API call (sedikit lebih lambat)

## Testing

Setelah backend diperbaiki, test dengan langkah berikut:

1. ✅ UNCOMMENT semua kode server-side sorting (ikuti langkah di atas)
2. ✅ HAPUS semua kode client-side sorting
3. ✅ Test sort by name (A-Z dan Z-A)
4. ✅ Test sort by category
5. ✅ Test sort by created_at (newest/oldest first)
6. ✅ Test sort by updated_at
7. ✅ Test kombinasi filter + sort
8. ✅ Verify di Network tab bahwa order_by parameter terkirim dengan benar
9. ✅ Verify API response sudah ter-sort sesuai parameter

## Catatan Penting

- ⚠️ Semua kode yang di-comment diberi marker **"TODO: UNCOMMENT WHEN BACKEND SUPPORTS ORDER_BY"**
- ⚠️ Semua kode client-side sorting diberi marker **"TODO: HAPUS CLIENT-SIDE SORTING INI KETIKA BACKEND SUDAH FIX ORDER_BY"**
- ⚠️ Jangan lupa **HAPUS** client-side sorting setelah mengaktifkan server-side sorting
- ⚠️ Format order_by yang benar sudah ada di kode yang di-comment: `["field_name ASC"]` atau `["field_name DESC"]`

## Referensi

- [SORTING_DEBUG_FIX.md](SORTING_DEBUG_FIX.md) - Debugging process dan format order_by yang benar
- [URL_ENCODING_FIX.md](URL_ENCODING_FIX.md) - URL encoding untuk spec parameter
- Goback API Documentation - Format order_by official

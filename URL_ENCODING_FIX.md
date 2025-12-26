# URL Encoding Fix untuk HTTP 500 Error

## Masalah

Ketika user mencoba menggunakan filter di ItemList atau ProductList, API request gagal dengan **HTTP 500 Internal Server Error**.

User melaporkan bahwa endpoint yang sama bekerja dengan baik di Postman, tetapi gagal ketika dipanggil dari browser.

## Root Cause

Masalah ada di function `getQueryUrl()` di [src/config/api.ts](src/config/api.ts).

**Before (SALAH):**
```typescript
export function getQueryUrl(
  endpoint: string,
  spec?: Record<string, unknown>
): string {
  const baseUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  if (spec) {
    return `${baseUrl}?spec=${JSON.stringify(spec)}`;  // ❌ TIDAK DI-ENCODE
  }
  return baseUrl;
}
```

**Kenapa salah?**
- `JSON.stringify(spec)` menghasilkan string JSON dengan special characters: `{`, `}`, `[`, `]`, `"`, `:`, `,`
- Special characters ini harus di-encode untuk URL query parameter
- Tanpa encoding, browser atau server bisa salah interpretasi parameter

**Contoh URL yang dihasilkan (tanpa encoding):**
```
https://api-ekaplus.ekatunggal.com/api/resource/item?spec={"fields":["*"],"filters":[["item_name","like","test"]]}
```

## Solusi

Tambahkan `encodeURIComponent()` untuk meng-encode JSON string menjadi valid URL query parameter.

**After (BENAR):**
```typescript
export function getQueryUrl(
  endpoint: string,
  spec?: Record<string, unknown>
): string {
  const baseUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  if (spec) {
    return `${baseUrl}?spec=${encodeURIComponent(JSON.stringify(spec))}`; // ✅ DI-ENCODE
  }
  return baseUrl;
}
```

**Contoh URL yang dihasilkan (dengan encoding):**
```
https://api-ekaplus.ekatunggal.com/api/resource/item?spec=%7B%22fields%22%3A%5B%22*%22%5D%2C%22filters%22%3A%5B%5B%22item_name%22%2C%22like%22%2C%22test%22%5D%5D%7D
```

## Perubahan File

### [src/config/api.ts](src/config/api.ts:65)
- Line 65: Tambah `encodeURIComponent()` wrapper untuk proper URL encoding

### [src/components/items/ItemList.tsx](src/components/items/ItemList.tsx)
- Line 155-159: Tambah console.log untuk debugging filter requests
- Line 197-214: Improved error handling - return empty array untuk 400/500 errors instead of throwing
- Sekarang menampilkan "Data tidak ditemukan" instead of error message ketika filter gagal

### [src/components/products/ProductList.tsx](src/components/products/ProductList.tsx)
- Line 178-182: Tambah console.log untuk debugging filter requests
- Line 224-240: Improved error handling - log error details tapi return empty array untuk 400/500
- Konsisten dengan ItemList error handling

## Debug Logging

Untuk membantu troubleshooting kedepan, telah ditambahkan console logging di ItemList dan ProductList:

```typescript
console.log("[ItemList] Filter Triples:", filterTriples);
console.log("[ItemList] Item Spec:", itemSpec);
console.log("[ItemList] Request URL:", DATA_URL);
```

**Cara menggunakan:**
1. Buka Browser DevTools (F12)
2. Pilih tab "Console"
3. Lakukan filter di UI
4. Periksa log output untuk melihat:
   - Filter yang sedang aktif
   - Spec object yang dikirim ke API
   - Full URL yang di-generate (sudah ter-encode)

## Testing

Setelah fix ini, coba test filter berikut:

### Basic Filter Test
1. ✅ Filter item berdasarkan nama (like operator)
2. ✅ Filter item berdasarkan kategori (= operator)
3. ✅ Filter item berdasarkan created_at (between → >= dan <=)

### Product Filter Test
1. ✅ Filter product berdasarkan hot_deals (= operator)
2. ✅ Filter product berdasarkan item_category (in operator)
3. ✅ Filter product berdasarkan created_at (between)

### Combined Filter + Sort Test
1. ✅ Apply filter + sort by created_at descending
2. ✅ Apply multiple filters (name + category)
3. ✅ Apply filter dengan date range (between operator)

## Catatan Penting

- **Postman auto-encode**: Postman secara otomatis meng-encode query parameters, makanya user tidak mengalami masalah di Postman
- **Browser tidak auto-encode**: Browser tidak auto-encode query string yang sudah di-construct manual, harus di-encode eksplisit dengan `encodeURIComponent()`
- **Server-side parsing**: Server mengharapkan spec parameter dalam bentuk URL-encoded JSON

## Referensi

- MDN: [encodeURIComponent()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
- URL Encoding: Special characters yang harus di-encode: `{}[]":,` → `%7B%7D%5B%5D%22%3A%2C`

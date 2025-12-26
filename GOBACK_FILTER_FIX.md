# Perbaikan Goback Filter Integration

## Masalah yang Ditemukan

1. **Operator "between" tidak di-support oleh Goback API**
   - UI menggunakan operator "between" untuk date range
   - Goback API tidak mengenali operator "between"
   - Menyebabkan API request error

2. **Format "is" / "is not" operator salah**
   - UI menggunakan operator "is" dan "is not" secara terpisah
   - Goback hanya punya operator "is" dengan value "set" atau "not set"

## Solusi yang Diterapkan

### 1. Konversi Operator "between" ✅

**Before:**
```javascript
// Filter UI state
{
  field: "created_at",
  operator: "between",
  value: ["2025-01-01", "2025-01-31"]
}

// Converted to (SALAH - Goback tidak support "between")
["created_at", "between", ["2025-01-01", "2025-01-31"]]
```

**After:**
```javascript
// Filter UI state (sama)
{
  field: "created_at",
  operator: "between",
  value: ["2025-01-01", "2025-01-31"]
}

// Converted to (BENAR - 2 filter terpisah)
["created_at", ">=", "2025-01-01"]
["created_at", "<=", "2025-01-31"]
```

### 2. Konversi Operator "is" / "is not" ✅

**Before:**
```javascript
// Filter UI state
{
  field: "variants",
  operator: "is",
  value: "null"
}

// Converted to (SALAH)
["variants", "is", "null"]
```

**After:**
```javascript
// Filter UI state: operator "is"
{
  field: "variants",
  operator: "is",
  value: "null"
}
// Converted to (BENAR)
["variants", "is", "set"]

// Filter UI state: operator "is not"
{
  field: "variants",
  operator: "is not",
  value: "null"
}
// Converted to (BENAR)
["variants", "is", "not set"]
```

## File yang Dimodifikasi

### src/utils/filterUtils.ts
- **Function `stateToTriple()`**: Updated untuk handle konversi yang benar
  - "between" → 2 filter terpisah (`>=` dan `<=`)
  - "is" → `["field", "is", "set"]`
  - "is not" → `["field", "is", "not set"]`

## Operator Goback yang Di-support

Berdasarkan dokumentasi Goback:

### Perbandingan
- `=` - sama dengan
- `!=` - tidak sama dengan
- `>` - lebih besar
- `>=` - lebih besar atau sama
- `<` - lebih kecil
- `<=` - lebih kecil atau sama

### String
- `like` - LIKE '%value%'
- `not like` - NOT LIKE '%value%'

### List/Array
- `in` - nilai ada dalam list
- `not in` - nilai tidak ada dalam list

### Keberadaan (Relation/Child)
- `is` dengan value `"set"` - field/child ADA
- `is` dengan value `"not set"` - field/child TIDAK ADA

## Testing

Setelah perbaikan ini, filter di ItemList dan ProductList seharusnya berfungsi dengan baik:

1. ✅ Filter dengan operator standar (=, !=, >, <, dll)
2. ✅ Filter dengan operator string (like, not like)
3. ✅ Filter dengan operator list (in, not in)
4. ✅ Filter dengan date range (between → converted to >= and <=)
5. ✅ Filter dengan relation check (is/is not)

## Catatan Penting

- **"between" tetap ada di UI** untuk user experience yang lebih baik
- **Konversi terjadi di `stateToTriple()`** sebelum dikirim ke API
- **Goback API tidak pernah menerima operator "between"** - hanya menerima >= dan <=
- **Filter state di URL/localStorage tetap menggunakan "between"** untuk kompatibilitas UI

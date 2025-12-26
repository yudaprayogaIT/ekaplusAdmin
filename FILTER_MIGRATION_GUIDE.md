# Filter System Migration Guide

Panduan cepat untuk migrate list views ke sistem filter stackable baru.

## Changes Required for Each List View

### 1. Add Imports
```typescript
import FilterBuilder from "@/components/filters/FilterBuilder";
import { useFilters } from "@/hooks/useFilters";
import { [ENTITY]_FILTER_FIELDS } from "@/config/filterFields";
import { FilterTriple } from "@/types/filter";
```

### 2. Remove Old Filter State
**REMOVE:**
```typescript
const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
const [searchQuery, setSearchQuery] = useState("");
const [showHotDealsOnly, setShowHotDealsOnly] = useState(false);
const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
```

**KEEP:**
```typescript
const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
const [sortBy, setSortBy] = useState<SortOption>("default");
const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
```

### 3. Add Filter Hook & Functions
```typescript
// Function to load data with filters
async function loadDataWithFilters(filterTriples: FilterTriple[] = []) {
  setLoading(true);
  setError(null);
  try {
    const data = await loadAllData(filterTriples);
    setItems(data);
    localStorage.setItem(SNAP_KEY, JSON.stringify(data));
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : String(err));
  } finally {
    setLoading(false);
  }
}

// Use filter system
const { filters, setFilters } = useFilters({
  entity: "[entity_name]",
  onFiltersChange: (newFilters) => {
    loadDataWithFilters(newFilters);
  },
});

// Handle filter apply
function handleApplyFilters(newFilters: FilterTriple[]) {
  setFilters(newFilters);
}
```

### 4. Update loadAllData to Accept Filters
```typescript
async function loadAllData(filterTriples: FilterTriple[] = []): Promise<Entity[]> {
  if (!token) return [];

  const headers = getAuthHeaders(token);

  const spec: Record<string, any> = {
    fields: ["*"],
  };

  if (filterTriples.length > 0) {
    spec.filters = filterTriples;
  }

  const url = getQueryUrl(API_CONFIG.ENDPOINTS.[ENTITY], spec);
  // ... rest of fetch logic
}
```

### 5. Update useEffect for Initial Load
```typescript
useEffect(() => {
  let cancelled = false;

  async function load() {
    if (!cancelled && token) {
      await loadDataWithFilters(filters);
    }
  }

  load();
  return () => {
    cancelled = true;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [token]);
```

### 6. Remove Client-Side Filtering Logic
**REMOVE:**
```typescript
// Filter items
let filteredItems = items;

if (searchQuery.trim()) {
  filteredItems = filteredItems.filter(...)
}

if (selectedCategory) {
  filteredItems = filteredItems.filter(...)
}
```

**REPLACE WITH:**
```typescript
// Sort items (filtering is now done server-side via FilterBuilder)
const sortedItems = [...items].sort((a, b) => {
  // ... sort logic
});
```

### 7. Update UI - Replace Old Filter Components
**REMOVE:**
- Search input
- Category dropdown
- Custom filter buttons

**ADD:**
```tsx
<div className="flex flex-wrap items-center gap-3 justify-between">
  <div className="flex flex-wrap items-center gap-3">
    {/* New FilterBuilder Component */}
    <FilterBuilder
      entity="[entity]"
      config={[ENTITY]_FILTER_FIELDS}
      onApply={handleApplyFilters}
      categories={categories}  // Optional, if needed
    />

    {/* Keep Sort Dropdown */}
    <div className="relative">
      {/* ... existing sort dropdown */}
    </div>
  </div>

  {/* Keep View Toggle */}
  <div className="flex gap-2">
    {/* ... existing view toggle buttons */}
  </div>
</div>
```

### 8. Update Empty State Message
```tsx
<p className="text-sm text-gray-500">
  Belum ada [entity] yang ditambahkan atau coba ubah filter
</p>
```

### 9. Remove Unused Imports
Remove:
- `FaFilter` (if not used elsewhere)
- `FaFire` (if not used elsewhere)

## Migration Checklist Per File

- [ ] Add new imports (FilterBuilder, useFilters, config, types)
- [ ] Remove old filter state variables
- [ ] Add loadDataWithFilters function
- [ ] Add useFilters hook
- [ ] Add handleApplyFilters function
- [ ] Update loadAllData to accept filterTriples parameter
- [ ] Add filters to spec in loadAllData
- [ ] Update initial useEffect to use filters
- [ ] Remove client-side filtering logic
- [ ] Replace filter UI with FilterBuilder component
- [ ] Update empty state message
- [ ] Remove unused imports
- [ ] Test TypeScript compilation

## Files to Migrate

1. ✅ ProductList.tsx - COMPLETED
   - ✅ Server-side filtering via FilterBuilder
   - ✅ Client-side quick filters (search bar + Hot Deals button) retained
   - ✅ Improved UI with gradient styling
   - ✅ Base64 URL encoding for shareable filters
   - ✅ Fixed "disabled" field → "Status" with clear Enabled/Disabled options
2. ⏳ ItemList.tsx
3. ⏳ VariantList.tsx
4. ⏳ UserList.tsx
5. ⏳ CategoryList.tsx
6. ⏳ BranchList.tsx
7. ⏳ WishlistList.tsx

## Key Improvements in ProductList

### Hybrid Filtering Approach

**Server-side (Advanced)**: FilterBuilder for complex multi-field filtering
**Client-side (Quick)**: Search bar and Hot Deals toggle for instant results

### UI Enhancements

- **FilterBuilder Button**: Gradient blue when active, white when inactive
- **Badge Counter**: Shows active filter count
- **Hot Deals Button**: Gradient yellow-orange when active
- **Search Bar**: Integrated with modern styling
- **Dropdown Panel**: Gradient header, improved spacing, animations

### Fixed Filter Configurations

- Changed "Disabled" field to "Status" for clarity
- Options: "Enabled" (0) / "Disabled" (1) instead of confusing "Yes/No"
- Removed duplicate "status" field that didn't match API structure

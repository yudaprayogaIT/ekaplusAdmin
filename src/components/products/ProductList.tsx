// src/components/products/ProductList.tsx
/**
 * Product List Component - NEW GENERIC VERSION
 *
 * Example implementation using GenericList with mock data.
 * This demonstrates how easy it is to create a new doctype using the generic system.
 *
 * OLD VERSION: Backed up as ProductListOld.tsx (if needed)
 */

"use client";

import React, { useState, useEffect } from "react";
import { GenericList } from "@/components/doctype/GenericList";
import { productConfig, mockProducts, Product } from "@/config/doctypes/product.config";

/**
 * Product List Component with Mock Data
 *
 * Since we don't have API access, this component uses localStorage for persistence.
 * In real implementation, GenericList would handle API calls automatically.
 */
export default function ProductList() {
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client side (for localStorage access)
  useEffect(() => {
    setIsClient(true);

    // Initialize mock data in localStorage if not exists
    const cacheKey = productConfig.cacheKey || "ekatalog_products_snapshot";
    const cached = localStorage.getItem(cacheKey);

    if (!cached) {
      // First time - save mock data
      localStorage.setItem(cacheKey, JSON.stringify(mockProducts));
      console.log("✅ Initialized mock products data");
    }
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            i
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-1">🎯 Demo Mode - Reusable Generic Components</h3>
            <p className="text-sm text-blue-700 mb-2">
              This Products module was created with <strong>ZERO custom components</strong> - just configuration!
              All CRUD operations are simulated using localStorage (mock API).
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-blue-600">
              <div>✅ Login: <code className="bg-blue-100 px-1 rounded">admin / admin123</code></div>
              <div>✅ Full CRUD operations</div>
              <div>✅ Search, Filter, Sort</div>
              <div>✅ Real-time stats calculation</div>
              <div>✅ Grid & List view modes</div>
              <div>✅ Grouped by category</div>
              <div>✅ Image upload (preview only)</div>
              <div>✅ Form validation</div>
            </div>
            <div className="mt-3 p-2 bg-blue-100 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-1">📝 How to create a new doctype like this:</p>
              <ol className="text-xs text-blue-700 space-y-0.5 ml-4 list-decimal">
                <li>Create config file (e.g., <code>product.config.ts</code>) - ~200 lines</li>
                <li>Define fields, filters, stats, permissions</li>
                <li>Use <code>&lt;GenericList config=&#123;productConfig&#125; /&gt;</code></li>
                <li>Done! Full CRUD interface ready in minutes</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Generic List Component - That's it! */}
      <GenericList config={productConfig} />
    </div>
  );
}

// src/components/doctype/GenericStats.tsx
/**
 * Generic Stats Cards Component
 *
 * Renders statistics cards based on StatCardConfig from DocTypeConfig.
 * Displays metrics, counts, and other aggregate data.
 */

import React from "react";
import type { DocTypeConfig, ColorScheme } from "@/lib/doctype/types";

export interface GenericStatsProps<T extends Record<string, unknown>> {
  /** DocType configuration */
  config: DocTypeConfig<T>;

  /** Array of items for calculations */
  items: T[];
}

// Color scheme mapping
const colorSchemes: Record<ColorScheme, { bg: string; border: string; text: string; value: string }> = {
  blue: { bg: "from-blue-50 to-blue-100", border: "border-blue-200", text: "text-blue-700", value: "text-blue-900" },
  green: { bg: "from-green-50 to-green-100", border: "border-green-200", text: "text-green-700", value: "text-green-900" },
  purple: { bg: "from-purple-50 to-purple-100", border: "border-purple-200", text: "text-purple-700", value: "text-purple-900" },
  orange: { bg: "from-orange-50 to-orange-100", border: "border-orange-200", text: "text-orange-700", value: "text-orange-900" },
  red: { bg: "from-red-50 to-red-100", border: "border-red-200", text: "text-red-700", value: "text-red-900" },
  pink: { bg: "from-pink-50 to-pink-100", border: "border-pink-200", text: "text-pink-700", value: "text-pink-900" },
  gray: { bg: "from-gray-50 to-gray-100", border: "border-gray-200", text: "text-gray-700", value: "text-gray-900" },
  yellow: { bg: "from-yellow-50 to-yellow-100", border: "border-yellow-200", text: "text-yellow-700", value: "text-yellow-900" },
};

/**
 * Generic Stats Cards Component
 */
export function GenericStats<T extends Record<string, unknown>>({
  config,
  items,
}: GenericStatsProps<T>) {
  if (!config.stats || config.stats.length === 0 || config.showStats === false) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {config.stats.map((stat, index) => {
        const scheme = colorSchemes[stat.colorScheme || "blue"];
        const value = stat.value(items);
        const displayValue = stat.format ? stat.format(value) : String(value);

        const Icon = stat.icon;

        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${scheme.bg} rounded-xl p-5 border-2 ${scheme.border}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className={`text-sm ${scheme.text} font-medium mb-1`}>
                  {stat.label}
                </div>
                <div className={`text-3xl font-bold ${scheme.value}`}>
                  {displayValue}
                </div>
                {stat.description && (
                  <div className={`text-xs ${scheme.text} mt-1 opacity-80`}>
                    {stat.description}
                  </div>
                )}
              </div>
              {Icon && (
                <Icon className={`w-8 h-8 ${scheme.text} opacity-40`} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { Tooltip } from "@/components/ui/tooltip";

import * as React from "react";
import { Cell } from "recharts";

export { Cell };

export function ChartContainer({ config, className, children }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // استخراج الألوان من التكوين
  const colors = Object.entries(config).reduce((acc, [key, value]) => {
    acc[`--color-${key}`] = value.color;
    return acc;
  }, {});

  return (
    <div
      className={className}
      style={{
        ...colors,
      }}
    >
      {children}
    </div>
  );
}

export function ChartTooltipContent({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        {payload.map((entry) => (
          <div key={entry.name} className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {entry.name}
            </span>
            <span className="font-bold">
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
      </div>
      {label ? (
        <div className="text-xs text-muted-foreground">{label}</div>
      ) : null}
    </div>
  );
}

export function ChartTooltip(props) {
  return <Tooltip {...props} />;
}

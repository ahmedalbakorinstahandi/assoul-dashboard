"use client";

import { cn } from "@/lib/utils";

/**
 * Componente Spinner simple para indicar estados de carga
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.size="md"] - Tamaño del spinner: "sm", "md", "lg"
 * @param {string} [props.color="primary"] - Color del spinner
 * @param {string} [props.className] - Clases adicionales
 * @returns {JSX.Element} Componente Spinner
 */
export function Spinner({
  size = "md",
  color = "primary",
  className,
  ...props
}) {
  // Mapeo de tamaños a clases
  const sizeMap = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  // Mapeo de colores a clases
  const colorMap = {
    primary: "border-primary border-t-transparent",
    secondary: "border-secondary border-t-transparent",
    honey: "border-[#ffac33] border-t-transparent",
    white: "border-white border-t-transparent",
  };

  const sizeClass = sizeMap[size] || sizeMap.md;
  const colorClass = colorMap[color] || colorMap.primary;

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClass,
        colorClass,
        className
      )}
      role="status"
      aria-label="جاري التحميل"
      {...props}
    >
      <span className="sr-only">جاري التحميل</span>
    </div>
  );
}

/**
 * Componente de carga con texto
 */
export function LoadingIndicator({
  text = "جاري التحميل...",
  className,
  ...props
}) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    >
      <Spinner />
      <span>{text}</span>
    </div>
  );
}

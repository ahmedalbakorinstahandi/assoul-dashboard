"use client"

import React from "react"
import { ThemeProvider } from "../components/theme-provider"

// import { ThemeProvider } from "@/components/ui/theme-provider"

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  )
}


"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [theme] = useState<Theme>(() => {
    // Always use dark theme as default
    return "dark"
  })

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    console.log("Applying dark theme to document")
    const root = window.document.documentElement

    // Always apply dark theme
    root.classList.remove("light", "dark")
    root.classList.add("dark")

    // Also update the data-theme attribute for better CSS targeting
    root.setAttribute("data-theme", "dark")

    console.log("Dark theme applied:", root.classList.contains("dark"))
  }, [theme])

  const value = {
    theme,
    setTheme: () => {
      // Do nothing - theme is fixed to dark
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Durante o build estático, useSession pode retornar undefined
  // Vamos verificar se estamos no lado do cliente
  const isClient = typeof window !== "undefined"

  useEffect(() => {
    if (!isClient) return // Não executar no servidor

    if (status === "loading") return // Ainda carregando

    if (!session || session.user.role !== "admin") {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router, isClient])

  // Se não estamos no cliente ou se a sessão está carregando, mostrar loading
  if (!isClient || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Se não há sessão ou o usuário não é admin, não renderizar nada
  if (!session || session.user.role !== "admin") {
    return null
  }

  return <>{children}</>
}

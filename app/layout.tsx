import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { CSRFProvider } from "@/components/providers/csrf-provider"
import "./globals.css"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Stoix - Sistema de Gerenciamento de Tarefas",
  description: "Sistema profissional para gerenciar tarefas com autenticação e proteção CSRF",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <CSRFProvider>
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
              </div>
            }
          >
            {children}
          </Suspense>
        </CSRFProvider>
      </body>
    </html>
  )
}

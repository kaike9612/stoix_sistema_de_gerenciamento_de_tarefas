"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { LoginFormSimple } from "@/components/auth/login-form-simple"
import { TaskListSimple } from "@/components/tasks/task-list-simple"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Database } from "@/lib/database"
import { useState } from "react"

export default function HomePage() {
  const { user, loading, logout } = useAuth()
  const [darkMode, setDarkMode] = useState(false)

  // Initialize sample data on first load
  useEffect(() => {
    Database.initializeSampleData()

    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark)

    setDarkMode(shouldUseDark)
    document.documentElement.classList.toggle("dark", shouldUseDark)
  }, [])

  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    document.documentElement.classList.toggle("dark", newDarkMode)
    localStorage.setItem("theme", newDarkMode ? "dark" : "light")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in-up">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg">Carregando sistema...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-6 right-6">
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {darkMode ? "☀️" : "🌙"}
          </Button>
        </div>

        <div className="w-full max-w-md p-8 relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <Logo size="lg" className="justify-center mb-6" />
            <h1 className="text-4xl font-light mb-4 text-balance">
              Sistema de Gerenciamento
              <span className="block font-medium">de Tarefas</span>
            </h1>
            <p className="text-muted-foreground text-lg">Organize suas tarefas com elegância e eficiência</p>
          </div>
          <div className="animate-slide-in-right">
            <LoginFormSimple />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="md" />
              <div className="h-6 w-px bg-border"></div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">👤</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {darkMode ? "☀️" : "🌙"}
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                🚪 Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="animate-fade-in-up">
          <TaskListSimple />
        </div>
      </main>
    </div>
  )
}

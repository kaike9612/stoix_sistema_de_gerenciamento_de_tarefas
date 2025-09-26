"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginFormSimple({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("admin@stoix.com")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const { login, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos")
      return
    }

    try {
      const result = await login(email.trim(), password)

      if (result.success) {
        onSuccess?.()
      } else {
        setError(result.error || "Falha no login. Verifique suas credenciais.")
      }
    } catch (error) {
      setError("Erro interno. Tente novamente.")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border shadow-lg">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-light">Bem-vindo de volta</CardTitle>
        <CardDescription className="text-base">Entre com suas credenciais para acessar o sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription>⚠️ {error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              📧 Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              🔒 Senha
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Sua senha"
              className="h-11"
            />
          </div>

          <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
            {loading ? "Entrando..." : "Entrar no sistema"}
          </Button>

          <div className="text-center space-y-2 pt-4 border-t">
            <p className="text-sm text-muted-foreground font-medium">Credenciais de demonstração</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>Admin:</strong> admin@stoix.com / admin123
              </p>
              <p>
                <strong>Demo:</strong> demo@example.com / qualquer senha
              </p>
              <p>
                <strong>Teste:</strong> test@example.com / qualquer senha
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

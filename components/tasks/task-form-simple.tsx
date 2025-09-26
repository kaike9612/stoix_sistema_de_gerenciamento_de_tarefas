"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Task } from "@/lib/types"

interface TaskFormProps {
  task?: Task
  onSubmit: (data: {
    title: string
    description: string
    status: "pending" | "in-progress" | "completed"
    priority: "low" | "medium" | "high"
  }) => Promise<{ success: boolean; error?: string }>
  onCancel: () => void
}

export function TaskFormSimple({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">(task?.status || "pending")
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task?.priority || "medium")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("O título é obrigatório")
      return
    }

    if (!description.trim()) {
      setError("A descrição é obrigatória")
      return
    }

    setLoading(true)
    try {
      const result = await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
      })

      if (!result.success) {
        setError(result.error || "Erro ao salvar tarefa")
      }
    } catch (error) {
      setError("Erro interno. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-light">{task ? "✏️ Editar Tarefa" : "➕ Nova Tarefa"}</CardTitle>
          <CardDescription>
            {task ? "Atualize as informações da tarefa" : "Preencha os dados para criar uma nova tarefa"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription>⚠️ {error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                📝 Título da Tarefa
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título da tarefa..."
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                📄 Descrição
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva os detalhes da tarefa..."
                className="min-h-24 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">📊 Status</Label>
                <Select
                  value={status}
                  onValueChange={(value: "pending" | "in-progress" | "completed") => setStatus(value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">⏳ Pendente</SelectItem>
                    <SelectItem value="in-progress">🔄 Em Progresso</SelectItem>
                    <SelectItem value="completed">✅ Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">🎯 Prioridade</Label>
                <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🔵 Baixa</SelectItem>
                    <SelectItem value="medium">🟡 Média</SelectItem>
                    <SelectItem value="high">🔴 Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="submit" className="flex-1 h-11" disabled={loading}>
                {loading ? "💾 Salvando..." : task ? "💾 Atualizar Tarefa" : "➕ Criar Tarefa"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 h-11 bg-transparent"
                disabled={loading}
              >
                ❌ Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

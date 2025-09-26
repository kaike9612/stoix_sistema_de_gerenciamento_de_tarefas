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
  onSubmit: (taskData: {
    title: string
    description: string
    status: "pending" | "in-progress" | "completed"
    priority: "low" | "medium" | "high"
  }) => Promise<{ success: boolean; error?: string }>
  onCancel?: () => void
  loading?: boolean
}

export function TaskForm({ task, onSubmit, onCancel, loading }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [status, setStatus] = useState<"pending" | "in-progress" | "completed">(task?.status || "pending")
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task?.priority || "medium")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim() || !description.trim()) {
      setError("Título e descrição são obrigatórios")
      return
    }

    const result = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
    })

    if (!result.success) {
      setError(result.error || "Erro ao salvar tarefa")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{task ? "Editar Tarefa" : "Nova Tarefa"}</CardTitle>
        <CardDescription>
          {task ? "Atualize as informações da tarefa" : "Preencha os dados para criar uma nova tarefa"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a tarefa em detalhes"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: "pending" | "in-progress" | "completed") => setStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in-progress">Em Progresso</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : task ? "Atualizar" : "Criar Tarefa"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

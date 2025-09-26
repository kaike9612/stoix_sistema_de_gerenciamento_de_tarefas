"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Task } from "@/lib/types"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>
  onStatusChange: (
    id: string,
    status: "pending" | "in-progress" | "completed",
  ) => Promise<{ success: boolean; error?: string }>
}

export function TaskCardSimple({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const statusConfig = {
    pending: { label: "Pendente", color: "bg-amber-100 text-amber-800", emoji: "⏳" },
    "in-progress": { label: "Em Progresso", color: "bg-blue-100 text-blue-800", emoji: "🔄" },
    completed: { label: "Concluída", color: "bg-emerald-100 text-emerald-800", emoji: "✅" },
  }

  const priorityConfig = {
    low: { label: "Baixa", color: "bg-gray-100 text-gray-800", emoji: "🔵" },
    medium: { label: "Média", color: "bg-yellow-100 text-yellow-800", emoji: "🟡" },
    high: { label: "Alta", color: "bg-red-100 text-red-800", emoji: "🔴" },
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return

    setIsDeleting(true)
    try {
      await onDelete(task.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async (newStatus: "pending" | "in-progress" | "completed") => {
    if (newStatus === task.status) return

    setIsUpdatingStatus(true)
    try {
      await onStatusChange(task.id, newStatus)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return (
    <Card className="border shadow-sm hover:shadow-md transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {task.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className={statusConfig[task.status].color}>
                {statusConfig[task.status].emoji} {statusConfig[task.status].label}
              </Badge>
              <Badge variant="outline" className={priorityConfig[task.priority].color}>
                {priorityConfig[task.priority].emoji} {priorityConfig[task.priority].label}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-lg">⋮</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(task)} className="cursor-pointer">
                ✏️ Editar tarefa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="cursor-pointer text-red-600">
                {isDeleting ? "🔄 Excluindo..." : "🗑️ Excluir tarefa"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{task.description}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>📅 Criado: {new Date(task.createdAt).toLocaleDateString("pt-BR")}</span>
            {task.updatedAt !== task.createdAt && (
              <span>🔄 Atualizado: {new Date(task.updatedAt).toLocaleDateString("pt-BR")}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Alterar Status:</label>
            <Select value={task.status} onValueChange={handleStatusChange} disabled={isUpdatingStatus}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">⏳ Pendente</SelectItem>
                <SelectItem value="in-progress">🔄 Em Progresso</SelectItem>
                <SelectItem value="completed">✅ Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Edit, Trash2, Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react"
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

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    await onDelete(task.id)
    setLoading(false)
    setShowDeleteDialog(false)
  }

  const handleStatusChange = async (newStatus: "pending" | "in-progress" | "completed") => {
    if (newStatus === task.status) return

    setLoading(true)
    await onStatusChange(task.id, newStatus)
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800"
      default:
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800"
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluída"
      case "in-progress":
        return "Em Progresso"
      default:
        return "Pendente"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      default:
        return "Baixa"
    }
  }

  return (
    <>
      <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all duration-200 group">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-3 flex-1 min-w-0">
              <CardTitle className="text-lg font-medium leading-tight text-balance group-hover:text-primary transition-colors">
                {task.title}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className={`${getStatusColor(task.status)} border`}>
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(task.status)}
                    <span className="text-xs font-medium">{getStatusLabel(task.status)}</span>
                  </div>
                </Badge>
                <Badge variant="outline" className={`${getPriorityColor(task.priority)} border`}>
                  <span className="text-xs font-medium">{getPriorityLabel(task.priority)}</span>
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={loading}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar tarefa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("pending")} disabled={task.status === "pending"}>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Marcar como Pendente
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("in-progress")}
                  disabled={task.status === "in-progress"}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Marcar como Em Progresso
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("completed")}
                  disabled={task.status === "completed"}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Marcar como Concluída
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir tarefa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-sm leading-relaxed text-muted-foreground mb-4">
            {task.description}
          </CardDescription>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Criada em {new Date(task.createdAt).toLocaleDateString("pt-BR")}</span>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a tarefa <strong>"{task.title}"</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Excluindo..." : "Excluir tarefa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

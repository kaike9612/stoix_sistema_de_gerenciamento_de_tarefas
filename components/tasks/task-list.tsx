"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Filter, BarChart3, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { TaskCard } from "./task-card"
import { TaskForm } from "./task-form"
import { useTasks } from "@/hooks/use-tasks"
import type { Task } from "@/lib/types"

export function TaskList() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Group tasks by status
  const tasksByStatus = {
    pending: filteredTasks.filter((task) => task.status === "pending"),
    "in-progress": filteredTasks.filter((task) => task.status === "in-progress"),
    completed: filteredTasks.filter((task) => task.status === "completed"),
  }

  const handleCreateTask = async (taskData: {
    title: string
    description: string
    status: "pending" | "in-progress" | "completed"
    priority: "low" | "medium" | "high"
  }) => {
    const result = await createTask(taskData)
    if (result.success) {
      setShowForm(false)
    }
    return result
  }

  const handleUpdateTask = async (taskData: {
    title: string
    description: string
    status: "pending" | "in-progress" | "completed"
    priority: "low" | "medium" | "high"
  }) => {
    if (!editingTask) return { success: false, error: "No task selected" }

    const result = await updateTask(editingTask.id, taskData)
    if (result.success) {
      setEditingTask(null)
    }
    return result
  }

  const handleStatusChange = async (id: string, status: "pending" | "in-progress" | "completed") => {
    return await updateTask(id, { status })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center animate-fade-in-up">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg">Carregando tarefas...</p>
        </div>
      </div>
    )
  }

  if (showForm || editingTask) {
    return (
      <TaskForm
        task={editingTask || undefined}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        onCancel={() => {
          setShowForm(false)
          setEditingTask(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-light tracking-tight text-balance">
            Gerenciamento de
            <span className="block font-medium">Tarefas</span>
          </h1>
          <p className="text-muted-foreground text-lg">Organize e acompanhe suas tarefas com elegância e eficiência</p>
        </div>
        <Button size="lg" onClick={() => setShowForm(true)} className="shadow-sm">
          <Plus className="h-5 w-5 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Pendentes</p>
                <p className="text-3xl font-light tracking-tight">{tasksByStatus.pending.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Em Progresso</p>
                <p className="text-3xl font-light tracking-tight">{tasksByStatus["in-progress"].length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Concluídas</p>
                <p className="text-3xl font-light tracking-tight">{tasksByStatus.completed.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 h-11">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in-progress">Em Progresso</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-48 h-11">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as prioridades</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredTasks.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-16 text-center">
            <div className="text-muted-foreground space-y-4 animate-fade-in-up">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                <Filter className="h-8 w-8 opacity-50" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Nenhuma tarefa encontrada</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {tasks.length === 0
                    ? "Comece criando sua primeira tarefa e organize seu trabalho de forma eficiente."
                    : "Tente ajustar os filtros ou criar uma nova tarefa para começar."}
                </p>
              </div>
              {tasks.length === 0 && (
                <Button onClick={() => setShowForm(true)} className="mt-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira tarefa
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task, index) => (
            <div key={task.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <TaskCard task={task} onEdit={setEditingTask} onDelete={deleteTask} onStatusChange={handleStatusChange} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

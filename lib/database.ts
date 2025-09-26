import type { Task, User } from "./types"
import { LocalStorage } from "./storage"

// Mock database using localStorage
export class Database {
  private static TASKS_KEY = "tasks"
  private static USERS_KEY = "users"

  // Task operations
  static getTasks(userId?: string): Task[] {
    const tasks = LocalStorage.get<Task[]>(this.TASKS_KEY) || []
    return userId ? tasks.filter((task) => task.userId === userId) : tasks
  }

  static getTaskById(id: string): Task | null {
    const tasks = this.getTasks()
    return tasks.find((task) => task.id === id) || null
  }

  static createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Task {
    const tasks = this.getTasks()
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    tasks.push(newTask)
    LocalStorage.set(this.TASKS_KEY, tasks)
    return newTask
  }

  static updateTask(id: string, updates: Partial<Omit<Task, "id" | "createdAt">>): Task | null {
    const tasks = this.getTasks()
    const taskIndex = tasks.findIndex((task) => task.id === id)

    if (taskIndex === -1) return null

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    LocalStorage.set(this.TASKS_KEY, tasks)
    return tasks[taskIndex]
  }

  static deleteTask(id: string): boolean {
    const tasks = this.getTasks()
    const filteredTasks = tasks.filter((task) => task.id !== id)

    if (filteredTasks.length === tasks.length) return false

    LocalStorage.set(this.TASKS_KEY, filteredTasks)
    return true
  }

  // User operations
  static getUsers(): User[] {
    return LocalStorage.get<User[]>(this.USERS_KEY) || []
  }

  static getUserById(id: string): User | null {
    const users = this.getUsers()
    return users.find((user) => user.id === id) || null
  }

  static getUserByEmail(email: string): User | null {
    const users = this.getUsers()
    return users.find((user) => user.email === email) || null
  }

  static createUser(userData: Omit<User, "id" | "createdAt">): User {
    const users = this.getUsers()
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    LocalStorage.set(this.USERS_KEY, users)
    return newUser
  }

  // Utility methods
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Initialize with sample data
  static initializeSampleData(): void {
    const existingTasks = this.getTasks()
    const existingUsers = this.getUsers()

    if (existingUsers.length === 0) {
      const demoUser = this.createUser({
        email: "demo@example.com",
        name: "Demo User",
      })

      const testUser = this.createUser({
        email: "test@example.com",
        name: "Test User",
      })

      const adminUser = this.createUser({
        email: "admin@taskmanager.com",
        name: "Admin User",
      })

      if (existingTasks.length === 0) {
        // Tasks for demo user
        this.createTask({
          title: "Configurar projeto",
          description: "Configurar o ambiente de desenvolvimento do projeto",
          status: "completed",
          priority: "high",
          userId: demoUser.id,
        })

        this.createTask({
          title: "Implementar autenticação",
          description: "Desenvolver sistema de login com CSRF tokens",
          status: "in-progress",
          priority: "high",
          userId: demoUser.id,
        })

        this.createTask({
          title: "Criar interface de usuário",
          description: "Desenvolver componentes React para gerenciar tarefas",
          status: "pending",
          priority: "medium",
          userId: demoUser.id,
        })

        this.createTask({
          title: "Revisar documentação",
          description: "Revisar e atualizar a documentação do projeto",
          status: "pending",
          priority: "low",
          userId: testUser.id,
        })

        this.createTask({
          title: "Testes unitários",
          description: "Implementar testes unitários para as APIs",
          status: "in-progress",
          priority: "high",
          userId: testUser.id,
        })

        this.createTask({
          title: "Deploy em produção",
          description: "Configurar e realizar deploy do sistema em produção",
          status: "pending",
          priority: "high",
          userId: adminUser.id,
        })
      }
    }
  }
}

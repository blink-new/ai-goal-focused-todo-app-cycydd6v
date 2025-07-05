import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { blink } from './blink/client'
import { GoalsList } from './components/GoalsList'
import { TodosList } from './components/TodosList'
import { AddGoalDialog } from './components/AddGoalDialog'
import { AddTodoDialog } from './components/AddTodoDialog'
import { ViewToggle } from './components/ViewToggle'
import { Header } from './components/Header'
import { Target, CheckCircle2, Sparkles } from 'lucide-react'
import { toast } from 'react-hot-toast'

export type Goal = {
  id: string
  user_id: string
  title: string
  description: string
  color: string
  created_at: string
  updated_at: string
}

export type Todo = {
  id: string
  user_id: string
  title: string
  description: string
  goal_id: string | null
  priority: number
  completed: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export type ViewMode = 'all' | 'goals' | 'today'

function App() {
  const [user, setUser] = useState<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [goals, setGoals] = useState<Goal[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('all')
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (state.user) {
        loadData()
      } else {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  const loadData = async () => {
    try {
      const [goalsData, todosData] = await Promise.all([
        blink.db.goals.list({ where: { user_id: user?.id || '' } }),
        blink.db.todos.list({ where: { user_id: user?.id || '' }, orderBy: { order_index: 'asc' } })
      ])
      setGoals(goalsData)
      setTodos(todosData)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const addGoal = async (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newGoal = await blink.db.goals.create({
        ...goalData,
        user_id: user.id
      })
      setGoals(prev => [...prev, newGoal])
      toast.success('Goal created successfully!')
    } catch {
      toast.error('Failed to create goal')
    }
  }

  const addTodo = async (todoData: Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      // Use AI to match the todo to a goal if not specified
      let goalId = todoData.goal_id
      
      if (!goalId && goals.length > 0) {
        const goalsContext = goals.map(g => `${g.title}: ${g.description}`).join('\n')
        const prompt = `Given these goals:\n${goalsContext}\n\nWhich goal does this task best match: "${todoData.title}"?\n\nRespond with just the goal title, or "none" if no match.`
        
        try {
          const { text } = await blink.ai.generateText({ prompt })
          const matchedGoal = goals.find(g => 
            text.toLowerCase().includes(g.title.toLowerCase()) || 
            g.title.toLowerCase().includes(text.toLowerCase())
          )
          if (matchedGoal) {
            goalId = matchedGoal.id
            toast.success(`🎯 AI matched this task to "${matchedGoal.title}"`)
          }
        } catch {
          console.log('AI matching failed, proceeding without goal assignment')
        }
      }

      const newTodo = await blink.db.todos.create({
        ...todoData,
        goal_id: goalId,
        user_id: user.id,
        order_index: todos.length
      })
      setTodos(prev => [...prev, newTodo])
      toast.success('Task added successfully!')
    } catch {
      toast.error('Failed to add task')
    }
  }

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id)
      if (!todo) return

      await blink.db.todos.update(id, { completed: !todo.completed })
      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ))
      
      if (!todo.completed) {
        toast.success('🎉 Task completed!')
      }
    } catch {
      toast.error('Failed to update task')
    }
  }

  const updateTodoGoal = async (todoId: string, goalId: string | null) => {
    try {
      await blink.db.todos.update(todoId, { goal_id: goalId })
      setTodos(prev => prev.map(t => 
        t.id === todoId ? { ...t, goal_id: goalId } : t
      ))
      toast.success('Task goal updated!')
    } catch {
      toast.error('Failed to update task goal')
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      await blink.db.goals.delete(id)
      setGoals(prev => prev.filter(g => g.id !== id))
      toast.success('Goal deleted')
    } catch {
      toast.error('Failed to delete goal')
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      await blink.db.todos.delete(id)
      setTodos(prev => prev.filter(t => t.id !== id))
      toast.success('Task deleted')
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const getFilteredTodos = () => {
    if (viewMode === 'goals' && selectedGoal) {
      return todos.filter(t => t.goal_id === selectedGoal)
    }
    return todos
  }

  const getCompletedCount = () => {
    return todos.filter(t => t.completed).length
  }

  const getTotalCount = () => {
    return todos.length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your goals...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="bg-white p-6 rounded-full w-24 h-24 mx-auto mb-6 shadow-lg">
              <Target className="w-12 h-12 text-indigo-600 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Goal Focus</h1>
            <p className="text-gray-600">AI-powered goal-focused productivity</p>
          </div>
          <p className="text-gray-500">Please sign in to continue</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Header 
          user={user} 
          completedCount={getCompletedCount()} 
          totalCount={getTotalCount()} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  Goals
                </h2>
                <AddGoalDialog onAddGoal={addGoal} />
              </div>
              
              <GoalsList 
                goals={goals}
                selectedGoal={selectedGoal}
                onSelectGoal={setSelectedGoal}
                onDeleteGoal={deleteGoal}
                todos={todos}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Tasks
                  </h2>
                  <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
                </div>
                <AddTodoDialog onAddTodo={addTodo} goals={goals} />
              </div>

              <TodosList 
                todos={getFilteredTodos()}
                goals={goals}
                onToggleTodo={toggleTodo}
                onUpdateTodoGoal={updateTodoGoal}
                onDeleteTodo={deleteTodo}
              />

              {getFilteredTodos().length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {viewMode === 'goals' && selectedGoal ? 'No tasks for this goal' : 'No tasks yet'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {viewMode === 'goals' && selectedGoal 
                      ? 'Add your first task to get started with this goal' 
                      : 'Add your first task and let AI help organize it'
                    }
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
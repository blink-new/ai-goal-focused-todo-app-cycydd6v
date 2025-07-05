import { motion } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Target, Clock, CheckCircle2 } from 'lucide-react'
import { Goal, Todo } from '../App'

interface TodosListProps {
  todos: Todo[]
  goals: Goal[]
  onToggleTodo: (todoId: string) => void
  onUpdateTodoGoal: (todoId: string, goalId: string | null) => void
  onDeleteTodo: (todoId: string) => void
}

export function TodosList({ todos, goals, onToggleTodo, onUpdateTodoGoal, onDeleteTodo }: TodosListProps) {
  const getGoalById = (goalId: string | null) => {
    return goals.find(g => g.id === goalId)
  }

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    return b.order_index - a.order_index
  })

  return (
    <div className="space-y-3">
      {sortedTodos.map((todo, index) => {
        const goal = getGoalById(todo.goal_id)
        
        return (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group relative rounded-lg border-2 transition-all duration-200 ${
              todo.completed 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => onToggleTodo(todo.id)}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-medium ${
                      todo.completed 
                        ? 'text-green-700 line-through' 
                        : 'text-gray-800'
                    }`}>
                      {todo.title}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      onClick={() => onDeleteTodo(todo.id)}
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                  
                  {todo.description && (
                    <p className={`text-sm mb-3 ${
                      todo.completed ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {todo.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      {goal ? (
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ 
                            borderColor: goal.color,
                            color: goal.color
                          }}
                        >
                          <Target className="w-3 h-3 mr-1" />
                          {goal.title}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          No goal
                        </Badge>
                      )}
                      
                      {todo.completed && (
                        <Badge variant="outline" className="text-xs text-green-600">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    
                    {!todo.completed && (
                      <Select
                        value={todo.goal_id || "none"}
                        onValueChange={(value) => 
                          onUpdateTodoGoal(todo.id, value === "none" ? null : value)
                        }
                      >
                        <SelectTrigger className="w-32 h-6 text-xs">
                          <SelectValue placeholder="Set goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No goal</SelectItem>
                          {goals.map(goal => (
                            <SelectItem key={goal.id} value={goal.id}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: goal.color }}
                                />
                                {goal.title}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
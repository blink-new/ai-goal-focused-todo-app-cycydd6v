import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, Target } from 'lucide-react'
import { Goal, Todo } from '../App'

interface GoalsListProps {
  goals: Goal[]
  selectedGoal: string | null
  onSelectGoal: (goalId: string | null) => void
  onDeleteGoal: (goalId: string) => void
  todos: Todo[]
}

export function GoalsList({ goals, selectedGoal, onSelectGoal, onDeleteGoal, todos }: GoalsListProps) {
  const getGoalTaskCount = (goalId: string) => {
    return todos.filter(t => t.goal_id === goalId).length
  }

  const getGoalCompletedCount = (goalId: string) => {
    return todos.filter(t => t.goal_id === goalId && t.completed).length
  }

  if (goals.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <Target className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No goals yet</p>
        <p className="text-gray-400 text-xs mt-1">Create your first goal to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Button
        variant={selectedGoal === null ? "default" : "outline"}
        className="w-full justify-start"
        onClick={() => onSelectGoal(null)}
      >
        <Target className="w-4 h-4 mr-2" />
        All Tasks
      </Button>
      
      {goals.map((goal, index) => {
        const taskCount = getGoalTaskCount(goal.id)
        const completedCount = getGoalCompletedCount(goal.id)
        const completionPercentage = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0
        
        return (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group relative rounded-lg border-2 transition-all duration-200 ${
              selectedGoal === goal.id 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => onSelectGoal(goal.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: goal.color }}
                  />
                  <h3 className="font-medium text-gray-800 text-sm">{goal.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteGoal(goal.id)
                  }}
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </Button>
              </div>
              
              {goal.description && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{goal.description}</p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {taskCount} tasks
                  </Badge>
                  {completedCount > 0 && (
                    <Badge variant="outline" className="text-xs text-green-600">
                      {completedCount} done
                    </Badge>
                  )}
                </div>
                
                {taskCount > 0 && (
                  <div className="text-xs text-gray-500">
                    {completionPercentage}%
                  </div>
                )}
              </div>
              
              {taskCount > 0 && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
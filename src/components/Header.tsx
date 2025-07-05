import { motion } from 'framer-motion'
import { Target, TrendingUp } from 'lucide-react'

interface HeaderProps {
  user: any // eslint-disable-line @typescript-eslint/no-explicit-any
  completedCount: number
  totalCount: number
}

export function Header({ user, completedCount, totalCount }: HeaderProps) {
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              Goal Focus
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user.email?.split('@')[0] || 'there'}! Let's achieve your goals today.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{totalCount}</div>
              <div className="text-sm text-gray-500">Total Tasks</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">On Track</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
import { Button } from '@/components/ui/button'
import { List, Target, Calendar } from 'lucide-react'
import { ViewMode } from '../App'

interface ViewToggleProps {
  viewMode: ViewMode
  onViewChange: (mode: ViewMode) => void
}

export function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
      <Button
        variant={viewMode === 'all' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('all')}
        className="gap-2"
      >
        <List className="w-4 h-4" />
        All
      </Button>
      <Button
        variant={viewMode === 'goals' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('goals')}
        className="gap-2"
      >
        <Target className="w-4 h-4" />
        Goals
      </Button>
      <Button
        variant={viewMode === 'today' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('today')}
        className="gap-2"
      >
        <Calendar className="w-4 h-4" />
        Today
      </Button>
    </div>
  )
}
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2, Edit2, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isPast, isToday } from 'date-fns';
import { EditTodoDialog } from './EditTodoDialog';

const priorityConfig = {
  high: { label: 'High', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  medium: { label: 'Medium', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  low: { label: 'Low', className: 'bg-muted text-muted-foreground border-muted' },
};

export function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const isCompleted = todo.completed;
  const priority = priorityConfig[todo.priority];
  const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && !isCompleted;
  const isDueToday = dueDate && isToday(dueDate);

  return (
    <>
      <div className={cn("group flex items-start gap-3 p-4 rounded-lg border bg-card transition-all hover:shadow-md", isCompleted && "opacity-60")}>
        <Checkbox checked={isCompleted} onCheckedChange={() => onToggle(todo.id)} className="mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn("font-medium text-foreground", isCompleted && "line-through text-muted-foreground")}>{todo.title}</h3>
            <Badge variant="outline" className={cn("shrink-0", priority.className)}>
              <Flag className="h-3 w-3 mr-1" />{priority.label}
            </Badge>
          </div>
          {todo.description && (
            <p className={cn("text-sm text-muted-foreground mt-1", isCompleted && "line-through")}>{todo.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2">
            {dueDate && (
              <span className={cn("flex items-center gap-1 text-xs", isOverdue && "text-destructive", isDueToday && !isCompleted && "text-amber-600", !isOverdue && !isDueToday && "text-muted-foreground")}>
                <Calendar className="h-3 w-3" />
                {isOverdue ? 'Overdue: ' : isDueToday ? 'Today: ' : ''}{format(dueDate, 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditOpen(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(todo.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <EditTodoDialog todo={todo} open={isEditOpen} onOpenChange={setIsEditOpen} onSave={(updates) => { onUpdate(todo.id, updates); setIsEditOpen(false); }} />
    </>
  );
}

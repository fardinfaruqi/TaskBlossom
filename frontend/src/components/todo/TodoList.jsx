import { useState, useMemo } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { TodoItem } from './TodoItem';
import { TodoFilters } from './TodoFilters';
import { AddTodoDialog } from './AddTodoDialog';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle2, ListTodo } from 'lucide-react';

export function TodoList() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleStatus } = useTodos();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const status = todo.completed ? 'completed' : 'pending';
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;
      const matchesSearch = !searchQuery || todo.title.toLowerCase().includes(searchQuery.toLowerCase()) || todo.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [todos, statusFilter, priorityFilter, searchQuery]);

  const stats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
  }), [todos]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Tasks</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Your Tasks</h2>
        <Button onClick={() => setIsAddOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Task</Button>
      </div>
      <TodoFilters statusFilter={statusFilter} priorityFilter={priorityFilter} searchQuery={searchQuery} onStatusChange={setStatusFilter} onPriorityChange={setPriorityFilter} onSearchChange={setSearchQuery} />
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12 bg-card border rounded-lg">
            {todos.length === 0 ? (
              <>
                <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No tasks yet</h3>
                <p className="text-muted-foreground mb-4">Create your first task to get started!</p>
                <Button onClick={() => setIsAddOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Your First Task</Button>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No matching tasks</h3>
                <p className="text-muted-foreground">Try adjusting your filters</p>
              </>
            )}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggleStatus} onDelete={deleteTodo} onUpdate={updateTodo} />
          ))
        )}
      </div>
      <AddTodoDialog open={isAddOpen} onOpenChange={setIsAddOpen} onAdd={addTodo} />
    </div>
  );
}

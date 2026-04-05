import { Header } from '@/components/layout/Header';
import { TodoList } from '@/components/todo/TodoList';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <TodoList />
      </main>
    </div>
  );
}

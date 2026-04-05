import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { CheckSquare } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckSquare className="h-10 w-10 text-primary" />
          <span className="text-3xl font-bold text-foreground">TaskBlossom</span>
        </div>
        <p className="text-muted-foreground">Organize your tasks, boost your productivity</p>
      </div>
      {isLogin ? (
        <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
      ) : (
        <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
}

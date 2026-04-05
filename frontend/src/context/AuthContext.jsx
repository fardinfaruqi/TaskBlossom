import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      let message = "Invalid email or password. Please try again.";
      if (error.code === 'auth/user-not-found') {
        message = "No account found with this email.";
      } else if (error.code === 'auth/wrong-password') {
        message = "Invalid password.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Invalid email format.";
      }
      return { success: false, error: message };
    }
  };

  const signup = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Optionally update display name; ignore profile update failures
      try {
        await userCredential.user.updateProfile({ displayName: name });
      } catch (profileError) {
        console.warn('Signup display name update failed:', profileError);
      }
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      let message = "Signup failed. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        message = "An account with this email already exists.";
      } else if (error.code === 'auth/weak-password') {
        message = "Password is too weak. Use at least 6 characters.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Invalid email format.";
      }
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (error) {
      console.error('Google sign-in error:', error);
      let message = "Google sign-in failed. Please try again.";
      if (error.code === 'auth/popup-closed-by-user') {
        message = "Sign-in popup was closed.";
      }
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, signInWithGoogle, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

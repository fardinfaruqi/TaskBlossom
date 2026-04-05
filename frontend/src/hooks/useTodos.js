import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { getIdToken } from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useTodos() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTodos();
    } else {
      setTodos([]);
    }
  }, [user]);

  const getAuthHeaders = async () => {
    const token = await getIdToken(auth.currentUser);
    return { Authorization: `Bearer ${token}` };
  };

  const fetchTodos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/todos`, { headers });
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast({ title: "Error", description: "Failed to load todos.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title, description, priority = 'medium', dueDate) => {
    if (!user) return;
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/todos`, { title, description, priority, dueDate }, { headers });
      setTodos(prev => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({ title: "Error", description: "Failed to add todo.", variant: "destructive" });
    }
  };

  const updateTodo = async (id, updates) => {
    if (!user) return;
    try {
      const headers = await getAuthHeaders();
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`, updates, { headers });
      setTodos(prev => prev.map(todo => todo.id === id ? response.data : todo));
    } catch (error) {
      console.error('Error updating todo:', error);
      toast({ title: "Error", description: "Failed to update todo.", variant: "destructive" });
    }
  };

  const deleteTodo = async (id) => {
    if (!user) return;
    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${API_BASE_URL}/todos/${id}`, { headers });
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({ title: "Error", description: "Failed to delete todo.", variant: "destructive" });
    }
  };

  const toggleStatus = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    await updateTodo(id, { completed: !todo.completed });
  };

  return { todos, loading, addTodo, updateTodo, deleteTodo, toggleStatus, refetch: fetchTodos };
}

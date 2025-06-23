import React, { useState, useEffect } from 'react';
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import '../style/todos.css';

const TodoClient = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingTodo, setDeleteingTodo] = useState(null);
  const [todoForm, setTodoForm] = useState({ title: '', completed: false });

  const API_URL = 'http://localhost:3000/todos';

  useEffect(() => {
    loadTodos();
  }, [currentUserId]);

  const loadTodos = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}?userId=${currentUserId}`);
      if (!response.ok) throw new Error('Failed to fetch todos');

      const data = await response.json();
      setTodos(data);
    } catch (err) {
      setError('Error loading todos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = () => {
    setEditingTodo(null);
    setTodoForm({ title: '', completed: false });
    setShowModal(true);
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setTodoForm({ title: todo.title, completed: todo.completed });
    setShowModal(true);
  };

  const handleDeleteTodo = (todo) => {
    setDeleteingTodo(todo);
    setShowDeleteModal(true);
  };

  const saveTodo = async () => {
    if (!todoForm.title.trim()) {
      setError('Please enter a todo title');
      return;
    }

    try {
      let response;

      if (editingTodo) {
        // Update existing todo
        const updatedTodo = {
          ...editingTodo,
          title: todoForm.title,
          completed: todoForm.completed
        };

        response = await fetch(`${API_URL}/${editingTodo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTodo)
        });

        if (!response.ok) throw new Error('Failed to update todo');

        setTodos(prev =>
          prev.map(t => (t.id === editingTodo.id ? updatedTodo : t))
        );
      } else {
        // Create new todo
        const newTodo = {
          userId: currentUserId,
          title: todoForm.title,
          completed: todoForm.completed
        };

        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTodo)
        });

        if (!response.ok) throw new Error('Failed to create todo');

        const createdTodo = await response.json();
        setTodos(prev => [...prev, createdTodo]);
      }

      setShowModal(false);
      setError('');
    } catch (err) {
      setError('Error saving todo: ' + err.message);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${deletingTodo.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete todo');

      setTodos(prev => prev.filter(t => t.id !== deletingTodo.id));
      setShowDeleteModal(false);
      setError('');
    } catch (err) {
      setError('Error deleting todo: ' + err.message);
    }
  };

  const toggleComplete = async (todo, completed) => {
    try {
      const updatedTodo = { ...todo, completed };

      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo)
      });

      if (!response.ok) throw new Error('Failed to update todo');

      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? updatedTodo : t))
      );
    } catch (err) {
      setError('Error updating todo: ' + err.message);
    }
  };

  const closeError = () => {
    setError('');
  };

  return (
    <div className="todo-container">
      <header className="todo-header">
        <h1>Todo Manager</h1>
        <button onClick={handleAddTodo} className="btn btn-success">
          Add New Todo
        </button>
      </header>

      <main className="todo-main">
        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={closeError} className="error-close">×</button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading todos...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <h3>No todos found</h3>
            <p>Create your first todo to get started!</p>
          </div>
        ) : (
          <div className="todo-grid">
            <div className="grid-body">
              <div className="todo-cards-grid">
                {todos.map(todo => (
                  <div key={todo.id} className={`todo-card ${todo.completed ? 'completed' : ''}`}>
                    <div className="todo-card-info">
                      <label className="todo-checkbox">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={(e) => toggleComplete(todo, e.target.checked)}
                        />
                        <span className="checkmark"></span>
                      </label>
                      <h4 className={todo.completed ? 'completed-task' : ''}>
                        {todo.title}
                      </h4>
                    </div>
                    <div className="todo-card-actions">
                      <button
                        onClick={() => handleEditTodo(todo)}
                        className="btn btn-sm btn-edit"
                      >
                        <MdOutlineEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo)}
                        className="btn btn-sm btn-delete"
                      >
                        <MdOutlineDelete />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals stay unchanged */}
      {showModal && (
        <div className="modal" onClick={(e) => e.target.className === 'modal' && setShowModal(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                value={todoForm.title}
                onChange={(e) => setTodoForm({ ...todoForm, title: e.target.value })}
                placeholder="Enter todo title"
                maxLength="255"
                onKeyPress={(e) => e.key === 'Enter' && saveTodo()}
                autoFocus
              />
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={todoForm.completed}
                  onChange={(e) => setTodoForm({ ...todoForm, completed: e.target.checked })}
                />
                <span>Mark as completed</span>
              </label>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={saveTodo} className="btn btn-primary">
                {editingTodo ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal" onClick={(e) => e.target.className === 'modal' && setShowDeleteModal(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button onClick={() => setShowDeleteModal(false)} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this todo?</p>
              <p><strong>"{deletingTodo?.title}"</strong></p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoClient;

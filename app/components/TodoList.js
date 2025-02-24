'use client';

import { useState, useEffect } from 'react';

export default function TodoList() {
  const [taskList, setTaskList] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  // Load saved tasks when the app starts
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTaskList(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(taskList));
  }, [taskList]);

  // Add a new task to the list
  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskInput.trim()) {
      const newTask = {
        id: Date.now(),
        text: taskInput.trim(),
        completed: false
      };
      setTaskList([...taskList, newTask]);
      setTaskInput('');
    }
  };

  // Toggle task completion status
  const handleToggleTask = (id) => {
    setTaskList(taskList.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Remove a task from the list
  const handleDeleteTask = (id) => {
    setTaskList(taskList.filter(task => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 transition-colors duration-200">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 transition-all duration-200 hover:shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">My Tasks</h1>
        
        <form onSubmit={handleAddTask} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="What do you need to do?"
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white text-gray-800 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!taskInput.trim()}
            >
              Add Task
            </button>
          </div>
        </form>

        <ul className="space-y-2">
          {taskList.map(task => (
            <li
              key={task.id}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg group transition-all duration-200 hover:shadow-sm"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 transition-colors duration-200 cursor-pointer"
              />
              <span
                className={`flex-1 text-gray-700 dark:text-gray-200 transition-all duration-200 ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}
              >
                {task.text}
              </span>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-lg p-2 transition-all duration-200"
                aria-label="Delete task"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))}
        </ul>

        {taskList.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 mt-8 text-lg">
            No tasks yet - time to be productive!
          </p>
        )}
      </div>
    </div>
  );
}
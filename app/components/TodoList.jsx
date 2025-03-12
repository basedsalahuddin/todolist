'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';

export default function TodoList() {
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  const [taskList, setTaskList] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
    // Load saved tasks when the component mounts
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTaskList(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('tasks', JSON.stringify(taskList));
    }
  }, [taskList, isClient]);

  // Add a new task to the list
  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskInput.trim()) {
      const newTask = {
        id: Date.now(),
        text: taskInput.trim(),
        completed: false,
        priority: 'medium', // Default priority
        createdAt: new Date().toISOString()
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

  if (!isClient) {
    return null;
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: task.id });

  const style = {
    transform: transform ? `translateY(${transform.y}px)` : null,
    transition
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 transition-colors duration-200">
      <div className="max-w-lg mx-auto bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-md p-10 transition-all duration-300 hover:shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Tasks</h1>
        
        <form onSubmit={handleAddTask} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="What do you need to do?"
              className="flex-1 px-5 py-4 bg-indigo-50/50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 placeholder-gray-400 transition-all duration-300 shadow-sm hover:shadow-inner"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!taskInput.trim()}
            >
              Add Task
            </button>
          </div>
        </form>

        <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragEnd={({ active, over }) => {
          if (active.id !== over.id) {
            setTaskList(items => {
              const oldIndex = items.findIndex(i => i.id === active.id);
              const newIndex = items.findIndex(i => i.id === over.id);
              return arrayMove(items, oldIndex, newIndex);
            });
          }
          setActiveId(null);
        }}
      >
        <SortableContext items={taskList} strategy={verticalListSortingStrategy}>
          <AnimatePresence initial={false}>
            <ul className="space-y-3">
          {taskList.map(task => (
            <motion.li
                key={task.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-4 p-5 bg-white/90 backdrop-blur-sm rounded-xl group transition-all duration-300 hover:shadow-md ${activeId === task.id ? 'shadow-lg scale-[1.02] ring-1 ring-indigo-100' : ''}`}
              >
                <button
                  {...attributes}
                  {...listeners}
                  className="mr-2 p-2 hover:bg-gray-100 rounded-full cursor-grab active:cursor-grabbing"
                  ref={setNodeRef}
                  style={style}
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id)}
                className="w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-gray-700 transition-all duration-200 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.text}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${{
                    high: 'bg-red-100 text-red-800',
                    medium: 'bg-yellow-100 text-yellow-800',
                    low: 'bg-green-100 text-green-800'
                  }[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-lg p-2 transition-opacity duration-300"
                aria-label="Delete task"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </motion.li>
          ))}
        </ul>
          </AnimatePresence>
        </SortableContext>
      </DndContext>

        {taskList.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 text-gray-400/90 mt-8 text-xl"
          >
            <svg className="w-16 h-16 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>All caught up! Ready for new tasks</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
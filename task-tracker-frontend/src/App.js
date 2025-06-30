import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getISOWeek, format } from 'date-fns';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterWeek, setFilterWeek] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Inputs
  const [newTask, setNewTask] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [goalWeek, setGoalWeek] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Editing
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedAssignedTo, setEditedAssignedTo] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedEstimatedTime, setEditedEstimatedTime] = useState('');
  const [editedGoalWeek, setEditedGoalWeek] = useState('');

  // Helper: safely convert date to ISO week string
  function getISOWeekString(date) {
    if (!date) return null;
    const week = getISOWeek(date);
    const year = date.getFullYear();
    return `${year}-W${String(week).padStart(2, '0')}`;
  }

  // Helper: get date range for visual display
  function getWeekDateRange(date) {
    if (!date) return '';
    const day = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((day + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return `${format(monday, 'MMM d')} – ${format(sunday, 'MMM d')}`;
  }

  // Determine active week (calendar or typed)
  const activeWeek = filterWeek || (selectedDate ? getISOWeekString(selectedDate) : null);

  const fetchTasks = () => {
    fetch('http://localhost:5000/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching tasks:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    if (!newTask.trim()) return;

    fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTask,
        assignedTo,
        description,
        estimatedTime,
        goalWeek
      }),
    })
      .then(res => res.json())
      .then(() => {
        setNewTask('');
        setAssignedTo('');
        setDescription('');
        setEstimatedTime('');
        setGoalWeek('');
        fetchTasks();
        setShowAddForm(false);  
      })
      .catch(err => console.error('Error adding task:', err));
  };

  const handleToggle = (id) => {
    fetch(`http://localhost:5000/tasks/${id}/toggle`, {
      method: 'PUT',
    })
      .then(res => res.json())
      .then(updatedTask => {
        setTasks(prev =>
          prev.map(task =>
            task._id === id ? { ...task, isCompleted: updatedTask.isCompleted } : task
          )
        );
      })
      .catch(err => console.error('Error toggling task:', err));
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
    setEditedAssignedTo(task.assignedTo || '');
    setEditedDescription(task.description || '');
    setEditedEstimatedTime(task.estimatedTime || '');
    setEditedGoalWeek(task.goalWeek || '');
  };

  const handleSave = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editedTitle,
        assignedTo: editedAssignedTo,
        description: editedDescription,
        estimatedTime: editedEstimatedTime,
        goalWeek: editedGoalWeek,
      }),
    })
      .then(res => res.json())
      .then(() => {
        setEditingTaskId(null);
        fetchTasks();
      })
      .catch(err => console.error('Error saving task:', err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(() => fetchTasks())
      .catch(err => console.error('Error deleting task:', err));
  };

  const tasksForActiveWeek =
  filterWeek || selectedDate
    ? tasks.filter(task => task.goalWeek === activeWeek)
    : [...tasks].sort((a, b) => {
        // Sort by year and then week number
        const [yearA, weekA] = a.goalWeek?.split('-W') || [];
        const [yearB, weekB] = b.goalWeek?.split('-W') || [];

        if (yearA === yearB) {
          return parseInt(weekA || 0) - parseInt(weekB || 0);
        }
        return parseInt(yearA || 0) - parseInt(yearB || 0);
      });
  const completedForActiveWeek = tasksForActiveWeek.filter(task => task.isCompleted).length;
  const progress =
    tasksForActiveWeek.length === 0
      ? 0
      : Math.round((completedForActiveWeek / tasksForActiveWeek.length) * 100);

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center' }}>🗂️ Weekly Productivity & Task Tracker Dashboard</h1>

      {/* Weekly Summary */}
      <h2>
  Completed{' '}
  <span style={{ fontWeight: 'bold', color: '#007bff' }}>
    {completedForActiveWeek} of {tasksForActiveWeek.length}
  </span>{' '}
  tasks for{' '}
  <span style={{ color: '#666' }}>
    {activeWeek
      ? activeWeek
      : 'All Weeks'}
  </span>
</h2>

{/* Styled Weekly Progress Bar */}
<div style={{
  background: '#e0e0e0',
  borderRadius: '30px',
  height: '25px',
  width: '100%',
  overflow: 'hidden',
  marginBottom: 20,
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
}}>
  <div
    style={{
      width: `${progress}%`,
      background: 'linear-gradient(90deg, #81c784, #388e3c)',
      height: '100%',
      borderRadius: '30px 0 0 30px',
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold',
      lineHeight: '25px',
      transition: 'width 0.5s ease-in-out'
    }}
  >
    {progress > 0 ? `${progress}%` : ''}
  </div>
</div>

      {/* Week Filter */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>Select a Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setFilterWeek('');
          }}
          dateFormat="yyyy-MM-dd"
          placeholderText="Pick a date"
        />
        <span style={{ marginLeft: 10, color: '#888' }}>
          {activeWeek} {selectedDate && `(${getWeekDateRange(selectedDate)})`}
        </span>
      </div>

      {/* Manual ISO Input */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>Or Filter by Week (e.g., 2025-W26):</label>
        <input
          type="text"
          value={filterWeek}
          onChange={(e) => {
            setFilterWeek(e.target.value);
            setSelectedDate(null); // Disable calendar when using ISO week
          }}
          placeholder="Enter ISO week"
          style={{ padding: 6 }}
        />
      </div>

       {/* Add Button */}
      {!showAddForm && (
        <button onClick={() => setShowAddForm(true)} style={{ marginBottom: 20 }}>
          ➕ Add Task
        </button>
      )}
      
      {/* Add Task Form (toggle visibility) */}
      {showAddForm && (
        <div style={{ marginBottom: 20, border: '1px solid #ccc', padding: 10, borderRadius: 8 }}>
          <input
            type="text"
            placeholder="Task Title"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{ padding: 8, marginRight: 10 }}
          />
          <input
            type="text"
            placeholder="Assigned To"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            style={{ padding: 8, marginRight: 10 }}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: 8, marginRight: 10 }}
          />
          <input
            type="text"
            placeholder="Estimated Time"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            style={{ padding: 8, marginRight: 10 }}
          />
          <input
            type="text"
            placeholder="Goal Week (e.g., 2025-W27)"
            value={goalWeek}
            onChange={(e) => setGoalWeek(e.target.value)}
            style={{ padding: 8, marginRight: 10 }}
          />
          <div style={{ marginTop: 10 }}>
            <button onClick={handleAddTask} style={{ marginRight: 10 }}>
              Add
            </button>
            <button onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Task Table */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Assigned To</th>
              <th>Description</th>
              <th>Estimated Time</th>
              <th>Goal Week</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasksForActiveWeek.map(task => (
              <tr key={task._id}>
                <td>
                  {editingTaskId === task._id ? (
                    <input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                  ) : (
                    task.title
                  )}
                </td>
                <td>
                  {editingTaskId === task._id ? (
                    <input
                      value={editedAssignedTo}
                      onChange={(e) => setEditedAssignedTo(e.target.value)}
                    />
                  ) : (
                    task.assignedTo || '—'
                  )}
                </td>
                <td>
                  {editingTaskId === task._id ? (
                    <input
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                    />
                  ) : (
                    task.description || '—'
                  )}
                </td>
                <td>
                  {editingTaskId === task._id ? (
                    <input
                      value={editedEstimatedTime}
                      onChange={(e) => setEditedEstimatedTime(e.target.value)}
                    />
                  ) : (
                    task.estimatedTime || '—'
                  )}
                </td>
                <td>
                  {editingTaskId === task._id ? (
                    <input
                      value={editedGoalWeek}
                      onChange={(e) => setEditedGoalWeek(e.target.value)}
                    />
                  ) : (
                    task.goalWeek || '—'
                  )}
                </td>
                <td onClick={() => handleToggle(task._id)} style={{ cursor: 'pointer' }}>
                  {task.isCompleted ? '✅' : '❌'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      {editingTaskId === task._id ? (
                        <button onClick={() => handleSave(task._id)}>💾 Save</button>
                ) : (
                  <button onClick={() => handleEdit(task)}>✏️ Edit</button>
                )}
                  <button onClick={() => handleDelete(task._id)}>🗑️ Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    {/* Footer */}
    <footer
  style={{
    marginTop: '40px',
    padding: '20px 0',
    borderTop: '1px solid #ddd',
    textAlign: 'center',
    color: '#555',
    fontSize: '14px',
    fontStyle: 'italic',
    fontFamily: 'Segoe UI, sans-serif',
  }}
>
  Created with <span style={{ color: 'red' }}>❤️</span> by Fiona Lin &copy; 2025
</footer>
</div>
  );
}

export default App;

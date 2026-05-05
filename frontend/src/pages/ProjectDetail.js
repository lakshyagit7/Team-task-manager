import React, { useEffect, useState } from 'react';
import { getTasksByProject, createTask, updateTaskStatus, deleteTask } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', assignedTo: '' });

  useEffect(() => {
    if (!user) return navigate('/');
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await getTasksByProject(id);
      setTasks(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreate = async () => {
    if (!form.title) return alert('Title is required');
    try {
      const taskData = { title: form.title, description: form.description, dueDate: form.dueDate, project: id };
      if (form.assignedTo) taskData.assignedTo = form.assignedTo;
      await createTask(taskData);
      setForm({ title: '', description: '', dueDate: '', assignedTo: '' });
      fetchTasks();
    } catch (err) {
      alert('Only admins can create tasks');
    }
  };

  const handleStatus = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, { status });
      fetchTasks();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (err) {
      alert('Only admins can delete tasks');
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
      <h2 style={styles.title}>Project Tasks</h2>

      {user?.role === 'admin' && (
        <div style={styles.card}>
          <h3>Create New Task</h3>
          <input style={styles.input} placeholder="Task Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input style={styles.input} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input style={styles.input} type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <input style={styles.input} placeholder="Assign To (User ID)" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} />
          <button style={styles.button} onClick={handleCreate}>Create Task</button>
        </div>
      )}

      <h3 style={{ marginTop: '30px' }}>All Tasks</h3>
      {tasks.length === 0 && <p>No tasks yet.</p>}
      {tasks.map((task) => (
        <div key={task._id} style={{ ...styles.taskCard, borderLeft: isOverdue(task.dueDate) && task.status !== 'done' ? '4px solid #ef4444' : '4px solid #4f46e5' }}>
          <div style={styles.taskHeader}>
            <h4 style={styles.taskTitle}>{task.title}</h4>
            {isOverdue(task.dueDate) && task.status !== 'done' && (
              <span style={styles.overdue}>OVERDUE</span>
            )}
          </div>
          <p style={styles.desc}>{task.description}</p>
          {task.dueDate && <p style={styles.due}>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
          {task.assignedTo && <p style={styles.assigned}>Assigned to: {task.assignedTo.name}</p>}
          <div style={styles.statusRow}>
            <select style={styles.select} value={task.status} onChange={(e) => handleStatus(task._id, e.target.value)}>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <span style={{ ...styles.badge, background: task.status === 'done' ? '#10b981' : task.status === 'in-progress' ? '#f59e0b' : '#6b7280' }}>
              {task.status}
            </span>
            {user?.role === 'admin' && (
              <button style={styles.deleteBtn} onClick={() => handleDelete(task._id)}>Delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '30px' },
  backBtn: { padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' },
  title: { color: '#333', marginBottom: '20px' },
  card: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button: { padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  taskCard: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '15px' },
  taskHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  taskTitle: { margin: 0, color: '#333' },
  overdue: { background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' },
  desc: { color: '#666', margin: '8px 0' },
  due: { color: '#888', fontSize: '14px' },
  assigned: { color: '#888', fontSize: '14px' },
  statusRow: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' },
  select: { padding: '6px', borderRadius: '5px', border: '1px solid #ddd' },
  badge: { padding: '4px 10px', borderRadius: '20px', color: 'white', fontSize: '13px' },
  deleteBtn: { padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
};

export default ProjectDetail;
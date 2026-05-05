import React, { useEffect, useState } from 'react';
import { getProjects, createProject, deleteProject, addMember } from '../api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberId, setMemberId] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) return navigate('/');
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await getProjects();
      setProjects(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreate = async () => {
    if (!name) return alert('Project name is required');
    try {
      await createProject({ name, description });
      setName('');
      setDescription('');
      fetchProjects();
    } catch (err) {
      alert('Only admins can create projects');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (err) {
      alert('Only admins can delete projects');
    }
  };

  const handleAddMember = async (id) => {
    if (!memberId) return alert('Enter a user ID');
    try {
      await addMember(id, { userId: memberId });
      alert('Member added!');
      setMemberId('');
    } catch (err) {
      alert('Failed to add member');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Welcome, {user?.name} 👋</h2>
        <div>
          <span style={styles.role}>{user?.role}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {user?.role === 'admin' && (
        <div style={styles.card}>
          <h3>Create New Project</h3>
          <input style={styles.input} placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input style={styles.input} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button style={styles.button} onClick={handleCreate}>Create Project</button>
        </div>
      )}

      <h3 style={{ marginTop: '30px' }}>Your Projects</h3>
      {projects.length === 0 && <p>No projects found.</p>}
      {projects.map((project) => (
        <div key={project._id} style={styles.projectCard}>
          <div style={styles.projectHeader}>
            <h4 style={styles.projectName}>{project.name}</h4>
            <div>
              <button style={styles.viewBtn} onClick={() => navigate(`/project/${project._id}`)}>View Tasks</button>
              {user?.role === 'admin' && (
                <button style={styles.deleteBtn} onClick={() => handleDelete(project._id)}>Delete</button>
              )}
            </div>
          </div>
          <p style={styles.desc}>{project.description}</p>
          <p style={styles.members}>Members: {project.members.map(m => m.name).join(', ')}</p>
          {user?.role === 'admin' && (
            <div style={styles.addMember}>
              <input style={styles.smallInput} placeholder="User ID to add" value={memberId} onChange={(e) => setMemberId(e.target.value)} />
              <button style={styles.addBtn} onClick={() => handleAddMember(project._id)}>Add Member</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '30px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { color: '#333' },
  role: { background: '#4f46e5', color: 'white', padding: '4px 12px', borderRadius: '20px', marginRight: '10px', fontSize: '14px' },
  logoutBtn: { padding: '6px 14px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  card: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button: { padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  projectCard: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '15px' },
  projectHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  projectName: { margin: 0, color: '#333' },
  desc: { color: '#666', margin: '8px 0' },
  members: { color: '#888', fontSize: '14px' },
  viewBtn: { padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '8px' },
  deleteBtn: { padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  addMember: { display: 'flex', gap: '10px', marginTop: '10px' },
  smallInput: { flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ddd' },
  addBtn: { padding: '8px 14px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
};

export default Dashboard;
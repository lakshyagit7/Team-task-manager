import React, { useState } from 'react';
import { signup } from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signup(form);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} name="name" placeholder="Full Name" onChange={handleChange} />
        <input style={styles.input} name="email" placeholder="Email" onChange={handleChange} />
        <input style={styles.input} name="password" type="password" placeholder="Password" onChange={handleChange} />
        <select style={styles.input} name="role" onChange={handleChange}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button style={styles.button} onClick={handleSubmit}>Sign Up</button>
        <p style={styles.link}>Already have an account? <Link to="/">Login</Link></p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  box: { background: 'white', padding: '40px', borderRadius: '10px', width: '350px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', marginBottom: '20px', color: '#333' },
  input: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button: { width: '100%', padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red', textAlign: 'center' },
  link: { textAlign: 'center', marginTop: '15px' }
};

export default Signup;
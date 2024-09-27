import React, { useState } from 'react';
import axios from 'axios';
import { Card, Input, Button, Select, Form, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'antd/dist/reset.css';
import "../App.css";

const { Option } = Select;
const { Title } = Typography;

const LoginRegister = ({ onLogin }) => { // Accept onLogin as a prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); 
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', { username, password, role });
      message.success(response.data.message);
      setUsername(''); // Clear input fields
      setPassword('');
    } catch (error) {
      console.error(error);
      message.error('Error during registration');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      const { token, role } = response.data; 
      localStorage.setItem('token', token); 
      message.success('Login successful');
      
      onLogin({ username, isAdmin: role === 'admin' }); 
      console.log('Role:', role);

      if (role === 'admin') {
        navigate('/admin-dashboard'); 
      } else {
        navigate('/user-dashboard'); 
      }
    } catch (error) {
      console.error(error);
      message.error('Login failed');
    }
  };



  return (
    <div class="main">
      <Title level={2} class="titles" >IRCTC</Title>
      <Title level={2} class="titles">Train Ticket Booking</Title>

      <Card class="logincard" style={{ width: 400, marginTop: 10 }}>
        <h1>{isRegistering ? 'Register' : 'Login'}</h1>
        <Form layout="vertical">
          <Form.Item label="Username">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </Form.Item>

          <Form.Item label="Password">
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </Form.Item>

          {isRegistering && (
            <Form.Item label="Role">
              <Select value={role} onChange={(value) => setRole(value)}>
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>
          )}

          <Button type="primary" block onClick={isRegistering ? handleRegister : handleLogin}>
            {isRegistering ? 'Register' : 'Login'}
          </Button>

          <Button type="link" block onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Switch to Login' : 'Switch to Register'}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default LoginRegister;

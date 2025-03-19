import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import axios from 'axios';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        if (!formData.email || !formData.password) {
          setError('Please fill in all fields');
          return;
        }

        const response = await axios.post('http://localhost:3000/api/v1/user/login', {
          email: formData.email,
          password: formData.password,
        }, { withCredentials: true });

        if (response.status === 200) {
          onLogin({
            name: response.data.data.name,
            email: formData.email,
          });
          navigate('/homepage');
        }
      } else {
        if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.address) {
          setError('Please fill in all fields');
          return;
        }

        const response = await axios.post('http://localhost:3000/api/v1/user/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNo: formData.phone,
          address: formData.address,
        }, { withCredentials: true });

        if (response.status === 201) {
          onLogin({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          });
          navigate('/login');
        }
      }
    } catch (error) {
      console.log('Authentication error:', error);
      setError(error.response?.data?.message || 'Authentication failed');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Inventory Management System</h1>
          <p>{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-button">
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button type="button" className="toggle-button" onClick={toggleForm}>
              {isLogin ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
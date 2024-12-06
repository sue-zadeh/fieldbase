import React, { useState } from 'react'

interface LoginProps {
  onLoginSuccess: () => void
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter a username and password.')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      setIsLoading(false)

      if (data.message === 'Login successful') {
        onLoginSuccess()
        if (rememberMe) {
          localStorage.setItem('username', username) // Remember username
        }
        setError('')
      } else {
        setError(data.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      console.error('Error during login or password reset:', err)
      setIsLoading(false)
      setError('Server error. Please try again.')
    }
  }

  const handleForgotPassword = async () => {
    if (!username) {
      setError('Please enter your email.')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username }),
      })
      const data = await response.json()
      setIsLoading(false)

      if (data.message === 'Password reset email sent successfully') {
        setError('')
        alert('Password reset email sent. Check your inbox.')
      } else {
        setError(data.message || 'Failed to reset password. Try again.')
      }
    } catch (err) {
      console.error('Error during login or password reset:', err)
      setIsLoading(false)
      setError('Server error. Please try again.')
    }
  }

  return (
    <div
      className="login-container d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: '#F4F7F1' }}
    >
      <div
        className="login-box p-4 shadow rounded"
        style={{ backgroundColor: '#FFFFFF', width: '400px' }}
      >
        <h2 className="text-center mb-4" style={{ color: '#76D6E2' }}>
          Welcome to FieldBase
        </h2>
        <h3 className="text-center my-4" style={{ color: '#76D6E2' }}>
          <i>{isForgotPassword ? 'Forgot Password' : 'Login'}</i>
        </h3>

        <div className="form-group mb-3">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        {!isForgotPassword && (
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}
        {error && <div className="text-danger">{error}</div>}
        {!isForgotPassword && (
          <div className="form-group form-check">
            <input
              type="checkbox"
              id="rememberMe"
              className="form-check-input"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe" className="form-check-label">
              Remember Me
            </label>
          </div>
        )}
        {!isForgotPassword && (
          <button
            className="btn w-100 mt-3"
            style={{ backgroundColor: '#0094B6', color: 'white' }}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        )}
        {isForgotPassword && (
          <button
            className="btn w-100 mt-3"
            style={{ backgroundColor: '#0094B6', color: 'white' }}
            onClick={handleForgotPassword}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Password Reset Email'}
          </button>
        )}
        <button
          className="btn w-100 mt-3 btn-link"
          style={{ color: '#0094B6' }}
          onClick={() => setIsForgotPassword(!isForgotPassword)}
        >
          {isForgotPassword ? 'Back to Login' : 'Forgot Password?'}
        </button>
      </div>
    </div>
  )
}

export default Login

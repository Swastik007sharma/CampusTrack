import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { login, forgotPassword } from '../../services/authService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import Modal from '../../components/common/Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoogleLoginButton from '../auth/GoogleLoginButton';

function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const { login: setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await login({ email, password });
      setAuth(response.data.authorization, response.data.user || null);
      localStorage.setItem('token', response.data.authorization);
      console.log('Login successful, token:', response.data.authorization);
      toast.success('Login successful!');
      setTimeout(() => navigate('/'), 300);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setIsForgotModalOpen(true);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your email');
      return;
    }
    forgotPassword({ email: forgotEmail })
      .then(() => {
        toast.success('OTP sent to your email. Please verify it.');
        setTimeout(() => navigate(`/verify-otp?email=${encodeURIComponent(forgotEmail)}&forgot=true`), 2000);
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to send OTP. Try again.'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--color-bg)' }}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg" style={{ background: 'var(--color-secondary)', color: 'var(--color-text)' }}>
        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: 'var(--color-text)' }}>Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              disabled={loading}
            />
          </div>
          
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>Password</label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-2 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pr-12"
              disabled={loading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full focus:outline-none mt-4"
              style={{ color: 'var(--color-accent)' }}
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
            </button>
          </div>
          
          <div>
            <Button
              type="submit"
              className="w-full py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>

        {/* Google Login Component */}
        <GoogleLoginButton disabled={loading} />

        <div className="mt-4 text-sm text-center" style={{ color: 'var(--color-text)' }}>
          <p>
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
          <button
            onClick={handleForgotPassword}
            className="mt-2 text-blue-600 hover:underline"
            disabled={loading}
          >
            Forgot Password?
          </button>
        </div>
      </div>

      <Modal isOpen={isForgotModalOpen} onClose={() => setIsForgotModalOpen(false)}>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Forgot Password</h3>
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>Email</label>
            <Input
              id="forgot-email"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            Send OTP
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export default LoginComponent;
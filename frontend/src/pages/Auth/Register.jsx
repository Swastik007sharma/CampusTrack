import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { register } from '../../services/authService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Google Auth utilities
import { initializeGoogleAuth, signInWithGoogle } from '../../lib/googleAuth';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login: setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Initialize Google Auth on component mount
  useEffect(() => {
    initializeGoogleAuth();
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await register({ name, email, password });
      console.log('Registration response:', response.data);

      // No token is generated yet; proceed to OTP verification
      toast.success('Registration initiated. Please verify OTP to activate your account.');
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.details?.[0]?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      const { user, accessToken } = await signInWithGoogle();
      
      console.log('Google user info:', user);
      
      // Send Google user data to backend for registration/login
      const response = await fetch('http://localhost:5000/api/v1/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: {
            name: user.name,
            email: user.email,
            profilePicture: user.picture,
            googleId: user.id
          }
        }),
      });

      const data = await response.json();
      
      if (data.authorization) {
        setAuth(data.authorization, data.user || null);
        localStorage.setItem('token', data.authorization);
        toast.success('Google registration successful!');
        navigate('/');
      } else {
        throw new Error('No authorization token received');
      }
    } catch (err) {
      console.error('Google registration error:', err);
      toast.error('Google registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in-down">
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
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg transform transition-all duration-500 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 animate-fade-in-down">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="animate-fade-in-left" style={{ animationDelay: '0.1s' }}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-2 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm disabled:opacity-50"
              disabled={loading}
            />
          </div>
          <div className="animate-fade-in-left" style={{ animationDelay: '0.2s' }}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm disabled:opacity-50"
              disabled={loading}
            />
          </div>
          <div className="relative animate-fade-in-left" style={{ animationDelay: '0.3s' }}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-2 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm disabled:opacity-50 pr-12"
              disabled={loading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-500 hover:text-gray-700 focus:outline-none mt-4"
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
            </button>
          </div>
          <div className="relative animate-fade-in-left" style={{ animationDelay: '0.4s' }}>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="mt-2 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm disabled:opacity-50 pr-12"
              disabled={loading}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-500 hover:text-gray-700 focus:outline-none mt-4"
              disabled={loading}
            >
              {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
            </button>
          </div>
          <div className="animate-fade-in-left" style={{ animationDelay: '0.5s' }}>
            <Button
              type="submit"
              className={`w-full py-3 rounded-lg text-sm font-semibold text-white transition-all duration-200 shadow-md ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                'Register'
              )}
            </Button>
          </div>
        </form>

        {/* Google Register Button */}
        <div className="mt-4 animate-fade-in-left" style={{ animationDelay: '0.6s' }}>
          <Button
            onClick={handleGoogleRegister}
            className={`w-full py-3 rounded-lg text-sm font-semibold border transition-all duration-200 shadow-md flex items-center justify-center ${
              loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:shadow-lg'
            }`}
            disabled={loading}
          >
            <FaGoogle className="mr-2 text-red-500" />
            {loading ? 'Please wait...' : 'Continue with Google'}
          </Button>
        </div>

        <p className="mt-4 text-sm text-center text-gray-600 animate-fade-in-left" style={{ animationDelay: '0.7s' }}>
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
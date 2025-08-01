import { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaHome, FaBell, FaPlus, FaComments, FaBars, FaTimes, FaTachometerAlt, FaShieldAlt } from 'react-icons/fa';
import ThemeToggle from './common/ThemeToggle';

function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, token, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const handleGuestLogin = () => {
    // Simulate guest login (customize as needed)
    localStorage.setItem('token', 'guest-token');
    localStorage.setItem('user', JSON.stringify({ name: 'Guest', email: 'guest@example.com', role: 'guest' }));
    window.location.reload();
  };

  const getInitial = () => user?.name?.charAt(0).toUpperCase() || 'U';
  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="bg-blue-600 text-white p-4 sm:p-6 shadow-lg animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <nav className="bg-navbar text-white p-4 sm:p-4 shadow-lg sticky top-0 z-30" style={{ background: 'var(--color-navbar)' }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl sm:text-2xl md:text-3xl font-bold transition duration-200 ease-in-out flex items-center gap-2"
        >
          Lost & Found
        </Link>
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {token ? (
            <>
              <NavLink to="/" label="Home" icon={<FaHome />} active={location.pathname === '/'} />
              <NavLink to="/notifications" label="Notifications" icon={<FaBell />} active={location.pathname === '/notifications'} />
              <NavLink to="/items/create" label="Post Item" icon={<FaPlus />} active={location.pathname === '/items/create'} />
              <NavLink to="/conversations" label="Conversations" icon={<FaComments />} active={location.pathname === '/conversations'} />
              <NavLink
                to="/dashboard"
                label="User Dashboard"
                icon={<FaTachometerAlt className="text-white" />}
                active={location.pathname === '/dashboard'}
                className="bg-purple-700 hover:bg-purple-800 hover:text-blue-200 px-1 rounded-md"
                activeClassName="bg-purple-800"
              />
              {isAdmin && (
                <NavLink
                  to="/admin"
                  label="Admin Dashboard"
                  icon={<FaShieldAlt className="text-white" />}
                  active={location.pathname === '/admin'}
                  className="bg-green-700 hover:bg-green-800 hover:text-blue-200 px-1 rounded-md"
                  activeClassName="bg-green-800"
                />
              )}
              <ThemeToggle />
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-blue-800 rounded-full text-lg sm:text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 hover:ring-2 hover:ring-blue-300 transition duration-200 ease-in-out hover:scale-105"
                >
                  {getInitial()}
                </button>
                {isProfileOpen && (
                  <div className="absolute top-14 right-0 w-64 bg-white text-gray-800 rounded-md shadow-lg p-4 z-20 border border-gray-100 animate-fade-in-down">
                    <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-600 mb-4 truncate">{user?.email || 'email@example.com'}</p>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsProfileOpen(false);
                      }}
                      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out flex items-center justify-center gap-2 mb-2 text-sm hover:scale-105"
                    >
                      <FaUser /> Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200 ease-in-out flex items-center justify-center gap-2 text-sm hover:scale-105"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" label="Login" active={location.pathname === '/login'} />
              <NavLink to="/register" label="Register" active={location.pathname === '/register'} />
              <button
                onClick={handleGuestLogin}
                className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold transition ml-2"
              >
                Guest Login
              </button>
            </>
          )}
        </div>
        <div className="md:hidden flex items-center">
          {token ? (
            !isMobileMenuOpen && (
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="focus:outline-none hover:text-blue-200 transition duration-200 ease-in-out hover:scale-105"
              >
                <FaBars className="w-6 h-6" />
              </button>
            )
          ) : (
            <div className="flex gap-4">
              <NavLink to="/login" label="Login" active={location.pathname === '/login'} />
              <NavLink to="/register" label="Register" active={location.pathname === '/register'} />
            </div>
          )}
          <ThemeToggle className="ml-2" />
        </div>
      </div>
      {isMobileMenuOpen && token && (
        <div
          ref={mobileMenuRef}
          className="fixed top-0 left-0 w-64 h-full bg-blue-600 text-white shadow-lg z-40 md:hidden animate-fade-in-left"
        >
          <div className="p-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 left-4 focus:outline-none hover:text-blue-200 transition duration-200 ease-in-out hover:scale-105"
            >
              <FaTimes className="w-6 h-6" />
            </button>
            <div className="flex items-center justify-center mt-12 mb-6">
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsMobileMenuOpen(false);
                }}
                className="w-12 h-12 flex items-center justify-center bg-blue-800 rounded-full text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 hover:ring-2 hover:ring-blue-300 transition duration-200 ease-in-out hover:scale-105"
              >
                {getInitial()}
              </button>
            </div>
            <div className="flex flex-col gap-4 text-center">
              <MobileNavLink to="/" label="Home" icon={<FaHome />} active={location.pathname === '/'} onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink to="/notifications" label="Notifications" icon={<FaBell />} active={location.pathname === '/notifications'} onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink to="/items/create" label="Post Item" icon={<FaPlus />} active={location.pathname === '/items/create'} onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink to="/conversations" label="Conversations" icon={<FaComments />} active={location.pathname === '/conversations'} onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavLink
                to="/dashboard"
                label="User Dashboard"
                icon={<FaTachometerAlt className="text-white" />}
                active={location.pathname === '/dashboard'}
                className="bg-purple-700 hover:bg-purple-800 hover:text-blue-200 py-2 px-4 rounded-md"
                activeClassName="bg-purple-800"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              {isAdmin && (
                <MobileNavLink
                  to="/admin"
                  label="Admin Dashboard"
                  icon={<FaShieldAlt className="text-white" />}
                  active={location.pathname === '/admin'}
                  className="bg-green-700 hover:bg-green-800 hover:text-blue-200 py-2 px-4 rounded-md"
                  activeClassName="bg-green-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-sm text-white py-2 px-4 rounded-md hover:bg-red-600 hover:text-blue-200 transition duration-200 ease-in-out flex items-center justify-center gap-2 mx-auto hover:scale-105"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Reusable NavLink component for desktop and tablet
const NavLink = ({ to, label, icon, active, className = '', activeClassName = '' }) => (
  <Link
    to={to}
    className={`group flex items-center transition-all duration-200 ease-in-out md:w-10 md:overflow-hidden md:hover:w-auto md:hover:bg-blue-700 md:hover:rounded-md lg:w-auto lg:hover:scale-105 lg:hover:text-blue-200 ${
      active ? `text-blue-200 underline font-semibold ${activeClassName}` : 'hover:text-blue-200'
    } ${className}`}
  >
    <span className="text-lg flex-shrink-0 p-2">{icon}</span>
    <span className="md:hidden md:group-hover:block lg:block whitespace-nowrap px-2 text-white">
      {label}
    </span>
  </Link>
);

// Reusable MobileNavLink component with hover effect
const MobileNavLink = ({ to, label, icon, active, className = '', activeClassName = '', onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`text-sm transition duration-200 ease-in-out flex items-center justify-center gap-2 hover:scale-105 hover:text-blue-200 hover:bg-blue-700 rounded-md py-2 px-4 ${
      active ? `text-blue-200 underline font-semibold ${activeClassName}` : ''
    } ${className}`}
  >
    {icon && <span className="text-lg">{icon}</span>}
    {label}
  </Link>
);

export default Navbar;
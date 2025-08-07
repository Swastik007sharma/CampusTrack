import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaHome, FaBell, FaPlus, FaComments, FaTachometerAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './common/ThemeToggle';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, token, logout, loading } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/login');
    };

    const navLinks = [
        { to: '/', label: 'Home', icon: <FaHome /> },
        { to: '/notifications', label: 'Notifications', icon: <FaBell /> },
        { to: '/items/create', label: 'Post Item', icon: <FaPlus /> },
        { to: '/conversations', label: 'Conversations', icon: <FaComments /> },
        { to: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    ];

    if (loading) {
        return <div className="bg-blue-600 text-white p-4 animate-pulse">Loading...</div>;
    }

    return (
        <nav className="sticky bg-blue-700 text-white p-4 shadow-md top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold">Lost & Found</Link>

                {/* Center Navigation Links */}
                <div className="hidden md:flex gap-6 items-center">
                    {token && (
                        <>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`flex justify-center items-center gap-x-2 hover:text-blue-200 transition ${location.pathname === link.to ? 'underline font-semibold' : ''}`}
                                >
                                    {link.icon}
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </>
                    )}
                </div>


                {/* Right side signup/login/logout */}
                <div className="flex items-center gap-3">

                    {token ? (
                        <button onClick={handleLogout} className="hidden md:flex items-center gap-1 text-sm bg-red-500 hover:bg-red-600 py-1 px-3 rounded-md">
                            <FaSignOutAlt /> Logout
                        </button>
                    ) : (
                        <div className='hidden md:flex gap-6 items-center'>
                            <Link to="/login" className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors">Login</Link>
                            <Link to="/register" className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors">Register</Link>
                        </div>

                    )}

                    <ThemeToggle className="ml-4 w-8 h-8 p-1" />
                    <button
                        className="md:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {menuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                    </button>

                </div>
            </div>

            {/* Navigation menu for smaller screens */}
            {menuOpen && (
                <div className="md:hidden mt-3 bg-blue-800 text-white flex flex-col gap-4 p-4 rounded shadow-md">
                    {token ? (
                        <>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`block px-2 py-1 rounded hover:bg-blue-600 ${location.pathname === link.to ? 'bg-blue-600' : ''}`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <button onClick={handleLogout} className="w-full bg-red-500 py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2">
                                <FaSignOutAlt /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block px-2 py-1 hover:bg-blue-600 rounded" onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link to="/register" className="block px-2 py-1 hover:bg-blue-600 rounded" onClick={() => setMenuOpen(false)}>Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;

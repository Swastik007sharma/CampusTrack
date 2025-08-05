import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaSignOutAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Profile", path: "/profile" },
  { name: "Messages", path: "/messages" },
  { name: "Notifications", path: "/notifications" },
];

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
      if (!event.target.closest("#profileDropdown")) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const getInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || "U";
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // Inline NavLink components
  const NavLinkItem = ({ name, path }) => {
    const isActive = location.pathname === path;
    return (
      <Link
        to={path}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-indigo-900 text-white'
            : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
        }`}
      >
        {name}
      </Link>
    );
  };

  const MobileNavLink = ({ name, path, onClick }) => {
    const isActive = location.pathname === path;
    return (
      <Link
        to={path}
        onClick={onClick}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'bg-indigo-900 text-white'
            : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
        }`}
      >
        {name}
      </Link>
    );
  };

  return (
    <header className="bg-indigo-700 text-white shadow-md px-6 py-3 flex justify-between items-center relative z-50">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        CampusTrack
      </h1>

      <nav className="hidden md:flex gap-6 items-center">
        {navLinks.map((link) => (
          <NavLinkItem key={link.path} {...link} />
        ))}
        <div className="relative" id="profileDropdown">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="w-10 h-10 bg-indigo-900 rounded-full flex items-center justify-center text-white font-semibold hover:ring-2 ring-white transition-all duration-150"
          >
            {getInitial()}
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg border border-gray-200 py-3 z-50">
              <div className="px-4 pb-3 border-b border-gray-200">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 transition text-sm"
              >
                <FaUser /> Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-100 transition text-sm"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden text-2xl"
      >
        <FaBars />
      </button>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-start"
        >
          <div className="w-72 sm:w-80 h-full bg-indigo-700 text-white shadow-xl relative animate-slide-in-left p-6 space-y-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">CampusTrack</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-2xl">
                <FaTimes />
              </button>
            </div>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <MobileNavLink key={link.path} {...link} onClick={() => setIsMobileMenuOpen(false)} />
              ))}
              <hr className="border-white/30 my-2" />
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-indigo-600 rounded-md"
              >
                <FaUser /> Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 text-red-300 hover:bg-red-600 rounded-md"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import NotificationsBar from './common/NotificationsBar';

function Layout() {
  const { user, addNotification, removeNotification, notifications, socket } = useContext(AuthContext);

  useEffect(() => {
    if (!socket || !user) return;

    // Ensure the user joins their room if not already joined
    socket.emit('joinUserRoom', user.id);

    // Additional event handling if needed
    const handleNewNotification = (notification) => {
      addNotification({ ...notification, id: Date.now() });
    };

    socket.on('newNotification', handleNewNotification);

    // Cleanup
    return () => {
      socket.off('newNotification', handleNewNotification);
    };
  }, [socket, user, addNotification]);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Navbar socket={socket} />
      <NotificationsBar />
      <main className="flex-1 font-sans py-6 sm:py-8 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <Outlet context={{ socket }} />
      </main>
      <footer className="py-4" style={{ background: 'var(--color-navbar)', color: 'var(--color-text)' }}>
        <div className="container mx-auto text-center">
          <p className="text-sm">© 2025 Lost & Found. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
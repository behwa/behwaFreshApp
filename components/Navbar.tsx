import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';  // Import the CSS Module

interface UserData {
  userid: string;
  role: string;
  token: string;
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.asPath;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [currentPath]);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const isActive = (href: string) => currentPath === href;

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light sticky-top px-3 ${styles['navbar-custom']}`}
      aria-label="Main navigation"
    >
      <div className="container-fluid">
        <Link
          href="/"
          className="navbar-brand fw-bold d-flex align-items-center gap-2 text-decoration-none"
          aria-label="Go to homepage"
        >
          <img
            src="/zooPic.png"
            alt="Logo"
            height="80"
            width="80"
            className="rounded-circle"
          />
          Task Management App!
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
          onClick={toggleNavbar}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className={`collapse navbar-collapse${isCollapsed ? '' : ' show'}`}
          id="navbarSupportedContent"
        >
          <div className="ms-auto d-flex gap-2 align-items-center">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className={`${styles['btn-nav-link']} ${
                    isActive('/login') ? styles.active : ''
                  } btn btn-outline-primary`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`${styles['btn-nav-link']} ${
                    isActive('/signup') ? styles.active : ''
                  } btn btn-primary`}
                >
                  Sign Ups
                </Link>
              </>
            ) : (
              <>
                <span className="me-3">
                  Welcome, <strong>{user.userid}</strong> ({user.role})
                </span>
                <button className="btn btn-danger" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

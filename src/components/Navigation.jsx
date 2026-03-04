import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/features', label: 'Features' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">MyApp</Link>
        </div>

        <button
          className="nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className={isOpen ? 'open' : ''}></span>
          <span className={isOpen ? 'open' : ''}></span>
          <span className={isOpen ? 'open' : ''}></span>
        </button>

        <ul className={`nav-menu ${isOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .navigation {
          background: #1a1a2e;
          padding: 1rem 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-brand a {
          color: #fff;
          font-size: 1.5rem;
          font-weight: bold;
          text-decoration: none;
        }

        .nav-menu {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 2rem;
        }

        .nav-menu a {
          color: #fff;
          text-decoration: none;
          transition: color 0.3s;
        }

        .nav-menu a.active {
          color: #4ecdc4;
        }

        .nav-toggle {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .nav-toggle span {
          width: 25px;
          height: 3px;
          background: #fff;
          margin: 3px 0;
          transition: 0.3s;
        }

        @media (max-width: 768px) {
          .nav-menu {
            display: ${isOpen ? 'flex' : 'none'};
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #1a1a2e;
            padding: 1rem;
            gap: 1rem;
          }

          .nav-toggle {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;

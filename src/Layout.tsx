import React from "react";
import "./Layout.css";
import PositionMap from "./PositionMap";

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <header className="header">
        <div className="brand">Guitar Tab Player</div>
        <nav className="topnav">
          <a href="#">Home</a>
          <a href="#">Projects</a>
          <a href="#">Docs</a>
        </nav>
      </header>

      <aside className="sidebar">
        <div className="menu-title">Menu</div>
        <ul className="menu">
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Tracks</a></li>
          <li><a href="#">Metronome</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </aside>

      <main className="content">
        {/* PositionMap はそのまま表示 */}
        <PositionMap />
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} TabCite</span>
      </footer>
    </div>
  );
};

export default Layout;
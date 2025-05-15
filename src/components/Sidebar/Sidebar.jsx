import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';


const Sidebar = () => {
    const navigate = useNavigate();
    const menuItems = [
        { label: 'Subjects', icon: <i className="bi bi-book-half"></i>, route: '/subjects' },
        { label: 'Users', icon: <i className="bi bi-people"></i>, route: '/users' },
        { label: 'Schedule', icon: <i className="bi bi-calendar-date"></i>, route: '/schedules' },
        { label: 'Exams', icon: <i className="bi bi-bar-chart-line"></i>, route: '/exams' },
        { label: 'Marks', icon: <i className="bi bi-bar-chart-line"></i>, route: '/marks' },
    ];
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleMenuClick = (route) => {
        setActiveMenu(route);
        navigate(route);
    };

    return (
        <div className={`sidebar-custom${isSidebarOpen ? '' : ' collapsed'}`}>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {isSidebarOpen ? (
                    <i className="bi bi-chevron-left" />
                ) : (
                    <i className="bi bi-chevron-right" />
                )}
            </button>
            <div className="sidebar-logo">School Management</div>
            <ul className="nav flex-column">
                {menuItems.map((item) => (
                    <li key={item.label} className="nav-item">
                        <a
                            className={
                                "nav-link d-flex align-items-center" +
                                (activeMenu === item.route ? " bg-light active" : "")
                            }
                            onClick={() => handleMenuClick(item.route)}
                            style={{ cursor: 'pointer' }}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </a>
                    </li>
                ))}
            </ul>
            <div className="sidebar-footer">© 2025 School</div>
        </div>
    );
};

export default Sidebar;
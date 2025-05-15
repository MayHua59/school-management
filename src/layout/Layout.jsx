import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';


const Layout = ({ children }) => {
    return (
        <div className="d-flex">
            <Sidebar />
            
            <div className="flex-grow-1 p-4">
                {children}
            </div>
        </div>
    );
};

export default Layout;
import React, { useState } from 'react';
import AuthForm from '../../auth/AuthForm';

const AuthenticationPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [route, setRoute] = useState('login');

    const handleRouteChange = (newRoute) => {
        setRoute(newRoute);
        setIsLogin(newRoute === 'login');
    };
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-center">
                    {/* <button
                        onClick={() => handleRouteChange('login')}
                        className={`btn ${route === 'login' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => handleRouteChange('signup')}
                        className={`btn ${route === 'signup' ? 'btn-primary' : 'btn-outline-primary'}`}
                    >
                        Sign Up
                    </button> */}
                </div>
                <AuthForm isLogin={route === 'login'} onRouteChange={handleRouteChange}/>
            </div>
        </div>
  )
}

export default AuthenticationPage
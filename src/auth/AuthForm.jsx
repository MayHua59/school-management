import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({isLogin, onRouteChange}) => {
    const navigate = useNavigate();
     const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // client-side validation
        if (!email || !password || (!isLogin && !name)) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        if (!isLogin && password.length < 8) {
            setError('Password must be at least 8 characters long.');
            setLoading(false);
            return;
        }
        
        
        try {
           
             

            if (isLogin) {
                
                if (email === 'test@example.com' && password === 'password') {
                    const user = { id: 1, name: 'Test User', email: 'test@example.com', role_id: 1 }; 
                    console.log('Logged in successfully!', user);
                   
                    // redirect to the dashboard or another page.
                    navigate('/');
                
                } else {
                    setError('Invalid credentials. Please check your email and password.');
                }
            } else {
                
                const newUser = { id: 2, name: name, email: email, role_id: 2 };
                console.log('Signed up successfully!', newUser);
                
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
  return (
    <div className="container-fluid">
            <div className="card shadow-sm my-4">
                <div className="card-body">
                    <h2 className="card-title h3 mb-3">{isLogin ? 'Login' : 'Sign Up'}</h2>
                    <p className="card-subtitle text-muted mb-4">
                        {isLogin ? 'Login to your account' : 'Create a new account'}
                    </p>
                    <form onSubmit={handleSubmit} className="form-group">
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                    disabled={loading}
                                    className="form-control"
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                disabled={loading}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                disabled={loading}
                                className="form-control"
                            />
                        </div>
                        {error && <p className="text-danger small">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className={loading ? 'btn btn-secondary w-100' : 'btn btn-primary w-100'}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Processing...
                                </>
                            ) : (
                                isLogin ? 'Login' : 'Sign Up'
                            )}
                        </button>
                        {isLogin ? (
                            <p className="text-center mt-3 small">
                                Don't have an account?{' '}
                                <a onClick={() => onRouteChange('signup')} className="text-blue pointer">
                                    Sign Up
                                </a>
                            </p>
                        ) : (
                            <p className="text-center mt-3 small">
                                Already have an account?{' '}
                                <a onClick={() => onRouteChange('login')} className="text-blue pointer">
                                    Login
                                </a>
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
  )
}

export default AuthForm;
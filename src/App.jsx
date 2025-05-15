import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'
import AuthenticationPage from './pages/Authentication/AuthenticationPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
            <Routes>
                <Route path="/login" element={<AuthenticationPage />} />
                <Route path="/signup" element={<AuthenticationPage />} />
                {/* <Route path="/forgot-password" element={<AuthenticationPage />} />
                <Route path="/reset-password" element={<AuthenticationPage />} /> */}
                
                <Route path="/" element={<div>Home Page</div>} />
            </Routes>
        </Router>
  )
}

export default App

import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'
import AuthenticationPage from './pages/Authentication/AuthenticationPage';
import HomePage from './pages/HomePage/HomePage';
import Subjects from './pages/SubjectManagement/Subjects';
import EditSubject from './pages/SubjectManagement/EditSubject';
import CreateSubject from './pages/SubjectManagement/CreateSubject';
import Users from './pages/UserManagement/Users';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
            <Routes>
                <Route path="/login" element={<AuthenticationPage />} />
                <Route path="/signup" element={<AuthenticationPage />} />
                {/* <Route path="/forgot-password" element={<AuthenticationPage />} />
                <Route path="/reset-password" element={<AuthenticationPage />} /> */}
                
                <Route path="/" element={<HomePage/>}/>
                <Route path="/subjects" element={<Subjects/>}/>
                <Route path="/subjects/:id/edit" element={<EditSubject/>}/>
                <Route path="/subjects/create" element={<CreateSubject/>}/>
                <Route path="/users" element={<Users/>}/>
            </Routes>
        </Router>
  )
}

export default App

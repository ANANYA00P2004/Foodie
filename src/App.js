// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/components/signin';
import StudentDashboard from '../src/components/StudentDashboard';
import AdminDashboard from '../src/components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/student" element={<StudentDashboard />} /> 
         <Route path="/admin" element={<AdminDashboard />} />  
      </Routes>
    </Router>
  );
}

export default App;

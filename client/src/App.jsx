import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Client from './routes/Client';
import Developer from './routes/Developer';
import NotFound from './routes/NotFound';
import DeveloperDashboard from './routes/DeveloperDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={'/'} element={<Client />} />
        <Route path={'/developer'} element={<Developer />} />
        <Route path={'/developer/dashboard'} element={<DeveloperDashboard />} />
        <Route path={'*'} element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

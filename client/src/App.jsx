import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Client from './routes/Client';
import DeveloperLogin from './routes/DeveloperLogin';
import NotFound from './routes/NotFound';
import DeveloperDashboard from './routes/DeveloperDashboard';

function App() {
  return (
    <Routes>
      <Route path={'/developer'} element={<DeveloperLogin />} />
      <Route path={'/developer/dashboard'} element={<DeveloperDashboard />} />
      <Route path={'/'} element={<Client />} />
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
}

export default App;

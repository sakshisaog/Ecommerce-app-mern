import React from 'react'
import Admin from './pages/admin/Admin.jsx'
import Navbar from './components/Navbar/Navbar.jsx';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <Navbar />
      <Admin />
    </div>
  )
}

export default App;
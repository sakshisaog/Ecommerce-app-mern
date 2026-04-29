import React from 'react'
import logo from '../assets/admin_assets/logo.png'

const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center justify-between py-2 pl-2 pr-[4%] w-full'>
      
      {/* LEFT SIDE - Logo */}
      <img 
        src={logo} 
        style={{ height: "40px", width: "auto" }} 
        alt=""
      />

      {/* RIGHT SIDE - Logout */}
      <button
        onClick={() => setToken('')}
        className='bg-gray-600 text-white px-5 py-2 rounded-full text-sm'
      >
        Logout
      </button>

    </div>
  )
}

export default Navbar
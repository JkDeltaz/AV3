import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import { useAuth } from '../contexts/AuthContext';


function Footer() {
  
    const {userPermission, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate("/login");
    }

    return (
    <div className='mt-auto flex ml-8 mb-4 max-h-1/12'>
        <h1 className='text-default font-mono text-xl'>Usuário : {userPermission}</h1>
        <button className='text-red-500 font-mono text-xl ml-8 cursor-pointer hover:underline'
        onClick={handleLogout}>
          Sair
        </button>
    </div>
  )
}

export default Footer
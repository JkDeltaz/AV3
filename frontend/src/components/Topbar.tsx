import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css'


function Topbar() {

  const navigate = useNavigate();

  return (
    <div className="bg-superficie p-8 border-b border-white/10">
        <button className="text-default font-mono text-3xl cursor-pointer"  
          onClick={() => navigate("/dashboard")}
        >
          AEROCODE
        </button>
        <p className="text-default font-mono text-xl">Sistema de Gerenciamento de Aeronaves</p>
    </div>
  )
}

export default Topbar
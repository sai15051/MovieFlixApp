import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import './Navbar.scss'

import { useDispatch, useSelector } from 'react-redux'

import { logoutReducer } from '../../store/Slice/auth-slice'
import toast from 'react-hot-toast'

import { useTheme } from '../../contexts/ThemeContext'
import { FaPowerOff, FaSearch, FaSun, FaMoon } from 'react-icons/fa'; 



const Navbar = ({isScrolled,genre='movie',isGenresActive=false}) => {

    const navigate = useNavigate() 
    const { theme, toggleTheme } = useTheme();

    const dispatch = useDispatch()


    const logOutHandler = () => {
        dispatch(logoutReducer())
        toast('Logged Out Successfully',
        {
            icon: '👻',
            style: {
            background: '#333',
            color: '#fff',
            },
        }
        );
        navigate('/login')
        
    }


  return (
        <nav 

        >
            <div className='navbar__desktop'>
                <div className='navbar__content'>
                    <div className='navbar__content--logo'>
                            <h1>MovieFlix</h1>
                    </div>
          <button 
            className='theme-toggle'
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>

                </div>
                <div className='navbar__footer'>
                    <div className='navbar__footer--container' >
                    </div>
                <button className='navbar__footer--logout'
                onClick={logOutHandler}>
                    <FaPowerOff />
                    
                </button> 
                </div>
            </div>
        
        </nav>
  )
}

export default Navbar
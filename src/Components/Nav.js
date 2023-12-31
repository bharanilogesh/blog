import React from 'react'
import './styles.css'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
function Nav() {
  const navigate = useNavigate()
  const logout = async () => {
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((err) => console.log('error'));
  };
  return (
    <div className='nav'>
        <h2 className='nav-brand'>Blogs</h2>
        <ul className='menu'>
            
            <li><Link to="/newblog" style={{textDecoration: "none"}} className='menu-btn'>New Blog</Link></li>
            <li><Link to="/user" style={{textDecoration: "none"}} className='menu-btn'>Profile
            </Link></li>
          
            <button onClick={logout}>Logout</button>
        </ul>
    </div>
  )
}

export default Nav
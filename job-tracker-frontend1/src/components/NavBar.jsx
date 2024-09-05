import React from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../assets/logo.png';

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
      <div className="container-fluid mx-auto ps-2" style={{width: "1000px"}}>
        <div>
            <NavLink to='/'><img src={Logo} alt='Logo' className='logo'/></NavLink>
        </div>
        <div>
              <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
              </button>
            <div className="offcanvas offcanvas-end" style={{width: "350px"}} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                <div className="offcanvas-header">
                  <NavLink to='/'><img src={Logo} alt='Logo' className='logo'/></NavLink>
                  <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item ">
                      <NavLink className="nav-link ps-4" to='/'>Home</NavLink>
                  </li>
                  <li className="nav-item">
                      <NavLink className="nav-link ps-4 pe-4" to='/reports'>Report</NavLink>
                  </li>
                </ul>
            </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar

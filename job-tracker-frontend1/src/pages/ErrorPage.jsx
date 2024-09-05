import React from 'react'
import { NavLink } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <>
      <h1>404 Error</h1>
      <NavLink to='/'>Home</NavLink>
    </>
  )
}

export default ErrorPage

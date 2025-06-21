"use client"
import logOut from '@/actionserver/logout';
import React from 'react'

interface SignOutProps{
  children?:React.ReactNode
}


const SignOut = ({
  children
}:SignOutProps) => {
  const onClick=()=>{
    logOut()
  }
  return (
    <span className='cursor-pointer' onClick={onClick}>
      {children}
    </span>
  )
}

export default SignOut
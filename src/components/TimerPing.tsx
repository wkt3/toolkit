"use client"
import React, { useEffect } from 'react'

const TimerPing = () => {
    useEffect(() => {
        const timer = setTimeout(() => {
          fetch("/api/ping", { method: "POST" });
        }, 600000);
        return () => clearTimeout(timer);
      });
  return (
      <div>
          timer 
    </div>
  )
}

export default TimerPing
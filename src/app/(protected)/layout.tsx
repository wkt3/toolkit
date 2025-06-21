import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import PNavbar from '@/components/protected/PNavbar';


export default async function ProtectedLayout({
  children
}:{children:React.ReactNode}){

  const session= await auth()
  return (
    <SessionProvider session={session}>
      <div>
        <PNavbar/>
        {children}
      </div>
    </SessionProvider>
  );
}
import React from 'react'
import Container from '../Container'
import Logo from './Logo';
import Search from './Search';
import UserMenu from './UserMenu';
import Categories from './Categories';
import { SafeUser } from '@/app/types';
import { User } from '@prisma/client';

interface NavbarProps{
  currentUser?: SafeUser|User|null
}

const Navbar = ({ currentUser }: NavbarProps) => {
  return (
    <div className="fixed w-full bg-gray-100 z-10 shadow-sm border-[1px] top-0">
      <div className="py-4 border-b-1">
        <Container>
          <div className="
          flex
          flex-row
          items-center
          justify-between
          gap-3
          md:gap-0
          ">
            <Logo />
            <Search />
            <UserMenu currentUser={currentUser}/>
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
}

export default Navbar
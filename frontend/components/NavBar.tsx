import Image from 'next/image'
import React from 'react'
import ActionButton from './Button';
import { API } from '@/pages/_app';

interface NavBarProps {
    isLoggedin: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isLoggedin }) => {
        return (
            <nav className="flex items-center justify-between flex-wrap p-6">
                  <Image 
                  onClick={() => window.open('https://reclaimprotocol.org/', "_self")}
        src='/logo.png'
        alt='reclaim_protocol'
        width={50}
        height={50}
      />
      {isLoggedin && (
      <ActionButton
        onClick={async() => {
          const data = await fetch(`${API}/twitter/logout`, {
            method: 'POST',
            credentials: 'include'
          })
          if(data.ok) {
            window.location.reload();
          }
        }}
        isLoading={false}
        label="Logout"
      /> 
      )}
      </nav>
        ); 
}

export default NavBar
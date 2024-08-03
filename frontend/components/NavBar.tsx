import Image from 'next/image'
import React from 'react'

interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {
        return (
            <nav className="flex items-center justify-between flex-wrap p-6">
                  <Image 
        src='/logo.png'
        alt='reclaim_protocol'
        width={50}
        height={50}
      />
      </nav>
        );
}

export default NavBar
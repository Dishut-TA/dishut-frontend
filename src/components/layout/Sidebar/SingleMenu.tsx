import React from 'react';
import { NavLink } from 'react-router-dom';

interface SingleMenuProps {
  item: {
    name: string;
    path: string;
    icon: React.ReactNode;
  };
  setIsOpen: (isOpen: boolean) => void;
}

const SingleMenu: React.FC<SingleMenuProps> = ({ item, setIsOpen }) => {
  return (
    <NavLink
      to={item.path}
      onClick={() => setIsOpen(false)} 
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${
          isActive ? 'bg-white text-[#185325] shadow-sm' : 'text-gray-700 hover:bg-[#c4ebd0]'
        }`
      }
    >
      {item.icon}
      {item.name}
    </NavLink>
  );
};

export default SingleMenu;
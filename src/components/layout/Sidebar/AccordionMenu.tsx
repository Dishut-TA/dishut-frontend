import React from 'react';
import { NavLink } from 'react-router-dom';
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi2';

interface AccordionMenuProps {
  menu: any;
  openMenu: string | null;
  toggleMenu: (id: string) => void;
  setIsOpen: (isOpen: boolean) => void;
}

const AccordionMenu: React.FC<AccordionMenuProps> = ({ menu, openMenu, toggleMenu, setIsOpen }) => {
  const isOpen = openMenu === menu.id;

  return (
    <div className="flex flex-col" key={menu.id}>
      <div 
        onClick={() => toggleMenu(menu.id)}
        className="px-4 py-3 text-sm font-medium text-gray-700 flex justify-between items-center cursor-pointer hover:bg-[#c4ebd0] rounded-md transition-colors"
      >
        <div className="flex items-center gap-3">
          {menu.icon}
          {menu.title}
        </div>
        {isOpen ? <HiOutlineChevronUp className="w-4 h-4" /> : <HiOutlineChevronDown className="w-4 h-4" />}
      </div>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col gap-1 py-1">
          {menu.items.map((sub: any) => (
            <NavLink
              key={sub.name}
              to={sub.path}
              onClick={() => setIsOpen(false)} 
              className={({ isActive }) =>
                `pl-12 pr-4 py-2 rounded-md transition-colors text-sm font-medium ${
                  isActive ? 'bg-white text-[#185325] shadow-sm' : 'text-gray-600 hover:text-[#185325] hover:bg-[#c4ebd0]'
                }`
              }
            >
              {sub.name}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccordionMenu;
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { HiXMark } from 'react-icons/hi2';
import LOGO from "@/assets/images/LogoSigapFull2.png";
import { useAuth } from '@/context/AuthContext';
import SingleMenu from './SingleMenu';
import AccordionMenu from './AccordionMenu';
import { ROLE_BASE_PATHS, ROLES } from '@/utils/roles';
import { getSidebarMenus } from './sidebarConfig';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const userRole = useMemo(() => {
    return user?.peran?.[0]?.nama?.toLowerCase() || ROLES.STAFF;
  }, [user]);

  const basePath = ROLE_BASE_PATHS[userRole] || "/admin/staff";

  const menus = useMemo(() => 
    getSidebarMenus(basePath, userRole, user), 
  [basePath, userRole, user]);

  const toggleMenu = (menuId: string) => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/donasi')) setOpenMenu('donasi');
    else if (path.includes('/monitoring')) setOpenMenu('monitoring');
    else if (path.includes('/evaluasi')) setOpenMenu('evaluasi');
    else if (path.includes('/investasi') || path.includes('/rehabilitasi')) setOpenMenu('rehabilitasi');
    else if (path.includes('/manajemen-akun')) setOpenMenu('manajemen-akun');
  }, [location.pathname]);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}
      
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-62 bg-greenAdmin flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-between px-6 md:justify-center mt-4 mb-6 shrink-0">
          <div className="font-bold text-2xl text-white tracking-widest px-4 py-1 rounded-md">
            <img src={LOGO} alt="SIGAP Logo" />
          </div>
          <button 
            className="md:hidden text-gray-700 hover:bg-[#c4ebd0] p-1 rounded-md" 
            onClick={() => setIsOpen(false)}
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-4 custom-scrollbar">
          {menus.map((menu, index) => {
            if (menu.items) {
              return (
                <AccordionMenu 
                  key={menu.id || `acc-${index}`} 
                  menu={menu} 
                  openMenu={openMenu} 
                  toggleMenu={toggleMenu} 
                  setIsOpen={setIsOpen} 
                />
              );
            } 
            
            return (
              <SingleMenu 
                key={menu.name || `single-${index}`} 
                item={menu} 
                setIsOpen={setIsOpen} 
              />
            );
          })}

        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
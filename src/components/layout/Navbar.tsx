import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineBars3,
  HiOutlineMagnifyingGlass,
  HiOutlineBell,
  HiOutlineChevronDown,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import ConfirmAlert from "@/components/ConfirmAlert";
import { ToastError, ToastLoading, ToastSuccess } from "@/utils/toastHelper";
import { useAuth } from "@/context/AuthContext";
import NotificationDropdown from "../NotificationDropdown";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const formattedName = user?.nama_pengguna
    ? user.nama_pengguna
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Guest";

  const primaryRole =
    user?.peran && user.peran.length > 0 ? user.peran[0].nama : "User";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const executeLogout = async () => {
    setIsLogoutLoading(true);
    const loadingId = ToastLoading("Sedang keluar dari sistem...");
    try {
      await logout();
      ToastSuccess("Anda berhasil keluar", loadingId);
      setIsLogoutAlertOpen(false);
      navigate("/admin/login");
    } catch (error: any) {
      ToastError("Terjadi kesalahan saat keluar", loadingId);
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const fotoAsli = user?.profil?.foto_profile || user?.foto_profile;
  const fotoUrl = fotoAsli
    ? fotoAsli
    : `https://ui-avatars.com/api/?name=${user?.nama_pengguna}&background=D5F0DE&color=185325&size=128&bold=true`;

  return (
    <>
      <header className="h-16 bg-white flex items-center justify-between px-4 md:px-6 border-b border-gray-100 shrink-0 z-10 relative">
        <div className="flex items-center flex-1 gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <HiOutlineBars3 className="w-6 h-6" />
          </button>

          <div className="hidden sm:block flex-1 max-w-md">
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-[#185325] transition-colors">
                <HiOutlineMagnifyingGlass className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Cari.."
                className="w-full bg-gray-50 text-sm rounded-md pl-10 pr-4 py-2 focus:outline-none border border-transparent focus:border-[#185325] focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
              }}
              className="relative cursor-pointer p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            >
              <HiOutlineBell className="w-6 h-6" />
              {primaryRole.toLowerCase().includes("kth") && (
                <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-white">
                  2
                </span>
              )}
            </button>

            {primaryRole.toLowerCase().includes("kth") && (
              <NotificationDropdown
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
              />
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 md:pr-2 md:pl-3 rounded-full md:rounded-lg transition-colors border border-transparent hover:border-gray-100"
            >
              <HiOutlineChevronDown
                className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
              />
              <img
                src={fotoUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-gray-200 object-cover"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-sm font-semibold text-gray-700 capitalize">
                  {formattedName}
                </span>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {primaryRole}
                </span>
              </div>
            </button>

            <div
              className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2 z-50 transform origin-top-right transition-all duration-300 ease-out
              ${isProfileOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 -translate-y-2 pointer-events-none"}`}
            >
              <div className="px-4 py-3 border-b border-gray-100 mb-1 bg-gray-50/50">
                <p className="text-sm font-bold text-gray-800 capitalize truncate">
                  {formattedName}
                </p>
                <p className="text-xs text-gray-500 font-medium mt-0.5 uppercase tracking-wider">
                  {primaryRole}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/admin/profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#185325] hover:bg-[#D5F0DE]/40 transition-colors"
              >
                <HiOutlineUser className="w-5 h-5" /> Profile
              </button>
              <div className="my-1 border-t border-gray-100"></div>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsLogoutAlertOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#185325] hover:bg-red-50 hover:text-red-600 transition-colors group"
              >
                <HiOutlineArrowRightOnRectangle className="w-5 h-5 group-hover:text-red-600" />{" "}
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      <ConfirmAlert
        isOpen={isLogoutAlertOpen}
        title="Keluar Sistem?"
        message="Sesi Anda akan diakhiri dan Anda harus masuk kembali untuk mengakses sistem."
        isDanger={true}
        confirmText="Ya, Keluar"
        isLoading={isLogoutLoading}
        onConfirm={executeLogout}
        onCancel={() => setIsLogoutAlertOpen(false)}
      />
    </>
  );
};

export default Navbar;

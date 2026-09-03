import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import KTHBG from "@/assets/images/KTH Monitoring 1.png";
import { getUserProfile, loginAccount } from "@/services/authService";
import { ToastError, ToastLoading, ToastSuccess } from "@/utils/toastHelper"; 
import { useAuth } from "@/context/AuthContext";

const Login: React.FC = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingId = ToastLoading("Memverifikasi kredensial...");

    try {
      const result = await loginAccount({
        login: loginInput,
        kata_sandi: password,
      });

      const token = result.payload.token;
      localStorage.setItem("token", token);
      const fullUserProfile = await getUserProfile();
      localStorage.setItem("user", JSON.stringify(fullUserProfile));
      setUser(fullUserProfile); 

      ToastSuccess("Berhasil masuk!", loadingId);
      setTimeout(() => {
        navigate("/admin"); 
      }, 500);

    } catch (err: any) {
      localStorage.removeItem("token");
      ToastError(err.message || "Gagal masuk. Periksa kembali data Anda.", loadingId);
    } finally {
      setIsLoading(false);
    }
};
  return (
    <div className="min-h-screen bg-[#F5F6F6] flex items-center justify-center p-4 lg:p-8">
      <div className="max-w-275 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        <div className="bg-white w-full max-w-xl p-8 sm:p-10 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#185325] mb-2">
              Selamat Datang
            </h1>
            <p className="text-[#185325] text-sm font-medium">
              Sistem Monitoring Berbasis Bukti Lapangan
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <InputField
              label="Email / NIP"
              type="text"
              placeholder="Cth: example@gmail.com atau NIP"
              value={loginInput}
              onChange={(e: any) => setLoginInput(e.target.value)}
              required
            />
            
            <InputField
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
              onIconClick={() => setShowPassword(!showPassword)}
              icon={
                showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                )
              }
            />

            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-400">Atau</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              iconRight={
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              }
            >
              Bantuan Akses
            </Button>
          </form>
        </div>

        <div className="hidden lg:flex flex-1 justify-center items-center">
          <img 
            src={KTHBG}
            alt="Ilustrasi Petugas Kehutanan" 
            className="w-full max-w-lg object-contain drop-shadow-sm" 
          />
        </div>

      </div>
    </div>
  );
};

export default Login;
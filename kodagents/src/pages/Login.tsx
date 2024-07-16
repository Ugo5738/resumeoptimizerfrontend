import { GoogleLogin } from '@react-oauth/google';
import React, { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/common/AuthContext';
import BackgroundDesign from "../components/layout/BackgroundDesign";
import Navbar from "../components/layout/Navbar";
import axiosInstance from '../utils/axiosConfig';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleButtonReady, setIsGoogleButtonReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, login } = useAuth();

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGoogleButtonReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (errors.email) {
      emailInputRef.current?.focus();
    } else if (errors.password) {
      passwordInputRef.current?.focus();
    }
  }, [errors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear the error for this field when the user starts typing
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // const response = await axiosInstance.post("https://api.resumeguru.pro/api/token/", {
      const response = await axiosInstance.post("/api/auth/token/", formData);
      await login(response.data.access, response.data.refresh);

      // Check if email is verified
      // const userResponse = await axiosInstance.get("https://api.resumeguru.pro/api/auth/user/", {
      const userResponse = await axiosInstance.get("/api/auth/user/", {
        headers: { Authorization: `Bearer ${response.data.access}` }
      });

      if (!userResponse.data.email_verified) {
        navigate("/email-verification");
      } else {
        // Redirect to the page user was trying to access, or to upload page
        const from = (location.state as any)?.from?.pathname || '/upload';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response) {
        if (error.response.data.detail) {
          // Handle the 'detail' error from TokenObtainPairView
          setErrors({ general: error.response.data.detail });
        } else if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          setErrors({ general: "An unexpected error occurred. Please try again later." });
        }
      } else {
        setErrors({ general: "Unable to connect to the server. Please check your internet connection." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setErrors({});
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/api/auth/google-auth/", {
        credential: credentialResponse.credential,
      });

      await login(response.data.access, response.data.refresh);

      // Get the redirect path from location state, or default to '/upload'
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Google login error:", error);
      if (error.response && error.response.data.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: "Google login failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center overflow-hidden">
      <BackgroundDesign />
      <Navbar />
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-xl z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign in to your account</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              ref={emailInputRef}
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email || errors.general ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Enter Email"
              disabled={isLoading}
            />
            {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              ref={passwordInputRef}
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password || errors.general ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              disabled={isLoading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
          </div>
          {errors.general && <div className="text-red-500 text-sm">{errors.general}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            {isGoogleButtonReady ? (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    console.log('Login Failed');
                    setErrors({ general: "Google login failed. Please try again." });
                  }}
                  useOneTap={true}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>
            ) : (
              <div className="w-full h-[40px] bg-gray-200 animate-pulse rounded-md"></div>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

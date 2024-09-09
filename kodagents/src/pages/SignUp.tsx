import { GoogleLogin } from "@react-oauth/google";
import React, { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import countryList from "react-select-country-list";
import { useAuth } from "../components/contexts/AuthContext";
import BackgroundDesign from "../components/layout/BackgroundDesign";
import Navbar from "../components/layout/Navbar";
import axiosInstance, { isAxiosError } from "../utils/axiosConfig";

interface SignupProps {}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  country?: string;
  general?: string;
}

const Signup: React.FC<SignupProps> = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    country: null as { value: string; label: string } | null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const countries = countryList().getData();
  const { login } = useAuth();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const [isGoogleButtonReady, setIsGoogleButtonReady] = useState(false);

  useEffect(() => {
    // Set a timeout to simulate Google button loading
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
    } else if (errors.confirmPassword) {
      confirmPasswordInputRef.current?.focus();
    }
  }, [errors]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field when the user starts typing
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCountryChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setFormData((prev) => ({ ...prev, country: selectedOption }));
    setErrors((prev) => ({ ...prev, country: undefined }));
  };

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    const signupData = {
      email: formData.email,
      password: formData.password,
      country: formData.country?.value,
    };

    try {
      const response = await axiosInstance.post(
        "/api/auth/signup/",
        signupData
      );
      if (response.data) {
        navigate("/email-verification", {
          state: {
            message:
              "Registration successful. Please check your email to verify your account.",
          },
        });
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const newErrors: FormErrors = {};
          Object.entries(errorData.errors).forEach(([key, value]) => {
            newErrors[key as keyof FormErrors] = value as string;
          });
          setErrors(newErrors);

          // Clear password fields
          setFormData((prev) => ({
            ...prev,
            password: "",
            confirmPassword: "",
          }));
        } else {
          setErrors({
            email:
              "An error occurred during signup. Please check your information and try again.",
          });
        }
      } else {
        setErrors({ email: "An unexpected error occurred. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/auth/google-auth/", {
        credential: credentialResponse.credential,
      });

      if (response.data.access) {
        await login(response.data.access, response.data.refresh);
        navigate("/");
      } else {
        setErrors({
          general:
            "Google signup successful, but no access token received. Please try logging in.",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Google signup error:", error);
      if (isAxiosError(error) && error.response) {
        setErrors({
          general: `Google signup failed: ${
            error.response.data.error || "Unknown error"
          }`,
        });
      } else {
        setErrors({
          general:
            "An unexpected error occurred during Google signup. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClassName = (fieldName: keyof FormErrors) => {
    return `block w-full px-3 py-2 border ${
      errors[fieldName] ? "border-red-500" : "border-gray-300"
    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`;
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center overflow-hidden">
      <BackgroundDesign />
      <Navbar />
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-xl z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create Free Account
        </h2>
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-1">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              ref={emailInputRef}
              className={getInputClassName("email")}
              placeholder="Enter Email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="space-y-1">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className={getInputClassName("password")}
                placeholder="Password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="space-y-1">
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className={getInputClassName("confirmPassword")}
                placeholder="Confirm Password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                disabled={isLoading}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="space-y-1">
            <Select
              options={countries}
              value={formData.country}
              onChange={handleCountryChange}
              placeholder="Select Country"
              isDisabled={isLoading}
              styles={{
                control: (provided, _) => ({
                  ...provided,
                  borderColor: errors.country ? "#ef4444" : "#d1d5db",
                  "&:hover": {
                    borderColor: errors.country ? "#ef4444" : "#9ca3af",
                  },
                }),
              }}
            />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-4 w-full">
            {isGoogleButtonReady ? (
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    // console.log('Login Failed');
                    setErrors({
                      general: "Google login failed. Please try again.",
                    });
                  }}
                  useOneTap={true}
                  theme="outline"
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                />
              </div>
            ) : (
              <div className="w-full h-[40px] bg-gray-200 animate-pulse rounded-md"></div>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

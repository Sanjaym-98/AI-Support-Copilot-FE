import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpUser } from "./authService";
import toast from 'react-hot-toast';

const SignUp = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const name = useRef(null);
  const email = useRef(null);
  const mobile = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameValue = name?.current?.value?.trim();
    const emailValue = email?.current?.value?.trim();
    const mobileValue = mobile?.current?.value?.trim();
    const passwordValue = password?.current?.value;
    const confirmPasswordValue = confirmPassword?.current?.value;

    // Validation
    if (!nameValue || !emailValue || !mobileValue || !passwordValue || !confirmPasswordValue) {
      toast.error("All fields are required");
      return;
    }

    if (nameValue.length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    if (!emailValue.includes("@") || !emailValue.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (mobileValue.length < 10) {
      toast.error("Please enter a valid mobile number (min 10 digits)");
      return;
    }

    if (passwordValue.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (passwordValue !== confirmPasswordValue) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await signUpUser({
        name: nameValue,
        email: emailValue,
        mobile: mobileValue,
        password: passwordValue,
      });

      if (result.success) {
        toast.success("✅ Account created successfully! Please sign in.");
        setMessage("✅ Account created successfully! Please sign in.");
        // Clear form
        name.current.value = "";
        email.current.value = "";
        mobile.current.value = "";
        password.current.value = "";
        confirmPassword.current.value = "";
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } else {
        setMessage(result.message || "Failed to create account. Please try again.");
        toast.error(result.message || "Failed to create account");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://img.magnific.com/premium-photo/cute-small-artificial-intelligence-assistant-robot-with-empty-note_493806-15627.jpg?semt=ais_hybrid&w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Very light overlay - keeps robot colors vibrant */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>
      
      {/* Decorative soft accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg mb-4 border border-white/50 hover:scale-105 transition-transform duration-300">
            <svg
              className="w-10 h-10 text-blue-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight drop-shadow-sm">
            Create Account
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            Join AI Support Copilot
          </p>
        </div>

        {/* Card - White with high opacity for readability */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 p-6">
          {/* Success/Error Message */}
          {message && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${
              message.includes("✅") 
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}>
              {message}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                <input
                  type="text"
                  ref={name}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-gray-900 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                <input
                  type="email"
                  ref={email}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-gray-900 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📱</span>
                <input
                  type="tel"
                  ref={mobile}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-gray-900 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input
                  type="password"
                  ref={password}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-gray-900 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✓</span>
                <input
                  type="password"
                  ref={confirmPassword}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-gray-900 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-600/30"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/" className="text-blue-700 hover:text-blue-800 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        
      </div>
    </div>
  );
};

export default SignUp;
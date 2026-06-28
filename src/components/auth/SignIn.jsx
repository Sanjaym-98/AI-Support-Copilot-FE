

// import React from "react";
// import { validateInput, signInUser } from "./authService";
// import { useRef } from "react";
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addUser } from "./authSlice";
// import { useNavigate, Link } from "react-router-dom";

// const SignIn = () => {
//   const [message, setMessage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [role, setRole] = useState("CUSTOMER"); // "CUSTOMER" or "AGENT"
//   const mobile = useRef(null);
//   const password = useRef(null);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Demo credentials
//   const DEMO_CREDENTIALS = {
//     CUSTOMER: {
//       mobile: "7377162612",
//       password: "1qaz@WSX",
//     },
//     AGENT: {
//       mobile: "8892548947",
//       password: "1qaz@WSX",
//     },
//   };

//   const submitSignIn = async () => {
//     const mobileValue = mobile?.current?.value;
//     const passwordValue = password?.current?.value;

//     // Simple validation
//     if (!mobileValue || !passwordValue) {
//       setMessage("Mobile number and password are required");
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     try {
//       const login = await signInUser(mobileValue, passwordValue);
//       if (login.success) {
//         dispatch(addUser(login.data));
//         if (login?.data?.user?.role === "CUSTOMER") {
//           navigate("/customer/dashboard",{ replace: true });
//         } else {
//           navigate("/agent/dashboard",{ replace: true });
//         }
//       } else {
//         setMessage(login.message || "Invalid credentials. Please try again.");
//       }
//     } catch (error) {
//       setMessage("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRoleSwitch = (selectedRole) => {
//     setRole(selectedRole);
//     // Auto-fill demo credentials
//     const creds = DEMO_CREDENTIALS[selectedRole];
//     if (mobile.current) mobile.current.value = creds.mobile;
//     if (password.current) password.current.value = creds.password;
//     setMessage(null);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
//       <div className="max-w-md w-full">
//         {/* Logo & Brand */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-700 rounded-2xl shadow-lg mb-4">
//             <svg
//               className="w-8 h-8 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
//               />
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8a4 4 0 100 8 4 4 0 000-8z"
//               />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800">AI Support Copilot</h1>
//         </div>

//         {/* Card */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
//           {/* Role Toggle */}
//           <div className="grid grid-cols-2 gap-0 mb-6 border border-gray-200 rounded-xl overflow-hidden">
//             <button
//               type="button"
//               onClick={() => handleRoleSwitch("CUSTOMER")}
//               className={`py-3 text-sm font-medium transition-all duration-200 ${
//                 role === "CUSTOMER"
//                   ? "bg-blue-700 text-white"
//                   : "bg-white text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               👤 Customer
//             </button>
//             <button
//               type="button"
//               onClick={() => handleRoleSwitch("AGENT")}
//               className={`py-3 text-sm font-medium transition-all duration-200 ${
//                 role === "AGENT"
//                   ? "bg-blue-700 text-white"
//                   : "bg-white text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               🎯 Agent
//             </button>
//           </div>

//           {/* Demo Credentials Hint */}
//           <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
//             <div className="flex items-start gap-2">
//               <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <div className="text-xs text-blue-700">
//                 <p className="font-medium">Demo Credentials</p>
//                 <p className="mt-0.5">
//                   Mobile: <span className="font-mono font-semibold">{DEMO_CREDENTIALS[role].mobile}</span>
//                   {" • "}
//                   Password: <span className="font-mono font-semibold">{DEMO_CREDENTIALS[role].password}</span>
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Error Message */}
//           {message && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
//               <p className="text-sm text-red-600">{message}</p>
//             </div>
//           )}

//           {/* Form */}
//           <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Mobile Number
//               </label>
//               <input
//                 type="tel"
//                 ref={mobile}
//                 placeholder="+91 98765 43210"
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 transition"
//                 defaultValue={DEMO_CREDENTIALS[role].mobile}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 ref={password}
//                 placeholder="••••••••"
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 transition"
//                 defaultValue={DEMO_CREDENTIALS[role].password}
//               />
//             </div>

//             <button
//               type="button"
//               onClick={submitSignIn}
//               disabled={loading}
//               className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                   </svg>
//                   Signing in...
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//                   </svg>
//                   Sign in as {role === "CUSTOMER" ? "Customer" : "Agent"}
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Footer */}
//           {role==="CUSTOMER" ?
//           <p className="text-center text-sm text-gray-500 mt-6">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-blue-700 hover:underline font-medium">
//               Sign up
//             </Link>
//           </p>:null}
//         </div>

//         {/* Footer note */}
//         <p className="text-center text-xs text-gray-400 mt-6">
//           Secure login • Powered by AI Support Copilot
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignIn;

import React from "react";
import { signInUser } from "./authService";
import { useRef } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "./authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';

const SignIn = () => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("CUSTOMER");
  const mobile = useRef(null);
  const password = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const DEMO_CREDENTIALS = {
    CUSTOMER: { mobile: "7377162612", password: "1qaz@WSX" },
    AGENT: { mobile: "8892548947", password: "1qaz@WSX" },
  };

  const submitSignIn = async () => {
    const mobileValue = mobile?.current?.value;
    const passwordValue = password?.current?.value;

    if (!mobileValue || !passwordValue) {
      toast.error("Mobile number and password are required");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const login = await signInUser(mobileValue, passwordValue);
      if (login.success) {
        dispatch(addUser(login.data));
        toast.success(`Welcome back, ${login.data.user.name}!`);
        if (login?.data?.user?.role === "CUSTOMER") {
          navigate("/customer/dashboard", { replace: true });
        } else {
          navigate("/agent/dashboard", { replace: true });
        }
      } else {
        setMessage(login.message || "Invalid credentials. Please try again.");
        toast.error(login.message || "Invalid credentials");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSwitch = (selectedRole) => {
    setRole(selectedRole);
    const creds = DEMO_CREDENTIALS[selectedRole];
    if (mobile.current) mobile.current.value = creds.mobile;
    if (password.current) password.current.value = creds.password;
    setMessage(null);
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
      
      {/* Decorative soft accents - subtle to not overpower the robot */}
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
            AI Support Copilot
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            {role === "CUSTOMER" ? "Customer Portal" : "Agent Dashboard"}
          </p>
        </div>

        {/* Card - White with high opacity for readability */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 p-6">
          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-0 mb-6 border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => handleRoleSwitch("CUSTOMER")}
              className={`py-3 text-sm font-medium transition-all duration-300 ${
                role === "CUSTOMER"
                  ? "bg-blue-700 text-white shadow-lg shadow-blue-700/30"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              👤 Customer
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch("AGENT")}
              className={`py-3 text-sm font-medium transition-all duration-300 ${
                role === "AGENT"
                  ? "bg-blue-700 text-white shadow-lg shadow-blue-700/30"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              🎯 Agent
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-xl border border-blue-100/50">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-blue-700">
                <p className="font-medium">Demo Credentials</p>
                <p className="mt-0.5">
                  Mobile: <span className="font-mono font-semibold">{DEMO_CREDENTIALS[role].mobile}</span>
                  {" • "}
                  Password: <span className="font-mono font-semibold">{DEMO_CREDENTIALS[role].password}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
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
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
                  defaultValue={DEMO_CREDENTIALS[role].mobile}
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
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 text-gray-900 transition"
                  defaultValue={DEMO_CREDENTIALS[role].password}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={submitSignIn}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-600/30"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign in as {role === "CUSTOMER" ? "Customer" : "Agent"}
                </>
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
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-700 hover:text-blue-800 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default SignIn;
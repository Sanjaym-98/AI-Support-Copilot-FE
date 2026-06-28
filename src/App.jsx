import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./components/auth/SignIn";
import Support from "./components/shared/Support";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import TicketDetails from "./components/ticket/TicketDetails";
import { Toaster } from 'react-hot-toast';
import PublicRoute from "./components/shared/PublicRoute";
import SignUp from "./components/auth/SignUp";




function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <PublicRoute>
          <SignIn />
        </PublicRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      ),
    },
    {
      path: "/agent/dashboard",
      element: (
        <ProtectedRoute allowedRoles={["AGENT"]}>
          <Support />
        </ProtectedRoute>
      ),
    },
    {
      path: "/customer/dashboard",
      element: (
        <ProtectedRoute allowedRoles={["CUSTOMER"]}>
          <Support />
        </ProtectedRoute>
      ),
    },
    {
      path: "/ticket/:id",
      element: (
        <ProtectedRoute allowedRoles={["CUSTOMER", "AGENT"]}>
          <TicketDetails />
        </ProtectedRoute>
      ),
    },
  ]);
  return (
    <div>
        <Toaster position="top-center" />
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;

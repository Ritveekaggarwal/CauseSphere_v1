import React from "react";
import Home from "./pages/Home.jsx";
import Donor from "./pages/Donor.jsx";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StartCampaign from "./pages/StartCampaign.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { Navbar } from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <Toaster />
      
      <Router>
        {/* <Navbar /> optional, if you want it globally */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donor" element={<Donor />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/start-campaign" element={<StartCampaign />} />
          <Route path="/dashboard" element={<Dashboard />} />

        </Routes>
      </Router>
    </>
  );
};

export default App;
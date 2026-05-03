import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) return;

    await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-6">
      <div className="w-full max-w-md bg-secondary p-8 border border-border">
        <h1 className="font-serif text-4xl mb-6">Reset Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" placeholder="New Password" onChange={(e)=>setPassword(e.target.value)} className="input" />
          <input type="password" placeholder="Confirm Password" onChange={(e)=>setConfirm(e.target.value)} className="input" />

          <button className="btn w-full">Update Password</button>
        </form>
      </div>
    </div>
  );
}
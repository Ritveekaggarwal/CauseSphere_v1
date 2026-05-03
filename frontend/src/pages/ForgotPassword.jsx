import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-6">
      <div className="w-full max-w-md bg-secondary p-8 border border-border">
        <h1 className="font-serif text-4xl mb-6">Forgot Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />

          <button className="btn w-full">Send Reset Link</button>
        </form>

        <Link to="/login" className="block text-center mt-4 text-sm">
          Back to login
        </Link>
      </div>
    </div>
  );
}
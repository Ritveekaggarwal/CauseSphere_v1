import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     const res = await fetch("/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // 🔥 VERY IMPORTANT
  body: JSON.stringify(form),
});

      // localStorage.setItem("token", data.token);
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
    }
  };

  const Input = ({ label, icon, rightIcon, ...props }) => (
    <div className="space-y-1">
      <label className="text-[11px] tracking-[0.2em] text-gray-500 uppercase">
        {label}
      </label>

      <div className="flex items-center border border-white/10 rounded-md px-3 py-3 bg-black/40 focus-within:border-yellow-500 transition">
        {icon && <span className="mr-2 text-gray-500">{icon}</span>}
        <input
          {...props}
          className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-500"
        />
        {rightIcon && <span className="ml-2 cursor-pointer text-gray-500">{rightIcon}</span>}
      </div>
    </div>
  );

  return (
    <>  

    <Navbar />
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0b0b0c] pt-20 text-white">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex relative px-20 items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-black to-black" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-500/10 blur-3xl" />

        <div className="relative max-w-xl space-y-8">
          <p className="text-[11px] tracking-[0.3em] text-yellow-500 uppercase">
            — CauseSphere
          </p>

          <h1 className="font-serif text-6xl leading-[1.1]">
            Welcome <span className="text-yellow-500">back.</span>
            <br />
            The work continues.
          </h1>

          <p className="text-gray-400 text-sm leading-relaxed max-w-md">
            Sign in to track your contributions, follow the campaigns you've
            backed, and discover new causes worth supporting.
          </p>

          <p className="text-[10px] tracking-[0.3em] text-gray-600 uppercase pt-10">
            Compassion over indifference.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-6 lg:px-12">
        <div className="w-full max-w-md">

          <div className="mb-10">
            <p className="text-[11px] tracking-[0.3em] text-yellow-500 uppercase">
              — Sign In
            </p>
            <h2 className="font-serif text-4xl mt-2">
              Continue the journey.
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <Input
              label="Email ID"
              icon={<Mail size={16} />}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <Input
              label="Password"
              type={show ? "text" : "password"}
              icon={<Lock size={16} />}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              rightIcon={
                show ? (
                  <EyeOff size={16} onClick={() => setShow(false)} />
                ) : (
                  <Eye size={16} onClick={() => setShow(true)} />
                )
              }
            />

            <div className="flex justify-end text-xs text-gray-500">
              <Link to="/forgot-password" className="hover:text-yellow-500">
                FORGOT PASSWORD?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#8b6b2e] hover:bg-[#a17c35] text-black py-3 text-sm tracking-[0.2em] uppercase rounded-sm transition"
            >
              Sign In →
            </button>

            <p className="text-center text-sm text-gray-400 pt-4">
              New to CauseSphere?{" "}
              <Link to="/signup" className="text-yellow-500 hover:underline">
                Create an account
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
    </>
  );
}
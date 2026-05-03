import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, User, Phone, MapPin, Lock } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    password: false,
    confirm: false,
  });

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

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
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0b0b0c] text-white">

      {/* LEFT */}
      <div className="hidden lg:flex relative px-20 items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-black to-black" />

        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-500/10 blur-3xl" />

        <div className="relative max-w-xl space-y-8">
          <p className="text-[11px] tracking-[0.3em] text-yellow-500 uppercase">
            — CauseSphere
          </p>

          <h1 className="font-serif text-6xl leading-[1.1]">
            Every act of kindness creates a{" "}
            <span className="text-yellow-500">ripple.</span>
            <br />
            Start yours today.
          </h1>

          <p className="text-gray-400 text-sm leading-relaxed max-w-md">
            Join a verified community of donors and changemakers funding causes
            that matter — with full transparency, every step of the way.
          </p>

          <p className="text-[10px] tracking-[0.3em] text-gray-600 uppercase pt-10">
            Compassion over indifference.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 lg:px-12">
        <div className="w-full max-w-md">

          <div className="mb-10">
            <p className="text-[11px] tracking-[0.3em] text-yellow-500 uppercase">
              — Create Account
            </p>
            <h2 className="font-serif text-4xl mt-2">
              Begin your journey.
            </h2>
          </div>

          <form className="space-y-5">

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                icon={<User size={16} />}
                placeholder="Jane"
                value={form.firstName}
                onChange={set("firstName")}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                value={form.lastName}
                onChange={set("lastName")}
              />
            </div>

            <Input
              label="Email ID"
              icon={<Mail size={16} />}
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                icon={<Phone size={16} />}
                placeholder="+1 555 0123"
                value={form.phone}
                onChange={set("phone")}
              />
              <Input
                label="Location"
                icon={<MapPin size={16} />}
                placeholder="City, Country"
                value={form.location}
                onChange={set("location")}
              />
            </div>

            <Input
              label="Password"
              type={show.password ? "text" : "password"}
              icon={<Lock size={16} />}
              value={form.password}
              onChange={set("password")}
              rightIcon={
                show.password ? (
                  <EyeOff size={16} onClick={() => setShow(s => ({...s, password:false}))} />
                ) : (
                  <Eye size={16} onClick={() => setShow(s => ({...s, password:true}))} />
                )
              }
            />

            <Input
              label="Confirm Password"
              type={show.confirm ? "text" : "password"}
              icon={<Lock size={16} />}
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              rightIcon={
                show.confirm ? (
                  <EyeOff size={16} onClick={() => setShow(s => ({...s, confirm:false}))} />
                ) : (
                  <Eye size={16} onClick={() => setShow(s => ({...s, confirm:true}))} />
                )
              }
            />

            <button
              type="submit"
              className="w-full bg-[#8b6b2e] hover:bg-[#a17c35] text-black py-3 text-sm tracking-[0.2em] uppercase rounded-sm transition"
            >
              Create Account →
            </button>

            <p className="text-center text-sm text-gray-400 pt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-yellow-500 hover:underline">
                Login
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
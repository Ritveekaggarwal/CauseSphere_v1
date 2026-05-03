import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

import { ArrowLeft, Check, Upload } from "lucide-react";

/* ✅ Input OUTSIDE (fix typing bug) */
const Input = ({ label, error, ...props }) => (
  <div>
    <label className="text-[11px] tracking-[0.25em] text-gray-500 uppercase">
      {label}
    </label>

    <input
      {...props}
      className={`w-full mt-2 px-4 py-3 border bg-black/40 text-white text-sm outline-none transition
        ${error ? "border-red-500" : "border-white/10 focus:border-yellow-500"}
      `}
    />

    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

export default function StartCampaign() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    description: "",
    goal: "",
    category: "",
    endDate: "",
    email: "",
    phone: "",
    payoutMethod: "upi",
    upiId: "",
    idDoc: null,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  /* ✅ VALIDATION WITH ERRORS */
  const validateStep = () => {
    const e = {};

    if (step === 1) {
      if (!form.name.trim()) e.name = "Campaign name is required";

      if (!form.description.trim())
        e.description = "Description is required";

      if (!form.goal) e.goal = "Goal amount required";

      if (!form.category) e.category = "Select a category";

      if (!form.endDate) e.endDate = "End date required";

      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email))
        e.email = "Enter valid Gmail (example@gmail.com)";

      if (form.phone.length !== 10)
        e.phone = "Phone must be 10 digits";
    }

    if (step === 2) {
      if (step === 2) {
  if (form.payoutMethod === "upi") {
    if (!form.upiId.trim()) e.upiId = "UPI ID required";
  } else {
    if (!form.bankName.trim()) e.bankName = "Bank name required";
    if (!form.accountName.trim()) e.accountName = "Account holder required";
    if (!form.accountNumber) e.accountNumber = "Account number required";
    if (!form.ifsc) e.ifsc = "IFSC required";
  }
}
    }

    if (step === 3) {
      if (!form.idDoc) e.idDoc = "Upload ID document";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => s + 1);
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/campaign/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      window.location.href = `/dashboard/${data.id}`;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />

    {/* <div className="min-h-screen grid lg:grid-cols-2 bg-[#0b0b0c]  text-white"> */}
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#0b0b0c] text-white pt-20">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between px-20 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black" />
        <div className="absolute bottom-[-150px] left-[-150px] w-[600px] h-[600px] bg-[#e0b24a]/25 blur-[160px]" />

        <div className="relative z-10 space-y-10">
          {/* <p className="text-[11px] tracking-[0.3em] text-yellow-500 uppercase">
            — CauseSphere
          </p> */}

          <div>
            <p className="text-[11px] tracking-[0.3em] text-yellow-500 uppercase mb-4">
              STEP {step} OF 3
            </p>

            <h1 className="font-serif text-5xl leading-tight">
              Tell the world <br />
              <span className="italic">why it matters.</span>
            </h1>
          </div>

          <div className="space-y-3">
            {["Campaign info", "Payout", "Verify"].map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-6 h-6 flex items-center justify-center border text-xs ${
                  step > i + 1
                    ? "bg-yellow-500 text-black"
                    : step === i + 1
                    ? "border-yellow-500 text-yellow-500"
                    : "border-white/20 text-gray-500"
                }`}>
                  {step > i + 1 ? <Check size={12} /> : i + 1}
                </div>
                <span className="text-xs uppercase text-gray-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center px-6 lg:px-12 py-12">
        <div className="w-full max-w-lg mx-auto p-8 bg-black/30 border border-white/10 backdrop-blur-sm">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">

              <Input
                label="Campaign name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                error={errors.name}
              />

              <div>
                <textarea
                  rows={4}
                  placeholder="Describe your campaign..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className={`w-full px-4 py-3 border bg-black/40 text-white text-sm 
                    outline-none resize-none min-h-[120px]
                    ${errors.description ? "border-red-500" : "border-white/10 focus:border-yellow-500"}
                  `}
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <Input
                label="Goal Amount"
                value={form.goal}
                onChange={(e) => set("goal", e.target.value.replace(/\D/g, ""))}
                error={errors.goal}
              />

              <div>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className={`w-full px-4 py-3 border bg-black text-white mt-2
                    ${errors.category ? "border-red-500" : "border-white/10"}
                  `}
                >
                  <option value="">Select category</option>
                  <option value="Medical">Medical</option>
                  <option value="Education">Education</option>
                </select>
                {errors.category && (
                  <p className="text-red-400 text-xs mt-1">{errors.category}</p>
                )}
              </div>

              <Input
                label="End Date"
                type="date"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                error={errors.endDate}
              />

              <Input
                label="Phone"
                value={form.phone}
                onChange={(e) =>
                  set("phone", e.target.value.replace(/\D/g, ""))
                }
                error={errors.phone}
              />

              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) =>
                  set("email", e.target.value.toLowerCase())
                }
                error={errors.email}
              />
            </div>
          )}

          {/* STEP 2 */}
         {step === 2 && (
  <div className="space-y-6">

    {/* OPTION SELECT */}
    <div className="grid grid-cols-2 gap-4">
      {["upi", "bank"].map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => set("payoutMethod", m)}
          className={`p-5 border transition ${
            form.payoutMethod === m
              ? "border-yellow-500 bg-yellow-500/10"
              : "border-white/10 hover:border-yellow-500/40"
          }`}
        >
          <p className="text-xs text-yellow-500 uppercase">
            {m === "upi" ? "Option A" : "Option B"}
          </p>
          <p className="font-serif text-xl mt-1">
            {m === "upi" ? "UPI ID" : "Bank account"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {m === "upi" ? "Instant settlement" : "1–2 business days"}
          </p>
        </button>
      ))}
    </div>

    {/* UPI */}
    {form.payoutMethod === "upi" ? (
      <Input
        label="UPI ID"
        value={form.upiId}
        onChange={(e) => set("upiId", e.target.value)}
        error={errors.upiId}
      />
    ) : (
      <div className="space-y-5">

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Bank name"
            value={form.bankName}
            onChange={(e) => set("bankName", e.target.value)}
            error={errors.bankName}
          />

          <Input
            label="Account holder"
            value={form.accountName}
            onChange={(e) => set("accountName", e.target.value)}
            error={errors.accountName}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Account number"
            value={form.accountNumber}
            onChange={(e) =>
              set("accountNumber", e.target.value.replace(/\D/g, ""))
            }
            error={errors.accountNumber}
          />

          <Input
            label="IFSC code"
            value={form.ifsc}
            onChange={(e) =>
              set("ifsc", e.target.value.toUpperCase())
            }
            error={errors.ifsc}
          />
        </div>
      </div>
    )}
  </div>
)}

          {/* STEP 3 */}
         {step === 3 && (
  <div className="space-y-6">

    {/* ID DOCUMENT */}
    <label
      className={`flex items-center justify-between px-4 py-4 border border-dashed cursor-pointer transition
        ${form.idDoc
          ? "border-yellow-500 bg-yellow-500/5"
          : "border-white/10 hover:border-yellow-500/50"
        }
      `}
    >
      <span className="text-sm">
        {form.idDoc ? form.idDoc.name : "Upload ID (Aadhaar / PAN / Passport)"}
      </span>

      {form.idDoc ? <Check size={16} /> : <Upload size={16} />}

      <input
        type="file"
        className="hidden"
        onChange={(e) => set("idDoc", e.target.files[0])}
      />
    </label>

    {errors.idDoc && (
      <p className="text-red-400 text-xs">{errors.idDoc}</p>
    )}

    {/* SUPPORTING DOC */}
    <label
      className={`flex items-center justify-between px-4 py-4 border border-dashed cursor-pointer transition
        ${form.supportDoc
          ? "border-yellow-500 bg-yellow-500/5"
          : "border-white/10 hover:border-yellow-500/50"
        }
      `}
    >
      <span className="text-sm">
        {form.supportDoc
          ? form.supportDoc.name
          : "Supporting document (optional)"}
      </span>

      {form.supportDoc ? <Check size={16} /> : <Upload size={16} />}

      <input
        type="file"
        className="hidden"
        onChange={(e) => set("supportDoc", e.target.files[0])}
      />
    </label>

    <p className="text-xs text-gray-400">
      Documents are reviewed privately by our verification team.
    </p>

  </div>
)}

          {/* FOOTER */}
          <div className="flex justify-between mt-10">
            <button onClick={back}>← Back</button>

            {step < 3 ? (
              <button
                onClick={next}
                className="bg-yellow-500 px-6 py-2 text-black disabled:opacity-40"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={submit}
                className="bg-yellow-500 px-6 py-2 text-black"
              >
                {loading ? "Loading..." : "Launch"}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
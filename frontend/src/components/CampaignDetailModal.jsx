import { useState, useEffect } from "react";
import jsPDF from "jspdf";


import {
  Star,
  Clock,
  ArrowLeft,
  Check,
  Copy,
  ShieldCheck,
  Download,
  XCircle,
  RotateCw
} from "lucide-react";

const formatINR = (n) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${n.toLocaleString("en-IN")}`;

const QUICK_AMOUNTS = [500, 1000, 2500, 5000, 10000];

export default function CampaignDetailModal({ campaign, open, onClose }) {
  const [step, setStep] = useState("details");
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState("upi");
  const [copied, setCopied] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [donorName, setDonorName] = useState("");
  const [txn, setTxn] = useState(null);

  // ✅ NEW STATES
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle | processing | success | failed


  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

useEffect(() => {
  document.body.style.overflow = open ? "hidden" : "auto";

  if (!open) {
    setStep("details");
    setPaymentStatus("idle");
    setCustomAmount("");
        // ✅ add
    setTxn(null);            // ✅ add
  }
}, [open]);







const downloadReceiptPDF = (txn) => {
  const doc = new jsPDF();

  // Background
  doc.setFillColor(11, 11, 12);
  doc.rect(0, 0, 210, 297, "F");

  // Title
  doc.setTextColor(251, 191, 36);
  doc.setFontSize(12);
  doc.text("PAYMENT SUCCESSFUL", 105, 30, { align: "center" });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text("Thank you,", 105, 50, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.text(txn.donorName || "Guest", 105, 60, { align: "center" });

  // Description
  // doc.setFontSize(10);
  // doc.setTextColor(180, 180, 180);
  // doc.text(
  //   `Your generosity moves ${txn.campaignTitle} closer to its goal.`,
  //   105,
  //   75,
  //   { align: "center", maxWidth: 160 }
  // );

  // Card box
  doc.setDrawColor(60, 60, 60);
  doc.roundedRect(25, 95, 160, 80, 6, 6);

  const rows = [
    ["DONOR", txn.donorName],
    ["CAMPAIGN", txn.campaignTitle],
    ["AMOUNT", `₹${txn.amount}`],
    ["REFERENCE ID", txn.refId],
    ["METHOD", txn.method],
    ["DATE", new Date(txn.at).toLocaleString("en-IN")],
  ];

  let y = 110;

  rows.forEach(([k, v]) => {
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text(k, 30, y);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(v, 180, y, { align: "right" });

    y += 12;
  });

  doc.save(`CauseSphere-${txn.refId}.pdf`);
};

  if (!open || !campaign) return null;

  const pct = Math.min(100, Math.round((campaign.raised / campaign.target) * 100));
  const finalAmount = customAmount ? Number(customAmount) : amount;
  const merchantVpa = `causesphere.${campaign.id}@hdfcbank`;

  // ✅ PAYMENT HANDLER (NO FAKE SUCCESS)
  const handlePayment = async () => {
    try {
      setPaymentStatus("processing");

      const ok = await loadRazorpay();
      if (!ok) {
        setPaymentStatus("failed");
        return;
      }

      const res = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: finalAmount }),
      });

      const order = await res.json();

      const options = {
        key: "rzp_test_RjEb4IZ9ONXxne",
        amount: order.amount,
        currency: "INR",
        name: "CauseSphere",
        description: campaign.title,
        order_id: order.id,

        handler: async function (response) {
          try {
            await fetch("http://localhost:5000/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...response,
                campaignId: campaign._id,
                amount: finalAmount,
                donor: isAnonymous ? "Anonymous" : donorName,
              }),
            });

            // ✅ SET TRANSACTION DATA
            setTxn({
              donorName: isAnonymous ? "Anonymous" : donorName,
              donorEmail: "user@email.com", // 🔥 replace later with real user email
              campaignTitle: campaign.title,
              amount: finalAmount,
              refId: response.razorpay_payment_id,
              method: "UPI",
              at: new Date(),
            });

            // setPaymentStatus("success");
            setStep("success");



          } catch (err) {
            console.error(err);
            setPaymentStatus("failed");
          }
        },

        // ❗ HANDLE FAILURE / CANCEL
        modal: {
          ondismiss: function () {
            // setPaymentStatus("failed");
            // setShowPopup(true);
            setStep("failed");
          },
        },

        theme: {
          color: "#fbbf24",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      setPaymentStatus("failed");
    }
  };



  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">

      <div className="w-full max-w-5xl bg-[#111] text-white rounded-3xl overflow-hidden relative">

        {/* CLOSE */}
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400">
          ✕
        </button>

        {/* STEP 1 */}
        {step === "details" && (
          <div className="flex h-[520px]">

            {/* LEFT IMAGE */}
            <div className="w-1/2 h-full relative">
              <img
                src={campaign.image}
                className="w-full h-full object-cover"
              />

              {/* TAGS */}
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="px-3 py-1 text-[10px] tracking-widest bg-black/60 border border-white/10 rounded-full text-amber-400">
                  {campaign.category?.toUpperCase() || "CAUSE"}
                </span>
                {/* <span className="px-3 py-1 text-[10px] tracking-widest bg-black/60 border border-white/10 rounded-full text-red-400">
          {campaign.urgency?.toUpperCase() || "HIGH"}
        </span> */}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-1/2 h-full px-10 py-10 flex flex-col justify-between">

              <div>
                {/* HEADER */}
                <p className="text-[10px] tracking-[3px] text-amber-400 mb-4">
                  — VERIFIED CAMPAIGN
                </p>

                <h2 className="font-serif text-3xl leading-tight mb-4">
                  {campaign.title}
                </h2>

                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {campaign.description}
                </p>

                {/* META */}
                <div className="flex items-center justify-between text-xs border-y border-white/10 py-4 mb-6">
                  {/* <div className="flex items-center gap-2">
            <Star size={14} className="text-amber-400" />
            {campaign.rating}
          </div> */}

                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    {campaign.daysLeft}d
                  </div>

                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} />
                    Verified
                  </div>
                </div>

                {/* AMOUNT */}
                <div className="mb-2 text-lg font-medium">
                  {formatINR(campaign.raised)}
                  <span className="text-sm text-gray-400 ml-2">
                    raised of {formatINR(campaign.target)}
                  </span>
                </div>

                {/* PROGRESS */}
                <div className="w-full h-[4px] bg-white/10 rounded-full mb-2">
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: pct + "%" }}
                  />
                </div>

                <p className="text-[11px] text-amber-400 tracking-wide">
                  {pct}% FUNDED
                </p>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setStep("amount")}
                  className="flex-1 bg-amber-400 text-black py-4 rounded-full font-medium tracking-wide hover:brightness-110 transition"
                >
                  ♥ DONATE NOW
                </button>

                <button
                  onClick={onClose}
                  className="px-6 border border-white/20 rounded-full text-sm text-white/70 hover:text-white"
                >
                  CLOSE
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === "amount" && (
          <div className="p-10 space-y-6">

            <button onClick={() => setStep("details")} className="text-xs flex gap-2">
              <ArrowLeft size={14} /> Back
            </button>

            <h2 className="text-3xl font-serif">Choose amount</h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {QUICK_AMOUNTS.map(a => (
                <button
                  key={a}
                  onClick={() => { setAmount(a); setCustomAmount(""); }}
                  className={`p-4 border rounded-xl ${amount === a ? "border-amber-400 bg-amber-400/10" : "border-white/10"
                    }`}
                >
                  ₹{a}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full p-3 bg-black border border-white/10 rounded-xl"
            />

            <button
              onClick={() => setStep("method")}
              className="w-full bg-white text-black py-3 rounded-full"
            >
              Continue ₹{finalAmount}
            </button>
            <div className="space-y-3 mt-4">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                />
                Donate anonymously
              </label>

              {!isAnonymous && (
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full p-3 bg-black border border-white/10 rounded-xl"
                />
              )}
            </div>
          </div>

        )}

        {/* STEP 3 */}
        {step === "method" && (
          <div className="p-10 space-y-6">

            <button onClick={() => setStep("amount")} className="text-xs flex gap-2">
              <ArrowLeft size={14} /> Back
            </button>

            <h2 className="text-3xl font-serif">Payment method</h2>

            <button
              onClick={() => setMethod("upi")}
              className="w-full p-4 border rounded-xl border-amber-400 bg-amber-400/10"
            >
              UPI
            </button>

            <button
              onClick={handlePayment}
              className="w-full bg-amber-400 text-black py-3 rounded-full"
            >
              Proceed ₹{finalAmount}
            </button>
          </div>
        )}

        {/* STEP 4 */}
        {/* {step === "upi" && (
          <div className="p-10 space-y-6">

            <button onClick={()=>setStep("method")} className="text-xs flex gap-2">
              <ArrowLeft size={14}/> Back
            </button>

            <h2 className="text-3xl font-serif">Pay ₹{finalAmount}</h2>

            <div className="flex justify-between items-center border p-3 rounded-xl">
              <span>{merchantVpa}</span>
              <button onClick={()=>{
                navigator.clipboard.writeText(merchantVpa);
                setCopied(true);
                setTimeout(()=>setCopied(false),1000);
              }}>
                {copied ? "Copied" : <Copy size={16}/>}
              </button>
            </div>

            <button
              onClick={handlePayment}
              disabled={paymentStatus === "processing"}
              className="w-full bg-amber-400 text-black py-3 rounded-full"
            >
              {paymentStatus === "processing"
                ? "Processing..."
                : `Pay ₹${finalAmount}`}
            </button>

            {paymentStatus === "failed" && (
              <p className="text-red-400 text-sm">Payment failed. Try again.</p>
            )}
          </div>
        )} */}

        {/* STEP 5 */}
        
        {step === "processing" && (
          <div className="p-16 text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
            <div>
              <p className="text-[10px] tracking-editorial uppercase text-gold mb-3">Processing</p>
              <h2 className="font-serif text-3xl text-foreground">Confirming your payment…</h2>
              <p className="text-sm text-muted-foreground mt-3">Please don't close this window.</p>
            </div>
          </div>
        )}

        {step === "success" && txn && (
          <div className="p-10 md:p-14 text-center space-y-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-gold/15 flex items-center justify-center ring-8 ring-gold/5">
              <Check className="h-10 w-10 text-gold" strokeWidth={3} />
            </div>
            <div>
              <p className="text-[10px] tracking-editorial uppercase text-gold mb-3">Payment Successful</p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
                Thank you, <span className="italic">{txn.donorName.split(" ")[0]}.</span>
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mt-4">
                Your generosity moves <span className="text-foreground">{txn.campaignTitle}</span> closer to its goal. A receipt has been emailed to <span className="text-foreground">{txn.donorEmail}</span>.
              </p>
            </div>

            <div className="max-w-md mx-auto rounded-2xl border border-hairline bg-background/50 p-6 text-left space-y-3">
              {[
                ["Donor", txn.donorName],
                ["Campaign", txn.campaignTitle],
                ["Amount", formatINR(txn.amount)],
                ["Reference ID", txn.refId],
                ["Method", txn.method],
                ["Date", new Date(txn.at).toLocaleString("en-IN")],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 text-xs">
                  <span className="tracking-editorial uppercase text-muted-foreground">{k}</span>
                  <span className="text-foreground font-medium text-right truncate">{v}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <button
                onClick={() => downloadReceiptPDF(txn)}
                className="flex-1 h-14 rounded-full bg-gold text-primary-foreground text-xs font-semibold tracking-wider uppercase hover:bg-gold-glow transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" /> Download Receipt
              </button>
              <button
                onClick={onClose}
                className="flex-1 h-14 rounded-full border border-hairline text-xs font-semibold tracking-wider uppercase text-foreground hover:border-foreground/40 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {step === "failed" && txn && (
          <div className="p-10 md:p-14 text-center space-y-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-destructive/15 flex items-center justify-center ring-8 ring-destructive/5">
              <XCircle className="h-10 w-10 text-destructive" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] tracking-editorial uppercase text-destructive mb-3">Payment Failed</p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
                We couldn't process<br /><span className="italic">your contribution.</span>
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mt-4">
                {txn.failureReason} No amount has been debited. You can retry below or download this failure record for your reference.
              </p>
            </div>

            <div className="max-w-md mx-auto rounded-2xl border border-hairline bg-background/50 p-6 text-left space-y-3">
              {[
                ["Donor", txn.donorName],
                ["Campaign", txn.campaignTitle],
                ["Attempted", formatINR(txn.amount)],
                ["Reference ID", txn.refId],
                ["Method", txn.method],
                ["Status", "Failed"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 text-xs">
                  <span className="tracking-editorial uppercase text-muted-foreground">{k}</span>
                  <span className="text-foreground font-medium text-right truncate">{v}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <button
                onClick={() => { setTxn(null); setStep("method"); }}
                className="flex-1 h-14 rounded-full bg-gold text-primary-foreground text-xs font-semibold tracking-wider uppercase hover:bg-gold-glow transition-colors flex items-center justify-center gap-2"
              >
                <RotateCw className="h-4 w-4" /> Retry Payment
              </button>
              <button
                onClick={() => downloadReceiptPDF(txn)}
                className="flex-1 h-14 rounded-full border border-hairline text-xs font-semibold tracking-wider uppercase text-foreground hover:border-foreground/40 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" /> Download Record
              </button>
            </div>
          </div>
        )}
      





      </div>
    </div>
  );  
}
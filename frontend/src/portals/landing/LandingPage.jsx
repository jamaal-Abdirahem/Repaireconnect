/** portals/landing/LandingPage.jsx */
import { useState } from "react";
import {
  Wrench, Zap, MapPin, Shield, Star, Clock, Receipt,
  Car, ChevronRight, CircleDot, X, ArrowLeft, Phone
} from "lucide-react";

const FEATURES = [
  { icon: Zap,     title: "Instant Dispatch",     desc: "The moment you submit a request, our nearest certified technician is alerted and on their way — usually within 15 minutes." },
  { icon: MapPin,  title: "Wherever You Are",      desc: "Stuck on a highway, a back road, or a parking lot — if you have a signal, we can find you." },
  { icon: Shield,  title: "Transparent Pricing",   desc: "See the full inspection report and cost before paying a cent. No surprises, no hidden fees." },
  { icon: Star,    title: "Vetted Technicians",    desc: "Every RepairConnect technician is background-checked, certified, and rated by real customers." },
  { icon: Clock,   title: "24 / 7 Availability",  desc: "Car trouble doesn't follow business hours. Our network operates around the clock, every single day." },
  { icon: Receipt, title: "Pay Only When Fixed",   desc: "You only pay once the job is complete and you're satisfied. Straightforward, every time." },
];

const STEPS = [
  { n: "01", title: "Submit a Request",     desc: "Tell us where you are, your vehicle, and what's wrong. Under 2 minutes." },
  { n: "02", title: "Get Matched",          desc: "We assign the closest available certified technician immediately." },
  { n: "03", title: "Track in Real Time",   desc: "Follow your technician live — assigned, on the way, arrived, working." },
  { n: "04", title: "Approve & Pay",        desc: "Review the work, approve it, pay securely. Back on the road." },
];

const TESTIMONIALS = [
  { name: "Marcus T.",  location: "Highway 45",      text: "Stranded at midnight with a dead battery. RepairConnect had someone there in 18 minutes. Genuinely shocked.", rating: 5 },
  { name: "Priya S.",   location: "Westside",         text: "Flat tyre sorted in 20 minutes and the technician showed me the full cost upfront. No games at all.", rating: 5 },
  { name: "Daniel K.",  location: "Rural area",       text: "I live 40 km from the nearest garage. RepairConnect has genuinely changed my situation. Use it every time.", rating: 5 },
];

export function LandingPage({ onClientEnter, onTechEnter, onAdminEnter }) {
  const [showTechModal, setShowTechModal] = useState(false);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#f59e0b" }}>
              <Wrench size={16} className="text-slate-900" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">RepairConnect</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClientEnter}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
            >
              Sign In
            </button>
            <button
              onClick={onClientEnter}
              className="text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors px-5 py-2 rounded-xl"
            >
              Get Help Now
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        className="pt-28 pb-20 px-5 md:px-8 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e293b 55%, #0f172a 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 20%, #10b981 0%, transparent 40%)"
        }} />
        <div className="max-w-5xl mx-auto relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              <CircleDot size={8} className="animate-pulse" />
              Available 24 / 7 · Nationwide
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Stranded?<br />
              <span style={{ color: "#f59e0b" }}>Help is minutes away.</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              RepairConnect dispatches a certified technician directly to your car — wherever you are.
              No towing, no waiting rooms. Fast, professional roadside repair, on demand.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClientEnter}
                className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-7 py-4 rounded-2xl text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap size={18} /> Request a Technician
              </button>
              <button
                onClick={onClientEnter}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-7 py-4 rounded-2xl text-base transition-all"
              >
                Create Free Account
              </button>
            </div>
            <p className="text-slate-500 text-xs mt-4">No credit card required to register</p>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto mt-16 relative">
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-sm">
            {[
              { v: "< 20 min", l: "avg. response" },
              { v: "4.9 ★",    l: "customer rating" },
              { v: "24 / 7",   l: "availability" },
            ].map(s => (
              <div key={s.l}>
                <p className="text-2xl md:text-3xl font-extrabold text-white">{s.v}</p>
                <p className="text-slate-400 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-5 md:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Back on the road in 4 steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-full w-full h-px bg-gradient-to-r from-amber-300 to-transparent z-0" style={{ width: "calc(100% - 2rem)" }} />
                )}
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center mb-4">
                    <span className="text-slate-900 font-extrabold text-xs">{s.n}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-5 md:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Why RepairConnect</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Everything you need when it matters most</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="bg-gray-50 hover:bg-amber-50 border border-gray-100 hover:border-amber-200 rounded-2xl p-6 transition-all group"
              >
                <div className="w-10 h-10 bg-slate-900 group-hover:bg-amber-400 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <f.icon size={17} className="text-white group-hover:text-slate-900 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-5 md:px-8" style={{ background: "#0f172a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">Real Stories</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">People who've been there</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin size={10} />{t.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-5 md:px-8 bg-amber-400">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Don't wait on the roadside.</h2>
          <p className="text-slate-800 text-lg mb-8">Create a free account and get help the moment you need it.</p>
          <button
            onClick={onClientEnter}
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-8 py-4 rounded-2xl text-base hover:bg-slate-800 transition-all hover:scale-[1.02]"
          >
            <Zap size={18} /> Get Started — It's Free
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 px-5 md:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#f59e0b" }}>
                  <Wrench size={13} className="text-slate-900" />
                </div>
                <span className="text-white font-bold tracking-tight">RepairConnect</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Professional roadside assistance dispatched directly to you. Fast, transparent, 24/7.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-3 text-sm">
              <div className="space-y-2.5">
                <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">Platform</p>
                <button onClick={onClientEnter} className="block text-slate-500 hover:text-white transition-colors">Sign Up</button>
                <button onClick={onClientEnter} className="block text-slate-500 hover:text-white transition-colors">Sign In</button>
              </div>
              <div className="space-y-2.5">
                <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-1">Support</p>
                <span className="block text-slate-500">Help Centre</span>
                <span className="block text-slate-500">Privacy Policy</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs">© 2025 RepairConnect. All rights reserved.</p>

            {/* Staff portal links — subtle, for staff only */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowTechModal(true)}
                className="text-slate-700 hover:text-emerald-500 text-xs transition-colors flex items-center gap-1.5"
              >
                <Wrench size={11} /> Technician login
              </button>
              <span className="text-slate-800 text-xs">·</span>
              <button
                onClick={onAdminEnter}
                className="text-slate-800 hover:text-indigo-400 text-xs transition-colors flex items-center gap-1.5"
              >
                Staff portal
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ── TECHNICIAN MODAL ── */}
      {showTechModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
            <button
              onClick={() => setShowTechModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#10b981" }}>
                <Wrench size={16} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Technician Portal</p>
                <p className="text-xs text-gray-400">RepairConnect Staff</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              This area is for registered RepairConnect technicians only.{" "}
              <button
                onClick={() => { setShowTechModal(false); onClientEnter(); }}
                className="text-slate-900 font-semibold underline"
              >
                Looking for help as a customer?
              </button>
            </p>
            <button
              onClick={() => { setShowTechModal(false); onTechEnter(); }}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
            >
              Continue to Technician Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

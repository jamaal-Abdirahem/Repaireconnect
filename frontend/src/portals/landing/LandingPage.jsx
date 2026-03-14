import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import {
  Wrench,
  Zap,
  MapPin,
  Shield,
  Star,
  Clock,
  Receipt,
  ArrowRight,
  ArrowUpRight,
  X,
  Play,
} from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Dispatch",
    desc: "The moment you submit a request, our nearest certified technician is alerted and on their way — usually within 15 minutes.",
  },
  {
    icon: MapPin,
    title: "Global Coverage",
    desc: "Stuck on a highway or a back road? If you have a signal, we can find you.",
  },
  {
    icon: Shield,
    title: "Transparent Pricing",
    desc: "See the full inspection report and cost before paying a cent. No hidden fees.",
  },
  {
    icon: Star,
    title: "Vetted Techs",
    desc: "Every technician is background-checked and rated by real customers.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    desc: "Car trouble doesn't follow business hours. We operate around the clock.",
  },
  {
    icon: Receipt,
    title: "Pay Only When Fixed",
    desc: "You only pay once the job is complete and you're satisfied. Straightforward.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Submit Request",
    desc: "Tell us your location and issue in under 2 minutes.",
  },
  {
    n: "02",
    title: "Get Matched",
    desc: "We assign the closest certified technician immediately.",
  },
  {
    n: "03",
    title: "Live Tracking",
    desc: "Follow your technician live — assigned, on the way, arrived.",
  },
  {
    n: "04",
    title: "Approve & Pay",
    desc: "Review the work, approve it, and pay securely.",
  },
];

const TESTIMONIALS = [
  {
    name: "Marcus T.",
    role: "Daily Commuter",
    text: "Stranded at midnight with a dead battery. RepairConnect had someone there in 18 minutes. Genuinely shocked.",
    rating: 5,
  },
  {
    name: "Priya S.",
    role: "Roadtrip Enthusiast",
    text: "Flat tyre sorted in 20 minutes and the technician showed me the full cost upfront. No games at all.",
    rating: 5,
  },
  {
    name: "Daniel K.",
    role: "Rural Resident",
    text: "I live 40 km from the nearest garage. RepairConnect has genuinely changed my situation. Use it every time.",
    rating: 5,
  },
  {
    name: "Sarah L.",
    role: "Delivery Driver",
    text: "Time is money for me. The live tracking let me know exactly when help would arrive. Flawless experience.",
    rating: 5,
  },
];

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export function LandingPage() {
  const navigate = useNavigate();
  const onClientEnter = () => navigate("/client");
  const onTechEnter = () => navigate("/technician");
  const onAdminEnter = () => navigate("/admin");
  const [showTechModal, setShowTechModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#0D0D0C] font-sans selection:bg-[#FF5500] selection:text-white overflow-x-hidden relative">
      {/* ── NOISE TEXTURE OVERLAY ── */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-[100]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      ></div>

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${scrolled ? "bg-[#F7F7F5]/90 backdrop-blur-md border-b border-[#E6E6E4] py-2" : "bg-transparent py-6"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img src="/logo.png" alt="RepairConnect Logo" className="w-auto h-12 transform group-hover:scale-105 transition-transform duration-500" />
            <span className="font-display font-bold text-xl md:text-2xl tracking-tight">
              RepairConnect
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
            <button
              onClick={onClientEnter}
              className="hidden md:block text-sm font-bold text-[#0D0D0C] hover:text-[#FF5500] transition-colors uppercase tracking-widest"
            >
              Log in
            </button>
            <button
              onClick={onClientEnter}
              className="text-xs md:text-sm font-bold text-white bg-[#0D0D0C] hover:bg-[#FF5500] transition-colors px-6 py-3 md:px-8 md:py-4 rounded-full flex items-center gap-2 uppercase tracking-widest group"
            >
              Get Help{" "}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO (SAAS SPLIT LAYOUT) ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 min-h-[90vh] flex flex-col justify-center overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E6E6E4_1px,transparent_1px),linear-gradient(to_bottom,#E6E6E4_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>

        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#FF5500] rounded-full blur-[120px] mix-blend-multiply pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: 2,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-[#FF8800] rounded-full blur-[150px] mix-blend-multiply pointer-events-none"
        />

        <div className="relative z-10 px-6 md:px-12 max-w-[1400px] mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="z-10 pr-0 lg:pr-12"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5500]/10 text-[#FF5500] font-bold text-sm tracking-wide mb-8 border border-[#FF5500]/20 backdrop-blur-sm"
              >
                <span className="flex h-2 w-2 rounded-full bg-[#FF5500] animate-pulse"></span>
                REPAIRCONNECT PLATFORM 2.0
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-[2.75rem] sm:text-6xl lg:text-[5.5rem] font-display font-bold leading-[1.1] sm:leading-[1.05] tracking-tight text-[#0D0D0C] mb-6 sm:mb-8"
              >
                The operating system for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] to-[#FF8800]">
                  roadside assistance.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-[#686865] leading-relaxed font-medium max-w-xl mb-10"
              >
                Automate dispatch, track technicians in real-time, and process
                payments instantly. The complete SaaS platform for modern
                recovery fleets and stranded drivers.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <button
                  onClick={onClientEnter}
                  className="inline-flex items-center justify-center gap-3 bg-[#0D0D0C] text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:bg-[#FF5500] hover:shadow-[0_8px_30px_rgba(255,85,0,0.3)]"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => setShowTechModal(true)}
                  className="inline-flex items-center justify-center gap-3 bg-white/80 backdrop-blur-md border border-[#E6E6E4] text-[#0D0D0C] font-bold px-8 py-4 rounded-xl text-lg transition-all hover:border-[#0D0D0C] hover:bg-white shadow-sm"
                >
                  <Play size={20} className="fill-current" /> Book a Demo
                </button>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-6"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-[#F7F7F5] bg-[#E6E6E4] overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-[#FF5500]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} className="fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-[#686865]">
                    Trusted by 10,000+ fleets
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right UI Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="relative mt-12 lg:mt-0 w-full max-w-xl mx-auto lg:max-w-none"
            >
              {/* Main App Window */}
              <div className="relative w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-[#E6E6E4] overflow-hidden z-10">
                {/* Window Header */}
                <div className="h-10 sm:h-12 border-b border-[#E6E6E4] bg-[#F7F7F5]/80 flex items-center px-3 sm:px-4 gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F]"></div>
                  <div className="mx-auto bg-white/50 px-8 sm:px-32 py-1.5 rounded-md border border-[#E6E6E4] text-[10px] font-mono text-[#A0A09C]">
                    app.repairconnect.io
                  </div>
                </div>

                {/* App Content */}
                <div className="p-4 sm:p-6 grid grid-cols-12 gap-4 sm:gap-6 bg-[#F7F7F5]/30">
                  {/* Sidebar */}
                  <div className="hidden sm:block sm:col-span-4 space-y-4">
                    <div className="h-8 w-24 bg-[#E6E6E4] rounded-md mb-8"></div>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-10 rounded-lg ${i === 1 ? "bg-[#FF5500]/10 border border-[#FF5500]/20" : "bg-white border border-[#E6E6E4]"}`}
                      ></div>
                    ))}
                  </div>
                  {/* Main Area */}
                  <div className="col-span-12 sm:col-span-8 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-6 w-32 bg-[#0D0D0C] rounded-md"></div>
                      <div className="h-8 w-24 bg-[#FF5500] rounded-full"></div>
                    </div>
                    {/* Map Placeholder */}
                    <div className="w-full h-48 bg-[#E6E6E4]/50 rounded-xl relative overflow-hidden border border-[#E6E6E4]">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            "radial-gradient(#0D0D0C 1px, transparent 1px)",
                          backgroundSize: "16px 16px",
                        }}
                      ></div>
                      {/* Route Line */}
                      <svg
                        className="absolute inset-0 w-full h-full"
                        preserveAspectRatio="none"
                      >
                        <motion.path
                          d="M 50 150 Q 150 50 250 100 T 400 50"
                          fill="none"
                          stroke="#FF5500"
                          strokeWidth="3"
                          strokeDasharray="6 6"
                          animate={{ strokeDashoffset: [0, -100] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "linear",
                          }}
                        />
                      </svg>
                      {/* Markers */}
                      <div className="absolute top-[40px] right-[80px] w-4 h-4 bg-[#0D0D0C] rounded-full border-2 border-white shadow-md"></div>
                      <div className="absolute bottom-[40px] left-[50px] w-6 h-6 bg-[#FF5500] rounded-full border-2 border-white shadow-md flex items-center justify-center animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-20 bg-white rounded-xl border border-[#E6E6E4] p-3 flex flex-col justify-between"
                        >
                          <div className="h-2 w-8 bg-[#E6E6E4] rounded-full"></div>
                          <div className="h-4 w-16 bg-[#0D0D0C] rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute -right-2 sm:-right-8 top-12 sm:top-32 z-20 scale-75 sm:scale-100 origin-top-right"
              >
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-[#E6E6E4] flex items-center gap-3 sm:gap-4"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#27C93F]/10 flex items-center justify-center">
                    <Shield
                      size={16}
                      className="text-[#27C93F] sm:w-5 sm:h-5"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs font-bold text-[#A0A09C] uppercase tracking-wider">
                      Status
                    </p>
                    <p className="text-sm sm:text-base font-bold text-[#0D0D0C]">
                      Tech Arrived
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute -left-2 sm:-left-12 bottom-24 sm:bottom-20 z-20 scale-75 sm:scale-100 origin-bottom-left"
              >
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-[#E6E6E4] flex items-center gap-3 sm:gap-4"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#FF5500]">
                    <img
                      src="https://i.pravatar.cc/100?img=33"
                      alt="Tech"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-[#0D0D0C]">
                      Mike R.
                    </p>
                    <div className="flex items-center gap-1 text-[#FF5500]">
                      <Star size={10} className="fill-current sm:w-3 sm:h-3" />
                      <span className="text-[10px] sm:text-xs font-bold text-[#0D0D0C]">
                        4.9
                      </span>
                      <span className="text-[10px] sm:text-xs text-[#A0A09C]">
                        (124)
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute -right-2 sm:-right-12 bottom-4 sm:bottom-12 z-20 scale-75 sm:scale-100 origin-bottom-right"
              >
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="bg-[#0D0D0C] p-4 sm:p-5 rounded-2xl shadow-2xl border border-[#2A2A28] flex flex-col gap-2 sm:gap-3 w-40 sm:w-48"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] sm:text-xs font-bold text-[#A0A09C] uppercase tracking-wider">
                      Active Techs
                    </span>
                    <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#27C93F] animate-pulse"></span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-white">
                    1,204
                  </div>
                  <div className="w-full h-1 sm:h-1.5 bg-[#2A2A28] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF5500] w-[78%]"></div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── OUTLINE ANIMATED MARQUEE ── */}
      <div className="w-full overflow-hidden bg-[#0D0D0C] py-8 border-y border-[#2A2A28] relative flex items-center">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="flex whitespace-nowrap font-display font-bold text-4xl md:text-6xl uppercase tracking-widest"
        >
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-8 text-[#FF5500]">•</span>
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1px #F7F7F5" }}
              >
                24/7 DISPATCH
              </span>
              <span className="mx-8 text-[#FF5500]">•</span>
              <span className="text-[#F7F7F5]">NATIONWIDE COVERAGE</span>
              <span className="mx-8 text-[#FF5500]">•</span>
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1px #F7F7F5" }}
              >
                CERTIFIED TECHS
              </span>
              <span className="mx-8 text-[#FF5500]">•</span>
              <span className="text-[#F7F7F5]">TRANSPARENT PRICING</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── STATS (BRUTALIST) ── */}
      <section className="bg-white border-b border-[#E6E6E4]">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#E6E6E4]"
          >
            {[
              { v: "< 15m", l: "Average Response" },
              { v: "4.9/5", l: "Customer Rating" },
              { v: "24/7", l: "Active Availability" },
              { v: "10k+", l: "Repairs Completed" },
            ].map((s, i) => (
              <motion.div
                variants={fadeInUp}
                key={s.l}
                className="flex flex-col justify-center p-8 md:p-12 lg:p-16 text-center lg:text-left hover:bg-[#F7F7F5] transition-colors duration-500"
              >
                <p className="text-4xl md:text-5xl lg:text-7xl font-display font-bold tracking-tighter text-[#0D0D0C] mb-2">
                  {s.v}
                </p>
                <p className="text-[#686865] text-xs md:text-sm font-bold uppercase tracking-widest">
                  {s.l}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CREATIVE GRID FEATURES ── */}
      <section className="bg-[#F7F7F5] py-24 md:py-40">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="max-w-4xl mb-20"
          >
            <h2 className="text-5xl md:text-[6rem] font-display font-bold tracking-tighter text-[#0D0D0C] mb-6 md:mb-8 leading-[0.9] uppercase">
              Engineered for <br />
              <span className="text-[#FF5500]">reliability.</span>
            </h2>
            <p className="text-xl md:text-3xl text-[#686865] leading-relaxed font-medium">
              We stripped away the waiting rooms and hidden fees to build a
              roadside service that actually serves the driver.
            </p>
          </motion.div>

          {/* Interactive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: i * 0.1,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
                key={f.title}
                className="group relative p-10 md:p-12 bg-white rounded-3xl border border-[#E6E6E4] overflow-hidden"
              >
                {/* Hover Fill Animation */}
                <div className="absolute inset-0 bg-[#0D0D0C] rounded-3xl scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-[0.22,1,0.36,1] z-0" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 bg-[#F0F0EE] group-hover:bg-[#FF5500] rounded-2xl flex items-center justify-center mb-16 transition-colors duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                    <f.icon
                      size={28}
                      className="text-[#0D0D0C] group-hover:text-white transition-colors duration-500"
                    />
                  </div>
                  <div className="mt-auto">
                    <h3 className="font-display font-bold text-3xl mb-4 tracking-tight text-[#0D0D0C] group-hover:text-white transition-colors duration-500">
                      {f.title}
                    </h3>
                    <p className="text-[#686865] group-hover:text-[#A0A09C] leading-relaxed text-lg transition-colors duration-500">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL STEPS (IMAGE + SCROLL) ── */}
      <section className="py-24 md:py-40 px-6 md:px-12 max-w-[1400px] mx-auto border-t border-[#E6E6E4]">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Sticky Image Side */}
          <div className="hidden lg:block relative">
            <div className="sticky top-32 w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1000&auto=format&fit=crop"
                alt="Tow truck"
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#FF5500]/20 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0C] to-transparent opacity-80"></div>
              <div className="absolute bottom-12 left-12 right-12">
                <h2 className="text-6xl font-display font-bold text-white mb-4 leading-[0.9] uppercase">
                  How it
                  <br />
                  works
                </h2>
                <p className="text-xl text-[#F7F7F5]/80 font-medium">
                  Four simple steps to get you back on the road. No friction, no
                  stress.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden mb-8">
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-[#0D0D0C] mb-6 leading-[0.9] uppercase">
              How it works
            </h2>
            <p className="text-xl text-[#686865] font-medium">
              Four simple steps to get you back on the road. No friction, no
              stress.
            </p>
          </div>

          {/* Scrolling Steps */}
          <div className="flex flex-col gap-16 md:gap-24 lg:py-32 relative">
            {/* Progress Line */}
            <div className="absolute left-[28px] md:left-[44px] top-0 bottom-0 w-px bg-[#E6E6E4] hidden md:block"></div>

            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex gap-8 md:gap-16 group relative z-10"
              >
                <div className="w-16 h-16 md:w-24 md:h-24 shrink-0 rounded-full bg-white border border-[#E6E6E4] flex items-center justify-center text-2xl md:text-4xl font-display font-bold text-[#0D0D0C] group-hover:bg-[#FF5500] group-hover:text-white group-hover:border-[#FF5500] transition-all duration-500 shadow-sm">
                  {s.n}
                </div>
                <div className="pt-2 md:pt-4">
                  <h3 className="font-display font-bold text-3xl md:text-5xl mb-4 tracking-tight text-[#0D0D0C]">
                    {s.title}
                  </h3>
                  <p className="text-[#686865] text-xl md:text-2xl leading-relaxed font-medium">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HORIZONTAL SCROLLING TESTIMONIALS ── */}
      <section className="border-y border-[#E6E6E4] bg-[#0D0D0C] py-24 md:py-40 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <h2 className="text-5xl md:text-[6rem] font-display font-bold tracking-tighter text-white leading-[0.9] uppercase">
              Driver
              <br />
              <span className="text-[#FF5500]">feedback.</span>
            </h2>
            <div className="flex items-center gap-2 md:gap-3 text-white bg-[#1A1A18] px-6 py-3 md:px-8 md:py-4 rounded-full border border-[#2A2A28]">
              <Star
                size={20}
                className="fill-[#FF5500] text-[#FF5500] md:w-6 md:h-6"
              />
              <span className="font-bold text-lg md:text-xl">4.9/5</span>
              <span className="font-medium text-sm md:text-base text-[#A0A09C]">
                Average rating
              </span>
            </div>
          </motion.div>
        </div>

        {/* Infinite Marquee for Testimonials */}
        <div className="flex gap-8 px-6 md:px-12 pb-8 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
          {/* Duplicated for infinite feel in a real app, here we just allow horizontal scroll */}
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.6,
                delay: (i % 4) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              key={i}
              className="min-w-[320px] md:min-w-[450px] flex flex-col h-full bg-[#1A1A18] p-10 md:p-12 rounded-[2rem] border border-[#2A2A28] snap-center"
            >
              <div className="flex gap-1 mb-8">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={20}
                    className="fill-[#FF5500] text-[#FF5500]"
                  />
                ))}
              </div>
              <p className="text-white text-xl md:text-2xl leading-relaxed mb-12 flex-grow font-medium">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4 pt-8 border-t border-[#2A2A28]">
                <div className="w-14 h-14 rounded-full bg-[#FF5500] text-white flex items-center justify-center font-bold text-xl">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{t.name}</p>
                  <p className="text-[#A0A09C] font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA (MASSIVE & MAGNETIC) ── */}
      <section className="py-32 md:py-52 px-6 md:px-12 bg-[#FF5500] text-white relative overflow-hidden flex items-center justify-center text-center">
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#E64D00_100%)]"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto relative z-10 flex flex-col items-center"
        >
          <h2 className="text-5xl sm:text-[5rem] md:text-[8rem] font-display font-bold leading-[0.85] tracking-[-0.04em] mb-6 md:mb-8 uppercase text-white drop-shadow-lg">
            Ready to drive
            <br />
            with peace of mind?
          </h2>
          <p className="text-white/90 text-xl md:text-3xl font-medium mb-12 md:mb-16 max-w-2xl">
            Create a free account today. Pay only when you need us.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClientEnter}
            className="group inline-flex items-center gap-3 md:gap-4 bg-[#0D0D0C] text-white font-bold px-8 py-4 md:px-16 md:py-8 rounded-full text-xl md:text-3xl transition-all shadow-2xl hover:shadow-[0_0_60px_rgba(13,13,12,0.4)]"
          >
            Get Started{" "}
            <ArrowUpRight
              size={24}
              className="md:w-8 md:h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </motion.button>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0D0D0C] text-[#A0A09C] px-6 md:px-12 pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-16 mb-24">
            <div className="col-span-2 md:col-span-5">
              <div className="flex items-center gap-3 mb-8">
                <img src="/logo.png" alt="RepairConnect Logo" className="w-auto h-16 transform hover:scale-105 transition-transform duration-300" />
                <span className="font-display font-bold text-3xl tracking-tight text-white">
                  RepairConnect
                </span>
              </div>
              <p className="text-xl leading-relaxed max-w-md font-medium">
                The modern infrastructure for roadside assistance. Built for
                speed, transparency, and reliability.
              </p>
            </div>

            <div className="col-span-2 md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-6">
                <p className="font-bold text-white tracking-widest uppercase text-sm">
                  Product
                </p>
                <button
                  onClick={() => navigate("/features")}
                  className="block hover:text-[#FF5500] transition-colors font-medium text-lg"
                >
                  Features
                </button>
                <button
                  onClick={() => navigate("/pricing")}
                  className="block hover:text-[#FF5500] transition-colors font-medium text-lg"
                >
                  Pricing
                </button>
                <button
                  onClick={() => navigate("/coverage")}
                  className="block hover:text-[#FF5500] transition-colors font-medium text-lg"
                >
                  Coverage
                </button>
              </div>
              <div className="space-y-6">
                <p className="font-bold text-white tracking-widest uppercase text-sm">
                  Company
                </p>
                <button
                  onClick={() => navigate("/about")}
                  className="block hover:text-[#FF5500] transition-colors font-medium text-lg"
                >
                  About
                </button>
                <button
                  onClick={() => navigate("/careers")}
                  className="block hover:text-[#FF5500] transition-colors font-medium text-lg"
                >
                  Careers
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="block hover:text-[#FF5500] transition-colors font-medium text-lg"
                >
                  Contact
                </button>
              </div>
              <div className="space-y-6">
                <p className="font-bold text-white tracking-widest uppercase text-sm">
                  Legal
                </p>
                <button
                  onClick={() => navigate("/privacy")}
                  className="block hover:text-[#FF5500] transition-colors font-medium text-lg"
                >
                  Privacy
                </button>
                <button
                  onClick={() => navigate("/terms")}
                  className="block hover:text-[#FF5500] transition-colors font-medium text-lg"
                >
                  Terms
                </button>
              </div>
              <div className="space-y-6">
                <p className="font-bold text-white tracking-widest uppercase text-sm">
                  Portals
                </p>
                <button
                  onClick={() => setShowTechModal(true)}
                  className="block hover:text-[#FF5500] transition-colors font-medium text-lg"
                >
                  Technician
                </button>
                <button
                  onClick={onAdminEnter}
                  className="block hover:text-[#FF5500] transition-colors font-medium text-lg"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-12 border-t border-[#2A2A28]">
            <p className="font-medium text-lg">
              © {new Date().getFullYear()} RepairConnect Inc.
            </p>
            <div className="flex items-center gap-3 text-sm font-bold bg-[#1A1A18] px-6 py-3 rounded-full border border-[#2A2A28]">
              <span className="flex h-3 w-3 rounded-full bg-[#FF5500] animate-pulse"></span>
              <span className="text-white uppercase tracking-widest">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── NATIVE-STYLE MODAL ── */}
      {showTechModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 bg-[#0D0D0C]/60 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-[#E6E6E4]"
          >
            <div className="px-8 py-6 border-b border-[#E6E6E4] flex items-center justify-between bg-[#F7F7F5]">
              <span className="font-display font-bold text-2xl text-[#0D0D0C]">
                Technician Auth
              </span>
              <button
                onClick={() => setShowTechModal(false)}
                className="text-[#686865] hover:text-[#FF5500] transition-colors bg-white p-3 rounded-full shadow-sm border border-[#E6E6E4]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-10">
              <p className="text-[#686865] mb-10 text-xl leading-relaxed font-medium">
                This portal is restricted to verified RepairConnect technicians.
                Please authenticate to access dispatch tools.
              </p>
              <button
                onClick={() => {
                  setShowTechModal(false);
                  onTechEnter();
                }}
                className="w-full py-5 rounded-full bg-[#0D0D0C] text-white font-bold hover:bg-[#FF5500] transition-colors flex items-center justify-center gap-3 text-xl"
              >
                Continue to Login <ArrowRight size={24} />
              </button>
              <button
                onClick={() => {
                  setShowTechModal(false);
                  onClientEnter();
                }}
                className="w-full py-5 mt-4 rounded-full bg-[#F7F7F5] text-[#0D0D0C] font-bold hover:bg-[#E6E6E4] transition-colors text-xl"
              >
                I'm a customer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Global CSS for hide-scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

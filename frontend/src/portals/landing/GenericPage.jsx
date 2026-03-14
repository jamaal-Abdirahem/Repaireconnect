import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Wrench, ArrowRight, Play, MapPin } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export function GenericPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const onClientEnter = () => navigate("/client");
  const onTechEnter = () => navigate("/technician");
  const onAdminEnter = () => navigate("/admin");
  const [showTechModal, setShowTechModal] = useState(false);

  const pageTitle =
    location.pathname.replace("/", "").charAt(0).toUpperCase() +
    location.pathname.slice(2);
  const titles = {
    "/features": "Features",
    "/pricing": "Pricing",
    "/coverage": "Coverage",
    "/about": "About",
    "/careers": "Careers",
    "/contact": "Contact",
    "/privacy": "Privacy Policy",
    "/terms": "Terms of Service",
  };
  const title = titles[location.pathname] || "Page Not Found";

  const contents = {
    "/features": (
      <div className="space-y-6 text-lg text-[#686865]">
        <p>
          RepairConnect offers a comprehensive suite of tools for both clients
          and technicians. Our platform ensures that finding roadside assistance
          is as easy as tapping a button.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Real-time Tracking:</strong> See exactly where your
            technician is on the map.
          </li>
          <li>
            <strong>Instant Quotes:</strong> Get upfront pricing before you
            request service.
          </li>
          <li>
            <strong>Automated Dispatch:</strong> Our AI matches you with the
            nearest qualified technician.
          </li>
          <li>
            <strong>Secure Payments:</strong> Pay securely through the app once
            the job is done.
          </li>
        </ul>
      </div>
    ),
    "/pricing": (
      <div className="space-y-6 text-lg text-[#686865]">
        <p>
          Transparent pricing with no hidden fees. You only pay for the service
          you need.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="p-8 bg-white rounded-3xl shadow-sm border border-[#E6E6E4]">
            <h3 className="text-2xl font-bold text-[#0D0D0C] mb-4">
              Standard Callout
            </h3>
            <p className="text-4xl font-display font-bold text-[#0D0D0C] mb-6">
              $49
              <span className="text-sm font-normal text-[#686865]">/base</span>
            </p>
            <p>
              Plus the cost of specific services (e.g., fuel delivery, jump
              start, tire change).
            </p>
          </div>
          <div className="p-8 bg-[#0D0D0C] text-white rounded-3xl shadow-sm border border-[#0D0D0C]">
            <h3 className="text-2xl font-bold mb-4">Premium Membership</h3>
            <p className="text-4xl font-display font-bold text-[#FF5500] mb-6">
              $12
              <span className="text-sm font-normal text-[#A0A09C]">/month</span>
            </p>
            <p className="text-[#A0A09C]">
              Includes 3 free callouts per year, priority dispatch, and
              discounted service rates.
            </p>
          </div>
        </div>
      </div>
    ),
    "/coverage": (
      <div className="space-y-6 text-lg text-[#686865]">
        <p>
          We are rapidly expanding our network of qualified technicians across
          the country. Currently, RepairConnect is fully operational in the
          following metropolitan areas:
        </p>
        <ul className="grid grid-cols-2 gap-4 mt-8 font-medium">
          <li className="flex items-center gap-2">
            <MapPin size={20} className="text-[#FF5500]" /> Mogadishu
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={20} className="text-[#FF5500]" /> Hargeisa
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={20} className="text-[#FF5500]" /> Kismayo
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={20} className="text-[#FF5500]" /> Baidoa
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={20} className="text-[#FF5500]" /> Bosaso
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={20} className="text-[#FF5500]" /> Garowe
          </li>
        </ul>
        <p className="mt-8">
          Don't see your city? We are adding new locations every month!
        </p>
      </div>
    ),
    "/about": (
      <div className="space-y-6 text-lg text-[#686865]">
        <p className="text-2xl leading-relaxed text-[#0D0D0C] mb-8 font-medium">
          RepairConnect was founded with a simple mission: to make roadside
          breakdowns less stressful.
        </p>
        <p>
          We believe that sitting on the side of a busy highway waiting for a
          tow truck shouldn't involve endless phone calls and uncertain ETAs. By
          leveraging modern mobile technology and connecting drivers directly to
          local, vetted technicians, we've built the "Uber for Mechanics".
        </p>
        <p>
          Our team consists of automotive experts, software engineers, and
          logistics professionals dedicated to reinventing roadside assistance.
        </p>
      </div>
    ),
    "/careers": (
      <div className="space-y-6 text-lg text-[#686865]">
        <p>
          Help us build the future of automotive mobility. We are always looking
          for passionate individuals to join our growing team.
        </p>
        <div className="mt-8 space-y-6">
          <div className="p-6 bg-white border border-[#E6E6E4] rounded-2xl flex justify-between items-center group cursor-pointer hover:border-[#FF5500] transition-colors">
            <div>
              <h4 className="text-xl font-bold text-[#0D0D0C] mb-1">
                Senior Frontend Engineer
              </h4>
              <p>Remote • Full-time</p>
            </div>
            <ArrowRight className="text-[#A0A09C] group-hover:text-[#FF5500]" />
          </div>
          <div className="p-6 bg-white border border-[#E6E6E4] rounded-2xl flex justify-between items-center group cursor-pointer hover:border-[#FF5500] transition-colors">
            <div>
              <h4 className="text-xl font-bold text-[#0D0D0C] mb-1">
                Operations Manager
              </h4>
              <p>Chicago, IL • Full-time</p>
            </div>
            <ArrowRight className="text-[#A0A09C] group-hover:text-[#FF5500]" />
          </div>
        </div>
      </div>
    ),
    "/contact": (
      <div className="space-y-8 text-lg text-[#686865] max-w-2xl">
        <p>
          Have questions? We'd love to hear from you. Fill out the form below
          and our team will get back to you within 24 hours.
        </p>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#0D0D0C] uppercase tracking-wider">
                First Name
              </label>
              <input
                type="text"
                className="w-full bg-white border border-[#E6E6E4] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF5500]"
                placeholder="Jane"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#0D0D0C] uppercase tracking-wider">
                Last Name
              </label>
              <input
                type="text"
                className="w-full bg-white border border-[#E6E6E4] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF5500]"
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0D0D0C] uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-white border border-[#E6E6E4] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF5500]"
              placeholder="jane@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0D0D0C] uppercase tracking-wider">
              Message
            </label>
            <textarea
              className="w-full bg-white border border-[#E6E6E4] px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF5500] min-h-[120px]"
              placeholder="How can we help?"
            ></textarea>
          </div>
          <button className="bg-[#0D0D0C] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#FF5500] transition-colors">
            Send Message
          </button>
        </form>
      </div>
    ),
    "/privacy": (
      <div className="space-y-6 text-lg text-[#686865]">
        <p>Last updated: October 2023</p>
        <h3 className="text-2xl font-bold text-[#0D0D0C] mt-8 mb-4">
          1. Information We Collect
        </h3>
        <p>
          We collect information you provide directly to us when you create an
          account, request services, or contact customer support. This includes
          your name, phone number, email address, payment information, and
          location data.
        </p>
        <h3 className="text-2xl font-bold text-[#0D0D0C] mt-8 mb-4">
          2. How We Use Information
        </h3>
        <p>
          We use the information we collect to provide, maintain, and improve
          our services, including matching you with nearby technicians and
          processing payments securely.
        </p>
      </div>
    ),
    "/terms": (
      <div className="space-y-6 text-lg text-[#686865]">
        <p>Last updated: October 2023</p>
        <h3 className="text-2xl font-bold text-[#0D0D0C] mt-8 mb-4">
          1. Acceptance of Terms
        </h3>
        <p>
          By accessing or using the RepairConnect platform, you agree to be
          bound by these Terms of Service and all applicable laws and
          regulations.
        </p>
        <h3 className="text-2xl font-bold text-[#0D0D0C] mt-8 mb-4">
          2. User Responsibilities
        </h3>
        <p>
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activities that occur under your
          account. You agree to provide accurate, current, and complete
          information.
        </p>
      </div>
    ),
  };

  const defaultContent = (
    <div className="text-lg text-[#686865]">
      <p>
        Content for this section is currently being updated. Please check back
        soon.
      </p>
    </div>
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#0D0D0C] font-sans selection:bg-[#FF5500] selection:text-white overflow-x-hidden relative flex flex-col">
      {/* ── NOISE TEXTURE OVERLAY ── */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-[100]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
        }}
      ></div>

      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${scrolled ? "bg-[#F7F7F5]/90 backdrop-blur-md border-b border-[#E6E6E4] py-2" : "bg-transparent py-6"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <div
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo.png"
              alt="RepairConnect Logo"
              className="w-auto h-12 transform group-hover:scale-105 transition-transform duration-500"
            />
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
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6 md:px-12 max-w-[1400px] mx-auto flex-1 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6E6E4] text-[#0D0D0C] text-xs font-bold tracking-widest uppercase mb-8">
            <div className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
            RepairConnect Information
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9] mb-8">
            {title}
          </h1>

          <div className="mb-12 max-w-4xl">
            {contents[location.pathname] || defaultContent}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/")}
              className="bg-[#FF5500] hover:bg-[#E64D00] text-white px-8 py-5 rounded-full font-bold text-lg transition-colors flex items-center justify-center gap-2 uppercase tracking-wide group"
            >
              Back to Home{" "}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0D0D0C] text-[#A0A09C] px-6 md:px-12 pt-24 pb-12 mt-auto">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-16 mb-24">
            <div className="col-span-2 md:col-span-5">
              <div
                className="flex items-center gap-3 mb-8 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <img
                  src="/logo.png"
                  alt="RepairConnect Logo"
                  className="w-auto h-16 transform hover:scale-105 transition-transform duration-300"
                />
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
            <p className="text-lg font-medium">
              © {new Date().getFullYear()} RepairConnect Inc.
            </p>
            <div className="flex gap-8">
              <span className="hover:text-white transition-colors cursor-pointer font-medium text-lg">
                Twitter
              </span>
              <span className="hover:text-white transition-colors cursor-pointer font-medium text-lg">
                LinkedIn
              </span>
              <span className="hover:text-white transition-colors cursor-pointer font-medium text-lg">
                GitHub
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

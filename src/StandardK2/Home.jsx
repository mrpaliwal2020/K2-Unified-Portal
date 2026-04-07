import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const ctaItem = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const sectionFadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const cardContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const faqs = [
    {
      q: "What is the K2 app?",
      a: "K2 is an all-in-one agriculture platform for farmers, workers, and FPOs. It helps manage farms, hire labor, rent machines, and access markets easily.",
    },
    {
      q: "Who can use the K2 app?",
      a: "Farmers, technicians, machine owners, and FPOs can all use the app. It's designed to support every stakeholder in the farming ecosystem.",
    },
    {
      q: "Is K2 available in regional languages?",
      a: "Yes, the app supports 10+ Indian languages and uses icon-based design. This ensures easy use for rural users with limited digital literacy.",
    },
    {
      q: "What services does K2 provide?",
      a: "It offers farm tracking, labor/machine booking, marketplace, and FPO tools. Everything a farmer needs is available in one platform.",
    },
    {
      q: "Is the K2 app free to use?",
      a: "Yes, it's free for farmers and basic users. Some premium features may be introduced in the future.",
    },
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    await fetch("https://formsubmit.co/Info@ambaokrishikutumb.com", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });
    setEmail("");
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  const playstore =
    "https://play.google.com/store/apps/details?id=com.ambaokrishikutumb.k2k&pli=1";
  const openApp = () => window.open(playstore, "_blank", "noopener,noreferrer");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Header />

      {/* ── Hero Section ── */}
      <main
        className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 pt-32 pb-16 md:py-16 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/Images/bg.png')", minHeight: "100vh" }}
      >
        {/* Hero background image zoom-in */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/Images/bg.png')" }}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Hero text content — staggered children */}
        <motion.div
          className="text-center md:text-left max-w-xl space-y-6 relative z-10"
          variants={heroContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            variants={heroItem}
            className="bg-white text-black px-5 py-1 rounded-xl shadow hover:bg-green-700 hover:text-white transition"
          >
            Trusted by Thousands!
          </motion.button>

          <motion.h1
            variants={heroItem}
            className="text-5xl font-semibold leading-tight"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            Rooted in Tradition.
          </motion.h1>

          <motion.h1
            variants={heroItem}
            className="text-5xl font-semibold leading-tight"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            Powered by <span className="text-green-600">Innovation</span>
          </motion.h1>

          <motion.p variants={heroItem} className="text-gray-700">
            K2 is a unified agri-platform connecting farmers, workers, FPOs, and
            services in one smart ecosystem. From soil to market, manage
            everything in your language, your way — easily, efficiently,
            powerfully.
          </motion.p>

          <motion.div
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <motion.button
              variants={ctaItem}
              onClick={openApp}
              className="bg-green-700 text-white px-6 py-2 rounded-xl hover:bg-green-800 transition"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started
            </motion.button>
            <motion.button
              variants={ctaItem}
              onClick={openApp}
              className="text-green-900 px-6 py-2 rounded-xl hover:bg-green-800 hover:text-white transition"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Learn more
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Hero image — fade in with zoom */}
        <motion.div
          className="mt-10 md:mt-0 relative z-10"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <img
            src="/Images/girl.png"
            alt="Hero Image"
            className="w-48 md:w-56 lg:w-64 relative lg:absolute lg:left-[70%] lg:top-[18%]"
          />
        </motion.div>

        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
          <span className="animate-bounce text-3xl text-white">↓</span>
        </div>
      </main>

      {/* ── Services Section ── */}
      <section className="text-center py-16 px-4 bg-gray-50">
        <motion.h5
          className="text-green-700 font-semibold mb-2 uppercase tracking-wide"
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          Services
        </motion.h5>
        <motion.h1
          className="text-3xl md:text-4xl font-semibold pb-10"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          Elevating Excellence Beyond Expectations
        </motion.h1>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-10"
          variants={cardContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {[
            {
              img: "/Images/tracktor.webp",
              title: "Machine Rental",
              desc: "Easily find and book nearby farm machinery for rent, saving time and cost.",
            },
            {
              img: "/Images/men1.jpg",
              title: "Labour / Technician Hire",
              desc: "Hire skilled workers and technicians for farm tasks, repairs, and expert services.",
            },
            {
              img: "/Images/men2.jpg",
              title: "Group Farming / FPO",
              desc: "Collaborate with farmer groups or FPOs for shared resources, planning, and better market access.",
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              variants={cardItem}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-2xl transition duration-300 text-left"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {card.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">{card.desc}</p>
              <button
                onClick={openApp}
                className="inline-flex items-center text-green-700 font-semibold hover:underline"
              >
                Get the App for More
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          onClick={openApp}
          className="bg-green-700 text-white px-8 py-2 rounded-full text-sm font-semibold hover:bg-green-800 transition"
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          View more
        </motion.button>
      </section>

      {/* ── Features Section ── */}
      <section className="text-center py-16 px-4 bg-white">
        <motion.h5
          className="text-green-700 font-semibold mb-2 uppercase tracking-wide"
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          Features
        </motion.h5>
        <motion.h1
          className="text-3xl md:text-4xl font-bold pb-10 font-serif"
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          Elevate Your Ambitions with Purpose
        </motion.h1>

        <div className="flex flex-col lg:flex-row items-start gap-10 max-w-6xl mx-auto">
          <motion.div
            className="w-full lg:w-[30%] flex justify-center"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <img
              src="/Images/men3.png"
              alt="Illustration"
              className="w-[400px] h-auto"
            />
          </motion.div>

          <motion.div
            className="w-full lg:w-[70%] grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"
            variants={cardContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              {
                icon: "fa-tractor",
                title: "For Farmers",
                desc: "Connect, share experiences, and learn sustainable practices from fellow farming experts.",
              },
              {
                icon: "fa-people-roof",
                title: "For Workers",
                desc: "Collaborate, upskill, and support modern agriculture with shared tools and expertise.",
              },
              {
                icon: "fa-screwdriver-wrench",
                title: "For Technicians",
                desc: "Exchange knowledge, improve farming systems, and enable smart, tech-driven solutions together.",
              },
              {
                icon: "fa-lightbulb",
                title: "For Innovators",
                desc: "Bring new ideas, tools, and technology to revolutionize modern agricultural practices.",
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={cardItem}
                className="border border-green-200 rounded-xl p-5 text-left h-[160px] shadow-sm"
                whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <i
                    className={`fa-solid ${f.icon} text-green-700 text-lg mt-1`}
                  ></i>
                  <h3 className="font-semibold text-[17px]">{f.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-snug">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="text-center pt-16 px-4 bg-gray-50 flex flex-col justify-center items-center mb-10">
        <motion.h5
          className="text-green-700 font-semibold mb-2 uppercase tracking-wide"
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          FAQs Section
        </motion.h5>
        <motion.h1
          className="text-3xl md:text-4xl font-semibold font-serif mb-6"
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          Frequently Asked Questions
        </motion.h1>
      </section>

      <motion.div
        className="w-full md:w-3/4 lg:w-1/2 border-2 border-gray-200 rounded-xl p-4 mx-auto -mt-2"
        variants={cardContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            variants={cardItem}
            className={`bg-white p-5 rounded-xl shadow-md ${i < faqs.length - 1 ? "mb-4" : ""}`}
          >
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-left flex justify-between items-center text-lg md:text-xl font-medium text-gray-800"
            >
              <span>{faq.q}</span>
              <i
                className={`fa-solid fa-chevron-down text-gray-500 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
              ></i>
            </button>
            {openFaq === i && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="mt-4 text-gray-600 text-sm leading-relaxed"
              >
                <p>{faq.a}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      <div className="py-10 flex justify-center">
        <motion.button
          onClick={openApp}
          className="bg-green-700 text-white px-8 py-2 rounded-full text-sm font-semibold hover:bg-green-800 transition"
          variants={sectionFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          View more
        </motion.button>
      </div>

      {/* ── Subscribe Section ── */}
      <motion.section
        style={{ backgroundColor: "#eef9d4" }}
        className="py-12 mx-4 sm:mx-10 rounded-xl my-10"
        variants={sectionFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-4 px-4">
          <h5 className="text-2xl text-gray-600 font-semibold">
            NEVER MISS AN UPDATE!
          </h5>
          <h1
            className="text-3xl font-bold text-gray-800"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            Subscribe to Our Newsletter
          </h1>
          <form
            onSubmit={handleSubscribe}
            className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              required
              className="px-3 py-2 border border-green-700 rounded-md w-full sm:w-64 bg-mauve-50"
            />
            <motion.button
              type="submit"
              className="px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Subscribe Now
            </motion.button>
          </form>
          {subscribed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-green-700 bg-green-100 px-4 py-2 rounded-md text-center inline-block"
            >
              Thanks for subscribing!
            </motion.div>
          )}
        </div>
      </motion.section>

      <Footer />
    </motion.div>
  );
};

export default Home;

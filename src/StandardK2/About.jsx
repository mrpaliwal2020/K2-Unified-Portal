import React from 'react';
import { motion } from "framer-motion";
import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const About = () => {
  const playstore = "https://play.google.com/store/apps/details?id=com.ambaokrishikutumb.k2k&pli=1";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Header />

      {/* ── Hero Section ── */}
      <section className="bg-gray-50 px-6 sm:px-8 md:px-12 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* Left Content — slide in from left */}
          <motion.div
            className="order-2 md:order-1"
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              className="mb-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <span className="inline-block text-gray-700 px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                Who we are!
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              Together, We<br />
              Cultivate a <span className="text-green-600">Future</span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg text-gray-600 mb-6"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              K2 is an all-in-one digital platform for farmers, workers, FPOs, and agri-service providers.
              It simplifies farming, hiring, renting, and selling through smart tools, regional languages, and intuitive design.
            </motion.p>

            <motion.div
              className="mb-8"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.a
                href={playstore}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm sm:text-base font-semibold transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started
              </motion.a>
            </motion.div>

            {/* Quote */}
            <motion.div
              className="bg-green-50 border border-green-200 p-4 sm:p-5 rounded-lg"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="text-gray-800 italic mb-3 text-sm sm:text-base">
                "I started this platform to bridge the gaps in agriculture—so every farmer, worker, and agri-stakeholder can grow together"
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-black"></div>
                <span className="text-xs sm:text-sm text-gray-700">
                  <strong className="text-black">Mohan Paliwal</strong> - Founder, Krishi Kutumb
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image — slide in from right */}
          <motion.div
            className="order-1 md:order-2 flex justify-center"
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <img
              src="/Images/who1.png"
              alt="Farmer Woman"
              className="rounded-xl w-full max-w-xs sm:max-w-sm md:max-w-md shadow-md -rotate-3 hover:rotate-0 transition duration-300 ease-in-out"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Edge Section ── */}
      <section className="py-12 sm:py-16 px-6 sm:px-8 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">

          <motion.div
            className="text-center mb-8 sm:mb-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.p variants={fadeUp} className="text-green-600 font-medium mb-2 text-sm sm:text-base">
              Our Edge
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold">
              What makes us different
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">

            {/* Left Content — slide in from left */}
            <motion.div
              variants={slideLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <motion.p variants={fadeUp} className="text-gray-700 mb-4 text-sm sm:text-base">
                  We don't just provide services — we build experiences that put people first.
                  Every decision at K2 is rooted in understanding your time, your needs, and your trust.
                </motion.p>
                <motion.p variants={fadeUp} className="text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base">
                  With a transparent, tech-enabled, and deeply human approach, we aim to bridge gaps
                  in access, opportunity, and collaboration across Indian agriculture.
                </motion.p>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 gap-3 sm:gap-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {[
                  { label: "Founding Year", value: "2023" },
                  { label: "Pilots Conducted", value: "2 events" },
                  { label: "Stakeholders Reached", value: "350+" },
                  { label: "Members", value: "10+" },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    variants={fadeUp}
                    className="border border-green-200 rounded-lg p-3 sm:p-4 text-center"
                    whileHover={{ scale: 1.04 }}
                  >
                    <p className="text-gray-500 text-xs sm:text-sm mb-1">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-semibold">{stat.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Image — slide in from right */}
            <motion.div
              className="flex justify-center mt-6 sm:mt-0"
              variants={slideRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <img
                src="/Images/whp2.png"
                alt="Farm scene"
                className="w-full max-w-sm sm:max-w-md rounded-xl -rotate-6 hover:rotate-0 transition duration-300 ease-in-out"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default About;

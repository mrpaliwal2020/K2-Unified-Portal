import React from "react";
import { motion } from "framer-motion";
import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const imgReveal = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const Blog1 = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* ── Blog Header ── */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            Why Every FPO Needs a Digital Platform
          </motion.h1>
          <motion.p
            className="text-gray-700 font-semibold text-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Empowering collective farming through smart tech
          </motion.p>
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <img
              src="/Images/blog1_pictures/blog1_1.png"
              alt="Digital Farming"
              className="w-full max-w-4xl mx-auto rounded-lg shadow-md"
            />
          </motion.div>
        </div>

        {/* ── Blog Sections ── */}
        <div className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto space-y-8">
          {/* Introduction */}
          <motion.section
            className="bg-white p-6 rounded-lg shadow-sm"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-gray-600 leading-relaxed text-lg">
              Farmer Producer Organizations (FPOs) are revolutionizing how small
              and marginal farmers operate by offering them collective
              strength—be it for buying inputs in bulk, Getting fair market
              prices, or accessing credit and government schemes. But despite
              their massive potential, most FPOs are still managing everything
              manually—ledgers, crop plans, attendance, labor, expenses—all on
              paper or basic spreadsheets. This Not Only wastes time but also
              leads to poor decision-making, weak planning, and no real
              visibility into what's working. In today's fast-changing agri
              landscape, going digital is not just a good idea—it's the next
              step forward for survival, growth, and scale.
            </p>
          </motion.section>

          {/* Challenges */}
          <motion.section
            className="bg-white p-6 rounded-lg shadow-sm"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
            >
              The Common Challenges Faced by FPOs
            </motion.h2>
            <motion.div variants={imgReveal} className="mb-6">
              <img
                src="/Images/blog1_pictures/blog1_2.png"
                alt="Farming Challenges"
                className="w-full rounded-lg shadow-sm"
              />
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-gray-600 leading-relaxed text-lg"
            >
              Most FPOs are still stuck with scattered member data, unclear
              admin roles, and no structured way to assign tasks or manage
              units. Crop activities are done without centralized planning, and
              group demands for agri inputs are raised in silos—often too late.
              Financial records are difficult to track, audits are a headache,
              and there's barely any system for real-time communication or
              updates. This makes FPOs slow, reactive, and difficult to scale.
              With limited tools, even the most motivated FPO leaders struggle
              to organize Operations Smartly.
            </motion.p>
          </motion.section>

          {/* K2 Empowers */}
          <motion.section
            className="bg-white p-6 rounded-lg shadow-sm"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl md:text-3xl font-bold text-black-800 mb-4"
            >
              How Krishi Kutumb (K2) Empowers FPOs
            </motion.h2>
            <motion.div variants={imgReveal} className="mb-6">
              <img
                src="/Images/blog1_pictures/blog1_3.png"
                alt="Krishi Kutumb Empowers FPOs"
                className="w-full rounded-lg shadow-sm"
              />
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-gray-600 leading-relaxed text-lg mb-4"
            >
              Krishi Kutumb isn't just another agri-tech app—it's a complete
              digital operating system made for FPOs. Right from setting up your
              FPO structure to assigning crop activities and managing worker
              data, everything becomes organized under one smart system. Admins
              can create multiple units, assign roles, add farmers, workers, or
              technicians, and maintain a structured member database with
              verified profiles. This builds a strong base for planning and
              communication.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="text-gray-600 leading-relaxed text-lg"
            >
              Crop planning becomes smarter with K2's activity scheduler. You
              can assign sowing, irrigation, pesticide, and harvesting tasks to
              each group or farmer with due dates and reminders. Demand planning
              is made simple—members can raise input requests (like seeds or
              fertilizers), and admins get a clear view of how much quantity is
              needed, helping them avoid shortages or excess stock.
            </motion.p>
          </motion.section>

          {/* Features List */}
          <motion.section
            className="bg-white p-6 rounded-lg shadow-sm"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.h3
              variants={fadeUp}
              className="text-xl font-semibold text-gray-800 mb-4"
            >
              Here's how K2 works:
            </motion.h3>
            <motion.ol
              variants={stagger}
              className="list-decimal pl-6 space-y-4 text-gray-600 text-lg"
            >
              {[
                {
                  title: "Easy Admin & Unit Setup",
                  desc: "FPOs can digitally create their organization structure—dividing members by village, crop type, or region—with dedicated admins managing each group. This eliminates confusion and brings clarity to every level.",
                },
                {
                  title: "Adding Members & Maintaining Structured Data",
                  desc: "No more messy spreadsheets or paper registers. Each farmer, worker, or technician can have their own profile with assigned roles. This ensures accountability and traceability.",
                },
                {
                  title: "Assign Crops & Schedules per Unit",
                  desc: "Admins can assign specific crops and their growing schedules (sowing, irrigation, spraying, harvesting, etc.) to different units. This leads to smarter resource planning and reduces wastage.",
                },
                {
                  title: "Smart Demand & Supply Planning",
                  desc: "Members and groups can raise demand for inputs like seeds, fertilizers, or tools directly from the app. All requests are tracked and categorized—helping FPOs avoid over-purchasing and plan inventory precisely.",
                },
                {
                  title: "Simplified Financial Management",
                  desc: "Track every transaction—income, expenditure, loans, or grants. Get access to real-time reports, making audits, funding applications, and decision-making easier than ever before.",
                },
                {
                  title: "IoT Integration & Smart Tech",
                  desc: "K2 is future-ready. With IoT integration, FPOs can access real-time insights like weather forecasts, soil health, and crop data—making decision-making truly data-driven and scalable.",
                },
              ].map((item) => (
                <motion.li key={item.title} variants={fadeUp} className="pl-2">
                  <strong className="text-gray-800">{item.title}</strong>
                  <br />
                  {item.desc}
                </motion.li>
              ))}
            </motion.ol>
          </motion.section>

          {/* Financial Section */}
          <motion.section
            className="bg-white p-6 rounded-lg shadow-sm"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl font-semibold text-gray-800 mb-4"
            >
              Financial Simplicity & Smart Collaboration
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-600 leading-relaxed text-lg mb-4"
            >
              Money matters are no longer messy. K2 helps FPOs track every
              rupee—whether it's income, loans, input purchases, or group
              expenses. Everything is recorded with clarity, which helps during
              audits or when applying for funding. Members can even raise
              payment or finance-related issues directly in the app, keeping
              everything transparent.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="text-gray-600 leading-relaxed text-lg"
            >
              K2 also brings farmers closer to the right resources. Skilled
              workers and technicians can list their services and availability.
              Farmers can contact them directly for repair, labor, or service
              needs—cutting down delays and boosting productivity. Livestock and
              farm care becomes easier with automatic reminders for vaccination,
              irrigation, spraying, and other key activities. And as the
              platform evolves, it's also integrating smart IoT tools—so farmers
              and FPOs can access real-time data on soil, weather, or field
              health.
            </motion.p>
          </motion.section>

          {/* Conclusion */}
          <motion.section
            className="bg-white p-6 rounded-lg shadow-sm"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl font-semibold text-gray-800 mb-4"
            >
              Conclusion - A Digital Leap Toward the Future of Farming
            </motion.h2>
            <motion.div variants={imgReveal} className="mb-6">
              <img
                src="/Images/blog1_pictures/blog1_4.png"
                alt="Digital Farming"
                className="w-full rounded-lg shadow-sm"
              />
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="text-gray-600 leading-relaxed text-lg"
            >
              The future of agriculture lies in structure, community, and data.
              FPOs who digitize today will have the edge in scale, transparency,
              and growth tomorrow. With Krishi Kutumb, FPOs don't just
              manage—they lead. They create a smarter ecosystem where
              everyone—from the smallest farmer to the largest group—can
              contribute, grow, and make better decisions. This is not just
              about being online. It's about being future-ready, connected, and
              efficient.
            </motion.p>
          </motion.section>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Blog1;

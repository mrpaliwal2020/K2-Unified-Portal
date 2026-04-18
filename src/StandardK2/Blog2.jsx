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
  visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const Blog2 = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* ── Blog Header ── */}
        <div className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto text-gray-800">
          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-2"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            How FPOs Are Transforming Farming With K2 App
          </motion.h1>
          <motion.p
            className="text-center text-xl text-gray-600 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Reimagining Everyday Farming for Smarter Collaboration
          </motion.p>

          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <img
              src="/Images/blog2_pictures/blog2_1.png"
              alt="FPOs and Digital Farming"
              className="rounded shadow-md w-full max-w-xl"
            />
          </motion.div>

          <motion.h2
            className="text-xl md:text-2xl font-semibold text-gray-800 mb-2"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            Farming Together: The New Digital Era
          </motion.h2>
          <motion.p
            className="text-gray-700 leading-relaxed text-lg"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            Across India, Farmer Producer Organizations (FPOs) are changing the
            game. By combining traditional wisdom with modern technology, they're
            creating stronger, more resilient farming communities. And at the
            heart of this transformation is the K2 App—a digital solution designed
            to streamline every task, big or small. From inventory and finance to
            service sharing and smart scheduling, K2 is helping FPOs farm
            better—together.
          </motion.p>
        </div>

        {/* ── Multi-Profile Section ── */}
        <motion.div
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto px-4 py-8 text-gray-800 grid md:grid-cols-2 gap-10 items-center"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUp}>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
              One Farmer, Many Roles: Switch Profiles Seamlessly
            </h2>
            <p className="mb-2 text-lg">Farming today is dynamic. A single person might be an:</p>
            <ul className="list-disc list-inside mb-3 text-gray-700 text-lg">
              <li>FPO member</li>
              <li>Individual farmer</li>
              <li>Local service provider</li>
            </ul>
            <p className="mb-6 text-lg">
              With K2's Multi-Profile Login, users can easily switch between roles
              without logging out. This means faster workflows and smoother
              operations, whether you're managing group crops, booking a tractor,
              or offering services to others.
            </p>
          </motion.div>

          <motion.div variants={imgReveal} className="flex justify-center">
            <div className="relative w-[400px] h-[400px] mx-auto">
              <img
                src="/Images/blog2_pictures/blog2_2.jpg"
                alt="K2 App Mobile Interface"
                className="absolute top-[52px] left-[90px] w-[132px] h-[296px] object-cover z-0 rounded-lg"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* ── My Business & My Services ── */}
        <motion.div
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto px-4 py-8"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUp} className="mb-10">
            <h2 className="font-bold text-xl md:text-2xl text-gray-800 mb-2">
              "My Business" – Total Visibility into Group Inventory
            </h2>
            <p className="text-lg">
              FPOs need clear visibility of what they have and who contributed what. K2's My Business feature provides:
            </p>
            <ul className="list-disc list-inside mb-2 text-lg text-gray-700">
              <li>Bulk stock entries for group assets like seeds, fertilizer, and harvests</li>
              <li>Detailed tracking of farmer-wise contributions</li>
              <li>Instant overviews of item types, quantities, and storage locations</li>
            </ul>
            <p className="text-lg">No more spreadsheets. Just smart, transparent tracking for the entire group.</p>
          </motion.div>

          <div className="flex items-start space-x-6">
            <motion.div variants={imgReveal} className="relative w-[400px] h-[400px] mx-auto">
              <img
                src="/images/blog2_pictures/blog2_3.jpg"
                alt="My Services Phone"
                className="absolute top-[52px] left-[90px] w-[116px] h-[296px] object-cover z-0 rounded-lg"
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <h2 className="font-bold text-xl md:text-2xl text-gray-800 mb-2">
                "My Services" – Smarter Use of Shared Tools
              </h2>
              <p className="mb-2 text-lg">Farm equipment is expensive. That's why sharing is key—and My Services makes it simple.</p>
              <ul className="list-disc list-inside mb-2 text-lg text-gray-700">
                <li>Browse a live list of available tools and tractors</li>
                <li>Check real-time provider availability</li>
                <li>Use the weekly color-coded calendar to plan and book with confidence</li>
              </ul>
              <p className="text-lg">Better scheduling leads to better productivity, with fewer overlaps and wait times.</p>
            </motion.div>
          </div>
        </motion.div>

        {/* ── My Finance & Admin Tools ── */}
        <motion.div
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto px-4 py-8 text-gray-800 grid md:grid-cols-2 gap-10 items-center"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUp}>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
              "My Finance" – Crystal Clear Group Expenses
            </h2>
            <p className="mb-2 text-lg">With My Finance, FPOs can take control of their economics like never before.</p>
            <ul className="list-disc list-inside mb-3 text-lg text-gray-700">
              <li>Estimate per-acre costs ahead of planting</li>
              <li>Track actual vs expected expenses to stay on budget</li>
              <li>Monitor expenses by member, unit, or crop type</li>
            </ul>
            <p className="mb-6 text-lg">This makes it easier to spot problems early and ensure transparency for all members.</p>

            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
              Admin Power Tools – Run the FPO with Confidence
            </h2>
            <p className="mb-2 text-lg">FPO leaders get a dedicated dashboard to manage operations effortlessly.</p>
            <ul className="list-disc list-inside text-lg text-gray-700 mb-3">
              <li>Add and manage members or farmer units</li>
              <li>Monitor overall performance with automated reports</li>
              <li>Access real-time data for smarter planning</li>
            </ul>
            <p className="text-lg">Whether you're scaling operations or solving daily challenges, these tools put you in command.</p>
          </motion.div>

          <motion.div variants={imgReveal} className="flex justify-center">
            <div className="relative w-[400px] h-[400px] mx-auto">
              <img
                src="/Images/blog2_pictures/blog2_4.jpg"
                alt="K2 App Mobile Interface"
                className="absolute top-[52px] left-[90px] w-[132px] h-[296px] object-cover z-0 rounded-lg"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* ── All-in-One Platform ── */}
        <motion.div
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto px-4 py-8 text-gray-800"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2 variants={fadeUp} className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
            All-in-One Platform – From Field to Market
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg">
            The real strength of the K2 App lies in its ability to connect the
            entire farming process—from sowing seeds to selling produce. It
            supports everything from demand generation to delivery planning, while
            also providing live updates on mandi (market) prices. Integration with
            IoT devices enables farmers to receive real-time data about their
            fields, improving decision-making and resource management. With all
            these features combined, K2 becomes more than a farm management
            tool—it becomes the digital backbone of the FPO's entire business model.
          </motion.p>
        </motion.div>

        <motion.div
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto px-4 py-8"
          variants={imgReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex justify-center mb-6">
            <img
              src="/Images/blog2_pictures/blog2_5.png"
              alt="FPOs and Digital Farming"
              className="rounded shadow-md w-full max-w-xl"
            />
          </div>
        </motion.div>

        {/* ── Conclusion ── */}
        <motion.div
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto px-4 py-8 text-gray-800"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2 variants={fadeUp} className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
            Simple. Smart. Supportive.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg">
            The K2 App is not just another software tool; it is a complete support
            system designed to help farmers and FPOs succeed together. By
            simplifying everyday operations, enhancing transparency, and
            encouraging collective growth, K2 makes farming more manageable and
            more profitable. It's a partner that understands the challenges of
            modern agriculture and provides the tools needed to overcome them.
            With K2, farming isn't just smarter—it's stronger, together.
          </motion.p>
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Blog2;

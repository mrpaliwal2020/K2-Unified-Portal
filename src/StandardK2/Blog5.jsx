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

const Blog5 = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* ── Section 1: Intro ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            How to Get the Best Price for Your Produce: A Farmer's Guide
          </motion.h1>
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          >
            <img
              src="/Images/blog5_pictures/blog5_1.png"
              alt="Farm produce money bag"
              className="rounded shadow-md max-w-lg w-full"
            />
          </motion.div>
          <motion.p
            className="mb-6 text-lg md:text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
          >
            In today's dynamic agricultural landscape, growing high-quality
            crops is only half the battle—selling them at the right price is
            equally critical. For many farmers, the real challenge begins after
            harvest: how to find the best market and negotiate fair prices. If
            you're wondering how to consistently get the best value for your
            hard-earned produce, this guide is for you.
          </motion.p>
          <motion.h2
            className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
          >
            1. Know Your Crop's True Value
          </motion.h2>
          <motion.p
            className="mb-4 text-lg md:text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            Before you hit the market, understand what your produce is worth:
          </motion.p>
          <motion.ul
            className="list-disc list-inside mb-4 space-y-1 text-lg md:text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
          >
            <li>Research current mandi rates daily using mobile apps or government portals.</li>
            <li>Compare local, regional, and national prices for the same produce.</li>
            <li>Evaluate quality factors such as size, grade, and freshness, which influence price.</li>
          </motion.ul>
          <motion.p
            className="text-lg md:text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            Pro Tip: Use agri-tech apps like Krishi Kutumb to monitor live market prices and trends across regions.
          </motion.p>
        </motion.section>

        {/* ── Section 2: Timing ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <motion.div variants={fadeUp} className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">2. Timing is Everything</h2>
              <p className="mb-3 text-lg md:text-xl text-gray-600">Market prices fluctuate based on seasonal supply and demand:</p>
              <ul className="list-disc list-inside mb-3 space-y-1 text-lg md:text-xl text-gray-600">
                <li>Avoid selling during peak harvest when markets are flooded.</li>
                <li>Consider storage options to delay selling until prices rise.</li>
                <li>Use weather forecasts and sowing calendars to plan off-season or early harvests for premium pricing.</li>
              </ul>
              <p className="italic text-lg md:text-xl text-gray-600">
                "Early to market, better the rate." – A timeless farm market truth.
              </p>
            </motion.div>
            <motion.div variants={imgReveal} className="md:w-1/3">
              <img
                src="/Images/blog5_pictures/blog5_2.png"
                alt="Hand in wheat field with graph"
                className="rounded shadow-md w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* ── Section 3: Multiple Channels ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <motion.div variants={imgReveal} className="md:w-1/3">
              <img
                src="/Images/blog5_pictures/blog5_3.png"
                alt="Farmer using digital platform"
                className="rounded shadow-md w-full h-auto object-cover"
              />
            </motion.div>
            <motion.div variants={fadeUp} className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">3. Explore Multiple Selling Channels</h2>
              <p className="mb-3 text-lg md:text-xl text-gray-600">Don't limit yourself to the local mandi. Today, farmers have many sales options:</p>
              <ul className="list-disc list-inside mb-3 space-y-1 text-lg md:text-xl text-gray-600">
                <li>Local Mandis (APMCs) – Traditional but often crowded.</li>
                <li>Direct-to-Consumer – Sell via farm stands or community delivery.</li>
                <li>Online Agri Marketplaces – Platforms like eNAM, Krishi Kutumb, DeHaat, and others.</li>
                <li>Farmer Producer Organizations (FPOs) – Collective bargaining power and bulk selling advantages.</li>
                <li>Contract Farming or Tie-ups with Retailers – Assured buyers and prices.</li>
              </ul>
              <p className="text-lg md:text-xl text-gray-600">
                Diversifying sales channels reduces your dependence on one market and increases chances of higher prices.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* ── Sections 4 & 5: Quality + Networks ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12 space-y-10"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            <motion.div variants={fadeUp} className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">4. Focus on Quality & Branding</h2>
              <p className="mb-3 text-lg md:text-xl text-gray-600">In a competitive market, quality stands out:</p>
              <ul className="list-disc list-inside mb-3 space-y-1 text-lg md:text-xl text-gray-600">
                <li>Sort, grade, and package your produce professionally.</li>
                <li>Add basic labeling: farm name, pesticide-free, organic (if applicable).</li>
                <li>Build a reputation for consistent, quality produce—buyers pay more for reliability.</li>
              </ul>
              <p className="text-lg md:text-xl text-gray-600">
                Think like a brand. Even farm produce can earn a loyal buyer base with the right image.
              </p>
            </motion.div>
            <motion.div variants={imgReveal} className="md:w-1/3">
              <img
                src="/Images/blog5_pictures/blog5_4.png"
                alt="Quality branding on clipboard"
                className="rounded shadow-md w-full h-auto object-cover"
              />
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-6">
            <motion.div variants={imgReveal} className="md:w-1/3">
              <img
                src="/Images/blog5_pictures/blog5_5.png"
                alt="Farmer using mobile network"
                className="rounded shadow-md w-full h-auto object-cover"
              />
            </motion.div>
            <motion.div variants={fadeUp} className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">5. Join Farmer Networks & Groups</h2>
              <p className="mb-3 text-lg md:text-xl text-gray-600">Knowledge shared is profit earned:</p>
              <ul className="list-disc list-inside mb-3 space-y-1 text-lg md:text-xl text-gray-600">
                <li>Be part of local WhatsApp groups, Krishi Kutumb communities, or FPOs.</li>
                <li>Share mandi rates, buyer contacts, and bulk transport options.</li>
                <li>Collaborate to negotiate better deals or bulk-sell directly to wholesalers.</li>
              </ul>
              <p className="text-lg md:text-xl text-gray-600">When farmers unite, middlemen lose power.</p>
            </motion.div>
          </div>
        </motion.section>

        {/* ── Sections 6, 7 & Conclusion ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12 space-y-10"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div variants={fadeUp} className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">6. Negotiate Like a Pro</h2>
              <p className="mb-3 text-lg md:text-xl text-gray-600">Yes, negotiation is an art—and farmers can master it:</p>
              <ul className="list-disc list-inside mb-6 space-y-1 text-lg md:text-xl text-gray-600">
                <li>Don't rush to sell. Be ready to walk away if the price isn't fair.</li>
                <li>Know your break-even cost—never sell below it.</li>
                <li>If possible, get multiple quotes before making a deal.</li>
                <li>Keep receipts and buyer contacts for future reference.</li>
              </ul>
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">7. Stay Updated, Stay Ahead</h2>
              <p className="mb-3 text-lg md:text-xl text-gray-600">Markets evolve. Stay informed:</p>
              <ul className="list-disc list-inside space-y-1 text-lg md:text-xl text-gray-600">
                <li>Follow agriculture news, government schemes, and subsidy updates.</li>
                <li>Attend farmer expos or agri workshops to learn marketing trends.</li>
                <li>Use apps like Krishi Kutumb to access curated, actionable updates.</li>
              </ul>
            </motion.div>
            <motion.div variants={imgReveal} className="md:w-1/3 flex justify-end">
              <img
                src="/Images/blog5_pictures/blog5_6.png"
                alt="Farmer showing tablet in field"
                className="rounded-md shadow-md max-w-xs w-full h-auto object-cover"
              />
            </motion.div>
          </div>

          <motion.div variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-800">Conclusion: Empower Yourself to Earn More</h2>
            <p className="mb-4 text-lg md:text-xl text-gray-600">
              You grow food that feeds the world—it's time you earn what it's
              worth. With smart planning, the right tools, and a networked
              approach, you can take control of how and where you sell your
              produce. Getting the best price isn't luck—it's strategy,
              awareness, and consistent effort.
            </p>
            <p className="text-lg md:text-xl text-gray-600">
              Don't settle for whatever price the market throws at you. Instead,
              set your own standards—understand your costs, recognize your
              crop's value, and demand what's fair. You have more power than you
              think, especially when you're informed and connected.
            </p>
          </motion.div>
        </motion.section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Blog5;

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

const Blog4 = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* ── Blog Header ── */}
        <section className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto text-center py-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8 text-gray-800"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            The Role of Mobile Apps in Modern Farming
          </motion.h2>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          >
            <img
              src="/Images/blog4_pictures/blog4_1.png"
              alt="Mobile Apps in Farming"
              className="max-w-lg w-full rounded shadow-md"
            />
          </motion.div>
        </section>

        {/* ── Intro ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12 text-gray-800"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p variants={fadeUp} className="mb-6 text-lg md:text-xl text-gray-600">
            In the past decade, Agriculture has Witnessed one of the most
            remarkable shifts in its long Gistory—a move from traditional,
            manual practices to technology-driven, precision-based farming.
            While innovations like drones, IoT sensors, and AI analytics are
            making headlines, One tool has quietly revolutionized the fields of
            even the smallest farmers: the Mobile Application.
          </motion.p>
          <motion.p variants={fadeUp} className="mb-10 text-lg md:text-xl text-gray-600">
            From providing weather updates to connecting farmers with markets,
            mobile apps are playing a vital role in Modernizing Indian
            agriculture. Let's explore how These powerful tools are not just
            supporting farmers—but empowering them.
          </motion.p>
          <motion.h3 variants={fadeUp} className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
            The Digital Evolution of Agriculture
          </motion.h3>
          <motion.p variants={fadeUp} className="mb-4 text-lg md:text-xl text-gray-600">
            The rise of smartphone usage in rural India has been a game-changer.
            Today, over 70% of rural households have access to smartphones and
            internet services, making digital tools more accessible than ever
            before. This growing connectivity is giving farmers direct access to
            knowledge, tools, and networks that were once out of reach.
          </motion.p>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-600">
            In this new landscape, mobile apps act as digital
            assistants—offering real-time support, simplifying complex
            decisions, and connecting farmers to resources they never had
            before. Whether a farmer is managing one acre or one hundred, mobile
            apps are helping them grow more, earn more, and risk less.
          </motion.p>
        </motion.section>

        {/* ── Key Functions ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12 text-gray-800"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2 variants={fadeUp} className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            Key Functions of Mobile Apps in Modern Agriculture
          </motion.h2>
          <motion.div variants={imgReveal} className="flex justify-center mb-8">
            <img
              src="/Images/blog4_pictures/blog4_2.png"
              alt="Farmer using a mobile app"
              className="rounded shadow-md max-w-md"
            />
          </motion.div>
          <motion.div variants={fadeUp} className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
              1. Smart Crop Planning and Scientific Advisory
            </h3>
            <p className="mb-2 text-lg md:text-xl text-gray-600">
              Traditional farming decisions were often based on intuition or
              local customs. Now, mobile apps provide scientific guidance and
              data-based recommendations. These apps analyze soil health,
              suggest optimal crops, recommend fertilizers, and help farmers
              schedule sowing and harvesting times.
            </p>
            <p className="text-lg md:text-xl text-gray-600">
              For instance, a farmer can input their location and soil type into
              an app and instantly receive crop suggestions suitable for that
              season, with complete planting and irrigation schedules. This
              precision planning significantly reduces input waste and improves
              yield outcomes.
            </p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
              2. Localized Weather Forecasting and Early Warning Alerts
            </h3>
            <p className="mb-2 text-lg md:text-xl text-gray-600">
              Weather is one of the biggest uncertainties in farming. Even a
              single unseasonal rain or temperature fluctuation can affect the
              entire crop. Mobile apps now offer hyperlocal weather forecasts,
              sometimes down to the village level, giving farmers a heads-up on
              expected rain, humidity, and temperature changes.
            </p>
            <p className="text-lg md:text-xl text-gray-600">
              Many apps also integrate pest and disease prediction models,
              alerting farmers to outbreaks and offering preventive measures. By
              taking early action, farmers can reduce the need for heavy
              pesticide use, thereby protecting crops, the environment, and
              their income.
            </p>
          </motion.div>
        </motion.section>

        {/* ── Farm Management + Market Prices ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12 text-gray-800"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={imgReveal} className="flex flex-wrap justify-center gap-4 mb-8">
            <img src="/Images/blog4_pictures/blog4_3.png" alt="Digital farming illustration" className="w-full max-w-[200px] h-auto rounded shadow-md" />
            <img src="/Images/blog4_pictures/blog4_4.png" alt="Weather app in hand" className="w-full max-w-[200px] h-auto rounded shadow-md" />
            <img src="/Images/blog4_pictures/blog4_5.png" alt="Farmer using tablet in field" className="w-full max-w-[200px] h-auto rounded shadow-md" />
          </motion.div>
          <motion.div variants={fadeUp} className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
              3. Efficient Farm Management and Digital Record-Keeping
            </h3>
            <p className="mb-2 text-lg md:text-xl text-gray-600">
              Farmers today are not just cultivators—they are farm managers.
              Mobile apps make it easy to track every aspect of the farm:
              expenses, input purchases, water usage, crop performance, and even labor.
            </p>
            <ul className="list-disc list-inside mb-2 text-lg md:text-xl text-gray-600">
              <li>Having digital records helps farmers:</li>
              <li>Evaluate profits and losses more accurately</li>
              <li>Apply for government schemes or subsidies</li>
              <li>Prove creditworthiness for loans</li>
              <li>Improve future planning through data analysis</li>
            </ul>
            <p className="text-lg md:text-xl text-gray-600">
              In short, mobile apps are helping farmers become more organized
              and professional in managing their farms.
            </p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
              4. Access to Real-Time Market Prices and Direct Buyers
            </h3>
            <p className="mb-2 text-lg md:text-xl text-gray-600">
              One of the major pain points in Indian agriculture has been the
              lack of transparency in market prices. Farmers often have to
              depend on middlemen, leading to unfair pricing and limited profit
              margins. Now, mobile apps provide live mandi prices from multiple
              markets, allowing farmers to choose where to sell.
            </p>
            <p className="text-lg md:text-xl text-gray-600">
              Even better, some platforms directly connect farmers to buyers,
              exporters, or retailers, cutting out intermediaries. This
              farm-to-market connectivity increases bargaining power and ensures
              a better share of the profit for the farmer.
            </p>
          </motion.div>
        </motion.section>

        {/* ── Farmer Communities ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12 text-gray-800"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUp} className="mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
              5. Farmer Communities and Peer Learning Platforms
            </h3>
            <p className="mb-2 text-lg md:text-xl text-gray-600">
              Beyond data and services, many mobile apps are building social
              networks for farmers. These community spaces allow users to:
            </p>
            <ul className="list-disc list-inside mb-2 text-lg md:text-xl text-gray-600">
              <li>Share photos of crop issues and get instant advice</li>
              <li>Discuss local market conditions</li>
              <li>Learn from other farmers' techniques and innovations</li>
              <li>Participate in training modules and video tutorials</li>
            </ul>
            <p className="text-lg md:text-xl text-gray-600">
              This kind of peer-to-peer learning strengthens community bonds and
              helps farmers stay updated with evolving practices.
            </p>
          </motion.div>
          <motion.div variants={imgReveal} className="flex justify-center mt-6">
            <img
              src="/Images/blog4_pictures/blog4_6.png"
              alt="Farmers using laptop together"
              className="w-full max-w-lg h-auto rounded shadow-md"
            />
          </motion.div>
        </motion.section>

        {/* ── Future & Conclusion ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12 text-gray-800"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUp} className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
              The Road Ahead: Tech-Enabled, Sustainable Agriculture
            </h2>
            <p className="mb-3 text-lg md:text-xl text-gray-600">
              As mobile apps integrate with emerging technologies like AI,
              satellite imaging, blockchain, and IoT, their impact will only
              grow. We're heading toward a future where farmers:
            </p>
            <ul className="list-disc list-inside mb-3 text-lg md:text-xl text-gray-600">
              <li>Receive personalized recommendations powered by AI</li>
              <li>Monitor crops in real-time through satellite-linked data</li>
              <li>Use digital tokens for secure produce transactions</li>
              <li>Manage entire supply chains from a mobile device</li>
            </ul>
            <p className="text-lg md:text-xl text-gray-600">
              This is not a dream—it's the direction we're heading in, and
              mobile apps are the driving force behind it.
            </p>
          </motion.div>
          <motion.div variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
              Conclusion: Empowering Farmers, One App at a Time
            </h2>
            <p className="mb-3 text-lg md:text-xl text-gray-600">
              In the face of climate challenges, rising costs, and market
              pressures, farmers need more than hard work—they need smart tools.
              Mobile apps have emerged as essential companions in the journey
              toward resilient, profitable, and sustainable agriculture.
            </p>
            <p className="mb-3 text-lg md:text-xl text-gray-600">
              By simplifying complex processes and putting information directly
              in the farmer's hands, mobile apps are bridging the gap between
              potential and performance.
            </p>
            <p className="mb-3 text-lg md:text-xl text-gray-600">
              At Krishi Kutumb, we are committed to being part of this digital
              movement. Our platform connects farmers with tools, communities,
              and insights tailored to their needs.
            </p>
            <p className="text-lg md:text-xl text-gray-600">
              If you're a farmer, or work in the agri space, don't wait for the
              future—download the Krishi Kutumb app and be part of it today.
            </p>
          </motion.div>
        </motion.section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Blog4;

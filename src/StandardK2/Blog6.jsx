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

const Blog6 = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* ── Intro ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12 space-y-8"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            Ways to Protect Your Farm from Extreme Weather Conditions
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          >
            <img
              src="/Images/blog6_pictures/blog6_1.png"
              alt="Stormy farm landscape"
              className="w-full max-h-96 object-cover rounded shadow-md"
            />
          </motion.div>
          <motion.p
            className="text-lg md:text-xl leading-relaxed text-justify text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            Climate change is no longer a distant concern—it's a present-day
            reality for farmers. From unseasonal rains and rising temperatures
            to floods and prolonged droughts, extreme weather events are
            directly impacting agricultural productivity and rural livelihoods.
            To survive and thrive in these challenging times, farmers must adopt
            strategies that make their farms more weather-resilient. Below are
            some essential approaches every farmer should consider.
          </motion.p>
        </motion.section>

        {/* ── Weather Monitoring + Crop Varieties ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12 space-y-16"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <motion.div variants={fadeUp} className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
                Monitoring Weather Conditions in Real Time
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                In today's digital era, staying informed about changing weather
                is both possible and practical. Real-time weather monitoring
                allows farmers to take timely action before disaster strikes.
                With the help of mobile apps, automated weather stations, and
                government advisories, it's now easier than ever to get
                location-specific updates on temperature, rainfall, humidity,
                and storms. When you're alerted early about a potential
                hailstorm or heavy rainfall, you can prepare your fields,
                protect equipment, and move livestock to safety—minimizing
                losses and disruptions to your operations.
              </p>
            </motion.div>
            <motion.div variants={imgReveal} className="md:w-1/3">
              <img
                src="/Images/blog6_pictures/blog6_2.png"
                alt="Weather monitoring on tablet"
                className="w-full rounded shadow-md object-cover max-h-72"
              />
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="md:w-full">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
              Choosing the Right Crops and Varieties
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Not all crops respond to weather stress in the same way. Selecting
              climate-resilient varieties that tolerate heat, drought, or excess
              moisture can significantly reduce risks. For example,
              short-duration or drought-resistant varieties of rice, wheat, or
              pulses are better suited for erratic rainfall patterns. Consult
              local agricultural universities or extension services to identify
              crops suited to your region's changing climate. Additionally,
              diversifying crops—mixing staples with cash crops or
              perennials—spreads risk and ensures some income even if one crop fails.
            </p>
          </motion.div>
        </motion.section>

        {/* ── Natural Barriers + Infrastructure ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12 space-y-16"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <motion.div variants={imgReveal} className="md:w-1/3">
              <img
                src="/Images/blog6_pictures/blog6_3.png"
                alt="Natural wind barrier"
                className="w-full rounded shadow-md object-cover max-h-72"
              />
            </motion.div>
            <motion.div variants={fadeUp} className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
                Creating Natural Barriers and Wind Protection
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                Strong winds, dust storms, and cyclonic activity can wreak havoc
                on farms, destroying crops and eroding topsoil. Establishing
                natural barriers like windbreaks and shelterbelts along the
                borders of your farm can provide much-needed protection. Rows of
                trees, such as neem or bamboo, help reduce wind velocity, limit
                soil loss, and protect delicate plants from physical damage.
                These green buffers also contribute to biodiversity and serve as
                shade sources for livestock.
              </p>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="md:w-full">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
              Strengthening Farm Infrastructure
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Having the right infrastructure in place can make all the
              difference during extreme weather. For instance, raised beds help
              prevent waterlogging in heavy rains, while mulched soil retains
              moisture during dry spells. Using polyhouses or shade nets can
              protect high-value crops from intense sunlight and hail. Livestock
              shelters should be designed with proper ventilation for summer and
              insulation for winter to avoid heat stress or cold-related
              illnesses. These improvements don't just protect during a
              crisis—they enhance long-term productivity.
            </p>
          </motion.div>
        </motion.section>

        {/* ── Water Management ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            <motion.div variants={fadeUp} className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
                Efficient Water Management Practices
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                Water is both a critical asset and a potential threat to
                farming. During droughts, scarcity affects plant growth, while
                floods can drown entire fields. That's why efficient water
                management is essential. Farm ponds and check dams help store
                excess rainwater, which can be used during dry spells. Drip
                irrigation systems ensure that every drop reaches the root zone,
                conserving water and increasing efficiency. Meanwhile, building
                proper drainage systems around fields ensures that excess water
                flows out quickly, preventing root rot and soil erosion.
              </p>
            </motion.div>
            <motion.div variants={imgReveal} className="md:w-1/3">
              <img
                src="/Images/blog6_pictures/blog6_4.png"
                alt="Irrigation system in farm field"
                className="w-full h-auto rounded shadow-md object-cover max-h-64"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* ── Soil Health + Connected + Conclusion ── */}
        <motion.section
          className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12 space-y-10 text-gray-800"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.div variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800">
              Improving Soil Health and Resilience
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Healthy soil is your farm's hidden defense against extreme
              weather. Soils rich in organic matter absorb more water during
              rains and hold moisture better during droughts. Regular soil
              testing helps you understand the current condition of your land so
              you can apply the right amendments, such as compost, gypsum, or
              lime. Practices like crop rotation, cover cropping, and mulching
              not only improve fertility but also make soil more resilient to
              temperature fluctuations and heavy rain.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800">
              Staying Connected and Informed
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              No farmer should face climate risks alone. Joining local farming
              groups, digital platforms, or cooperatives ensures that you're not
              only aware of upcoming weather threats but also connected to
              advice, assistance, and best practices. Mobile apps like Krishi
              Kutumb empower farmers with weather alerts, expert insights,
              community discussions, and access to reliable farm inputs. When
              farmers share their experiences and solutions, the entire
              community becomes stronger and more adaptive.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800">
              Conclusion
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              Extreme weather is becoming more frequent and intense, but it
              doesn't have to define the future of farming. By combining
              traditional wisdom with modern science—staying informed, investing
              in infrastructure, choosing the right crops, and working
              together—farmers can build stronger, more resilient farms that can
              withstand the unpredictability of climate change. The road ahead
              requires preparation and adaptability, but with the right steps,
              farmers can not only survive but thrive.
            </p>
          </motion.div>
        </motion.section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Blog6;

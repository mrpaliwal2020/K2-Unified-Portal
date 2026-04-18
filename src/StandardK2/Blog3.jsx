import React from "react";
import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";

const Blog3 = () => {
  return (
    <>
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-6 mt-12">
        {/* ── Intro ── */}
        <section className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
            The Future of Precision Agriculture: Tools Every Farmer Should Know
          </h1>
          <div className="flex justify-center">
            <img
              src="/Images/blog3_pictures/blog3_1.png"
              alt="Tablet in field"
              className="rounded shadow-md w-full max-w-2xl"
            />
          </div>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            In today's fast-evolving agricultural landscape, technology is no longer
            a luxury—it's a necessity. Precision agriculture is redefining how
            farmers approach crop production, land management, and sustainability.
            By integrating cutting-edge tools and smart technologies, farmers can
            achieve higher yields, reduce costs, and protect the environment.
          </p>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            But what exactly is shaping the future of precision agriculture? Let's
            explore the essential tools every modern farmer should know.
          </p>
        </section>

        {/* ── Section 1: Smart Sensors ── */}
        <section className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
                1. Smart Sensors and IoT Devices
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-4">
                Precision farming begins with precise information—and that's where
                smart sensors come in. By using Internet of Things (IoT) devices
                placed in fields, farmers can monitor soil moisture, nutrient levels,
                weather conditions, and even plant health in real time.
              </p>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Key Benefits:</h3>
              <ul className="list-disc list-inside mb-4 text-lg text-gray-600 space-y-1">
                <li>Optimize irrigation scheduling</li>
                <li>Detect early signs of soil depletion</li>
                <li>Reduce water and fertilizer waste</li>
              </ul>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Popular Tools:</h3>
              <ul className="list-disc list-inside mb-4 text-lg text-gray-600 space-y-1">
                <li>Soil moisture sensors</li>
                <li>Remote weather stations</li>
                <li>Smart irrigation controllers</li>
              </ul>
              <p className="text-lg md:text-xl text-gray-600">
                With this data, farmers can move from guesswork to data-driven
                decisions, leading to healthier crops and better resource management.
              </p>
            </div>
            <div className="md:w-1/3">
              <img
                src="/Images/blog3_pictures/blog3_2.png"
                alt="Smart sensor in agriculture"
                className="rounded shadow-md w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* ── Section 2: Drones ── */}
        <section className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
            2. Drones and Aerial Imaging
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            Drones are one of the most exciting advancements in agriculture today.
            Equipped with high-resolution cameras and sensors, they offer a
            bird's-eye view of fields, helping farmers detect crop stress, pest
            infestations, and uneven growth patterns early on.
          </p>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="md:w-1/3">
              <img
                src="/Images/blog3_pictures/blog3_3.png"
                alt="Drone spraying crops"
                className="rounded shadow-md w-full object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Common Applications:</h3>
              <ul className="list-disc list-inside mb-4 text-lg text-gray-600 space-y-1">
                <li>Crop health monitoring</li>
                <li>Aerial mapping and surveying</li>
                <li>Targeted pesticide or fertilizer spraying</li>
              </ul>
              <p className="text-lg md:text-xl text-gray-600">
                By using drones, farmers can respond faster to problems, minimize
                chemical use, and improve overall farm efficiency—all while saving
                time and money.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 3: Farm Management Software ── */}
        <section className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
                3. Farm Management Software (FMS)
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-4">
                Handling the growing amount of farm data can be overwhelming without
                the right tools. Farm Management Software platforms bring everything
                together—from planting schedules and equipment maintenance logs to
                financial records and harvest reports.
              </p>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Top Functions:</h3>
              <ul className="list-disc list-inside mb-4 text-lg text-gray-600 space-y-1">
                <li>Real-time field monitoring</li>
                <li>Yield forecasting</li>
                <li>Budget and input cost tracking</li>
                <li>Compliance and reporting assistance</li>
              </ul>
              <p className="text-lg md:text-xl text-gray-600">
                With cloud-based solutions accessible from smartphones and tablets,
                farmers can manage their entire operation from anywhere.
              </p>
            </div>
            <div className="md:w-1/3">
              <img
                src="/Images/blog3_pictures/blog3_4.png"
                alt="Farm management software overlay on field"
                className="rounded shadow-md w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* ── Section 4: AI & ML ── */}
        <section className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="md:w-1/3">
              <img
                src="/Images/blog3_pictures/blog3_5.png"
                alt="AI in agriculture with farmer and digital overlay"
                className="rounded shadow-md w-full object-cover"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
                4. Artificial Intelligence and Machine Learning
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-4">
                AI is moving beyond labs and into the fields. From predicting pest
                outbreaks to recommending optimal planting strategies, AI-driven
                tools are revolutionizing farm decision-making.
              </p>
              <h3 className="font-semibold text-gray-800 mb-2 text-lg">Emerging Applications:</h3>
              <ul className="list-disc list-inside mb-4 text-lg text-gray-600 space-y-1">
                <li>Predictive weather and yield models</li>
                <li>Automated weed and pest identification</li>
                <li>Decision support systems for input management</li>
              </ul>
              <p className="text-lg md:text-xl text-gray-600">
                By learning from past data and real-time inputs, AI offers farmers
                tailored recommendations, helping them increase efficiency, reduce
                risks, and improve profitability.
              </p>
            </div>
          </div>
        </section>

        {/* ── Why It Matters + Final Thoughts ── */}
        <section className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto py-12 space-y-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
              Why Precision Agriculture Matters for the Future
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Precision agriculture is crucial because it offers a smarter, more
              sustainable path forward for global farming. With the world's
              population expected to approach 10 billion by 2050, farmers face the
              immense challenge of producing more food while using fewer resources
              and protecting the environment. Precision agriculture enables farmers
              to optimize every input—from water and fertilizers to seeds and
              pesticides—ensuring maximum productivity with minimal waste. It also
              promotes more sustainable practices, helping to preserve soil health,
              conserve water, and reduce greenhouse gas emissions. In a time of
              increasing climate variability, precision technologies make farming
              more resilient, allowing producers to adapt to unpredictable weather
              patterns and shifting growing conditions. Ultimately, by embracing
              precision agriculture, farmers are not only improving their current
              operations but also contributing to a more secure, sustainable food
              system for future generations.
            </p>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800">
              Final Thoughts
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed">
              The future of farming is data-driven, connected, and smarter than ever
              before. Tools like smart sensors, drones, GPS-guided machinery, AI,
              and farm management software aren't just optional upgrades—they are
              essential for thriving in the modern agricultural era.
            </p>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              At Krishi Kutumb, we believe in empowering farmers with the knowledge
              and tools needed for this transformation. By staying informed and
              investing in precision agriculture, you're not just improving your
              farm—you're securing a sustainable future for generations to come.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog3;
import React from "react";
import { motion } from "framer-motion";
import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";
import { Link } from "react-router-dom";

const blogs = [
  {
    href: "/blog/1",
    img: "/Images/blog1_coverimage.png",
    alt: "Wheat",
    read: "2 mins read",
    title: "Why Every FPO Needs a Digital Platform",
    desc: "Digital platforms boost FPO efficiency, improve transparency, and connect farmers to wider markets for better growth and profits.",
  },
  {
    href: "/blog/2",
    img: "/Images/blog2_coverimage.png",
    alt: "Tomatoes",
    read: "5 mins read",
    title: "How FPO'S Are Transforming Farming With K2 App",
    desc: "K2 App helps FPOs streamline farm management and finance tracking, empowering farmers with better collaboration and real-time insights.",
  },
  {
    href: "/blog/3",
    img: "Images/blog3_coverimage.png",
    alt: "Sugarcane",
    read: "2 mins read",
    title: "The Future of Precision Agriculture: Tools Every Farmer Should Know",
    desc: "Precision agriculture tools like drones, GPS, and sensors enable farmers to reduce costs and increase yields through data-driven decisions.",
  },
  {
    href: "/blog/4",
    img: "Images/blog4_coverimage.png",
    alt: "Wheat",
    read: "2 mins read",
    title: "The Role of Mobile Apps in Modern Farming",
    desc: "Mobile apps provide farmers with instant access to weather updates, crop advice, and market prices, enabling smarter, faster decisions.",
  },
  {
    href: "/blog/5",
    img: "/Images/blog5_coverimage.png",
    alt: "Tomatoes",
    read: "5 mins read",
    title: "How to Get the Best Price for Your Produce: A Farmer's Guide",
    desc: "Understanding market trends, timing sales, and using digital platforms help farmers secure the best prices for their produce.",
  },
  {
    href: "/blog/6",
    img: "/Images/blog6_coverimage.png",
    alt: "Sugarcane",
    read: "2 mins read",
    title: "Ways to Protect Your Farm from Extreme Weather Conditions",
    desc: "Using resilient crops, efficient irrigation, and timely weather alerts helps farmers minimize losses from extreme weather events.",
  },
];

const cardContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Blog = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-6">
        {/* ── Header Section ── */}
        <section className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto text-center py-12 bg-white">
          <motion.p
            className="text-base md:text-lg text-gray-500 uppercase tracking-widest mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Blog and Article
          </motion.p>
          <motion.h2
            className="text-5xl sm:text-6xl font-bold leading-tight text-gray-800"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
          >
            Read our <span className="text-green-700">latest blog</span> and articles
          </motion.h2>
        </section>

        {/* ── Cards Section ── */}
        <section className="w-4/5 sm:w-9/10 md:w-4/5 mx-auto pt-0 pb-12 bg-white">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={cardContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {blogs.map((blog) => (
              <motion.div
                key={blog.href}
                variants={cardItem}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
              >
                <Link
                  to={blog.href}
                  className="block bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition h-full"
                >
                  <img
                    src={blog.img}
                    alt={blog.alt}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm md:text-base text-gray-500 uppercase mb-2">
                      {blog.read}
                    </p>
                    <h3 className="text-xl md:text-2xl font-semibold mb-1 text-gray-800">
                      {blog.title}
                    </h3>
                    <p className="text-base md:text-lg text-gray-600">
                      {blog.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Blog;

import React from "react";
import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";

const FPO = () => {
  const playstore =
    "https://play.google.com/store/apps/details?id=com.ambaokrishikutumb.k2k&pli=1";

  return (
    <>
      <Header />

      {/* ── Hero Section ── */}
      <section className="bg-gray-50 pt-3 px-6 sm:px-8 md:px-12 lg:px-16 pb-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
          {/* Left: Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <button className="bg-green-50 text-green-700 font-semibold px-4 py-1 rounded-full mb-4 text-sm sm:text-base">
              Who we are!
            </button>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 leading-tight"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              Empowering FPOs with Smart Digitalization
            </h1>
            <p className="text-gray-600 mb-6 text-base sm:text-lg">
              Transform your FPO with Technology - Streamline Operations,
              Simplify Finance, Boost Market Access, & Strengthen Farmer
              Networks.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <a
                href={playstore}
                className="bg-green-600 text-white px-6 py-1 rounded-xl hover:bg-green-700 transition text-sm sm:text-base text-center"
              >
                Get Started
              </a>
              <a
                href={playstore}
                className="border border-green-600 text-green-600 px-6 py-1 rounded-xl hover:bg-green-100 transition text-sm sm:text-base text-center"
              >
                Learn more
              </a>
            </div>
          </div>

          {/* Right: Image */}
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src="/Images/3430870 1.png"
              alt="Hero Image"
              className="w-full max-w-md mx-auto md:mx-0 md:max-w-full"
            />
          </div>
        </div>
      </section>

      {/* ── FPO Intro Section ── */}
      <section className="pt-0 pb-20 px-6 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            Empowering FPOs & Farmers
          </h1>
          <p className="text-gray-500 text-base sm:text-lg md:text-xl leading-relaxed">
            One comprehensive digital platform provides everything FPOs need to
            streamline operations{" "}
            <span className="hidden md:inline">
              <br />
            </span>
            and empower farmers with smarter tools and better access.
          </p>
        </div>
      </section>

      <div className="px-6 sm:px-8">
        <hr className="border-t-2 border-gray-300 w-full" />
      </div>

      {/* ── Card Section ── */}
      <section className="py-12 sm:py-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1 - smaller */}
          <div
            className="bg-white p-6 rounded-xl flex flex-col justify-between"
            style={{ height: "300px" }}
          >
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">
                Digital farm & Business Management
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Efficiently assign and track finances, tasks, and resources
                across your entire FPO operation.
              </p>
            </div>
            <img
              src="/Images/Placeholder image.png"
              alt="Digital farm"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>

          {/* Card 2 - larger */}
          <div
            className="bg-white p-6 rounded-xl flex flex-col justify-between"
            style={{ height: "550px" }}
          >
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">
                Group Demand Aggregation
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Enable bulk procurement and sales to secure better pricing for
                inputs and produce.
              </p>
            </div>
            <img
              src="/Images/3428553 1.png"
              alt="Group Demand"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>

          {/* Card 3 - larger, offset up on desktop */}
          <div
            className="bg-white p-6 rounded-xl flex flex-col justify-between"
            style={{ height: "550px", position: "relative", top: "-150px" }}
          >
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">
                Expert Advisory & Market Linkage
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Connect farmers with agricultural experts and new market
                opportunities to maximize value.
              </p>
            </div>
            <img
              src="/Images/tea_02 2.png"
              alt="Expert Advisory"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>

          {/* Card 4 - smaller */}
          <div
            className="bg-white p-6 rounded-xl flex flex-col justify-between"
            style={{ height: "300px" }}
          >
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">
                Financial Planning & Transactions
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Simplify payments, improve credit access, and manage financial
                resources digitally.
              </p>
            </div>
            <img
              src="/Images/Placeholder image.png"
              alt="Financial Planning"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        </div>
      </section>

      {/* ── Digital Transformation Journey Section ── */}
      <section className="pb-12 sm:pb-16 px-6 sm:px-8 mt-5">
        <div className="max-w-7xl mx-auto text-center">
          <h5 className="font-semibold mb-2 text-green-600 text-xs sm:text-sm">
            Why Choose Us
          </h5>
          <h1
            className="text-3xl sm:text-4xl font-extrabold mb-4"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            Digital Transformation Journey
          </h1>
          <p className="text-gray-500 mb-8 text-base sm:text-lg">
            We adhere to the highest standards of quality in all our products
            and services. <br className="hidden sm:block" />
            From streamlining operations to maximizing productivity, we help you
            embrace the future of agriculture.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                img: "/Images/Frame (3).png",
                alt: "FPO",
                title: "1. FPO",
                desc: "Our FPO is tailored to Lorem ipsum dolor sit amet.",
              },
              {
                img: "/Images/Frame (2).png",
                alt: "Digital Platform",
                title: "2. Digital Platform",
                desc: "Our FPO is tailored to Lorem ipsum dolor sit amet.",
              },
              {
                img: "/Images/Frame (1).png",
                alt: "Farmer Benefit",
                title: "3. Farmer's Benefits",
                desc: "Our FPO is tailored to Lorem ipsum dolor sit amet.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-4 sm:p-6 rounded-xl hover:scale-105 transform transition-all flex flex-col justify-center items-center"
              >
                <img
                  src={item.img}
                  alt={item.alt}
                  className="w-16 h-16 sm:w-20 sm:h-20"
                />
                <hr className="border-gray-300 border-[0.01rem] w-full my-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                  {item.desc}
                </p>
                <hr className="border-gray-300 border-[0.01rem] w-full my-4" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FPO Digitalization For Everyone Section ── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16 text-center">
        <p className="text-xs sm:text-sm text-green-600 font-medium mb-2">
          Who can benefit?
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          FPO Digitalization is for Every Agriculture Business!
        </h1>
        <p className="text-gray-600 mb-8 sm:mb-12 text-base sm:text-lg">
          We adhere to the highest standards of quality in all our products and
          services. From lorem ipsum to lorem ipsum.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {[
            {
              title: "Farmer Producer Organizations",
              desc: "Streamline demand aggregation, supply chain management, and day-to-day operations with our comprehensive digital tools.",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h4v4H3v-4zm14 0h4v4h-4v-4zm-7 2h4m-2-2v4m-6 6h4v-4H6v4zm10 0h4v-4h-4v4z"
                />
              ),
            },
            {
              title: "Agri-businesses",
              desc: "Gain better market access, improve operational efficiency, and connect directly with farmers through our platform.",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v8m4-4H8"
                />
              ),
            },
            {
              title: "Cooperatives & Societies",
              desc: "Digitize member engagement, resource management, and collective activities to enhance transparency and efficiency.",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-6 14h4m-2-2v4m-6-6h12"
                />
              ),
            },
            {
              title: "Government & NGOs",
              desc: "Support and integrate digital solutions for rural development, monitoring, and agricultural extension services.",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              ),
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                <div className="bg-green-100 text-green-600 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {card.icon}
                  </svg>
                </div>
                <h2 className="font-semibold text-base sm:text-lg">
                  {card.title}
                </h2>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact Form Section ── */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16 text-center">
        <p className="text-xs sm:text-sm text-green-600 font-medium mb-2">
          Let's talk!
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Want to Digitize your FPO? Let's Talk!
        </h2>
        <p className="text-gray-600 mb-6 sm:mb-10 text-base sm:text-lg">
          We adhere to the highest standards of quality in all our products and
          services. From lorem ipsum to lorem ipsum.
        </p>

        <ContactForm />
      </section>

      <Footer />
    </>
  );
};

/* ── Contact Form (separate component to use hooks) ── */
const ContactForm = () => {
  const [showPopup, setShowPopup] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    await fetch("https://formsubmit.co/Info@ambaokrishikutumb.com", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    setShowPopup(true);
    form.reset();
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <input
            type="text"
            name="Full Name"
            placeholder="Full Name"
            required
            className="w-full bg-gray-100 border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
          <input
            type="text"
            name="Organization Name"
            placeholder="Organization Name"
            className="w-full bg-gray-100 border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
          <input
            type="email"
            name="Email"
            placeholder="Email Address"
            required
            className="w-full bg-gray-100 border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
          <input
            type="tel"
            name="Phone"
            placeholder="Phone Number"
            className="w-full bg-gray-100 border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
        </div>

        <textarea
          name="Message"
          placeholder="Write a Message"
          rows={5}
          required
          className="w-full bg-gray-100 border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
        />

        <input type="hidden" name="_redirect" value="javascript:void(0);" />

        <div className="text-left">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md inline-flex items-center text-sm sm:text-base"
          >
            Send Message
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-7-7l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </form>

      {showPopup && (
        <div className="mt-4 text-green-700 bg-green-100 px-4 py-2 rounded-md text-center w-full sm:w-auto">
          Message sent successfully!
        </div>
      )}
    </>
  );
};

export default FPO;

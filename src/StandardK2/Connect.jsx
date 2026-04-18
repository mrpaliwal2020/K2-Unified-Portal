import React, { useState } from "react";
import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";

const GetInTouch = () => {
  const playstore =
    "https://play.google.com/store/apps/details?id=com.ambaokrishikutumb.k2k&pli=1";

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
    }).then((response) => {
      if (response.ok) {
        const msg = document.createElement("div");
        msg.textContent = "✅ Message sent successfully!";
        msg.className = "text-green-600 font-semibold mt-4";
        form.appendChild(msg);
        setTimeout(() => {
          msg.remove();
          form.reset();
        }, 3000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <>
      <Header />

      {/* ── Hero Section ── */}
      <section className="bg-gray-50 py-16 px-4 text-center">
        <p className="text-center text-black text-xl font-bold uppercase">
          <i className="fa-solid fa-phone-alt text-green-600 mr-2"></i> Let's
          Connect
        </p>
        <h1
          className="text-3xl md:text-4xl font-semibold my-6 text-black"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          Get in touch with <span className="text-green-600">us</span>
        </h1>

        <div className="max-w-[80%] mx-auto flex flex-col lg:flex-row justify-between gap-8">
          {[
            {
              img: "Images/reach at team.png",
              alt: "Team",
              tag: "HAVE A QUESTION",
              title: "Reach Our Team",
              desc: "Get assistance, ask anything, or simply understand how the platform works better",
            },
            {
              img: "Images/image (1).png",
              alt: "Phone",
              tag: "ACCESS-ON-THE-GO",
              title: "Get the App",
              desc: "Track crops, connect with others, and explore tools-right from your mobile device.",
            },
            {
              img: "Images/Frame 120.png",
              alt: "Podha",
              tag: "COLLABORATE WITH US",
              title: "Grow Together",
              desc: "We're open to partnership that benefit farmers, communities, and sustainable agri..",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-white shadow-lg rounded-xl p-6 transform transition-transform hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={card.img}
                alt={card.alt}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-500 text-sm font-medium uppercase text-left">
                {card.tag}
              </p>
              <h2 className="text-xl font-semibold text-black mb-2 text-left">
                {card.title}
              </h2>
              <p className="text-gray-600 mb-4 text-left">{card.desc}</p>
              <button className="bg-green-600 text-white py-2 px-6 rounded-xl hover:bg-green-700 transition block text-left">
                <a href={playstore}>View more</a>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-[80%] mx-auto flex flex-col lg:flex-row justify-between gap-8">
          {/* Contact Form */}
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl shadow-lg">
            <h2
              className="text-2xl font-semibold text-left text-black mb-2"
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              Contact Us
            </h2>
            <p className="text-gray-500 text-[12px] mb-4">
              Call us at{" "}
              <a
                href="tel:+916268645010"
                className="text-gray-600 hover:text-green-600 mb-1"
              >
                +91 6268645010
              </a>{" "}
              during our business hours
            </p>

            <form
              action="https://formsubmit.co/info@krishikutumb.com"
              method="POST"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="_captcha" value="false" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="p-3 border border-gray-300 rounded-lg w-full"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="p-3 border border-gray-300 rounded-lg w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  className="p-3 border border-gray-300 rounded-lg w-full"
                  required
                />
                <select
                  name="category"
                  className="p-3 border border-gray-300 rounded-lg w-full"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Support</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div className="mb-6">
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Write a message"
                  className="p-3 border border-gray-300 rounded-lg w-full"
                  required
                ></textarea>
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  name="privacy"
                  className="mr-2"
                  id="privacy"
                  required
                />
                <label htmlFor="privacy" className="text-gray-600">
                  You agree to our{" "}
                  <span className="text-green-600">privacy policy</span>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md inline-flex items-center"
                >
                  Send Message
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
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
          </div>

          {/* Contact Details */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 flex items-center gap-4">
              <i className="fa-solid fa-phone text-green-600 text-2xl"></i>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  Contact Details
                </h3>
                <a
                  href="tel:+916268645010"
                  className="text-gray-600 hover:text-green-600 mb-1 block"
                >
                  +91 6268645010
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 flex items-center gap-4">
              <i className="fa-solid fa-location-dot text-green-600 text-2xl"></i>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  Office Location
                </h3>
                <p className="text-gray-600">
                  Timarni Harda, Madhya Pradesh, <br />
                  India 461228
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 flex items-center gap-4">
              <i className="fa-solid fa-envelope text-green-600 text-2xl"></i>
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  Email Us
                </h3>
                <a
                  href="mailto:info@krishikutumb.com"
                  className="text-gray-600 hover:text-green-600"
                >
                  info@krishikutumb.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default GetInTouch;

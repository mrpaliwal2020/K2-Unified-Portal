import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    const WORKSPACE = "krishikutumb";
    const COUNTER = "site-visits";
    const VISITED_KEY = "kk-site-visited";

    const trackVisit = async () => {
      try {
        const alreadyVisited = localStorage.getItem(VISITED_KEY);
        const url = alreadyVisited
          ? `https://api.counterapi.dev/v1/${WORKSPACE}/${COUNTER}`
          : `https://api.counterapi.dev/v1/${WORKSPACE}/${COUNTER}/up`;

        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();

        if (typeof data?.count === "number") {
          setVisitorCount(data.count);
          if (!alreadyVisited) {
            localStorage.setItem(VISITED_KEY, Date.now().toString());
          }
        }
      } catch {
        // fail silently — counter is non-critical
      }
    };

    trackVisit();
  }, []);

  return (
    <footer>
      <section
        style={{ backgroundColor: "#eaf0e7" }}
        className="py-12 px-6 md:px-16 lg:px-20 flex flex-wrap justify-between items-start gap-x-8 gap-y-4 text-gray-800 text-sm"
      >
        {/* Brand Column */}
        <div className="max-w-sm space-y-4">
          <h1 className="text-4xl font-semibold text-black">Krishi Kutumb</h1>
          <p className="leading-relaxed text-lg text-gray-700">
            K2: Your all-in-one farm solution
            <br />
            connecting all your farming activities
            <br />
            with a focus on organic and sustainable
            <br />
            agriculture!
          </p>
          <div className="flex gap-3 pt-2 text-lg text-gray-600">
            <a
              href="https://www.facebook.com/people/KrishiKutumb/61569769137792/"
              className="hover:text-blue-600 transition bg-white px-2.5 py-1 rounded-full"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.instagram.com/k2.krishikutumb/"
              className="hover:text-pink-600 transition bg-white px-2.5 py-1 rounded-full"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://www.youtube.com/channel/UCegKq4QMnrzbD_maliEautQ"
              className="hover:text-red-500 transition bg-white px-2.5 py-1 rounded-full"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h2 className="font-semibold mb-1 text-black text-lg">Quick Links</h2>
          <ul className="space-y-1">
            <li>
              <a
                href="https://wa.me/+916268645010"
                className="hover:text-green-600 transition text-lg"
              >
                Help
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-600 transition text-lg">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-600 transition text-lg">
                FPO
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-600 transition text-lg">
                About us
              </a>
            </li>
          </ul>
        </div>

        {/* Community */}
        <div className="space-y-3">
          <h2 className="font-semibold mb-1 text-black text-lg">Community</h2>
          <ul className="space-y-1">
            <li>
              <a
                href="https://www.youtube.com/channel/UCegKq4QMnrzbD_maliEautQ"
                className="hover:text-green-600 transition text-lg"
              >
                Videos
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green-600 transition text-lg">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div className="space-y-1">
          <h2 className="font-semibold mb-1 text-black text-lg">Follow Us</h2>
          <ul className="space-y-1">
            <li>
              <a
                href="https://www.instagram.com/k2.krishikutumb/"
                className="hover:text-green-600 transition text-lg"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/people/KrishiKutumb/61569769137792/"
                className="hover:text-green-600 transition text-lg"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/channel/UCegKq4QMnrzbD_maliEautQ"
                className="hover:text-green-600 transition text-lg"
              >
                YouTube
              </a>
            </li>
            <li>
              <a
                href="http://www.linkedin.com/in/ambao-krishi-kutumb-a701b0314"
                className="hover:text-green-600 transition text-lg"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-300 mt-6"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full text-xs font-medium gap-3 text-gray-700 pt-4">
          <p className="text-lg">©2025 Krishi Kutumb. All rights reserved</p>

          {/* Visitor Counter */}
          <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm text-base text-gray-700">
            <i className="fas fa-eye text-green-600"></i>
            <span>Total Visitors:</span>
            <span className="font-semibold text-black tabular-nums">
              {visitorCount !== null ? visitorCount.toLocaleString() : "…"}
            </span>
          </div>

          <div className="flex gap-4">
            <Link
              to="/cancellation"
              className="hover:text-green-600 transition text-lg"
            >
              Privacy & Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-green-600 transition text-lg"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;

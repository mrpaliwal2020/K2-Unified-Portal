import React from "react";
import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";

const Condition = () => {
  return (
    <>
      <Header />

      {/* ── Cancellation & Refund Policy Section ── */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl ">
        <div className="space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-800 text-center">
            K2 : KRISHI KUTUMB
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 text-center">
            Cancellation & Refund Policy
          </h2>
          <p className="text-sm text-gray-600 italic">
            Last updated on 19-11-2024 20:58:27
          </p>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              AMBAO KRISHIKUTUMB LLP believes in helping its customers as far as
              possible, and has therefore a liberal cancellation policy. Under
              this policy:
            </p>

            <ul className="list-disc pl-6 space-y-3">
              <li>
                Cancellations will be considered only if the request is made
                immediately after placing the order. However, the cancellation
                request may not be entertained if the orders have been
                communicated to the vendors/merchants and they have initiated the
                process of shipping them.
              </li>
              <li>
                AMBAO KRISHIKUTUMB LLP does not accept cancellation requests for
                perishable items like flowers, eatables etc. However,
                refund/replacement can be made if the customer establishes that
                the quality of product delivered is not good.
              </li>
              <li>
                In case of receipt of damaged or defective items, please report
                the same to our Customer Service team. The request will, however,
                be entertained once the merchant has checked and determined the
                same at their own end. This should be reported within 15 days of
                receipt of the products. In case you feel that the product
                received is not as shown on the site or as per your expectations,
                you must bring it to the notice of our customer service within 15
                days of receiving the product. The Customer Service team, after
                reviewing your complaint, will take appropriate action, which may
                include a refund or replacement at our discretion.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Condition;
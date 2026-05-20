import Header from "./StandardHeader";
import Footer from "../components/Common/Footer";
import Eligibility from "../pages/DashboardSubsections/Director/Eligibility";

const FPO = () => {
  return (
    <>
      <Header />
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Eligibility />
      </div>
      <Footer />
    </>
  );
};

export default FPO;

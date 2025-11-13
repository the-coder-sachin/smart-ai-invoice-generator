import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Hero = () => {
  const {isAuthenticated} = useAuth();
  return (
    <section className="relative bg-sky-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.5] bg-[size:60px_60px]"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 leading-tight mb-6">
            <span className="text-5xl sm:text-7xl lg:text-9xl">AI</span>-Powered
            Invoicing, Generates Invoices in Seconds
          </h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
            Let our AI create invoices from simple Text, Generate Payment
            Reminders, & provide Smart Insights to help you Manage your
            Finances.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {isAuthenticated ? (
              <Link
                to={"/dashboard"}
                className="bg-gradient-to-r from-blue-950 to to-blue-900 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl transform"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to={"/signup"}
                className="bg-gradient-to-r from-blue-950 to to-blue-900 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl transform"
              >
                Get Started for Free
              </Link>
            )}
            <a
              href="#features"
              className="border-2 border-black text-black px-8 py-4 text-base rounded-xl font-semibold hover:bg-white transition-all duration-200 hover:scale-105 hover:shadow-2xl"
            >
              Learn more
            </a>
          </div>
        </div>
        <div className="mt-12 sm:mt-22 relative max-w-5xl mx-auto">
          <img
            src="https://images.pexels.com/photos/8962519/pexels-photo-8962519.jpeg"
            alt="Smart Invoicing ScreenShot"
            className="rounded-2xl shadow-2xl border-4 border-gray-200/20"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

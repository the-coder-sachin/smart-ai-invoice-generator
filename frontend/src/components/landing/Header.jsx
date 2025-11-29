import { FileText, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropDown from "../layout/ProfileDropDown";
import Button from "../../ui/Button";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropDownOpen] = useState(false);
  const profileDropDown = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const toggleDropDownMenu = (e) => {
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target)
      ) {
        setIsProfileDropDownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", toggleDropDownMenu);

    return () => document.removeEventListener("mousedown", toggleDropDownMenu);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-sky-50 backdrop-blur-sm shadow-xl"
          : "bg-gradient-to-b from-sky-200/50 to-sky-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link
            to={"/"}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/logo.png" className="text-white w-8 h-8 object-cover" />
            </div>
            <span className="text-xl text-gray-900 font-bold text-nowrap">
              Smart AI Invoice
            </span>
          </Link>
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full"
            >
              Testimonials
            </a>
            <a
              href="#FAQ"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full"
            >
              FAQ
            </a>
          </div>
          <div className="mr-7 flex space-x-4 items-center relative">
            {isAuthenticated ? (
              <div ref={profileDropDown}>
                <ProfileDropDown
                  isOpen={isProfileDropdownOpen}
                  onToggle={(e) => {
                    e.stopPropagation();
                    setIsProfileDropDownOpen(!isProfileDropdownOpen);
                  }}
                  avatar={user?.avatar || ""}
                  companyName={user?.name || ""}
                  email={user?.email || ""}
                  logout={logout}
                />
              </div>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="hidden lg:block text-black hover:text-gray-800 font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="hidden lg:block bg-gradient-to-r from-blue-950 to-blue-900 text-white hover:bg-gray-900 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <div className="lg:hidden fixed right-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-16 w-16 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white/30 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="lg:hidden top-full left-0 right-0 bg-sky-50 border-b border-gray-200 shadow-lg"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#features"
              className="px-4 py-3 block text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="px-4 py-3 block text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              Testimonials
            </a>
            <a
              href="#FAQ"
              className="px-4 py-3 block text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              FAQ
            </a>
            <div className="border-t border-gray-200 my-2"></div>
            {isAuthenticated ? (
              <div className="py-4 hover:bg-gradient-to-r rounded-lg transition-colors duration-300 hover:from-blue-950 hover:to-blue-800 hover:text-white">
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="w-full cursor-pointer"
                >
                  Go To Dashboard
                </Button>
              </div>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="px-4 py-3 block text-gray-600 hover:text-gray-900 bg-gray-50 font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="px-4 py-3 block text-white hover:text-gray-100 bg-black font-medium transition-colors duration-200 rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

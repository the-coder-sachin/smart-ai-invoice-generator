import { useState, useEffect } from "react";
import { Briefcase, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ProfileDropDown from "../../components/layout/ProfileDropDown";
import { useAuth } from "../../context/AuthContext";
import { NAVIGATION_MENU } from "../../utils/data";

const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 group ${
        isActive
          ? "bg-sky-100 text-blue-800 shadow-sm shadow-blue-50"
          : "text-gray-600 hover:bg-sky-50 hover:text-gray-900"
      }`}
    >
      <Icon
        className={`h-5 w-5 flex-shrink-0 ${
          isActive ? "text-blue-900" : "text-gray-500"
        }`}
      />
      {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
    </button>
  );
};

const DashboardLayout = ({ children, activeMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isProfileDropdownOpen) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isProfileDropdownOpen]);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const sidebarCollapsed = !isMobile && false;

  return (
    <>
      <div className="flex h-screen bg-sky-50">
        {/* Sidebar */}
        <div
          className={`fixed inset-0 left-0 z-50 transition-all duration-300 transform ${
            isMobile
              ? sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          } ${
            sidebarCollapsed ? "w-16" : "w-64"
          } bg-white border-r border-sky-200`}
        >
          {/* Company logo */}
          <div className="flex items-center border-b border-sky-200 px-6 h-16">
            <Link className="flex items-center space-x-3" to={"/dashboard"}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-950 to-blue-900 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <span className="text-gray-900 font-bold text-xl">
                  Ai Invoice app
                </span>
              )}
            </Link>
          </div>
          {/* Navigation */}
          <nav className="space-y-2 p-4">
            {NAVIGATION_MENU.map((item) => (
              <NavigationItem
                key={item.id}
                item={item}
                isActive={activeNavItem === item.id}
                onClick={handleNavigation}
                isCollapsed={sidebarCollapsed}
              />
            ))}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300"
            >
              <LogOut className="w-5 h-5 flex-shrink-0 text-gray-500" />
              {!sidebarCollapsed && <span className="ml-2">Logout </span>}
            </button>
          </div>
        </div>
        {/* Mobile overlay */}
        {sidebarOpen && isMobile && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/10 opacity-25 z-40 backdrop-blur-sm"
          ></div>
        )}
        {/* Main content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          {/* Top navbar */}
          <header className="bg-sky-100 backdrop-blur-sm border-b border-sky-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center space-x-4">
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-300 "
                >
                  {sidebarOpen ? (
                    <X className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              )}
              <div>
                <h1 className="text-base font-semibold text-gray-900">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  here's your invoice overview.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Profile dropdown */}
              <ProfileDropDown
              isOpen={isProfileDropdownOpen}
              onToggle={(e)=>{
                e.stopPropagation();
                setIsProfileDropdownOpen(prev=>!prev)
              }}
              avatar={user?.avatar || ""}
              companyName={user?.companyName || ""}
              email={user?.email || ""}
              logout={logout}
              />
            </div>
          </header>
          {/* Main content area */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;

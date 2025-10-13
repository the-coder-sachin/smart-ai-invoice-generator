import { FileText, Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const FooterLink = ({ href, to, children }) => {
  const className =
    "block text-gray-400 hover:text-white transition-colors duration-200";
  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
};

const SocialLink = ({ href, children }) => {
  return (
    <a
      href={href}
      className="w-10 h-10 bg-blue-950 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex justify-center items-center"
      target="_blank"
      rel="noopner noreferrer"
    >
      {children}
    </a>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <Link to={"/"} className="flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 rounded-md flex justify-center items-center">
                <img src="/logo.png" alt="logo" className="h-8 w-8 object-cover" />
              </div>
              <span className="text-xl font-bold select-none">Smart AI Invoice</span>
            </Link>
            <p className="leading-relaxed text-gray-400 max-w-sm select-none">
              The simplest way to generate your profession invoices.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-4 select-none">Products</h3>
            <ul className="space-y-2">
              <li>
                <FooterLink href={"#features"}>Features</FooterLink>
              </li>
              <li>
                <FooterLink href={"#testimonials"}>Testimonials</FooterLink>
              </li>
              <li>
                <FooterLink href={"#FAQ"}>FAQs</FooterLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base mb-4 select-none">Company</h3>
            <ul className="space-y-2">
              <li>
                <FooterLink to={"/about"}>About Us</FooterLink>
              </li>
              <li>
                <FooterLink to={"/contact"}>Contact Us</FooterLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base mb-4 select-none">Legal</h3>
            <ul className="space-y-2">
              <li>
                <FooterLink to={"/privacy"}>Privacy Policy</FooterLink>
              </li>
              <li>
                <FooterLink to={"/terms"}>Terms of Service</FooterLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 py-8 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">
              &copy; 2025 AI Invoice APP. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <SocialLink href={"#"}>
                <Twitter />
              </SocialLink>
              <SocialLink href={"#"}>
                <Github />
              </SocialLink>
              <SocialLink href={"#"}>
                <Linkedin />
              </SocialLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

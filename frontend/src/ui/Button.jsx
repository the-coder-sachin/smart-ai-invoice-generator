import { Loader2 } from "lucide-react";

const Button = ({
  variant = "primary",
  size = "medium",
  isloading = false,
  children,
  icon: Icon,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = {
    primary: "bg-blue-900 hover:bg-blue-800 text-white",
    secondary:
      "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
  };
  const sizesClasses = {
    small: "text-sm h-8 px-3 py-1",
    medium: "text-sm h-10 px-4 py-2",
    large: "text-base h-12 px-6 py-3",
  };
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizesClasses[size]}`}
      disabled={isloading}
      {...props}
    >
      {isloading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;

import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  FileText,
  ArrowRight,
  User,
  User2Icon
} from "lucide-react";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { validateEmail, validatePassword } from "../../utils/helper";

const Signup = () => {
  const {login} = useAuth();
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setfieldErrors] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:""
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  // validation function
  const validateName = (name) => {
    if(!name) return "Name is required!";
    if(name.length <2) return "Name should be of at least 2 characters";
    if(name.length > 25) return "Name should not exceed 25 characters";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if(!confirmPassword) return "Please confirm your password";
    if(confirmPassword !== password) return "Password does not match";
    return "";
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormdata(prev => ({...prev, [name]: value}));
    // Real time validation
    if(touched[name]){
      const newFieldErrors = {...fieldErrors };
      if(name === "name"){
        newFieldErrors.name = validateName(value);
      } else if(name === "email"){
        newFieldErrors.email = validateEmail(value).message;
      } else if(name === "password"){
        newFieldErrors.password = validatePassword(value).message;
        // also revalidate confirm password if touched
        if(touched.confirmPassword){
          newFieldErrors.confirmPassword = validateConfirmPassword(formdata.confirmPassword, value)
        }
      } else if(name === "confirmPassword"){
        newFieldErrors.confirmPassword = validateConfirmPassword(value, formdata.password)
      }
      setfieldErrors(newFieldErrors)
    }
    if(error) setError("")
  };

  const handleBlur = (e) => {
    const {name} = e.target;
    setTouched(prev => ({
      ...prev, [name]: true
    }));
    // Validate on blur
    const newFieldErrors = {...fieldErrors};
    if(name === "name"){
      newFieldErrors.name = validateName(formdata.name)
    } else if(name === "email"){
      newFieldErrors.email = validateEmail(formdata.email).message
    } else if(name === "password"){
      newFieldErrors.password = validatePassword(formdata.password).message
    } else if(name === "confirmPassword"){
      newFieldErrors.confirmPassword = validateConfirmPassword(formdata.confirmPassword, formdata.password)
    }
    setfieldErrors(newFieldErrors)
  };

  const isFormValid = () => {
    const nameError = validateName(formdata.name);
    const emailError = validateEmail(formdata.email).message;
    const passwordError = validatePassword(formdata.password).message;
    const confirmPasswordError = validateConfirmPassword(formdata.confirmPassword, formdata.password);
     
    return (
      !nameError && 
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      formdata.name &&
      formdata.email &&
      formdata.password &&
      formdata.confirmPassword
    )
  };

  const handleSubmit = async () => {
    // validate all fields before submission 
    const nameError = validateName(formdata.name);
    const emailError = validateEmail(formdata.email).message;
    const passwordError = validatePassword(formdata.password).message;
    const confirmPasswordError = validateConfirmPassword(formdata.confirmPassword, formdata.password);

    if(nameError || emailError || passwordError || confirmPasswordError){
      setfieldErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      return;
    };
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER, 
        {
          name: formdata.name,
          email: formdata.email,
          password: formdata.password
        }
      );
      const data = response.data;
      const {token} = data;
      if(response.status === 201){
        setSuccess("Account created successfully.. ");
        // reset form 
        setFormdata({
          name: "",
          email: "",
          password:"",
          confirmPassword:"",
        })
        setTouched({
          name: false,
          email: false,
          password: false,
          confirmPassword: false,
        });
        // login user immediately after successful registration
        console.log(response);
        
        login(data, token);
        navigate("/dashboard")
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }else{
        setError("Registraion failed please try again..");
        console.log("API Error : ", error.response || error);
      }
    } finally {
      setLoading(false)
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8 ">
      <div className="w-full max-w-sm">
        {/* header */}
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-950 to-blue-900 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 text-sm">Join Invoice Generator Today</p>
        </div>

        {/* form  */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User2Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                required
                value={formdata.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.name && touched.name
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {fieldErrors.name && touched.name && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>
          {/* Email  */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                required
                value={formdata.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.email && touched.email
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                placeholder="Enter your Email"
              />
            </div>
            {fieldErrors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={`${showPassword ? "text" : "password"}`}
                name="password"
                required
                value={formdata.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.password && touched.password
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                placeholder="Enter your Password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {fieldErrors.password && touched.password && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>
          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={`${showConfirmPassword ? "text" : "password"}`}
                name="confirmPassword"
                required
                value={formdata.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.confirmPassword && touched.confirmPassword
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-black"
                }`}
                placeholder="Confirm your Password"
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {fieldErrors.confirmPassword && touched.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>
          {/* Erorr/Success Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}
          {/* Terms & Conditions */}
          <div className="flex items-start pt-2">
            <input type="checkbox" id="terms" className="w-4 h-4 text-black border-gray-300 rounded-full focus:ring-black mt-1" required />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the <button className="text-black hover:underline cursor-pointer">Terms of Service </button> and{" "}
              <button className="text-black hover:underline cursor-pointer">Privacy Policy.</button>
            </label>
          </div>
          {/* Sign up Button */}
          <button className="w-full bg-gradient-to-r from-blue-950 to-blue-900 text-white py-3 px-4  rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center group" onClick={handleSubmit} disabled={loading || !isFormValid()}>
            {loading ? 
            <> Creating . . 
              <Loader2 className="w-4 h-4 ml-2 animate-spin" /> 
            </>
              : 
            <>
              Sign up 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
            }
          </button>
        </div>
        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            Already have an Account ?{" "}
            <button onClick={() => navigate("/login")} className="text-black cursor-pointer hover:underline">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

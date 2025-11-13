import {Eye, EyeOff, Loader2, Mail, Lock, FileText, ArrowRight } from "lucide-react"
import { API_PATHS } from "../../utils/apiPaths"
import { useAuth } from "../../context/AuthContext"
import axiosInstance from "../../utils/axiosInstance"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { validateEmail, validatePassword } from "../../utils/helper"

const login = () => {
    const {login} = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      email: "",
      password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
      email: "",
      password: ""
    });
    const [touched, setTouched] = useState({
      email: false,
      password: false,
    });

    const isFormValid = () => {
      const emailError = validateEmail(formData.email).message;
      const passwordError = validatePassword(formData.password).message;
      return !emailError && !passwordError && formData.email && formData.password;
    };
 
    const handleInputChange = (e)=>{
      const {name , value} = e.target;
      setFormData((prev)=> ({...prev, [name]: value}))
      // real time validation
      if(touched[name]){
        const newFiledErrors = {...fieldErrors};
        if(name === "email"){
          newFiledErrors.email = validateEmail(value).message;
        } else if(name=== "password"){
          newFiledErrors.password = validatePassword(value).message;
        }
        setFieldErrors(newFiledErrors)
      }
      if(error) setError("")
    };

    const handleBlur = (e)=> {
      const {name} = e.target;
      setTouched(prev=>({...prev, [name]: true}));

      // validate on blur
      const newFieldErrors = {...fieldErrors};
      if(name==="email"){
        newFieldErrors.email = validateEmail(formData.email).message;
      } else if(name==="password"){
        newFieldErrors.password = validatePassword(formData.password).message;
      }
    };

    const handleSubmit = async () => {
      // validate all fields 
      const emailError = validateEmail(formData.email).message;
      const passwordError = validatePassword(formData.password).message;
      if(emailError || passwordError){
        setFieldErrors({
          email: emailError,
          password: passwordError
        })
        setTouched({
          email: true,
          password: true,
        });
        return
      }

      setIsLoading(true);
      setError("");
      setSuccess("");

      try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);
        
        if(response.status === 200){
          const {token} = response.data;
          if(token){
            setSuccess("Login successful");
            login(response.data, token);
            navigate("/dashboard")
          }
          // Redirect based on role
          // setTimeout(() => {
          //   window.location.href = "/dashboard"
          // }, 2000);
        } else{
          setError(response.data.message || "Invalid credentials")
        }
      } catch (error) {
        if(error.response && error.response.data && error.response.data.message){
          setError(error.response.data.message)
        } else{
          setError("Server Error!")
        }
      } finally{
        setIsLoading(false)
      }
    }
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* header  */}
        <div className="text-center mb-8">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-950 to-blue-800 text-white flex items-center justify-center rounded-xl mb-6 mx-auto ">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Login Your Account
          </h1>
          <p className="text-gray-600 text-sm">
            welcome back to invoice generator
          </p>
        </div>
        {/* form */}
        <div className="space-y-4">
          {/* email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.email && touched.email
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-400 focus:ring-gray-600"
                }`}
                placeholder="Enter your Email"
              />
            </div>
            {fieldErrors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>
          {/* password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                required
                type={`${showPassword ? "text" : "password"}`}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all ${
                  fieldErrors.password && touched.password
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-400 focus:ring-gray-600"
                }`}
                placeholder="Enter your password"
              />
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 hover:text-gray-600 transition-colors"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {fieldErrors.password && touched.password && (
              <p className="text-sm mt-1 text-red-600">{fieldErrors.password}</p>
            )}
            {/* Error/Success message */}
            {error && (
              <div className="p-3 mt-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}
          </div>
          {/* sign in button */}
          <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-blue-950 to-blue-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center group transition-colors duration-300">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Signing in ...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </div>
        {/*  footer */}
        <div className="mt-6 pt-4 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600">
            Don't have an Account?
            <button className="text-black font-medium hover:underline cursor-pointer ml-2" onClick={()=>navigate("/signup")}>Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default login
import React, { useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "./context/UserContext";
import { 
  auth, 
  provider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithEmailAndPassword 
} from "./firebase"; 
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "./firebase"; 
import { sendSignInEmail, sendPasswordReset } from "./authUtils";
// Import the initialized Firebase app
// Import Firebase

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  // State for errors
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State for "Remember Me" checkbox
  const [rememberMe, setRememberMe] = useState(false);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      if (user.emailVerified) {
        console.log("Google Sign-In successful:", user);
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        alert("Please verify your email before logging in.");
        await sendEmailVerification(user);
      }
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      alert("Google Sign-In failed. Please try again.");
    }
  };

  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form inputs
  const validateForm = () => {
    let valid = true;
    const newErrors: FormErrors = { email: "", password: "" };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  
    if (validateForm()) {
      try {
        // Attempt to sign in with email and password
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;
        console.log("User logged in:", user);
  
        // Check if the user's email is verified
        if (user.emailVerified) {
          console.log("Email is verified. Redirecting to dashboard...");
          navigate("/dashboard");
        } else {
          console.log("Email not verified. Sending verification email...");
          alert("Please verify your email before logging in.");
          await sendEmailVerification(user);
        }
      } catch (error: any) {
        console.error("Error during login:", error);
  
        // Handle specific Firebase errors
        if (error.code === "auth/user-not-found") {
          alert("No user found with this email. Please sign up first.");
        } else if (error.code === "auth/wrong-password") {
          alert("Incorrect password. Please try again.");
        } else {
          alert("Login failed. Please try again.");
        }
      }
    }
  };

  // Get password strength
  const getPasswordStrength = (password: string): string => {
    if (password.length < 6) return "Weak";
    if (password.match(/[A-Z]/) && password.match(/[0-9]/)) return "Strong";
    return "Moderate";
  };

  // Doodle items for floating animations
  const doodleItems = [
    { src: "/images/tabledodle.png", top: "10%", left: "10%", width: "100px", delay: 0 },
    { src: "/images/cakedodle.png", top: "30%", left: "20%", width: "120px", delay: 0.5 },
    { src: "/images/dodle.png", top: "70%", left: "15%", width: "110px", delay: 1 },
    { src: "/images/eventdodle.png", top: "15%", right: "30%", width: "80px", delay: 1.5 },
    { src: "/images/guiterdodle.png", top: "20%", right: "15%", width: "90px", delay: 2 },
    { src: "/images/hotdogdodle.png", top: "40%", right: "20%", width: "85px", delay: 2.5 },
    { src: "/images/meatdodle.png", top: "60%", right: "10%", width: "100px", delay: 3 },
    { src: "/images/nooddodle.png", top: "50%", left: "10%", width: "95px", delay: 3.5 },
    { src: "/images/pioanododle.png", top: "80%", left: "45%", width: "90px", delay: 4 },
    { src: "/images/tabledodle.png", top: "70%", right: "30%", width: "100px", delay: 4.5 },
    { src: "/images/teacrosdod.png", bottom: "10%", right: "15%", width: "90px", delay: 5 },
    { src: "/images/cakedodle.png", bottom: "5%", left: "5%", width: "140px", delay: 5.5 },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-gray-50 overflow-hidden">
      {/* Floating Doodles */}
      {doodleItems.map((doodle, index) => (
        <motion.img
          key={index}
          src={doodle.src}
          className="absolute object-contain opacity-70 z-0"
          style={{
            ...doodle,
            position: "absolute",
          }}
          animate={{
            y: [-8, 8, -8],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Fixed Wave Background */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            fill="#00F29D"
            fillOpacity="1"
            d="M0,96L48,122.7C96,149,192,203,288,213.3C384,224,480,192,576,160C672,128,768,96,864,112C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="M0,96L48,122.7C96,149,192,203,288,213.3C384,224,480,192,576,160C672,128,768,96,864,112C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,128L48,154.7C96,181,192,235,288,245.3C384,256,480,224,576,192C672,160,768,128,864,144C960,160,1056,224,1152,245.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,96L48,122.7C96,149,192,203,288,213.3C384,224,480,192,576,160C672,128,768,96,864,112C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </path>
        </svg>
      </div>

      {/* Logo */}
      <div className="mb-6 text-center relative z-10">
        <h1 className="text-4xl font-bold">
          D<span className="relative">
            i
            <span className="absolute top-2.5 left-1.5 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></span>
          </span>neIn
          <span className="text-yellow-400">Go</span>
        </h1>
        <p className="text-sm text-gray-600">Reserve Dining & Events</p>
      </div>

      {/* Login Container */}
      <motion.div
        className="bg-white p-8 rounded-3xl w-full max-w-md z-10 shadow-xl border border-emerald-100 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Message */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-sm text-gray-600 mt-2">Sign in to continue your seamless dining experience.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-1"
          >
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full p-3 rounded-full border ${errors.email ? "border-red-500" : "border-gray-300"} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs ml-4">{errors.email}</p>}
          </motion.div>

          {/* Password Input */}
          <motion.div
            className="relative space-y-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full p-3 rounded-full border ${errors.password ? "border-red-500" : "border-gray-300"} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs ml-4">{errors.password}</p>}
          </motion.div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3 rounded-full font-medium text-sm hover:bg-emerald-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </motion.button>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">Or</span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <motion.button
           type="button"
           className="w-full bg-white text-gray-700 py-3 px-4 rounded-full border border-gray-300 font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
           onClick={handleGoogleSignIn} // Correctly call the function here
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="#10B981"
              />
            </svg>
            Sign in with Google
          </motion.button>

          {/* Sign-Up Link */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <Link to="/signup" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              Sign Up
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
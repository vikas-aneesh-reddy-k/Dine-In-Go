import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { motion } from "framer-motion";
import { auth, provider, signInWithPopup, createUserWithEmailAndPassword, sendEmailVerification } from "./firebase";
// Add Firestore imports at the top
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase"; // Ensure `db` is exported from your firebase.ts file

// Update the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Form submitted");

  if (validateForm()) {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      console.log("User signed up:", user);

      // Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        createdAt: new Date(),
      });

      // Send email verification
      await sendEmailVerification(user);
      alert("A verification email has been sent to your email address. Please verify your email to continue.");

      // Listen for email verification
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser && currentUser.emailVerified) {
          console.log("Email verified. Logging in...");
          unsubscribe(); // Stop listening
          navigate("/dashboard"); // Redirect to dashboard
        }
      });
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert(error.message);
    }
  }
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: ""
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: ""
  });

  // Check password strength whenever password changes
  useEffect(() => {
    if (formData.password) {
      const strength = checkPasswordStrength(formData.password);
      setPasswordStrength(strength);
      
      // If confirm password already has a value, check matching again
      if (formData.confirmPassword) {
        setPasswordsMatch(formData.password === formData.confirmPassword);
      } else {
        setPasswordsMatch(null);
      }
    } else {
      setPasswordStrength({ score: 0, label: "", color: "" });
      setPasswordsMatch(null);
    }
  }, [formData.password]);
  
  // Check if passwords match whenever confirm password changes
  useEffect(() => {
    if (formData.confirmPassword && formData.password) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordsMatch(null);
    }
  }, [formData.confirmPassword]);

  // Function to check password strength
  const checkPasswordStrength = (password) => {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    // Define strength levels
    if (score <= 2) {
      return { score, label: "Weak", color: "bg-red-500" };
    } else if (score <= 4) {
      return { score, label: "Moderate", color: "bg-yellow-500" };
    } else {
      return { score, label: "Strong", color: "bg-green-500" };
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { 
      name: "", 
      email: "", 
      password: "", 
      confirmPassword: "",
      agreeToTerms: ""
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    } else if (passwordStrength.score <= 2) {
      newErrors.password = "Password is too weak, please choose a stronger one";
      valid = false;
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
  
    if (validateForm()) {
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;
  
        console.log("User signed up:", user);
  
        // Send email verification
        await sendEmailVerification(user);
        alert("A verification email has been sent to your email address. Please verify your email to continue.");
  
        // Listen for email verification
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser && currentUser.emailVerified) {
            console.log("Email verified. Logging in...");
            unsubscribe(); // Stop listening
            navigate("/dashboard"); // Redirect to dashboard
          }
        });
      } catch (error) {
        console.error("Error during sign-up:", error);
        alert(error.message);
      }
    }
  };
  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      console.log("Google Sign-Up successful:", user);
  
      // Check if the user's email is verified
      if (user.emailVerified) {
        // Navigate to the dashboard
        navigate("/dashboard");
      } else {
        alert("Please verify your email before logging in.");
        // Send email verification
        await sendEmailVerification(user);
      }
    } catch (error) {
      console.error("Google Sign-Up failed:", error);
      alert(error.message);
    }
  };
  // Define doodle positions similar to your mockup
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
              values="
                M0,96L48,122.7C96,149,192,203,288,213.3C384,224,480,192,576,160C672,128,768,96,864,112C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,128L48,154.7C96,181,192,235,288,245.3C384,256,480,224,576,192C672,160,768,128,864,144C960,160,1056,224,1152,245.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,96L48,122.7C96,149,192,203,288,213.3C384,224,480,192,576,160C672,128,768,96,864,112C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
              "
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

      {/* Signup Container */}
      <motion.div 
        className="bg-white p-8 rounded-3xl w-full max-w-md z-10 shadow-xl border border-emerald-100 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Create Account Message */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
          <p className="text-sm text-gray-600 mt-2">Join us and explore the best dining and event experiences.</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            className="space-y-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className={`w-full p-3 rounded-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs ml-4">{errors.name}</p>
            )}
          </motion.div>

          <motion.div
            className="space-y-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email ID"
              className={`w-full p-3 rounded-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs ml-4">{errors.email}</p>
            )}
          </motion.div>

          <motion.div 
            className="relative space-y-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full p-3 rounded-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
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
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2 ml-4">
                <div className="flex items-center space-x-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color}`}
                      style={{ 
                        width: `${(passwordStrength.score / 6) * 100}%`,
                        transition: 'width 0.3s ease'
                      }}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${
                    passwordStrength.label === 'Weak' ? 'text-red-500' : 
                    passwordStrength.label === 'Moderate' ? 'text-yellow-500' : 
                    'text-green-500'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Password should have 8+ characters with upper, lower case, numbers and symbols.
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-red-500 text-xs ml-4">{errors.password}</p>
            )}
          </motion.div>

          <motion.div 
            className="relative space-y-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full p-3 rounded-full border ${errors.confirmPassword ? 'border-red-500' : (passwordsMatch === false ? 'border-red-500' : (passwordsMatch === true ? 'border-green-500' : 'border-gray-300'))} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                required
              />
              {/* Password match indicator */}
              {passwordsMatch !== null && (
                <span className="absolute right-12 top-1/2 -translate-y-1/2">
                  {passwordsMatch ? (
                    <Check size={20} className="text-green-500" />
                  ) : (
                    <X size={20} className="text-red-500" />
                  )}
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {/* Password Match Status */}
            {formData.confirmPassword && (
              <div className="mt-1 ml-4">
                <p className={`text-xs font-medium ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </p>
              </div>
            )}
            
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs ml-4">{errors.confirmPassword}</p>
            )}
          </motion.div>

          <motion.div
            className="flex items-start space-x-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-1"
            />
            <div>
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                I Agree 
                <Link to="/terms" className="text-blue-600 hover:underline ml-1">Terms and Conditions</Link>
              </label>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>
              )}
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3 rounded-full font-medium text-sm hover:bg-emerald-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign Up
          </motion.button>

          <div className="text-center py-2">
            <span className="text-sm text-gray-500">Or</span>
          </div>

          {/* Google Sign-Up Button */}
          <motion.button
            type="button"
            className="w-full bg-white text-gray-700 py-3 px-4 rounded-full border border-gray-300 font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
            onClick={handleGoogleSignUp} // Updated to call the Google Sign-Up function
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="#10B981"
              />
            </svg>
            Sign Up With Google
          </motion.button>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              Sign In
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
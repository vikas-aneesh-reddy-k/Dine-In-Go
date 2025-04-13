import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "@fontsource/league-spartan";

// Replace with your actual image paths or URLs
const image1 = "/images/eventdodle.png";
const image2 = "/images/tabledodle.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#fff",
        fontFamily: "'League Spartan', sans-serif",
      }}
    >
      {/* Background Tiles */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "16px",
          transform: "rotate(12deg) scale(1.5)",
          zIndex: 0,
        }}
      >
        {Array.from({ length: 36 }).map((_, i) => {
          const background = i % 2 === 0 ? "#00F29D" : "#fff";
          const border = i % 2 === 0 ? "#00F29D33" : "#00000033";

          return (
            <motion.div
              key={i}
              style={{
                background,
                borderColor: border,
                width: 64,
                height: 64,
                borderRadius: 12,
                border: "1px solid",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              animate={{ x: [-20, -40] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 8,
                delay: i * 0.1,
                ease: "linear",
              }}
            >
              <img
                src={i % 4 === 0 ? image1 : image2}
                alt="tile-img"
                style={{ width: 28, height: 28 }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ zIndex: 10, textAlign: "center", padding: "1rem" }}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "0",
          }}
        >
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: "bold",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              marginBottom: "0",
              textShadow: "3px 3px 6px rgba(0, 0, 0, 0.3)",
            }}
          >
            <span style={{ color: "#000" }}>D</span>
            <span style={{ color: "#000", position: "relative" }}>
              i
              <span
                style={{
                  position: "absolute",
                  top: "19px",
                  left: "40%",
                  transform: "translateX(-50%)",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                  boxShadow: "0 0 4px rgba(255, 0, 0, 0.5)",
                }}
              ></span>
            </span>
            <span style={{ color: "#000" }}>n</span>
            <span style={{ color: "#000" }}>e</span>
            <span style={{ color: "#000" }}>I</span>
            <span style={{ color: "#000" }}>n</span>
            <span style={{ color: "#facc15" }}>G</span>
            <span style={{ color: "#facc15" }}>o</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontSize: "1.75rem",
            color: "#333",
            fontWeight: "600",
            marginTop: "0",
            marginBottom: "0.5rem",
            lineHeight: "1.2",
          }}
        >
          Reserve Dining & Events
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            maxWidth: "700px",
            margin: "0 auto 2rem",
            fontSize: "1.25rem",
            color: "#444",
          }}
        >
          Discover the easiest way to reserve tables and event seats with a sleek,
          intuitive experience.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          whileHover={{ scale: 1.07 }}
          style={{
            backgroundColor: "#facc15",
            padding: "14px 40px",
            fontSize: "1.25rem",
            fontWeight: "bold",
            borderRadius: "999px",
            border: "none",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            cursor: "pointer",
          }}
          onClick={() => navigate("/login")}
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
}
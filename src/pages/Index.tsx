import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoSharedrop from "@/assets/logo-sharedrop.png";

const statusMessages = ["Scanning...", "Securing...", "Connecting..."];

const Index = () => {
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const statusInterval = setInterval(() => {
      setCurrentStatus((prev) => (prev + 1) % statusMessages.length);
    }, 1000);

    // Redirect after progress completes (~3.5s)
    const redirectTimer = setTimeout(() => {
      navigate("/documents");
    }, 3800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <motion.div
      className="fixed inset-0 gradient-bg flex flex-col"
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Top Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30">
        <motion.div
          className="h-full bg-foreground/80"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <motion.div
          className="animate-logo-pulse mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative">
            {/* Logo Icon */}
            <div className="w-24 h-24 relative">
              <img 
                src={logoSharedrop} 
                alt="ShareDrop Logo" 
                className="w-full h-full object-contain"
                style={{ mask: 'radial-gradient(circle, black 50%, transparent 80%)', WebkitMask: 'radial-gradient(circle, black 50%, transparent 80%)' }}
              />
            </div>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 w-24 h-24 rounded-3xl bg-primary/20 blur-2xl -z-10" />
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          ShareFile
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-lg mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Secure file sharing, simplified
        </motion.p>

        {/* Status Messages */}
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentStatus}
              className="text-muted-foreground text-sm font-medium tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {statusMessages[currentStatus]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        className="pb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p className="text-xs text-muted-foreground/60">
          End-to-end encrypted · Zero knowledge
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Index;

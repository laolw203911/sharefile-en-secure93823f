import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Upload, CheckCircle2 } from "lucide-react";
import logoSharedrop from "@/assets/logo-sharedrop.png";

const statusMessages = ["Scanning...", "Securing...", "Connecting..."];

const Share = () => {
  const [isTransferring, setIsTransferring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleTransfer = () => {
    setIsTransferring(true);
    setProgress(0);
    setCurrentStatus(0);
  };

  useEffect(() => {
    if (!isTransferring) return;

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    // Status message cycling
    const statusInterval = setInterval(() => {
      setCurrentStatus((prev) => (prev + 1) % statusMessages.length);
    }, 1000);

    // Navigate after 3 seconds
    const redirectTimer = setTimeout(() => {
      navigate("/documents");
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      clearTimeout(redirectTimer);
    };
  }, [isTransferring, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <motion.div
      className="fixed inset-0 gradient-bg flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Progress Bar (only visible during transfer) */}
      {isTransferring && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30 z-50">
          <motion.div
            className="h-full bg-foreground/80"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      )}

      {/* Header */}
      <motion.header 
        className="flex items-center justify-between px-6 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <img src={logoSharedrop} alt="ShareDrop" className="w-8 h-8 object-contain" />
          <span className="font-semibold text-foreground tracking-tight">ShareDrop</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:block">
            {user?.email}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {isTransferring ? (
          // Transfer in progress
          <>
            <motion.div
              className="animate-logo-pulse mb-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="relative">
                <img 
                  src={logoSharedrop} 
                  alt="ShareDrop" 
                  className="w-24 h-24 object-contain drop-shadow-2xl"
                />
                <div className="absolute inset-0 w-24 h-24 rounded-3xl bg-primary/20 blur-2xl -z-10" />
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Transferring
            </motion.h1>

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
          </>
        ) : (
          // AirDrop-style drop zone
          <>
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-3">
                Secure File Transfer
              </h1>
              <p className="text-muted-foreground">
                Tap to receive your encrypted file
              </p>
            </motion.div>

            {/* Circular Drop Zone */}
            <motion.button
              onClick={handleTransfer}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Outer glow ring */}
              <motion.div 
                className="absolute inset-0 rounded-full"
                animate={{ 
                  boxShadow: isHovered 
                    ? "0 0 60px 10px hsl(var(--foreground) / 0.15), 0 0 100px 20px hsl(var(--foreground) / 0.1)"
                    : "0 0 40px 5px hsl(var(--foreground) / 0.08), 0 0 80px 15px hsl(var(--foreground) / 0.05)"
                }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Pulsing ring animation */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-foreground/20"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ width: 200, height: 200 }}
              />

              {/* Main circle */}
              <div className="w-[200px] h-[200px] rounded-full glass-card flex items-center justify-center relative overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent dark:from-white/5" />
                
                {/* Icon */}
                <motion.div
                  animate={{ y: isHovered ? -5 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Upload className="w-12 h-12 text-foreground/80" />
                </motion.div>

                {/* Inner subtle ring */}
                <div className="absolute inset-4 rounded-full border border-foreground/5" />
              </div>
            </motion.button>

            {/* Status Text */}
            <motion.p 
              className="mt-8 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Ready to receive
            </motion.p>
          </>
        )}
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

export default Share;

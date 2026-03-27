import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, ArrowUpRight, CheckCircle2 } from "lucide-react";
import logoSharedrop from "@/assets/logo-sharedrop.png";
const FileReady = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const downloadZip = () => {
    setIsDownloading(true);
    const link = document.createElement("a");
    link.href = "/STEVERYAN_ID.zip";
    link.download = "STEVERYAN_ID.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsDownloading(false);
    setDownloadComplete(true);
  };
  return <motion.div className="fixed inset-0 gradient-bg flex flex-col items-center justify-center px-6" initial={{
    opacity: 0,
    x: 100
  }} animate={{
    opacity: 1,
    x: 0
  }} transition={{
    duration: 0.5,
    ease: "easeOut"
  }}>
      {/* Success Checkmark */}
      <motion.div initial={{
      scale: 0,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} transition={{
      duration: 0.5,
      delay: 0.2,
      type: "spring",
      stiffness: 200
    }} className="mb-8">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
      </motion.div>

      {/* Glass Card */}
      <motion.div className="glass-card rounded-3xl p-8 md:p-10 w-full max-w-md text-center" initial={{
      opacity: 0,
      y: 30
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6,
      delay: 0.3
    }}>
        {/* Logo Icon */}
        <motion.div className="mx-auto mb-6 flex justify-center" whileHover={{
        scale: 1.02
      }} transition={{
        type: "spring",
        stiffness: 400
      }}>
          <img src={logoSharedrop} alt="ShareDrop Logo" className="w-16 h-16 object-contain" />
        </motion.div>

        {/* Headline */}
        <h1 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-2">
          Your secure file is ready.
        </h1>
        
        <p className="text-muted-foreground text-sm mb-8">Encrypted transfer complete</p>

        {/* CTA Button */}
        <motion.div whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }}>
          <Button onClick={downloadZip} disabled={isDownloading} className="w-full h-14 rounded-2xl text-base font-medium bg-foreground text-background hover:bg-foreground/90 shadow-lg">
            {isDownloading ? <motion.div animate={{
            rotate: 360
          }} transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}>
                <Download className="w-5 h-5" />
              </motion.div> : downloadComplete ? <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Downloaded
              </> : <>
                <Download className="w-5 h-5 mr-2" />
                Open Secure File
              </>}
          </Button>
        </motion.div>

        {downloadComplete && <motion.p initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-success text-sm mt-4">
            File saved to your downloads folder
          </motion.p>}
      </motion.div>

      {/* Send Another File Link */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.5,
      delay: 0.6
    }} className="mt-8">
        <Link to="/auth" className="group inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
          Send another file
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.div className="absolute bottom-8 text-center" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.5,
      delay: 0.7
    }}>
        <p className="text-xs text-muted-foreground/60">
          Powered by ShareFile Pro
        </p>
      </motion.div>
    </motion.div>;
};
export default FileReady;
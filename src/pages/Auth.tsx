import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, ArrowRight, Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoSharedrop from "@/assets/logo-sharedrop.png";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(128, { message: "Password must be less than 128 characters" }),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/share");
    }
  }, [user, loading, navigate]);

  const onSubmit = async (values: AuthFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(values.email, values.password);
        if (error) {
          toast({
            variant: "destructive",
            title: "Authentication failed",
            description: error.message === "Invalid login credentials" 
              ? "Invalid email or password. Please try again."
              : error.message,
          });
        } else {
          navigate("/share");
        }
      } else {
        const { error } = await signUp(values.email, values.password);
        if (error) {
          let errorMessage = error.message;
          if (error.message.includes("already registered")) {
            errorMessage = "This email is already registered. Please sign in instead.";
          }
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: errorMessage,
          });
        } else {
          toast({
            title: "Account created",
            description: "Please check your email to verify your account.",
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 gradient-bg flex items-center justify-center">
        <motion.img 
          src={logoSharedrop} 
          alt="ShareDrop" 
          className="w-16 h-16 object-contain"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="fixed inset-0 gradient-bg flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Security Badge */}
      <motion.div 
        className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Shield className="w-4 h-4" />
        <span className="text-xs font-medium tracking-wide uppercase">Enterprise Security</span>
      </motion.div>

      {/* Glass Card */}
      <motion.div 
        className="glass-card rounded-3xl p-8 md:p-12 w-full max-w-md"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Logo */}
        <motion.div 
          className="flex justify-center mb-8"
          whileHover={{ scale: 1.02 }}
        >
          <img 
            src={logoSharedrop} 
            alt="ShareDrop" 
            className="w-16 h-16 object-contain"
          />
        </motion.div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-2">
            {isLogin ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isLogin 
              ? "Sign in to access secure file sharing" 
              : "Join ShareDrop for encrypted transfers"
            }
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      className="h-12 rounded-xl bg-background/50 border-border/50 focus:border-foreground/30 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground font-medium">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-12 rounded-xl bg-background/50 border-border/50 focus:border-foreground/30 transition-colors pr-12"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl text-base font-medium bg-foreground text-background hover:bg-foreground/90 shadow-lg mt-2"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Lock className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </Form>

        {/* Toggle */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              form.reset();
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </motion.div>

      {/* Security Footer */}
      <motion.div 
        className="absolute bottom-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            256-bit encryption
          </span>
          <span>•</span>
          <span>Zero-knowledge security</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Auth;

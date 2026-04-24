import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Hexagon, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      toast({
        title: "Access Granted",
        description: "Welcome to the SA7TEC admin panel.",
      });
      setLocation("/admin/dashboard");
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#091223] relative overflow-hidden selection:bg-primary/30">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-[#132442]/80 backdrop-blur-xl border border-white/10 shadow-2xl relative z-10 glow-cyan"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <Hexagon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">SA7TEC Admin</h1>
          <p className="text-slate-400 text-center">Enter your password to access the control panel.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 bg-black/30 border-white/10 text-white focus:border-primary focus:ring-primary/20 text-lg rounded-xl"
                autoFocus
              />
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-lg"
          >
            Authenticate
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

import { motion } from 'motion/react';
import { Wrench } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans flex flex-col items-center justify-between p-10 max-w-md mx-auto relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-primary/5 rounded-full filter blur-[120px] pointer-events-none" />
      
      {/* Top Utilities */}
      <div className="w-full flex justify-end z-20">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12 w-full z-10">
        {/* App Icon Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-32 h-32 bg-brand-sidebar rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group border border-brand-border"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
          <Wrench className="text-brand-primary w-14 h-14 rotate-45 group-hover:rotate-[60deg] transition-transform duration-500" />
        </motion.div>

        <div className="text-center space-y-6 px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold tracking-tight text-brand-text"
          >
            Work Management
          </motion.h1>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-1"
          >
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Your pocket workbench ledger.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Track jobs, manage collections,
            </p>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              stay focused.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full pt-8"
        >
          <button
            onClick={onGetStarted}
            className="w-full bg-brand-primary text-brand-bg py-5 px-6 rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(245,158,11,0.2)] hover:opacity-90 active:scale-[0.98] transition-all transform"
          >
            Get Started
          </button>
        </motion.div>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="pb-6 z-10 w-full"
      >
        <p className="text-[11px] text-slate-600 font-medium tracking-wide text-center">
          Powered by <span className="text-slate-500">TechEaseHub.com</span>
        </p>
      </motion.footer>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import {
  Heart,
  ArrowRight,
  Users,
  Clock,
  Award,
  Activity,
  MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const stats = [
  {
    icon: Users,
    value: 2400,
    suffix: '+',
    label: 'Active Donors',
    color: 'text-blue-500',
  },
  {
    icon: Heart,
    value: 850,
    suffix: '+',
    label: 'Lives Saved',
    color: 'text-[#B91C3C]',
  },
  {
    icon: Clock,
    value: 2,
    suffix: ' hrs',
    label: 'Avg Response',
    color: 'text-orange-500',
  },
  {
    icon: Award,
    value: 98,
    suffix: '%',
    label: 'Success Rate',
    color: 'text-emerald-500',
  },
];

export default function Hero() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const timers = stats.map((stat, i) => {
      let current = 0;
      const increment = stat.value / steps;
      return setInterval(() => {
        current += increment;
        setCounts(prev => {
          const updated = [...prev];
          updated[i] = current >= stat.value ? stat.value : Math.floor(current);
          return updated;
        });
      }, interval);
    });

    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <div className="relative min-h-[100vh] flex items-center bg-[#fafafa] dark:bg-[#080808] overflow-hidden pt-20 pb-12 lg:py-0">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#B91C3C]/[0.05] rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[5%] left-[-10%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-orange-500/[0.05] rounded-full blur-[80px] md:blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT SIDE: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B91C3C]"></span>
              </span>
              <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-gray-500">
                University Blood Network
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
              Every Drop <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                Saves a Life.
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Connect with campus donors instantly. Our community-driven
              platform makes blood donation faster and more reliable than ever.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#B91C3C] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Heart className="w-5 h-5 fill-current" />
                Start Donating
              </button>

              <button
                onClick={() => navigate('/find-donors')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-8 py-4 rounded-2xl font-bold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
              >
                Find Donors
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Responsive Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto lg:mx-0">
              {stats.map(({ icon: Icon, suffix, label, color }, i) => (
                <div
                  key={label}
                  className="p-3 md:p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-sm"
                >
                  <Icon className={`w-5 h-5 ${color} mb-2 mx-auto lg:mx-0`} />
                  <div className="text-lg md:text-xl font-black text-gray-900 dark:text-white">
                    {counts[i]}
                    {suffix}
                  </div>
                  <div className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-gray-400">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT SIDE: Image Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative order-1 lg:order-2 px-4 sm:px-10 lg:px-0"
          >
            <div className="hidden md:block relative z-10 p-2 md:p-3 bg-white dark:bg-[#111] rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/10 mx-auto max-w-sm md:max-w-md lg:max-w-none">
              <div className="rounded-[1.5rem] md:rounded-[2rem] overflow-hidden aspect-[4/5] lg:aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1683791895200-201c0c40310f?q=80&w=1170&auto=format&fit=crop&q=80"
                  alt="Blood Donation"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating UI Elements - Hidden on very small screens to avoid clutter */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="hidden sm:flex absolute -top-4 -right-2 lg:-right-6 z-20 bg-white dark:bg-[#1a1a1a] p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 items-center gap-3 md:gap-4"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-100 dark:bg-[#B91C3C]/20 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              </div>
              <div className="pr-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase">
                  Urgent
                </p>
                <p className="text-xs md:text-sm font-black text-gray-900 dark:text-white whitespace-nowrap">
                  B+ Needed Now
                </p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="hidden sm:flex absolute -bottom-6 -left-2 lg:-left-10 z-20 bg-white dark:bg-[#1a1a1a] p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 items-center gap-3"
            >
              <div className="p-2 bg-blue-50 dark:bg-blue-500/20 rounded-lg">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
              <span className="text-xs md:text-sm font-bold text-gray-700 dark:text-gray-200">
                Main Campus
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

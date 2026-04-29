import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Loader2,
  Navigation,
  AlertCircle,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Donor } from '../types';
import DonorCard from './DonorCard';
import DonorModal from './DonorModal';

/* ── Animation Variants ─────────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function NearbyDonors() {
  const [locationName, setLocationName] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearbyDonors, setNearbyDonors] = useState<Donor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [allDonors, setAllDonors] = useState<Donor[]>([]);

  // Fetch all available donors on mount
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users`,
        );
        if (response.ok) {
          const data = await response.json();
          let currentUserId: string | null = null;
          try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
              const userObj = JSON.parse(userStr);
              currentUserId = userObj._id || userObj.id;
            }
          } catch (_) {}

          const donors = data.filter(
            (u: any) =>
              u.status === 'Available' &&
              u.role !== 'admin' &&
              u._id !== currentUserId,
          );
          setAllDonors(donors);
        }
      } catch (error) {
        console.error('Failed to fetch donors');
      }
    };
    fetchDonors();
  }, []);

  const detectLocation = () => {
    setLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
          );
          const data = await response.json();

          if (data?.address) {
            const subDist =
              data.address.county ||
              data.address.city ||
              data.address.town ||
              data.address.suburb ||
              '';
            const dist = data.address.state_district || '';
            const division = data.address.state || '';

            const parts = [
              subDist,
              dist !== subDist ? dist : '',
              division,
            ].filter(Boolean);
            setLocationName(parts.join(', ') || 'Current Area');

            const terms = [subDist, dist, division]
              .filter(Boolean)
              .map(s => s.toLowerCase());

            const filtered = allDonors.filter(d =>
              terms.some(
                term =>
                  d.district?.toLowerCase().includes(term) ||
                  d.division?.toLowerCase().includes(term) ||
                  d.upazila?.toLowerCase().includes(term) ||
                  term.includes(d.district?.toLowerCase() || ''),
              ),
            );
            setNearbyDonors(filtered);
          } else {
            setLocationName('Location found, address unknown');
          }
        } catch {
          setLocationError('Failed to resolve coordinates');
        } finally {
          setLoadingLocation(false);
        }
      },
      error => {
        setLocationError(
          error.code === 1
            ? 'Location access denied. Please enable GPS.'
            : 'Unable to retrieve location.',
        );
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  // Trigger location detection once donors are loaded
  useEffect(() => {
    if (allDonors.length > 0 && !locationName) detectLocation();
  }, [allDonors]);

  return (
    <section className="py-24 bg-[#fcfcfc] dark:bg-[#080808] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-72 h-72 bg-red-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
              Nearby <span className="text-red-500">Donors</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Real-time connection with available blood donors in your immediate
              vicinity.
            </p>
          </div>

          <div className="flex shrink-0">
            <AnimatePresence mode="wait">
              {loadingLocation ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm"
                >
                  <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Locating...
                  </span>
                </motion.div>
              ) : locationError ? (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={detectLocation}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm font-semibold text-red-600 hover:bg-red-100 transition-all"
                >
                  <AlertCircle className="w-4 h-4" /> Retry
                </motion.button>
              ) : locationName ? (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-sm"
                >
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </div>
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {locationName}
                  </span>
                  <button
                    onClick={detectLocation}
                    className="ml-2 p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-red-500"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        {/* Results Area */}
        <div className="min-h-[400px]">
          {loadingLocation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="h-64 rounded-3xl bg-gray-100 dark:bg-white/5 animate-pulse border border-gray-200 dark:border-white/10"
                />
              ))}
            </div>
          ) : nearbyDonors.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {nearbyDonors.map(donor => (
                <motion.div key={donor._id} variants={itemVariants}>
                  <DonorCard
                    donor={donor}
                    onClick={() => setSelectedDonor(donor)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : locationName ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-[3rem] bg-white dark:bg-[#0c0c0c] border border-dashed border-gray-200 dark:border-white/10"
            >
              <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No Donors in {locationName}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
                We couldn't find any active donors in your current area right
                now. Try expanding your search radius.
              </p>
              <button className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-2">
                <Info className="w-4 h-4" /> View All Available Donors
              </button>
            </motion.div>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {selectedDonor && (
          <DonorModal
            donor={selectedDonor}
            onClose={() => setSelectedDonor(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

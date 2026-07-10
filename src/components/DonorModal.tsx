import React, { useState } from 'react';
import {
  Droplet,
  MapPin,
  Phone,
  X,
  IdCard,
  User,
  Mail,
  Calendar,
  MessageCircle,
  BookOpen,
  Users,
  Activity,
  Map,
  Clock,
  AlertCircle,
  Send,
  Loader2,
  ChevronLeft,
  CheckCircle2,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Donor } from '../types';
import toast from 'react-hot-toast';

/* ── Blood group color map ─────────────────────────────────────────── */
const BG_COLORS: Record<string, { pill: string; glow: string }> = {
  'A+': {
    pill: 'bg-red-50 dark:bg-[#B91C3C]/10 text-red-600 dark:text-red-400 border-red-200 dark:border-[#B91C3C]/25',
    glow: '#ef4444',
  },
  'A−': {
    pill: 'bg-red-50 dark:bg-[#B91C3C]/10 text-red-600 dark:text-red-400 border-red-200 dark:border-[#B91C3C]/25',
    glow: '#ef4444',
  },
  'B+': {
    pill: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/25',
    glow: '#3b82f6',
  },
  'B−': {
    pill: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/25',
    glow: '#3b82f6',
  },
  'O+': {
    pill: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/25',
    glow: '#10b981',
  },
  'O−': {
    pill: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/25',
    glow: '#10b981',
  },
  'AB+': {
    pill: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/25',
    glow: '#a855f7',
  },
  'AB−': {
    pill: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/25',
    glow: '#a855f7',
  },
};
const fallbackColor = {
  pill: 'bg-red-50 dark:bg-[#B91C3C]/10 text-red-600 dark:text-red-400 border-red-200 dark:border-[#B91C3C]/25',
  glow: '#ef4444',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

/* ── Detail row ────────────────────────────────────────────────────── */
const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-white/[0.04] last:border-0">
    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5 text-red-400">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
        {value || 'Not specified'}
      </p>
    </div>
  </div>
);

/* ── Field wrapper ─────────────────────────────────────────────────── */
const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
      {label}
    </label>
    {children}
  </div>
);

/* ── Props ─────────────────────────────────────────────────────────── */
interface DonorModalProps {
  donor: Donor;
  onClose: () => void;
}

/* ── Component ─────────────────────────────────────────────────────── */
const DonorModal: React.FC<DonorModalProps> = ({ donor, onClose }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [message, setMessage] = useState('');

  if (!donor) return null;

  const color = BG_COLORS[donor.bloodGroup] ?? fallbackColor;
  const isAvail = donor.status === 'Available';

const isEligible = React.useMemo(() => {
  if (!isAvail) return { status: false, daysLeft: 0, showDays: false };
  if (!donor.lastDonation || donor.lastDonation === 'Never')
    return { status: true, daysLeft: 0, showDays: false };

  const last = new Date(donor.lastDonation);
  if (isNaN(last.getTime()))
    return { status: true, daysLeft: 0, showDays: false };

  const diffDays = Math.floor((Date.now() - last.getTime()) / 86400000);

  if (diffDays >= 90) {
    return { status: true, daysLeft: 0, showDays: false };
  } else {
    return { status: false, daysLeft: 90 - diffDays, showDays: true };
  }
}, [donor.lastDonation, isAvail]);
  
  const formatDate = (d: string) => {
    if (!d || d === 'Never') return d || 'Not specified';
    try {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return d;
      return `${String(dt.getDate()).padStart(2, '0')}-${String(dt.getMonth() + 1).padStart(2, '0')}-${dt.getFullYear()}`;
    } catch {
      return d;
    }
  };

  const formatLocation = () =>
    [donor.upazila, donor.district, donor.division]
      .filter(Boolean)
      .join(', ') || 'Not specified';

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo) {
      toast.error('Please provide your contact information.');
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to send requests.');
        return;
      }
      const res = await fetch('/api/direct-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          donorId: donor.id || donor._id,
          contactInfo,
          message,
        }),
      });
      if (res.ok) {
        toast.success(`Request sent to ${donor.name}!`);
        setShowRequestForm(false);
        setContactInfo('');
        setMessage('');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to send request.');
      }
    } catch {
      toast.error('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={e => e.stopPropagation()}
          className="relative bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-white/[0.07] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* ── Colour glow strip at top ── */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
            style={{
              background: `linear-gradient(90deg, ${color.glow}, transparent)`,
            }}
          />

          {/* ── Scrollable body ── */}
          <div className="overflow-y-auto flex-1 p-6 sm:p-8">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <AnimatePresence mode="wait">
              {!showRequestForm ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.22 }}
                >
                  {/* ── Header ── */}
                  <div className="flex items-center gap-4 mb-6 pr-10">
                    {/* Avatar */}
                    <div
                      className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 ${color.pill}`}
                    >
                      <span className="text-lg font-black">
                        {getInitials(donor.name || 'D')}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                        {donor.name || 'Donor'}
                      </h2>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        ID: {donor.studentId}
                      </p>
                    </div>
                    {/* Blood group badge */}
                    <div
                      className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-black ${color.pill}`}
                    >
                      <Droplet className="w-4 h-4" />
                      {donor.bloodGroup || 'N/A'}
                    </div>
                  </div>

                  {/* Status pills */}
                  <div className="flex flex-wrap gap-2 mb-7">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
                        isAvail
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-gray-100 dark:bg-white/[0.04] border-gray-200 dark:border-white/[0.06] text-gray-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isAvail ? 'bg-emerald-500' : 'bg-gray-400'}`}
                      />
                      
                      {isAvail ? 'Available' : 'Unavailable'}
                    </span>
                    {/* <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
                        isEligible
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {isEligible ? 'Eligible to Donate' : 'Not Yet Eligible'}
                    </span> */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
                        isEligible.status
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-600 dark:text-orange-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {isEligible.status
                        ? 'Eligible to Donate'
                        : `Not Yet Eligible ${isEligible.showDays ? `(${isEligible.daysLeft} days left)` : ''}`}
                    </span>
                  </div>

                  {/* ── Detail grid ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 mb-7">
                    <div>
                      <DetailRow
                        icon={<BookOpen className="w-3.5 h-3.5" />}
                        label="Department"
                        value={donor.department}
                      />
                      <DetailRow
                        icon={<Users className="w-3.5 h-3.5" />}
                        label="Batch"
                        value={donor.batch}
                      />
                      <DetailRow
                        icon={<Calendar className="w-3.5 h-3.5" />}
                        label="Date of Birth"
                        value={formatDate(donor.dob)}
                      />
                      <DetailRow
                        icon={<Clock className="w-3.5 h-3.5" />}
                        label="Last Donation"
                        value={
                          donor.lastDonation && donor.lastDonation !== 'Never'
                            ? formatDate(donor.lastDonation)
                            : 'Never'
                        }
                      />
                    </div>
                    <div>
                      <DetailRow
                        icon={<MapPin className="w-3.5 h-3.5" />}
                        label="Location"
                        value={formatLocation()}
                      />
                      <DetailRow
                        icon={<Map className="w-3.5 h-3.5" />}
                        label="Area"
                        value={donor.area}
                      />
                      <DetailRow
                        icon={<Mail className="w-3.5 h-3.5" />}
                        label="Email"
                        value={donor.email}
                      />
                      <DetailRow
                        icon={<Phone className="w-3.5 h-3.5" />}
                        label="Phone"
                        value={donor.phone}
                      />
                    </div>
                  </div>

                  {/* Medical */}
                  {donor.medicalConditions && (
                    <div className="mb-7 p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-500/[0.06] border border-orange-100 dark:border-orange-500/20 flex gap-3">
                      <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-semibold text-orange-500/80 mb-1">
                          Medical Conditions
                        </p>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          {donor.medicalConditions}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ── Action buttons ── */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {isEligible && (
                      <button
                        onClick={() => setShowRequestForm(true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#B91C3C] hover:bg-[#B91C3C] active:bg-red-700 text-white py-3 rounded-2xl text-sm font-bold transition-all shadow-md shadow-[#B91C3C]/20 hover:shadow-[#B91C3C]/30 hover:-translate-y-0.5"
                      >
                        <Send className="w-4 h-4" />
                        Request Blood
                      </button>
                    )}
                    <button
                      onClick={() =>
                        (window.location.href = `tel:${donor.phone}`)
                      }
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-white py-3 rounded-2xl text-sm font-bold border border-gray-200 dark:border-white/[0.07] transition-all hover:-translate-y-0.5"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          `https://wa.me/${donor.phone?.replace(/[^0-9]/g, '')}`,
                          '_blank',
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-2 bg-[#128C7E] hover:bg-[#0f7a6d] text-white py-3 rounded-2xl text-sm font-bold transition-all shadow-sm hover:-translate-y-0.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ── Request Form ── */
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.22 }}
                >
                  {/* Back */}
                  <button
                    onClick={() => setShowRequestForm(false)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-6 pr-10"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to profile
                  </button>

                  {/* Form header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-[#B91C3C]/10 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-[#B91C3C]" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      Request Blood
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed pl-12">
                    Send a direct request to{' '}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {donor.name}
                    </span>
                    . They'll be notified and can accept or decline.
                  </p>

                  <form onSubmit={handleSendRequest} className="space-y-5">
                    <Field label="Your Contact Info *">
                      <input
                        type="text"
                        value={contactInfo}
                        onChange={e => setContactInfo(e.target.value)}
                        placeholder="e.g. 017XXXXXXXX at Dhaka Medical"
                        required
                        className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-red-400 dark:focus:border-[#B91C3C] transition-colors"
                      />
                    </Field>

                    <Field label="Message (Optional)">
                      <textarea
                        rows={4}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="We urgently need blood by tomorrow…"
                        className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-red-400 dark:focus:border-[#B91C3C] transition-colors resize-none"
                      />
                    </Field>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowRequestForm(false)}
                        className="flex-1 py-3 rounded-2xl text-sm font-bold bg-gray-100 dark:bg-white/[0.05] hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/[0.07] transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 rounded-2xl text-sm font-bold bg-[#B91C3C] hover:bg-[#B91C3C] active:bg-red-700 text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-[#B91C3C]/20 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />{' '}
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Send Request
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DonorModal;

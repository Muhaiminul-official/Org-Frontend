import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  User,
  Save,
  Loader2,
  Droplet,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  RefreshCw,
  LogOut,
  X,
  AlertCircle,
  IdCard,
  BookOpen,
  Users,
  Map,
  Clock,
  Bell,
  Settings,
  Send,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLocationData } from '../hooks/useLocationData';
import { io } from 'socket.io-client';
import { checkEligibilityLocal } from '../utils/eligibility';

/**
 * DESIGN SYSTEM NOTE
 * ───────────────────
 * This file uses two typefaces: Fraunces (a warm, humanist display serif —
 * used sparingly for names, headings, and the blood-group numeral) and
 * Inter (body / UI / data). Add this to your index.html <head> once:
 *
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
 *
 * Palette (warm paper + deep crimson, deliberately avoiding the generic
 * cream/terracotta and near-black/neon defaults):
 *   paper   #FDFBF8 / dark #15100F
 *   card    #FFFFFF / dark #1E1716
 *   crimson #B91C3C  (primary)   hover #8F1530
 *   ink     #241A18 / dark #F4EAE5
 *   ink-soft #6E5F5A / dark #B7A6A0
 *   verdant #1F7A4D  (eligible)
 *   amber   #B5862B  (not yet eligible / pending)
 *
 * Signature element: a heartbeat/pulse line — the visual thread tying
 * "availability" and "the donor's own pulse" together. Used once as a
 * divider beneath the profile header, and as the live-status indicator.
 */

const fontDisplay = { fontFamily: "'Fraunces', Georgia, serif" };

const PulseLine = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 400 32"
    preserveAspectRatio="none"
    className={className}
    aria-hidden="true"
  >
    <polyline
      points="0,16 120,16 138,4 152,28 168,16 400,16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 py-2.5">
    <div className="text-[#B91C3C] dark:text-[#E8546F] mt-0.5 shrink-0">
      {icon}
    </div>
    <div className="text-[#241A18] dark:text-[#F4EAE5] text-[15px] leading-relaxed">
      <span className="text-[#6E5F5A] dark:text-[#B7A6A0]">{label}</span>
      <span className="block sm:inline sm:ml-1.5 font-semibold">
        {value || 'Not specified'}
      </span>
    </div>
  </div>
);

const TABS: {
  key: 'profile' | 'received' | 'sent' | 'settings';
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
  { key: 'received', label: 'Received', icon: <Bell className="w-4 h-4" /> },
  { key: 'sent', label: 'Sent', icon: <Send className="w-4 h-4" /> },
  {
    key: 'settings',
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
  },
];

export default function Profile({ onLogout }: { onLogout?: () => void }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<
    'profile' | 'received' | 'sent' | 'settings'
  >('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<any>({});
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);

  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'received' || tab === 'sent' || tab === 'profile') {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || ''}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );
        if (response.ok) {
          const user = await response.json();
          setUserData(user);
          setSelectedDivision(user.division || '');
          setSelectedDistrict(user.district || '');
          setSelectedUpazila(user.upazila || '');
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (activeTab === 'received' || activeTab === 'sent') {
      const fetchDirectRequests = async () => {
        setLoadingRequests(true);
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || ''}/api/direct-requests?type=${activeTab}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            },
          );
          if (response.ok) {
            const data = await response.json();
            if (activeTab === 'received') setReceivedRequests(data);
            else setSentRequests(data);
          } else {
            console.error(
              `Failed to fetch ${activeTab} requests, server status:`,
              response.status,
            );
          }
        } catch (error) {
          console.error(
            `Failed to fetch ${activeTab} requests (network error)`,
          );
        } finally {
          setLoadingRequests(false);
        }
      };
      fetchDirectRequests();
    }
  }, [activeTab]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(import.meta.env.VITE_API_URL || undefined, {
      auth: { token },
    });

    socket.on('new-direct-request', (newReq: any) => {
      // Add to received requests if we are the donor
      if (userData?._id && newReq.donor?._id === userData._id) {
        setReceivedRequests(prev => [newReq, ...prev]);
        toast.success(
          `New blood request received from ${newReq.requester?.name}!`,
        );
      }
    });

    socket.on('direct-request-updated', (updatedReq: any) => {
      // Update in our sent requests if we are the requester
      if (userData?._id && updatedReq.requester?._id === userData._id) {
        setSentRequests(prev =>
          prev.map(req => (req._id === updatedReq._id ? updatedReq : req)),
        );
      }
      // Or in received if we are donor
      if (userData?._id && updatedReq.donor?._id === userData._id) {
        setReceivedRequests(prev =>
          prev.map(req => (req._id === updatedReq._id ? updatedReq : req)),
        );
      }
    });

    socket.on('direct-request-cancelled', (cancelledReqId: string) => {
      setReceivedRequests(prev =>
        prev.filter(req => req._id !== cancelledReqId),
      );
      toast('A direct request to you was cancelled.', { icon: 'ℹ️' });
    });

    return () => {
      socket.disconnect();
    };
  }, [userData?._id]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || ''}/api/direct-requests/${id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (response.ok) {
        toast.success(`Request ${newStatus.toLowerCase()}!`);
        // Refresh received requests
        setReceivedRequests(prev =>
          prev.map(req =>
            req._id === id ? { ...req, status: newStatus } : req,
          ),
        );
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const executeCancelRequest = async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || ''}/api/direct-requests/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      if (response.ok) {
        toast.success('Request cancelled successfully!');
        setSentRequests(prev => prev.filter(req => req._id !== id));
        setCancelConfirmId(null);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to cancel request');
      }
    } catch (error) {
      toast.error('An error occurred while cancelling the request');
    }
  };

  const { divisions, districts, upazilas, loadingDivisions, loadingDistricts } =
    useLocationData(selectedDivision, selectedDistrict);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    data.division = selectedDivision;
    data.district = selectedDistrict;
    data.upazila = selectedUpazila;

    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        window.dispatchEvent(new Event('userUpdated'));
        toast.success('Profile updated successfully!');
        setTimeout(() => {
          setIsEditing(false);
        }, 1000);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
    }
  };

  const toggleAvailability = async () => {
    setIsUpdatingAvailability(true);
    try {
      const newStatus =
        userData.status === 'Available' ? 'Unavailable' : 'Available';
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  const updateDonation = async () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ lastDonation: today }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
      }
    } catch (error) {
      console.error('Error updating donation date:', error);
    }
  };

  const getLocalDateString = (dateStr: string) => {
    if (!dateStr || dateStr === 'Never') return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatLocation = () => {
    const parts = [
      userData.upazila,
      userData.district,
      userData.division,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Not specified';
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Never')
      return dateString || 'Not specified';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  };

  const isEligible = () => {
    if (!userData.lastDonation || userData.lastDonation === 'Never')
      return true;
    const lastDate = new Date(userData.lastDonation);
    if (isNaN(lastDate.getTime())) return true;
    const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 90;
  };
const getEligibilityStatus = () => {
  if (!userData.lastDonation || userData.lastDonation === 'Never') {
    return { eligible: true, daysLeft: 0 };
  }

  const lastDate = new Date(userData.lastDonation);
  if (isNaN(lastDate.getTime())) {
    return { eligible: true, daysLeft: 0 };
  }

  const today = new Date();
  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays >= 90) {
    return { eligible: true, daysLeft: 0 };
  } else {
    return { eligible: false, daysLeft: 90 - diffDays };
  }
};
  // ─────────────────────────────────────────────────────────────────
  // EDIT MODE
  // ─────────────────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-[#FDFBF8] dark:bg-[#15100F] flex items-center justify-center">
        <div className="max-w-3xl w-full px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B91C3C]/10 text-[#B91C3C] dark:text-[#E8546F] text-sm font-semibold border border-[#B91C3C]/20">
              <Edit className="w-4 h-4" />
              Editing profile
            </span>
            <button
              onClick={() => setIsEditing(false)}
              className="text-[#6E5F5A] dark:text-[#B7A6A0] hover:text-[#241A18] dark:hover:text-white transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Close editing"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <h2
            style={fontDisplay}
            className="text-4xl font-semibold text-[#241A18] dark:text-[#F4EAE5] mb-2 tracking-tight"
          >
            Update your details
          </h2>
          <p className="text-[#6E5F5A] dark:text-[#B7A6A0] mb-10">
            Keep this accurate — it's what donors and requesters see about you.
          </p>

          <div className="bg-white dark:bg-[#1E1716] border border-[#EDE3DD] dark:border-white/8 rounded-3xl p-6 sm:p-9 shadow-[0_1px_2px_rgba(36,26,24,0.04)]">
            <form className="space-y-7" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5F5A] dark:text-[#B7A6A0] mb-2">
                    Full name *
                  </label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={userData.name || userData.fullName || ''}
                    className="w-full bg-[#FAF6F3] dark:bg-[#171112] border border-[#EDE3DD] dark:border-white/10 rounded-xl px-4 py-3 text-[#241A18] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/30 focus:border-[#B91C3C] transition-colors"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5F5A] dark:text-[#B7A6A0] mb-2">
                    Student ID *
                  </label>
                  <input
                    name="studentId"
                    type="text"
                    defaultValue={userData.studentId || ''}
                    className="w-full bg-[#FAF6F3] dark:bg-[#171112] border border-[#EDE3DD] dark:border-white/10 rounded-xl px-4 py-3 text-[#241A18] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/30 focus:border-[#B91C3C] transition-colors"
                    placeholder="e.g., 0272320005101116"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5F5A] dark:text-[#B7A6A0] mb-2">
                    Department *
                  </label>
                  <input
                    name="department"
                    type="text"
                    defaultValue={userData.department || ''}
                    className="w-full bg-[#FAF6F3] dark:bg-[#171112] border border-[#EDE3DD] dark:border-white/10 rounded-xl px-4 py-3 text-[#241A18] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/30 focus:border-[#B91C3C] transition-colors"
                    placeholder="e.g., CSE"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5F5A] dark:text-[#B7A6A0] mb-2">
                    Batch *
                  </label>
                  <input
                    name="batch"
                    type="text"
                    defaultValue={userData.batch || ''}
                    className="w-full bg-[#FAF6F3] dark:bg-[#171112] border border-[#EDE3DD] dark:border-white/10 rounded-xl px-4 py-3 text-[#241A18] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/30 focus:border-[#B91C3C] transition-colors"
                    placeholder="e.g., 21"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5F5A] dark:text-[#B7A6A0] mb-2">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={userData.email || ''}
                    className="w-full bg-[#FAF6F3] dark:bg-[#171112] border border-[#EDE3DD] dark:border-white/10 rounded-xl px-4 py-3 text-[#241A18] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/30 focus:border-[#B91C3C] transition-colors"
                    placeholder="you@university.edu"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5F5A] dark:text-[#B7A6A0] mb-2">
                    Phone *
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    defaultValue={userData.phone || ''}
                    className="w-full bg-[#FAF6F3] dark:bg-[#171112] border border-[#EDE3DD] dark:border-white/10 rounded-xl px-4 py-3 text-[#241A18] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/30 focus:border-[#B91C3C] transition-colors"
                    placeholder="01XXXXXXXXX"
                    required
                    
                    pattern="^01[3-9]\d{8}$"
                    title="Please enter a valid 11-digit Bangladeshi phone number starting with 01"
                    onChange={e => {
                      let value = e.target.value;

                      
                      value = value.replace(/[^0-9]/g, '');

                      
                      if (value.length > 11) {
                        value = value.slice(0, 11);
                      }

                      e.target.value = value;
                    }}
                    onBlur={e => {
                      const bdPhoneRegex = /^01[3-9]\d{8}$/;
                      
                      if (
                        e.target.value &&
                        !bdPhoneRegex.test(e.target.value)
                      ) {
                        alert(
                          'Please enter a valid 11-digit Bangladeshi phone number starting with 01',
                        );
                        e.target.value = ''; 
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5F5A] dark:text-[#B7A6A0] mb-2">
                    Blood group *
                  </label>
                  <select
                    name="bloodGroup"
                    value={userData.bloodGroup || ''}
                    onChange={e =>
                      setUserData({ ...userData, bloodGroup: e.target.value })
                    }
                    className="w-full bg-[#FAF6F3] dark:bg-[#171112] border border-[#EDE3DD] dark:border-white/10 rounded-xl px-4 py-3 text-[#241A18] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/30 focus:border-[#B91C3C] transition-colors appearance-none"
                    required
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5F5A] dark:text-[#B7A6A0] mb-2">
                    Date of birth *
                  </label>
                  <input
                    name="dob"
                    type="date"
                    defaultValue={userData.dob || ''}
                    max={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 18),
                      )
                        .toISOString()
                        .split('T')[0]
                    }
                    onChange={e => {
                      const selectedDate = new Date(e.target.value);
                      const today = new Date();

                      let age =
                        today.getFullYear() - selectedDate.getFullYear();
                      const monthDiff =
                        today.getMonth() - selectedDate.getMonth();
                      if (
                        monthDiff < 0 ||
                        (monthDiff === 0 &&
                          today.getDate() < selectedDate.getDate())
                      ) {
                        age--;
                      }

                      if (age < 18) {
                        alert('You must be at least 18 years old to register!');
                        e.target.value = '';
                      }
                    }}
                    className="w-full bg-[#FAF6F3] dark:bg-[#171112] border border-[#EDE3DD] dark:border-white/10 rounded-xl px-4 py-3 text-[#241A18] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/30 focus:border-[#B91C3C] transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5F5A] dark:text-[#B7A6A0] mb-2">
                    Last donation date
                  </label>
                  <input
                    name="lastDonation"
                    type="date"
                    defaultValue={getLocalDateString(userData.lastDonation)}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={e => {
                      const selectedDate = e.target.value;
                      const today = new Date().toISOString().split('T')[0];
                      if (selectedDate > today) {
                        alert('Future date is not allowed!');
                        e.target.value = today;
                      }
                    }}
                    className="w-full bg-[#FAF6F3] dark:bg-[#171112] border border-[#EDE3DD] dark:border-white/10 rounded-xl px-4 py-3 text-[#241A18] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/30 focus:border-[#B91C3C] transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5F5A] dark:text-[#B7A6A0] mb-2">
                    Division *
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDivision}
                      onChange={e => {
                        setSelectedDivision(e.target.value);
                        setSelectedDistrict('');
                        setSelectedUpazila('');
                      }}
                      className="w-full bg-[#FAF6F3] dark:bg-[#171112] border border-[#EDE3DD] dark:border-white/10 rounded-xl px-4 py-3 text-[#241A18] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/30 focus:border-[#B91C3C] transition-colors appearance-none disabled:opacity-50"
                      disabled={loadingDivisions}
                      required
                    >
                      <option value="" disabled>
                        {loadingDivisions ? 'Loading...' : 'Select division'}
                      </option>
                      {divisions.map(div => (
                        <option key={div.division} value={div.division}>
                          {div.division}
                        </option>
                      ))}
                    </select>
                    {loadingDivisions && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#6E5F5A] dark:text-[#B7A6A0]" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5F5A] dark:text-[#B7A6A0] mb-2">
                    District *
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDistrict}
                      onChange={e => {
                        setSelectedDistrict(e.target.value);
                        setSelectedUpazila('');
                      }}
                      className="w-full bg-[#FAF6F3] dark:bg-[#171112] border border-[#EDE3DD] dark:border-white/10 rounded-xl px-4 py-3 text-[#241A18] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/30 focus:border-[#B91C3C] transition-colors appearance-none disabled:opacity-50"
                      disabled={!selectedDivision || loadingDistricts}
                      required
                    >
                      <option value="" disabled>
                        {loadingDistricts ? 'Loading...' : 'Select district'}
                      </option>
                      {districts.map(dist => (
                        <option key={dist.district} value={dist.district}>
                          {dist.district}
                        </option>
                      ))}
                    </select>
                    {loadingDistricts && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#6E5F5A] dark:text-[#B7A6A0]" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5F5A] dark:text-[#B7A6A0] mb-2">
                    Upazila *
                  </label>
                  <select
                    value={selectedUpazila}
                    onChange={e => setSelectedUpazila(e.target.value)}
                    className="w-full bg-[#FAF6F3] dark:bg-[#171112] border border-[#EDE3DD] dark:border-white/10 rounded-xl px-4 py-3 text-[#241A18] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/30 focus:border-[#B91C3C] transition-colors appearance-none disabled:opacity-50"
                    disabled={!selectedDistrict}
                    required
                  >
                    <option value="" disabled>
                      Select upazila
                    </option>
                    {upazilas.map(upz => (
                      <option key={upz} value={upz}>
                        {upz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5F5A] dark:text-[#B7A6A0] mb-2">
                  Full address
                </label>
                <input
                  name="address"
                  type="text"
                  defaultValue={userData.address || ''}
                  className="w-full bg-[#FAF6F3] dark:bg-[#171112] border border-[#EDE3DD] dark:border-white/10 rounded-xl px-4 py-3 text-[#241A18] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/30 focus:border-[#B91C3C] transition-colors"
                  placeholder="House, road, area..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5F5A] dark:text-[#B7A6A0] mb-2">
                  Medical conditions (if any)
                </label>
                <textarea
                  name="medicalConditions"
                  defaultValue={userData.medicalConditions || ''}
                  className="w-full bg-[#FAF6F3] dark:bg-[#171112] border border-[#EDE3DD] dark:border-white/10 rounded-xl px-4 py-3 text-[#241A18] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#B91C3C]/30 focus:border-[#B91C3C] transition-colors min-h-[100px]"
                  placeholder="Mention any medical conditions, allergies, or medications you're currently taking..."
                ></textarea>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-transparent border border-[#EDE3DD] dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-[#241A18] dark:text-white px-4 py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#B91C3C] hover:bg-[#8F1530] text-white px-4 py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#B91C3C]/20"
                >
                  <Save className="w-5 h-5" />
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // VIEW MODE
  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#FDFBF8] dark:bg-[#15100F] flex flex-col items-center">
      <div className="max-w-4xl w-full px-4 sm:px-6 flex flex-col items-center">
        {/* Segmented tab bar */}
        <div className="flex flex-wrap justify-center gap-1 mb-10 w-full max-w-2xl bg-white dark:bg-[#1E1716] p-1.5 rounded-2xl border border-[#EDE3DD] dark:border-white/8 shadow-[0_1px_2px_rgba(36,26,24,0.04)]">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                activeTab === tab.key
                  ? 'bg-[#B91C3C] text-white shadow-md shadow-[#B91C3C]/25'
                  : 'text-[#6E5F5A] dark:text-[#B7A6A0] hover:bg-[#FAF6F3] dark:hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'settings' && (
          <div className="w-full max-w-2xl">
            <h2
              style={fontDisplay}
              className="text-2xl font-semibold text-[#241A18] dark:text-[#F4EAE5] mb-6 tracking-tight"
            >
              App settings
            </h2>
            <div className="bg-white dark:bg-[#1E1716] border border-[#EDE3DD] dark:border-white/8 rounded-3xl p-6 sm:p-8 space-y-8">
              <div>
                <h3 className="text-xs font-bold text-[#241A18] dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#B91C3C] dark:text-[#E8546F]" />
                  Notifications &amp; push
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-[#FAF6F3] dark:bg-white/5 rounded-xl border border-[#EDE3DD] dark:border-white/10">
                    <div>
                      <p className="font-semibold text-[#241A18] dark:text-white text-sm">
                        Browser permission
                      </p>
                      <p className="text-xs text-[#6E5F5A] dark:text-[#B7A6A0] mt-0.5">
                        Status: {Notification.permission}
                      </p>
                    </div>
                    {Notification.permission !== 'granted' ? (
                      <button
                        onClick={async () => {
                          const permission =
                            await Notification.requestPermission();
                          if (permission === 'granted') {
                            toast.success('Permission granted!');
                            window.location.reload();
                          }
                        }}
                        className="text-xs font-bold text-[#B91C3C] dark:text-[#E8546F] hover:opacity-80 px-3 py-1.5 bg-[#B91C3C]/10 rounded-lg transition-opacity border border-[#B91C3C]/20"
                      >
                        Grant access
                      </button>
                    ) : (
                      <CheckCircle className="w-5 h-5 text-[#1F7A4D]" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#FAF6F3] dark:bg-white/5 rounded-xl border border-[#EDE3DD] dark:border-white/10">
                    <div>
                      <p className="font-semibold text-[#241A18] dark:text-white text-sm">
                        Push subscription
                      </p>
                      <p className="text-xs text-[#6E5F5A] dark:text-[#B7A6A0] mt-0.5">
                        Tokens: {userData?.pushSubscriptions?.length || 0}{' '}
                        registered
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        const { subscribeToPush } =
                          await import('../utils/push');
                        const token = localStorage.getItem('token');
                        if (token) {
                          toast.promise(subscribeToPush(token), {
                            loading: 'Registering push...',
                            success: 'Push registered successfully!',
                            error: 'Failed to register push.',
                          });
                        }
                      }}
                      className="text-xs font-bold text-[#241A18] dark:text-[#F4EAE5] hover:bg-[#EDE3DD] dark:hover:bg-white/10 px-3 py-1.5 bg-white dark:bg-white/5 rounded-lg transition-colors border border-[#EDE3DD] dark:border-white/10"
                    >
                      Update token
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            `${import.meta.env.VITE_API_URL || ''}/api/notifications/test-push`,
                            {
                              method: 'POST',
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                              },
                            },
                          );
                          if (response.ok) {
                            const data = await response.json();
                            toast.success(data.message);
                          } else {
                            toast.error('Failed to send test push');
                          }
                        } catch (err) {
                          toast.error('Network error');
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-[#B91C3C] hover:bg-[#8F1530] text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-[#B91C3C]/20 transition-all active:scale-[0.98]"
                    >
                      <AlertCircle className="w-5 h-5" />
                      Send test notification
                    </button>
                    <p className="text-[11px] text-[#6E5F5A] dark:text-[#B7A6A0] mt-2 text-center">
                      Triggers a real-time socket event and a push notification
                      to your device.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#EDE3DD] dark:border-white/10">
                <h3 className="text-xs font-bold text-[#241A18] dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#B91C3C] dark:text-[#E8546F]" />
                  Account
                </h3>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 bg-[#FAF6F3] dark:bg-white/5 hover:bg-[#B91C3C]/10 text-[#B91C3C] dark:text-[#E8546F] font-semibold py-3 px-4 rounded-xl transition-all border border-transparent hover:border-[#B91C3C]/20"
                >
                  <LogOut className="w-5 h-5" />
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="w-full">
            {/* Profile Info Card */}
            <div className="relative bg-white dark:bg-[#1E1716] border border-[#EDE3DD] dark:border-white/8 rounded-3xl p-6 sm:p-10 w-full shadow-[0_1px_2px_rgba(36,26,24,0.04)] overflow-hidden">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-2">
                <div className="bg-[#B91C3C] text-white shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-[#B91C3C]/25">
                  <span
                    style={fontDisplay}
                    className="text-2xl font-bold leading-none"
                  >
                    {userData.bloodGroup || '—'}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest opacity-80 mt-1">
                    group
                  </span>
                </div>
                <div>
                  <h1
                    style={fontDisplay}
                    className="text-2xl sm:text-3xl font-semibold text-[#241A18] dark:text-[#F4EAE5] tracking-tight"
                  >
                    {userData.name || userData.fullName || 'User Name'}
                  </h1>
                  <p className="text-sm text-[#6E5F5A] dark:text-[#B7A6A0] mt-1">
                    {userData.department || 'Department'}
                    {userData.batch ? ` · Batch ${userData.batch}` : ''}
                  </p>
                </div>
              </div>

              {/* Signature pulse divider */}
              <PulseLine className="w-full h-6 my-5 text-[#B91C3C]/25 dark:text-[#E8546F]/25" />

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${userData.status === 'Available' ? 'bg-[#1F7A4D]/10 border-[#1F7A4D]/20 text-[#1F7A4D]' : 'bg-[#6E5F5A]/10 border-[#6E5F5A]/20 text-[#6E5F5A] dark:text-[#B7A6A0]'}`}
                >
                  <span className="relative flex w-2 h-2">
                    {userData.status === 'Available' && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1F7A4D] opacity-60"></span>
                    )}
                    <span
                      className={`relative inline-flex rounded-full w-2 h-2 ${userData.status === 'Available' ? 'bg-[#1F7A4D]' : 'bg-[#6E5F5A]'}`}
                    ></span>
                  </span>
                  <span className="text-sm font-semibold">
                    {userData.status === 'Available'
                      ? 'Available to donate'
                      : 'Not available'}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isEligible() ? 'bg-[#1F7A4D]/10 border-[#1F7A4D]/20 text-[#1F7A4D]' : 'bg-[#B5862B]/10 border-[#B5862B]/20 text-[#B5862B]'}`}
                >
                  {/* <span className="text-sm font-semibold">
                    {isEligible() ? 'Eligible to donate' : 'Not eligible yet'}
                  </span> */}
                  {(() => {
                    const { eligible, daysLeft } = getEligibilityStatus();
                    return (
                      <div className="flex flex-col">
                        <span className="text font-semibold">
                          {eligible
                            ? 'Eligible to donate'
                            : `Not eligible yet.  (${daysLeft} days remaining)`}
                        </span>
                        {/* {!eligible && (
                          <span className="text-xs text-red-500 mt-0.5">
                            ({daysLeft} days remaining)
                          </span>
                        )} */}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 divide-y sm:divide-y-0 divide-[#F1EBE6] dark:divide-white/5">
                <DetailItem
                  icon={<IdCard className="w-5 h-5" />}
                  label="Student ID"
                  value={userData.studentId}
                />
                <DetailItem
                  icon={<BookOpen className="w-5 h-5" />}
                  label="Department"
                  value={userData.department}
                />
                <DetailItem
                  icon={<Users className="w-5 h-5" />}
                  label="Batch"
                  value={userData.batch}
                />
                <DetailItem
                  icon={<Map className="w-5 h-5" />}
                  label="Address"
                  value={userData.address}
                />
                <DetailItem
                  icon={<MapPin className="w-5 h-5" />}
                  label="Location"
                  value={formatLocation()}
                />
                <DetailItem
                  icon={<Mail className="w-5 h-5" />}
                  label="Email"
                  value={userData.email}
                />
                <DetailItem
                  icon={<Phone className="w-5 h-5" />}
                  label="Phone"
                  value={userData.phone}
                />
                <DetailItem
                  icon={<Clock className="w-5 h-5" />}
                  label="Last donation"
                  value={
                    userData.lastDonation && userData.lastDonation !== 'Never'
                      ? formatDate(userData.lastDonation)
                      : 'Never'
                  }
                />
                <DetailItem
                  icon={<Calendar className="w-5 h-5" />}
                  label="Date of birth"
                  value={formatDate(userData.dob)}
                />
              </div>

              <div className="mt-3 pt-5 border-t border-[#F1EBE6] dark:border-white/5">
                <DetailItem
                  icon={<AlertCircle className="w-5 h-5" />}
                  label="Medical conditions"
                  value={userData.medicalConditions || 'None reported'}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8 w-full">
              <button
                onClick={() => setIsEditing(true)}
                className="border border-[#B91C3C]/40 text-[#241A18] dark:text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#B91C3C]/10 transition-colors font-semibold text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit profile
              </button>

              <button
                onClick={updateDonation}
                className="bg-[#B91C3C] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#8F1530] transition-colors font-semibold text-sm shadow-md shadow-[#B91C3C]/20"
              >
                <RefreshCw className="w-4 h-4" />
                Log today's donation
              </button>

              <button
                onClick={toggleAvailability}
                disabled={isUpdatingAvailability}
                className="border border-[#EDE3DD] dark:border-white/10 text-[#B91C3C] dark:text-[#E8546F] px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-semibold text-sm disabled:opacity-50"
              >
                {isUpdatingAvailability ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Droplet className="w-4 h-4" />
                )}
                {userData.status === 'Available'
                  ? 'Set unavailable'
                  : 'Set available'}
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="border border-[#EDE3DD] dark:border-white/10 text-[#B91C3C] dark:text-[#E8546F] px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-semibold text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              )}
            </div>
          </div>
        )}

        {(activeTab === 'received' || activeTab === 'sent') && (
          <div className="w-full space-y-5">
            {loadingRequests ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#B91C3C]" />
              </div>
            ) : activeTab === 'received' ? (
              receivedRequests.length === 0 ? (
                <div className="bg-white dark:bg-[#1E1716] border border-[#EDE3DD] dark:border-white/8 rounded-3xl p-14 text-center">
                  <Bell className="w-8 h-8 text-[#B91C3C]/40 mx-auto mb-3" />
                  <p
                    style={fontDisplay}
                    className="text-lg font-semibold text-[#241A18] dark:text-[#F4EAE5]"
                  >
                    No requests yet
                  </p>
                  <p className="text-sm text-[#6E5F5A] dark:text-[#B7A6A0] mt-1">
                    When someone reaches out for your blood group, it'll show up
                    here.
                  </p>
                </div>
              ) : (
                receivedRequests.map((req, idx) => (
                  <div
                    key={req._id || idx}
                    className="bg-white dark:bg-[#1E1716] border border-[#EDE3DD] dark:border-white/8 rounded-3xl p-6 sm:p-8 relative"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3
                          style={fontDisplay}
                          className="text-xl font-semibold text-[#241A18] dark:text-[#F4EAE5]"
                        >
                          Request from {req.requester?.name}
                        </h3>
                        <div className="text-sm text-[#6E5F5A] dark:text-[#B7A6A0] mt-1">
                          Date: {new Date(req.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          req.status === 'Pending'
                            ? 'bg-[#B5862B]/10 text-[#B5862B] border-[#B5862B]/20'
                            : req.status === 'Accepted'
                              ? 'bg-[#1F7A4D]/10 text-[#1F7A4D] border-[#1F7A4D]/20'
                              : 'bg-[#6E5F5A]/10 text-[#6E5F5A] border-[#6E5F5A]/20'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <DetailItem
                        icon={<Phone className="w-4 h-4" />}
                        label="Requester phone"
                        value={
                          req.requester?.phone ? (
                            <span>{req.requester.phone}</span>
                          ) : (
                            'N/A'
                          )
                        }
                      />
                      <DetailItem
                        icon={<AlertCircle className="w-4 h-4" />}
                        label="Contact info / hospital"
                        value={req.contactInfo}
                      />
                    </div>

                    {req.message && (
                      <div className="mt-4 p-4 bg-[#FAF6F3] dark:bg-white/5 rounded-xl border border-[#EDE3DD] dark:border-white/10 text-sm text-[#241A18] dark:text-[#F4EAE5]">
                        <strong>Message:</strong> {req.message}
                      </div>
                    )}

                    {req.status === 'Pending' ? (
                      <div className="flex gap-3 mt-8 pt-6 border-t border-[#F1EBE6] dark:border-white/5">
                        {(() => {
                          const eligible = checkEligibilityLocal(userData);
                          return (
                            <button
                              onClick={() =>
                                handleUpdateStatus(req._id, 'Accepted')
                              }
                              disabled={!eligible}
                              title={
                                !eligible
                                  ? 'You are not eligible to accept requests'
                                  : ''
                              }
                              className={`flex-1 font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 ${eligible ? 'bg-[#1F7A4D] hover:bg-[#175E3B] text-white' : 'bg-[#6E5F5A]/20 text-[#6E5F5A] cursor-not-allowed hidden'}`}
                            >
                              <CheckCircle className="w-5 h-5" /> Accept
                            </button>
                          );
                        })()}
                        <button
                          onClick={() =>
                            handleUpdateStatus(req._id, 'Declined')
                          }
                          className="flex-1 bg-[#FAF6F3] dark:bg-white/10 hover:bg-[#EDE3DD] dark:hover:bg-white/20 text-[#241A18] dark:text-white font-semibold text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-5 h-5" /> Decline
                        </button>
                      </div>
                    ) : req.status === 'Accepted' && req.requester?.phone ? (
                      <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-[#F1EBE6] dark:border-white/5">
                        <a
                          href={`tel:${req.requester.phone}`}
                          className="w-full flex items-center justify-center gap-2 bg-[#FAF6F3] hover:bg-[#EDE3DD] dark:bg-white/5 dark:hover:bg-white/10 text-[#241A18] dark:text-white py-2.5 rounded-xl font-semibold transition-colors text-sm"
                        >
                          <Phone className="w-4 h-4" />
                          Call requester
                        </a>
                        <a
                          href={`https://wa.me/${req.requester.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] dark:bg-[#25D366]/20 dark:hover:bg-[#25D366]/30 py-2.5 rounded-xl font-semibold transition-colors text-sm"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                          </svg>
                          WhatsApp
                        </a>
                      </div>
                    ) : null}
                  </div>
                ))
              )
            ) : sentRequests.length === 0 ? (
              <div className="bg-white dark:bg-[#1E1716] border border-[#EDE3DD] dark:border-white/8 rounded-3xl p-14 text-center">
                <Send className="w-8 h-8 text-[#B91C3C]/40 mx-auto mb-3" />
                <p
                  style={fontDisplay}
                  className="text-lg font-semibold text-[#241A18] dark:text-[#F4EAE5]"
                >
                  Nothing sent yet
                </p>
                <p className="text-sm text-[#6E5F5A] dark:text-[#B7A6A0] mt-1">
                  Requests you send to donors will be tracked here.
                </p>
              </div>
            ) : (
              sentRequests.map((req, idx) => (
                <div
                  key={req._id || idx}
                  className="bg-white dark:bg-[#1E1716] border border-[#EDE3DD] dark:border-white/8 rounded-3xl p-6 sm:p-8"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3
                        style={fontDisplay}
                        className="text-xl font-semibold text-[#241A18] dark:text-[#F4EAE5]"
                      >
                        Sent to {req.donor?.name}
                      </h3>
                      <div className="text-sm text-[#6E5F5A] dark:text-[#B7A6A0] mt-1">
                        Date: {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        req.status === 'Pending'
                          ? 'bg-[#B5862B]/10 text-[#B5862B] border-[#B5862B]/20'
                          : req.status === 'Accepted'
                            ? 'bg-[#1F7A4D]/10 text-[#1F7A4D] border-[#1F7A4D]/20'
                            : 'bg-[#6E5F5A]/10 text-[#6E5F5A] border-[#6E5F5A]/20'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <DetailItem
                      icon={<Phone className="w-4 h-4" />}
                      label="Donor phone"
                      value={
                        req.status === 'Accepted' && req.donor?.phone ? (
                          <span>{req.donor.phone}</span>
                        ) : req.status === 'Accepted' ? (
                          'N/A'
                        ) : (
                          'Hidden until accepted'
                        )
                      }
                    />
                    <DetailItem
                      icon={<AlertCircle className="w-4 h-4" />}
                      label="Contact info provided"
                      value={req.contactInfo}
                    />
                  </div>
                  {req.message && (
                    <div className="mt-4 p-4 bg-[#FAF6F3] dark:bg-white/5 rounded-xl border border-[#EDE3DD] dark:border-white/10 text-sm text-[#241A18] dark:text-[#F4EAE5]">
                      <strong>Your message:</strong> {req.message}
                    </div>
                  )}
                  {req.status === 'Pending' ? (
                    <div className="mt-6 pt-6 border-t border-[#F1EBE6] dark:border-white/5 flex justify-end">
                      {cancelConfirmId === req._id ? (
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-[#241A18] dark:text-[#F4EAE5]">
                            Are you sure?
                          </span>
                          <button
                            onClick={() => executeCancelRequest(req._id)}
                            className="bg-[#B91C3C] hover:bg-[#8F1530] text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            Yes, cancel
                          </button>
                          <button
                            onClick={() => setCancelConfirmId(null)}
                            className="bg-[#FAF6F3] dark:bg-white/10 hover:bg-[#EDE3DD] dark:hover:bg-white/20 text-[#241A18] dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCancelConfirmId(req._id)}
                          className="border border-[#B91C3C]/50 text-[#B91C3C] dark:text-[#E8546F] hover:bg-[#B91C3C] hover:text-white font-semibold py-2 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <X className="w-4 h-4" /> Cancel request
                        </button>
                      )}
                    </div>
                  ) : req.status === 'Accepted' && req.donor?.phone ? (
                    <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-[#F1EBE6] dark:border-white/5">
                      <a
                        href={`tel:${req.donor.phone}`}
                        className="w-full flex items-center justify-center gap-2 bg-[#FAF6F3] hover:bg-[#EDE3DD] dark:bg-white/5 dark:hover:bg-white/10 text-[#241A18] dark:text-white py-2.5 rounded-xl font-semibold transition-colors text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        Call donor
                      </a>
                      <a
                        href={`https://wa.me/${req.donor.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] dark:bg-[#25D366]/20 dark:hover:bg-[#25D366]/30 py-2.5 rounded-xl font-semibold transition-colors text-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

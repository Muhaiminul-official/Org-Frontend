import React, { useState } from 'react';
import { Loader2, ArrowRight, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLocationData } from '../hooks/useLocationData';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { subscribeToPush } from '../utils/push';

const BLOOD_GROUPS = [
  { label: 'A+', value: 'A+' },
  { label: 'A−', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B−', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB−', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O−', value: 'O-' },
];

const inputClass =
  'w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500/60 focus:bg-red-500/[0.04] focus:ring-2 focus:ring-red-500/10 transition-all duration-200 [color-scheme:dark]';

const selectClass =
  'w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/60 focus:bg-red-500/[0.04] focus:ring-2 focus:ring-red-500/10 transition-all duration-200 appearance-none disabled:opacity-40 disabled:cursor-not-allowed [&>option]:bg-[#1a1a1a]';

const labelClass =
  'block text-[10px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-2';

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5 mt-8 first:mt-0">
      <span className="text-[15px] font-bold  uppercase text-red-500/70 whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-white/[0.05]" />
    </div>
  );
}

export default function Register({ onLogin }: { onLogin: () => void }) {
  const [isLoading, setIsLoading] = useState(false); // Added Loading State
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [selectedBlood, setSelectedBlood] = useState('');
  const navigate = useNavigate();

  const { divisions, districts, upazilas, loadingDivisions, loadingDistricts } =
    useLocationData(selectedDivision, selectedDistrict);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Logged in with Google!');
        if (Notification.permission === 'granted')
          await subscribeToPush(data.token);
        onLogin();
        navigate('/profile');
      } else {
        let msg = 'Google login failed';
        try {
          const e = await response.json();
          if (e?.message) msg = e.message;
        } catch {}
        toast.error(msg);
      }
    } catch {
      toast.error('An error occurred during Google login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          password: data.password,
          studentId: data.studentId,
          department: data.department,
          batch: data.batch,
          dob: data.dob,
          bloodGroup: selectedBlood,
          phone: data.phone,
          division: selectedDivision,
          district: selectedDistrict,
          upazila: selectedUpazila,
          address: data.address,
          medicalConditions: data.medicalConditions,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.token && responseData.user) {
          localStorage.setItem('token', responseData.token);
          localStorage.setItem('user', JSON.stringify(responseData.user));
          if (Notification.permission === 'granted')
            await subscribeToPush(responseData.token);
          onLogin();
          toast.success('Registration successful! You are now logged in.');
          navigate('/profile');
        } else {
          toast.success('Registration successful! Please login.');
          navigate('/login');
        }
      } else {
        let msg = 'Registration failed';
        try {
          const e = await response.json();
          if (e?.message) msg = `Registration failed: ${e.message}`;
        } catch {}
        toast.error(msg);
      }
    } catch {
      toast.error('An error occurred during registration.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-28 pb-20 px-4 relative overflow-hidden">
      <div className="pointer-events-none fixed top-0 right-0 w-[600px] h-[600px] rounded-full bg-red-600/10 blur-[120px] -translate-y-1/3 translate-x-1/3" />
      <div className="pointer-events-none fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-red-700/[0.06] blur-[100px] translate-y-1/3 -translate-x-1/3" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-red-500">
            Blood Donor Registration
          </span>
        </div>

        
        {/* <p className="text-white/40 text-center text-base font-light mb-10 max-w-sm">
          Join our network of donors and make a difference when it matters most.
        </p> */}

        <div className="mb-8">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google login failed')}
          />
        </div>

        <div className="flex items-center gap-4 w-full max-w-3xl mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-[11px] tracking-[0.12em] uppercase text-white/20 font-medium whitespace-nowrap">
            Or register with email
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="w-full max-w-3xl relative">
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

          <div className="bg-white/[0.025] border border-white/[0.06] rounded-2xl p-8 sm:p-10 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-6 right-8 text-[88px] font-black text-red-500/[0.04] leading-none select-none pointer-events-none hidden sm:block">
              01
            </div>

            <form onSubmit={handleSubmit}>
              <SectionHeading>Personal Information</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    name="fullName"
                    required
                    type="text"
                    disabled={isLoading}
                    className={inputClass}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Student ID *</label>
                  <input
                    name="studentId"
                    required
                    type="text"
                    disabled={isLoading}
                    className={inputClass}
                    placeholder="e.g., 0272320005101116"
                  />
                </div>
                <div>
                  <label className={labelClass}>Department *</label>
                  <input
                    name="department"
                    required
                    type="text"
                    disabled={isLoading}
                    className={inputClass}
                    placeholder="e.g., CSE"
                  />
                </div>
                <div>
                  <label className={labelClass}>Batch *</label>
                  <input
                    name="batch"
                    required
                    type="text"
                    disabled={isLoading}
                    className={inputClass}
                    placeholder="e.g., 21"
                  />
                </div>
              </div>

              <SectionHeading>Account Details</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    name="email"
                    required
                    type="email"
                    disabled={isLoading}
                    className={inputClass}
                    placeholder="you@university.edu"
                  />
                </div>
                <div>
                  <label className={labelClass}>Password *</label>
                  <input
                    name="password"
                    required
                    type="password"
                    disabled={isLoading}
                    className={inputClass}
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone *</label>
                  <input
                    name="phone"
                    required
                    type="tel"
                    disabled={isLoading}
                    className={inputClass}
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input
                    name="dob"
                    required
                    type="date"
                    disabled={isLoading}
                    className={inputClass}
                  />
                </div>
              </div>

              <SectionHeading>Blood Group *</SectionHeading>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                {BLOOD_GROUPS.map(({ label, value }) => (
                  <label
                    key={value}
                    className={`flex items-center justify-center py-3 rounded-xl border text-sm font-bold cursor-pointer transition-all duration-150 select-none
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                      ${
                        selectedBlood === value
                          ? 'border-red-500 bg-red-500/10 text-red-500 ring-1 ring-red-500/30'
                          : 'border-white/[0.08] bg-white/[0.03] text-white/40 hover:border-red-500/30 hover:text-white/70 hover:bg-white/[0.05]'
                      }`}
                  >
                    <input
                      type="radio"
                      name="bloodGroup"
                      value={value}
                      className="sr-only"
                      disabled={isLoading}
                      checked={selectedBlood === value}
                      onChange={() => setSelectedBlood(value)}
                      required={selectedBlood === ''}
                    />
                    {label}
                  </label>
                ))}
              </div>

              <SectionHeading>Location</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>Division *</label>
                  <div className="relative">
                    <select
                      value={selectedDivision}
                      onChange={e => {
                        setSelectedDivision(e.target.value);
                        setSelectedDistrict('');
                        setSelectedUpazila('');
                      }}
                      className={selectClass}
                      disabled={loadingDivisions || isLoading}
                    >
                      <option value="" disabled>
                        {loadingDivisions ? 'Loading...' : 'Select Division'}
                      </option>
                      {divisions.map(div => (
                        <option key={div.division} value={div.division}>
                          {div.division}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>District *</label>
                  <div className="relative">
                    <select
                      value={selectedDistrict}
                      onChange={e => {
                        setSelectedDistrict(e.target.value);
                        setSelectedUpazila('');
                      }}
                      className={selectClass}
                      disabled={
                        !selectedDivision || loadingDistricts || isLoading
                      }
                    >
                      <option value="" disabled>
                        {loadingDistricts ? 'Loading...' : 'Select District'}
                      </option>
                      {districts.map(dist => (
                        <option key={dist.district} value={dist.district}>
                          {dist.district}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Upazila *</label>
                  <div className="relative">
                    <select
                      value={selectedUpazila}
                      onChange={e => setSelectedUpazila(e.target.value)}
                      className={selectClass}
                      disabled={!selectedDistrict || isLoading}
                    >
                      <option value="" disabled>
                        Select Upazila
                      </option>
                      {upazilas.map(upz => (
                        <option key={upz} value={upz}>
                          {upz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <SectionHeading>Additional Info</SectionHeading>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Full Address</label>
                  <input
                    name="address"
                    type="text"
                    disabled={isLoading}
                    className={inputClass}
                    placeholder="House, Road, Area..."
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Medical Conditions (if any)
                  </label>
                  <textarea
                    name="medicalConditions"
                    disabled={isLoading}
                    className={`${inputClass} min-h-[110px] resize-y leading-relaxed`}
                    placeholder="Mention any medical conditions..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`mt-8 w-full flex items-center justify-center gap-2.5 bg-red-600 text-white font-bold text-[15px] tracking-wide px-6 py-4 rounded-xl transition-all duration-200 relative overflow-hidden group 
                ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700 active:scale-[0.99] hover:shadow-[0_8px_32px_rgba(220,38,38,0.35)]'}`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    Register as Donor
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-white/30 text-sm mt-8">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-red-500 hover:text-red-400 font-semibold transition-colors"
          >
            Sign in →
          </button>
        </p>
      </div>
    </div>
  );
}

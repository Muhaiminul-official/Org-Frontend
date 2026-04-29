import React from 'react';
import {
  Droplet,
  MapPin,
  Phone,
  ArrowUpRight,
  GraduationCap,
} from 'lucide-react';
import { Donor } from '../types';

interface DonorCardProps {
  donor: Donor;
  onClick: () => void;
}

const DonorCard: React.FC<DonorCardProps> = ({ donor, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-xl p-4 cursor-pointer hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Top Section: Identity & Blood Group */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-red-500 border border-gray-100 dark:border-white/10 group-hover:border-red-500/30 transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-red-500 transition-colors">
              {donor.name}
            </h3>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1 flex items-center gap-1">
              ID: {donor.studentId}
            </p>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 px-4 py-2 rounded-2xl flex flex-col items-center justify-center min-w-[64px] border border-red-100 dark:border-red-500/20 shadow-sm">
          
          <span className="text-lg font-black leading-none">
            {donor.bloodGroup}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-3 mb-8 px-1">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-400">
          <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="truncate">
            {donor.upazila}, {donor.district}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-400">
          <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400">
            <Phone className="w-4 h-4" />
          </div>
          <span>{donor.phone}</span>
        </div>
      </div>

      {/* Footer: Status & Call Action */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-50 dark:border-white/5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
          <div
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${donor.status === 'Available' ? 'bg-emerald-500' : 'bg-gray-400'}`}
          />
          <span
            className={`text-[11px] font-bold uppercase tracking-wider ${donor.status === 'Available' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'}`}
          >
            {donor.status}
          </span>
        </div>

        <button
          onClick={e => {
            e.stopPropagation();
            window.location.href = `tel:${donor.phone}`;
          }}
          className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 dark:hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
        >
          Call
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Subtle background icon for flare */}
      <Droplet className="absolute bottom-4 right-4 w-24 h-24 text-gray-100 dark:text-white/[0.02] -z-10 pointer-events-none rotate-12" />
    </div>
  );
};

export default DonorCard;

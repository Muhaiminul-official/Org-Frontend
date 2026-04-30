import React from 'react';
import { User, Droplet, Mail, Phone, Shield, Crown } from 'lucide-react';

/* 🔹 Avatar Component (FIXED) */
function Avatar({ member }: { member: any }) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="relative mb-6">
      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-red-500/20 shadow-md group-hover:scale-105 transition">
        {!imgError && member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a]">
            <User className="w-10 h-10 text-red-500/60" />
          </div>
        )}
      </div>

      {/* ROLE ICON */}
      <div className="absolute bottom-0 right-[30%] translate-x-1/2 w-8 h-8 bg-white dark:bg-[#111111] rounded-full flex items-center justify-center border border-gray-200 dark:border-white/10 shadow">
        <member.icon className="w-4 h-4 text-red-500" />
      </div>
    </div>
  );
}

/* 🔹 Main Component */
export default function Team() {
  const team = [
    {
      name: 'Muhaiminul Islam',
      role: 'Admin & Founder',
      bloodGroup: 'O+',
      id: '0272320005101116',
      email: 'admin@bloodlink.com',
      phone: '01245775244',
      icon: Crown,
      image: '/Muhaiminul.png', 
    },
    {
      name: 'Rashedur Rahman',
      role: 'Moderator',
      bloodGroup: 'A+',
      id: '0272320005101035',
      email: 'rashedur@bloodlink.edu',
      phone: '01245775142',
      icon: Shield,
      image: '/Rashedur.png',
    },
    {
      name: 'Sarowar Hossain',
      role: 'Moderator',
      bloodGroup: 'B+',
      id: '0272320005101135',
      email: 'sarowar@bloodlink.com',
      phone: '01243571252',
      icon: Shield,
      image: '/Sarowar.png',
    },
    {
      name: 'Nizam Uddin',
      role: 'Moderator',
      bloodGroup: 'AB+',
      id: '0272320005101139',
      email: 'nizam@bloodlink.com',
      phone: '01245676841',
      icon: Shield,
      image: '/Nizam.jpg',
    },
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0a0a0a] dark:to-[#050505]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our <span className="text-red-500">Team</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Meet the people behind BloodLink who make this platform possible.
          </p>
        </div>

        {/* TEAM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-red-500/30 to-transparent hover:from-red-500/60 transition-all duration-500"
            >
              <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-3xl p-8 text-center h-full border border-gray-200 dark:border-white/5 group-hover:shadow-2xl group-hover:shadow-red-500/10 transition-all duration-500">
                {/* AVATAR */}
                <Avatar member={member} />

                {/* NAME */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>

                {/* ROLE */}
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-500 border border-red-500/20 mb-4">
                  {member.role}
                </span>

                {/* BLOOD GROUP */}
                <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-6">
                  <Droplet className="w-3 h-3 text-red-500" />
                  {member.bloodGroup}
                </div>

                {/* CONTACT */}
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-center gap-2 hover:text-red-500 transition">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{member.email}</span>
                  </div>

                  <div className="flex items-center justify-center gap-2 hover:text-red-500 transition">
                    <Phone className="w-4 h-4" />
                    {member.phone}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

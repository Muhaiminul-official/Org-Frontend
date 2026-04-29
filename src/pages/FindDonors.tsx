import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Droplet, Loader2 } from 'lucide-react';
import { Donor } from '../types';
import DonorCard from '../components/DonorCard';
import DonorModal from '../components/DonorModal';
import { useLocationData } from '../hooks/useLocationData';

export default function FindDonors() {
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  const [bloodGroup, setBloodGroup] = useState('All Groups');
  const [division, setDivision] = useState('All Divisions');
  const [district, setDistrict] = useState('All Districts');
  const [upazila, setUpazila] = useState('All Upazilas');

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users`,
        );
        if (response.ok) {
          const data = await response.json();
          let currentUserId = null;
          try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
              const userObj = JSON.parse(userStr);
              currentUserId = userObj._id || userObj.id;
            }
          } catch (e) {
            // Ignore parsing errors
          }
          const filteredData = data.filter(
            (u: any) => u.role !== 'admin' && u._id !== currentUserId,
          );
          setDonors(
            filteredData.map((u: any) => ({
              _id: u._id,
              name: u.name,
              email: u.email,
              studentId: u.studentId,
              department: u.department,
              batch: u.batch,
              dob: u.dob,
              bloodGroup: u.bloodGroup,
              division: u.division || 'Unknown',
              district: u.district || 'Unknown',
              upazila: u.upazila || 'Unknown',
              address: u.address,
              phone: u.phone || 'N/A',
              lastDonation: u.lastDonation || 'Never',
              medicalConditions: u.medicalConditions,
              status: u.status || 'Available',
              role: u.role,
              createdAt: u.createdAt,
            })),
          );
        }
      } catch (error) {
        console.error('Error fetching donors (network error)');
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  const {
    divisions: apiDivisions,
    districts: apiDistricts,
    upazilas: apiUpazilas,
    loadingDivisions,
    loadingDistricts,
  } = useLocationData(division, district);

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDivision(e.target.value);
    setDistrict('All Districts');
    setUpazila('All Upazilas');
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrict(e.target.value);
    setUpazila('All Upazilas');
  };

  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      const matchBloodGroup =
        bloodGroup === 'All Groups' || donor.bloodGroup === bloodGroup;
      const matchDivision =
        division === 'All Divisions' || donor.division === division;
      const matchDistrict =
        district === 'All Districts' || donor.district === district;
      const matchUpazila =
        upazila === 'All Upazilas' || donor.upazila === upazila;
      return matchBloodGroup && matchDivision && matchDistrict && matchUpazila;
    });
  }, [donors, bloodGroup, division, district, upazila]);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0a0a0a] dark:to-[#050505]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium mb-6 backdrop-blur">
            <Search className="w-4 h-4" />
            Find Blood Donors
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Search for <span className="text-red-500">Donors</span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Easily find verified blood donors based on group and location.
          </p>
        </div>

        {/* BLOOD GROUP FILTER */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {bloodGroups.map(bg => (
            <button
              key={bg}
              onClick={() =>
                setBloodGroup(bloodGroup === bg ? 'All Groups' : bg)
              }
              className={`group flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 shadow-sm ${
                bloodGroup === bg
                  ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20 scale-105'
                  : 'bg-white/70 dark:bg-[#111111]/70 backdrop-blur border-gray-300 dark:border-white/10 hover:border-red-500/40 hover:bg-red-500/5 hover:scale-105'
              }`}
            >
              <Droplet
                className={`w-4 h-4 transition-colors ${
                  bloodGroup === bg
                    ? 'text-white'
                    : 'text-red-500 group-hover:text-red-400'
                }`}
              />
              {bg}
            </button>
          ))}
        </div>

        {/* FILTER CARD */}
        <div className="bg-white/70 dark:bg-[#111111]/70 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-6 md:p-10 mb-12 shadow-xl">
          <div className="flex items-center gap-2 mb-8">
            <Filter className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Advanced Filters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
            {/* Blood */}
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value)}
                className="w-full bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition"
              >
                <option value="All Groups">All Groups</option>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* Division */}
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                Division
              </label>
              <div className="relative">
                <select
                  value={division}
                  onChange={handleDivisionChange}
                  disabled={loadingDivisions}
                  className="w-full bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition disabled:opacity-50"
                >
                  <option value="All Divisions">
                    {loadingDivisions ? 'Loading...' : 'All Divisions'}
                  </option>
                  {apiDivisions.map(div => (
                    <option key={div.division} value={div.division}>
                      {div.division}
                    </option>
                  ))}
                </select>

                {loadingDivisions && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                )}
              </div>
            </div>

            {/* District */}
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                District
              </label>
              <div className="relative">
                <select
                  value={district}
                  onChange={handleDistrictChange}
                  disabled={division === 'All Divisions' || loadingDistricts}
                  className="w-full bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition disabled:opacity-50"
                >
                  <option value="All Districts">
                    {loadingDistricts ? 'Loading...' : 'All Districts'}
                  </option>
                  {apiDistricts.map(dist => (
                    <option key={dist.district} value={dist.district}>
                      {dist.district}
                    </option>
                  ))}
                </select>

                {loadingDistricts && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                )}
              </div>
            </div>

            {/* Upazila */}
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                Upazila
              </label>
              <select
                value={upazila}
                onChange={e => setUpazila(e.target.value)}
                disabled={district === 'All Districts'}
                className="w-full bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition disabled:opacity-50"
              >
                <option value="All Upazilas">All Upazilas</option>
                {apiUpazilas.map(upz => (
                  <option key={upz} value={upz}>
                    {upz}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear */}
            <button
              onClick={() => {
                setBloodGroup('All Groups');
                setDivision('All Divisions');
                setDistrict('All Districts');
                setUpazila('All Upazilas');
              }}
              className="w-full h-[48px] rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition shadow-lg shadow-red-500/20"
            >
              Clear
            </button>
          </div>
        </div>

        {/* RESULT COUNT */}
        <div className="mb-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Found{' '}
            <span className="text-red-500 font-bold">
              {filteredDonors.length}
            </span>{' '}
            donor{filteredDonors.length !== 1 && 's'}
          </p>
        </div>

        {/* DONOR GRID */}
        {filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDonors.map(donor => (
              <DonorCard
                key={donor._id}
                donor={donor}
                onClick={() => setSelectedDonor(donor)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/70 dark:bg-[#111111]/70 backdrop-blur rounded-3xl border border-gray-200 dark:border-white/5 shadow-lg">
            <Droplet className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No donors found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Try adjusting filters to discover more donors.
            </p>
            <button
              onClick={() => {
                setBloodGroup('All Groups');
                setDivision('All Divisions');
                setDistrict('All Districts');
                setUpazila('All Upazilas');
              }}
              className="px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition shadow-md"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedDonor && (
        <DonorModal
          donor={selectedDonor}
          onClose={() => setSelectedDonor(null)}
        />
      )}
    </div>
  );
}

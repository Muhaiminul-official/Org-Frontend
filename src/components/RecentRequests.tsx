import {
  AlertCircle,
  Droplet,
  MapPin,
  Calendar,
  Phone,
  Users,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function RecentRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {


        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/requests`,
        );
        if (response.ok) {
          const data = await response.json();
          const recentPending = data
            .filter((req: any) => req.status === 'Active')
            .slice(0, 3);
          setRequests(recentPending);
        }
      } catch (error) {
        console.error('Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return null;
  if (requests.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Recent Blood Requests
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests.map((req, index) => (
            <div
              key={index}
              className="relative p-6 rounded-3xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
            >
              {/* Priority */}
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    req.priority === 'High'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {req.priority}
                </span>

                <span className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  <Droplet className="w-3 h-3" />
                  {req.bloodGroup}
                </span>
              </div>

              {/* Patient */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {req.patientName}
              </h3>

              {/* Message */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-4 line-clamp-3">
                {req.message || 'No additional message provided.'}
              </p>

              {/* Location */}
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <MapPin className="w-4 h-4 mt-0.5 text-red-400" />
                <span>
                  {req.hospitalName} <br />
                  {req.upazila}, {req.district}, {req.division}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Calendar className="w-4 h-4 text-red-400" />
                <span>
                  Needed: {new Date(req.requiredDate).toLocaleDateString()}
                </span>
              </div>

              {/* Created At */}
              <p className="text-xs text-gray-400 mb-4">
                Posted: {new Date(req.createdAt).toLocaleDateString()}
              </p>

              {/* Donor Responses */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <Users className="w-4 h-4 text-red-400" />
                <span>{req.donorResponses?.length || 0} donors responded</span>
              </div>

              {/* CTA */}
              <a
                href={`tel:${req.contactNumber}`}
                className="mt-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
              >
                <Phone className="w-4 h-4" />
                Contact Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

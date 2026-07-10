import { Droplet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CTA() {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fixed: Updated background from hardcoded dark to support both light and dark modes */}
        <div className="bg-gradient-to-b from-white to-gray-50 dark:from-[#161616] dark:to-[#111111] border border-gray-200 dark:border-[#B91C3C]/20 rounded-2xl p-10 md:p-16 text-center relative overflow-hidden shadow-xl dark:shadow-none">
          {/* Glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B91C3C]/5 dark:bg-[#B91C3C]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto bg-[#B91C3C]/10 rounded-xl flex items-center justify-center mb-6">
              <Droplet className="w-8 h-8 text-[#B91C3C]" />
            </div>

            {/* Fixed: Changed text-gray-300 to text-gray-900 for proper light mode visibility */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Register today and become part of our growing community of
              life-savers.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/register')}
                className="bg-[#B91C3C] hover:bg-[#ac1b38] text-white px-8 py-3.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-[#B91C3C]/20"
              >
                <Droplet className="w-5 h-5" />
                Register Now
              </button>
              <button
                onClick={() => navigate('/find-donors')}
                className="bg-white hover:bg-gray-100 dark:bg-[#1a1a1a] dark:hover:bg-[#222] border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white px-8 py-3.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                Browse Donors
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

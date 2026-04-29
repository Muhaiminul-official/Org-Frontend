import { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Nusrat Jahan',
      role: 'Pharmacy Student, Recipient',
      blood: 'AB+',
      text: 'When my brother needed AB+ blood urgently, we found 3 donors nearby through BloodLink. Forever grateful to this community!',
      image: 'https://i.pravatar.cc/100?img=5',
    },
    {
      name: 'Rahim Ahmed',
      role: 'Engineer, Donor',
      blood: 'O+',
      text: 'I’ve donated blood 5 times using BloodLink. It’s amazing how fast you can connect with people in need.',
      image: 'https://i.pravatar.cc/100?img=12',
    },
    {
      name: 'Sadia Karim',
      role: 'Teacher, Recipient',
      blood: 'A-',
      text: 'The platform helped us during an emergency at midnight. Found a donor within 20 minutes!',
      image: 'https://i.pravatar.cc/100?img=9',
    },
  ];

  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const next = () => {
    setIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const t = testimonials[index];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-[#111] dark:to-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            What People Say
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Real stories from our donor & recipient community.
          </p>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-[#161616]/70 backdrop-blur-xl shadow-xl p-6 sm:p-10 overflow-hidden">
          {/* Glow Effects */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-500/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 transition-all duration-500 ease-in-out">
            {/* Quote Icon */}
            <Quote className="w-10 h-10 text-red-500/20 mb-5" />

            {/* Text */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-white font-medium leading-relaxed mb-8">
              "{t.text}"
            </p>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              {/* Profile */}
              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500/20"
                />
                <div>
                  <h4 className="text-gray-900 dark:text-white font-semibold">
                    {t.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t.role}
                  </p>
                </div>
                <span className="ml-2 px-2 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded">
                  {t.blood}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 justify-between sm:justify-end">
                {/* Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#222] hover:bg-gray-300 dark:hover:bg-[#333] flex items-center justify-center transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Indicators */}
                  <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === index
                            ? 'w-6 bg-red-500'
                            : 'w-1.5 bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={next}
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#222] hover:bg-gray-300 dark:hover:bg-[#333] flex items-center justify-center transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Heart, Shield, Clock, Zap, Globe, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const reasons = [
  {
    icon: Heart,
    title: 'Save Lives',
    description:
      "A single donation can save up to 3 lives. Be someone's hero today.",
  },
  {
    icon: Shield,
    title: 'Health Benefits',
    description:
      'Regular donation helps maintain iron balance and supports heart health.',
  },
  {
    icon: Clock,
    title: 'Quick & Easy',
    description: 'The entire process takes only 30–45 minutes of your time.',
  },
  {
    icon: Zap,
    title: 'Instant Match',
    description:
      'Instantly connect with nearby donors matching your blood type.',
  },
  {
    icon: Globe,
    title: 'Campus Network',
    description:
      'Access donors across universities in Bangladesh through one platform.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'Join a growing community of student donors making a real impact.',
  },
];

export default function WhyDonate() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-red-50 dark:from-[#0b0b0b] dark:to-[#140909]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Why Donate Blood?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Every drop counts. Your small act can create a life-saving impact.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl border backdrop-blur-lg transition-all duration-300 group hover:-translate-y-2 hover:shadow-xl
                  ${
                    reason.highlight
                      ? 'bg-[#B91C3C] text-white border-[#B91C3C]'
                      : 'bg-white/70 dark:bg-white/5 border-gray-200 dark:border-white/10'
                  }`}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-[#B91C3C]/10 to-pink-500/10 blur-xl"></div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-2xl mb-6 transition-transform group-hover:scale-110
                  ${
                    reason.highlight
                      ? 'bg-white/20'
                      : 'bg-red-100 dark:bg-[#B91C3C]/10'
                  }`}
                >
                  <Icon
                    className={`w-7 h-7 ${
                      reason.highlight ? 'text-white' : 'text-[#B91C3C]'
                    }`}
                  />
                </div>

                {/* Content */}
                <h3
                  className={`text-xl font-bold mb-3 ${
                    reason.highlight
                      ? 'text-white'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {reason.title}
                </h3>

                <p
                  className={`text-sm leading-relaxed ${
                    reason.highlight
                      ? 'text-white/90'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

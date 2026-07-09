import { Clock, Droplet, Heart, AlertTriangle, Utensils } from 'lucide-react';
import { useState } from 'react';

export default function DonationGuide() {
  const [activeTab, setActiveTab] = useState('before');

  const tabs = [
    { id: 'before', label: 'Before Donation', icon: Clock },
    { id: 'during', label: 'During Donation', icon: Droplet },
    { id: 'after', label: 'After Donation', icon: Heart },
    { id: 'eligibility', label: 'Eligibility', icon: AlertTriangle },
    { id: 'foods', label: 'Best Foods', icon: Utensils },
  ];

  const renderList = items => (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-center gap-4 text-gray-700 dark:text-gray-300"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B91C3C]/20 text-[#B91C3C] text-xs font-bold">
            {i + 1}
          </span>
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <section className="py-20 bg-white dark:bg-[#111111]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Donation Guide
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Everything you need to know before, during, and after donating.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-200 dark:border-white/5 hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#B91C3C] border-b-2 border-[#B91C3C] bg-[#B91C3C]/5'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'before' && (
              <div>
                <h3 className="text-xl font-bold mb-6">Before Donation</h3>
                {renderList([
                  "Get a good night's sleep",
                  'Eat a healthy meal',
                  'Drink plenty of water',
                  'Avoid fatty foods',
                ])}
              </div>
            )}

            {activeTab === 'during' && (
              <div>
                <h3 className="text-xl font-bold mb-6">During Donation</h3>
                {renderList([
                  'Stay relaxed and calm',
                  'Follow staff instructions',
                  'Keep your arm still',
                  'Inform staff if you feel dizzy',
                ])}
              </div>
            )}

            {activeTab === 'after' && (
              <div>
                <h3 className="text-xl font-bold mb-6">After Donation</h3>
                {renderList([
                  'Rest for at least 10–15 minutes',
                  'Drink plenty of fluids',
                  'Avoid heavy exercise for 24 hours',
                  'Eat iron-rich foods',
                ])}
              </div>
            )}

            {activeTab === 'eligibility' && (
              <div>
                <h3 className="text-xl font-bold mb-6">Eligibility</h3>
                {renderList([
                  'Age between 18–60 years',
                  'Minimum weight 50kg',
                  'No recent illness or infection',
                  'Hemoglobin level within normal range',
                ])}
              </div>
            )}

            {activeTab === 'foods' && (
              <div>
                <h3 className="text-xl font-bold mb-6">Best Foods</h3>
                {renderList([
                  'Spinach and leafy greens',
                  'Red meat and liver',
                  'Eggs and dairy products',
                  'Dates, bananas, and apples',
                ])}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

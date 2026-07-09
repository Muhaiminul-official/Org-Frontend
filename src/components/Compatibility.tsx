import { Droplet, Check, X } from 'lucide-react';

export default function Compatibility() {
  const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const compatibilityMatrix = [
    [true, true, true, true, true, true, true, true],
    [false, true, false, true, false, true, false, true],
    [false, false, true, true, false, false, true, true],
    [false, false, false, true, false, false, false, true],
    [false, false, false, false, true, true, true, true],
    [false, false, false, false, false, true, false, true],
    [false, false, false, false, false, false, true, true],
    [false, false, false, false, false, false, false, true],
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-[#0a0a0a] dark:to-black border-t border-gray-200 dark:border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Blood Type Compatibility
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Quickly understand which blood types are safe for donation and save
            lives.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
          {/* Title Bar */}
          <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B91C3C]/20 to-[#B91C3C]/10 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-[#B91C3C]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Compatibility Chart
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Donor → Recipient
              </p>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-50/90 dark:bg-[#161616]/90 backdrop-blur border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Donor ↓ / Recipient →
                  </th>
                  {bloodTypes.map(type => (
                    <th
                      key={type}
                      className="px-4 py-4 text-center text-sm font-bold text-gray-900 dark:text-white"
                    >
                      {type}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {bloodTypes.map((donorType, rowIndex) => (
                  <tr
                    key={donorType}
                    className="border-b border-gray-200 dark:border-white/5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition"
                  >
                    <td className="px-6 py-4 font-bold text-[#B91C3C]">
                      {donorType}
                    </td>

                    {bloodTypes.map((_, colIndex) => {
                      const isCompatible =
                        compatibilityMatrix[rowIndex][colIndex];

                      return (
                        <td key={colIndex} className="px-4 py-4 text-center">
                          <div
                            className={`w-7 h-7 flex items-center justify-center rounded-full transition
                            ${
                              isCompatible
                                ? 'bg-[#B91C3C]/20 text-[#B91C3C] shadow-sm'
                                : 'bg-gray-200/60 dark:bg-white/5 text-gray-500'
                            }
                          `}
                          >
                            {isCompatible ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View (Card Layout) */}
          <div className="md:hidden p-4 space-y-4">
            {bloodTypes.map((donorType, rowIndex) => (
              <div
                key={donorType}
                className="border border-gray-200 dark:border-white/10 rounded-xl p-4 bg-white dark:bg-[#0f0f0f] shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-[#B91C3C] text-lg">
                    {donorType}
                  </span>
                  <span className="text-xs text-gray-500">Donates to</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {bloodTypes.map((type, colIndex) => {
                    const isCompatible =
                      compatibilityMatrix[rowIndex][colIndex];

                    return (
                      <div
                        key={colIndex}
                        className={`flex items-center justify-center text-xs py-2 rounded-lg font-medium transition
                          ${
                            isCompatible
                              ? 'bg-[#B91C3C]/15 text-[#B91C3C]'
                              : 'bg-gray-100 dark:bg-white/5 text-gray-400'
                          }
                        `}
                      >
                        {type}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

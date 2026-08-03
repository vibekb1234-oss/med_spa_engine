
import React from 'react';

const Brands: React.FC = () => {
  const brands = [
    { name: "Messenger", logo: "BRANDS WE WORK WITH/685bf79d200bebc83172e7e2_messenger.webp" },
    { name: "iMessage", logo: "BRANDS WE WORK WITH/685bf79d2cecfca83be94287_imessage.webp" },
    { name: "Replit", logo: "BRANDS WE WORK WITH/685bf79d2dc29ed5b8bcee92_replit.webp" },
    { name: "GitHub", logo: "BRANDS WE WORK WITH/685bf79d62123cc342bcbc7a_github.webp" },
    { name: "OneNote", logo: "BRANDS WE WORK WITH/685bf79d98a50e661d7a9c72_onenote.webp" },
    { name: "Notion", logo: "BRANDS WE WORK WITH/685bf79dadaf5b9ec3e4d993_notion.webp" },
    { name: "Gmail", logo: "BRANDS WE WORK WITH/685bf79db4af2305e30a1c47_gmail.webp" },
    { name: "Obsidian", logo: "BRANDS WE WORK WITH/685bf79dbd085cf0d09838f2_obsidian.webp" },
    { name: "Perplexity", logo: "BRANDS WE WORK WITH/685bf79dd99dd275c84910b5_perplexity.webp" },
    { name: "Figma", logo: "BRANDS WE WORK WITH/685bf79dea7b28162fd04606_figma.webp" },
    { name: "Outlook", logo: "BRANDS WE WORK WITH/685bf79ded2f57a63288e023_outlook.webp" },
    { name: "Google", logo: "BRANDS WE WORK WITH/6863d1d93e34a35502947250_google.webp" },
    { name: "Tinder", logo: "BRANDS WE WORK WITH/6863d1da7723389966d8b94d_tinder.webp" },
    { name: "Adobe", logo: "BRANDS WE WORK WITH/6863d1da9f61f0468a378da9_adobe-acrobat-reader.webp" },
    { name: "TikTok", logo: "BRANDS WE WORK WITH/6863d1daeeaa9e39bb7af1de_tiktok.webp" },
    { name: "Quora", logo: "BRANDS WE WORK WITH/6863d1daf5defba59688f04d_quora.webp" }
  ];

  // Duplicate brands for seamless loop
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="py-24 relative overflow-hidden bg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <p className="text-center text-gray-500 text-xs font-semibold uppercase tracking-[0.2em] mb-12">
          Trusted by Industry Leaders
        </p>

        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none" />

          <div className="flex animate-scroll hover:[animation-play-state:paused] cursor-default">
            {duplicatedBrands.map((brand, i) => (
              <div
                key={i}
                className="flex-shrink-0 mx-8 md:mx-12 group"
              >
                <div className="relative">
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-10 md:h-12 w-auto object-contain relative z-10 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Brands;

import React from 'react';

const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: "Michael Chen",
      role: "Founder, Scale Digital",
      text: "We went from zero LinkedIn presence to 17 qualified discovery calls in the first 45 days. Closed 4 new clients worth $78k in recurring revenue. This completely changed how we think about client acquisition.",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80"
    },
    {
      name: "Jennifer Martinez",
      role: "CEO, Growth Labs Agency",
      text: "I was skeptical because I'd tried LinkedIn before with zero results. Within 3 weeks we had our calendar filled with ideal-fit prospects. We've since brought on 6 new retainer clients and had to expand our team.",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80"
    },
    {
      name: "David Thompson",
      role: "Managing Partner, Apex Consulting",
      text: "Finally, a predictable lead source that doesn't require me to do anything. We're booking 8-12 calls per month with decision-makers who actually have budget. Best ROI we've ever seen from any marketing channel.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80"
    }
  ];

  return (
    <section className="py-32 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-20 text-center">
          Real Results from <span className="text-gradient-blue">Real Agencies</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="glass-panel p-8 md:p-10 rounded-3xl relative group hover:-translate-y-2 transition-transform duration-500">
              {/* Quote Icon */}
              <div className="absolute top-6 right-8 text-white/5 group-hover:text-blue-500/20 transition-colors duration-500">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V9C10.017 6.23858 12.2556 4 15.017 4H19.017C21.7784 4 24.017 6.23858 24.017 9V15C24.017 18.3137 21.3307 21 18.017 21H14.017ZM4.017 21L4.017 18C4.017 16.8954 4.91243 16 6.017 16H9.017C9.56928 16 10.017 15.5523 10.017 15V9C10.017 8.44772 9.56928 8 9.017 8H5.017C4.46472 8 4.017 8.44772 4.017 9V12C4.017 12.5523 3.56928 13 3.017 13H1.017C0.464722 13 0.017 12.5523 0.017 12V9C0.017 6.23858 2.25558 4 5.017 4H9.017C11.7784 4 14.017 6.23858 14.017 9V15C14.017 18.3137 11.3307 21 8.017 21H4.017Z" />
                </svg>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20" />
                  <img src={r.img} className="w-14 h-14 rounded-full border border-white/10 relative z-10" alt={r.name} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{r.name}</h4>
                  <p className="text-blue-400 text-sm font-medium">{r.role}</p>
                </div>
              </div>

              <p className="text-gray-300 italic leading-relaxed relative z-10">
                "{r.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

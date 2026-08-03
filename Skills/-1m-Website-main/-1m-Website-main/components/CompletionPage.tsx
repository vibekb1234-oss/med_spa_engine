
import React, { useEffect } from 'react';

const CompletionPage: React.FC = () => {
  useEffect(() => {
    // Load Cal.com script
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // Initialize Cal.com
      if (window.Cal) {
        window.Cal('init', 'teddy-15', { origin: 'https://app.cal.com' });

        window.Cal.ns['teddy-15']('inline', {
          elementOrSelector: '#my-cal-inline-teddy-15',
          config: { layout: 'month_view' },
          calLink: 'jackroberts/teddy-15',
        });

        window.Cal.ns['teddy-15']('ui', {
          hideEventTypeDetails: false,
          layout: 'month_view'
        });
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center pt-20 pb-40 px-6">
      {/* Background Glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        <div className="inline-block p-4 rounded-full bg-green-500/10 mb-8 border border-green-500/20 animate-[fadeInUp_0.5s_ease-out_forwards]">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
          Roadmap Sent!
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-12 font-light">
          Check your inbox. In the meantime...
        </p>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Book Your Free Strategy Call
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-0">
            Let's dive deeper into your results and build a custom action plan.
          </p>
        </div>
      </div>

      {/* Cal.com Calendar Embed */}
      <div className="w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl relative z-10 overflow-hidden">
        <div
          style={{ width: '100%', height: '100%', minHeight: '600px', overflow: 'scroll' }}
          id="my-cal-inline-teddy-15"
        />
      </div>
    </section>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    Cal: any;
  }
}

export default CompletionPage;

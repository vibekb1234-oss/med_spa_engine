import React from 'react';

const ValueProps: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient Line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent hidden md:block" />

      <div className="max-w-7xl mx-auto px-6 space-y-32 py-32 relative z-10">

        {/* Section 1: Research & Strategy */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
            <div className="glass-panel p-8 rounded-3xl border border-white/10 relative z-10 transform hover:scale-[1.02] transition-transform duration-500">
              {/* Visual Representation of Strategy/Research */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-gray-400 text-sm">Competitor Analysis</span>
                  <span className="text-green-400 text-sm">Completed</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-white/10 rounded-full w-3/4" />
                  <div className="h-2 bg-white/10 rounded-full w-1/2" />
                  <div className="h-2 bg-white/10 rounded-full w-5/6" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                    <div className="text-2xl font-bold text-white mb-1">20+</div>
                    <div className="text-xs text-blue-200">Competitors Analyzed</div>
                  </div>
                  <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                    <div className="text-2xl font-bold text-white mb-1">100%</div>
                    <div className="text-xs text-purple-200">Unique Strategy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium uppercase tracking-wider">
              01. Deep Research
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              We Don't Guess.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">We Architect.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              We go beyond surface-level insights. We analyze your market, dissect the top 20 competitors in your niche, and identify exactly who isn't getting served. Then, we build a bespoke strategy tailored to your voice and your goals. No templates, just data-backed precision.
            </p>
          </div>
        </div>

        {/* Section 2: Daily Content */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium uppercase tracking-wider">
              02. Consistent Execution
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Daily Content That<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Actually Converts.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              We post for you every single day. Highly optimized content designed not just for likes, but to turn viewers into buyers. We handle 100% of the engagement—responding to comments and nurturing relationships—so your profile grows while you sleep.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full" />
            <div className="glass-panel p-8 rounded-3xl border border-white/10 relative z-10 transform hover:scale-[1.02] transition-transform duration-500">
              {/* Visual Representation of Daily Content */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex-shrink-0" />
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-white/20 rounded w-1/3" />
                  <div className="h-16 bg-white/5 rounded border border-white/5 p-3">
                    <div className="h-2 bg-white/10 rounded w-full mb-2" />
                    <div className="h-2 bg-white/10 rounded w-2/3" />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <div className="w-4 h-4 bg-blue-500/20 rounded-full" />
                      <span>1,240 Likes</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <div className="w-4 h-4 bg-green-500/20 rounded-full" />
                      <span>48 Comments</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-white text-sm font-medium">New Lead Captured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Funnel Optimization */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full" />
            <div className="glass-panel p-8 rounded-3xl border border-white/10 relative z-10 transform hover:scale-[1.02] transition-transform duration-500">
              {/* Visual Representation of Revenue/Funnel */}
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Monthly Revenue</p>
                    <h3 className="text-4xl font-bold text-white">$42,500</h3>
                  </div>
                  <div className="text-green-400 flex items-center gap-1 text-sm font-medium bg-green-500/10 px-2 py-1 rounded-lg">
                    +128%
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>

                {/* Simple Chart Visualization */}
                <div className="flex items-end gap-2 h-32 pt-4 border-b border-white/5">
                  <div className="w-full bg-white/5 rounded-t hover:bg-green-500/40 transition-colors h-[30%]" />
                  <div className="w-full bg-white/5 rounded-t hover:bg-green-500/40 transition-colors h-[45%]" />
                  <div className="w-full bg-white/5 rounded-t hover:bg-green-500/40 transition-colors h-[40%]" />
                  <div className="w-full bg-white/5 rounded-t hover:bg-green-500/40 transition-colors h-[65%]" />
                  <div className="w-full bg-white/5 rounded-t hover:bg-green-500/40 transition-colors h-[55%]" />
                  <div className="w-full bg-green-500 rounded-t shadow-[0_0_20px_rgba(34,197,94,0.3)] h-[90%]" />
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium uppercase tracking-wider">
              03. Revenue Focus
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              From Engagement<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">To Income.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Vanity metrics don't pay the bills. We optimize your entire funnel to ensure attention turns into retention, and retention turns into revenue. We track every lead, nurture every prospect, and operationalize your LinkedIn presence so it becomes a reliable income stream.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ValueProps;

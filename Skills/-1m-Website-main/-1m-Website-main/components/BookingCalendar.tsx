import React, { useEffect } from 'react';

const BookingCalendar: React.FC = () => {
    useEffect(() => {
        (function (C: any, A: string, L: string) {
            let p = function (a: any, ar: any) { a.q.push(ar); };
            let d = C.document;
            C.Cal = C.Cal || function () {
                let cal = C.Cal;
                let ar = arguments;
                if (!cal.loaded) {
                    cal.ns = {};
                    cal.q = cal.q || [];
                    let script = d.createElement("script");
                    script.src = A;
                    d.head.appendChild(script);
                    cal.loaded = true;
                }
                if (ar[0] === L) {
                    const api = function () { p(api, arguments); };
                    const namespace = ar[1];
                    api.q = api.q || [];
                    if (typeof namespace === "string") {
                        cal.ns[namespace] = cal.ns[namespace] || api;
                        p(cal.ns[namespace], ar);
                        p(cal, ["initNamespace", namespace]);
                    } else p(cal, ar);
                    return;
                }
                p(cal, ar);
            };
        })(window, "https://app.cal.com/embed/embed.js", "init");

        (window as any).Cal("init", "teddy-15", { origin: "https://app.cal.com" });

        (window as any).Cal.ns["teddy-15"]("inline", {
            elementOrSelector: "#my-cal-inline-teddy-15",
            config: { "layout": "month_view" },
            calLink: "jackroberts/teddy-15",
        });

        (window as any).Cal.ns["teddy-15"]("ui", { "hideEventTypeDetails": false, "layout": "month_view" });
    }, []);

    return (
        <section id="booking-section" className="py-20 px-6 relative bg-black border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Revenue Audit</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Let's identify the gaps in your current LinkedIn strategy.
                    </p>
                </div>

                <div className="bg-white/5 rounded-3xl p-4 border border-white/10 backdrop-blur-sm overflow-hidden min-h-[700px]">
                    <div style={{ width: "100%", height: "100%", overflow: "scroll" }} id="my-cal-inline-teddy-15"></div>
                </div>
            </div>
        </section>
    );
};

export default BookingCalendar;

import React, { useState } from 'react';
import MultiStepForm from './MultiStepForm';
import CompletionPage from './CompletionPage';

const ContactForm: React.FC = () => {
  const [showCompletion, setShowCompletion] = useState(false);

  const handleFormComplete = () => {
    setShowCompletion(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showCompletion) {
    return <CompletionPage />;
  }

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-blue-900/5 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            See Your Future <span className="text-gradient-blue">Revenue</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Answer 5 simple questions to unlock your personalized LinkedIn Scaling Roadmap. It takes less than 30 seconds.
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <MultiStepForm onComplete={handleFormComplete} />
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

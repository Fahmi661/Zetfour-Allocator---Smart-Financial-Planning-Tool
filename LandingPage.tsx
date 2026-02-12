import React from 'react';
import { ArrowRight, ChevronRight, TrendingUp, Shield, Zap } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-fade-in">
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary-600 text-xs font-medium tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
          </span>
          Professional Edition
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
          Financial Clarity for <br className="hidden md:block" />
          <span className="text-primary-600">Professionals.</span>
        </h1>
        
        <p className="text-xl text-gray-500 max-w-lg mx-auto leading-relaxed">
          Real-time, data-driven financial planning for emergency funds, asset growth, and working capital.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
        {[
          { icon: Shield, title: "OJK Safety", desc: "Precise emergency fund calculation." },
          { icon: TrendingUp, title: "Asset Growth", desc: "Gold & Cash portfolio tracking." },
          { icon: Zap, title: "Capital Flow", desc: "Freelance liquidity logic." }
        ].map((item, idx) => (
          <div key={idx} className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-left">
            <item.icon className="w-6 h-6 text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      <button 
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white transition-all duration-200 bg-primary-600 rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 shadow-lg shadow-primary-600/30"
      >
        Start Planning
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
        Offline Capable • Private by Design
      </p>
    </div>
  );
};
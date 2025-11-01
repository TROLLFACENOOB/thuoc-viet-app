import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white p-5 shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Icon với animation pulse nhẹ */}
          <div className="relative">
            <div className="absolute inset-0 bg-white rounded-full opacity-20 blur-xl animate-pulse"></div>
            <div className="relative w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Thuốc Việt
            </h1>
            <p className="text-sm opacity-90 font-medium">
              Sức khỏe trong tầm tay
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative wave ở bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 opacity-50"></div>
    </div>
  );
}
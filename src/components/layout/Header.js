import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white p-4 shadow-lg sticky top-0 z-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-8 h-8" />
          Thuốc Việt
        </h1>
        <p className="text-sm opacity-90 mt-1">Sức khỏe trong tầm tay</p>
      </div>
    </div>
  );
}
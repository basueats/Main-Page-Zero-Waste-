import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showCompanyName?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showCompanyName = true }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {!imageError ? (
        <img
          src="/assets/aistudio/image_3f45c719.png"
          alt="Supritamone ACADEMY ZERO WASTE"
          className={`object-contain ${
            size === 'sm' ? 'h-7' : size === 'lg' ? 'h-11' : 'h-9'
          }`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5 font-bold tracking-tight text-neutral-900 text-lg leading-tight">
            <span>Supritamone</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          </div>
          <div className="text-[10px] tracking-wider font-semibold text-teal-600 uppercase flex items-center space-x-1">
            <span>ACADEMY</span>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-400">ZERO WASTE</span>
          </div>
        </div>
      )}
      {showCompanyName && (
        <span className="hidden sm:inline-block border-l border-neutral-300 pl-3 text-xs font-semibold text-neutral-800 tracking-tight">
          Zero waste by Supritamone
        </span>
      )}
    </div>
  );
};

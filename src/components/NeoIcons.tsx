import React from 'react';

interface IconProps {
  className?: string;
}

// Gemini Generated Image Asset Components (Optimized for 0ms Eager Loading)
export const GeminiIconLogo: React.FC<IconProps> = ({ className = 'w-9 h-9' }) => (
  <img
    src="/icons/prm-logo.jpg"
    alt="Logo PRM"
    loading="eager"
    decoding="async"
    className={`${className} object-cover rounded-xl border-2 border-[#1D1C1C] shadow-[2px_2px_0px_#1D1C1C]`}
  />
);

export const GeminiIconPhone: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/icons/phone.jpg"
    alt="OTP Phone"
    loading="eager"
    decoding="async"
    className={`${className} object-cover rounded-lg border-2 border-[#1D1C1C] shadow-[1.5px_1.5px_0px_#1D1C1C]`}
  />
);

export const GeminiIconSearch: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/icons/search.jpg"
    alt="Search"
    loading="eager"
    decoding="async"
    className={`${className} object-cover rounded-lg border-2 border-[#1D1C1C] shadow-[1.5px_1.5px_0px_#1D1C1C]`}
  />
);

export const GeminiIconApproval: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/icons/approval.jpg"
    alt="Approval"
    loading="eager"
    decoding="async"
    className={`${className} object-cover rounded-lg border-2 border-[#1D1C1C] shadow-[1.5px_1.5px_0px_#1D1C1C]`}
  />
);

export const GeminiIconExcel: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <img
    src="/icons/excel.jpg"
    alt="Excel Export"
    loading="eager"
    decoding="async"
    className={`${className} object-cover rounded-lg border-2 border-[#1D1C1C] shadow-[1.5px_1.5px_0px_#1D1C1C]`}
  />
);

// Custom Neo-Brutalist Vector Icons
export const IconPhone: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.21.49 2.53.76 3.88.76a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.27 1.11l-2.37 2.37z"
      fill="#83F582"
      stroke="#1D1C1C"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconShieldCheck: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      fill="#7AF7F7"
      stroke="#1D1C1C"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9 12l2 2 4-4" stroke="#1D1C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconUserCheck: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
      stroke="#1D1C1C"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8.5" cy="7" r="4" fill="#FFF48D" stroke="#1D1C1C" strokeWidth="2.5" />
    <path d="M17 11l2 2 4-4" stroke="#1D1C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconLogOut: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconKey: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 2l-2 2m-2-2l2 2m2 4l-4 4m0 0l-1.5-1.5M17 8l-1.5-1.5M14 11l-9.5 9.5a2.121 2.121 0 01-3-3L11 8"
      stroke="#1D1C1C"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16.5" cy="7.5" r="3.5" fill="#FFF48D" stroke="#1D1C1C" strokeWidth="2.5" />
  </svg>
);

export const IconSearch: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="7" fill="#7AF7F7" stroke="#1D1C1C" strokeWidth="2.5" />
    <path d="M21 21l-4.35-4.35" stroke="#1D1C1C" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const IconCheck: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="#83F582" stroke="#1D1C1C" strokeWidth="2.5" />
    <path d="M8 12l3 3 5-5" stroke="#1D1C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconClock: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="#FFF48D" stroke="#1D1C1C" strokeWidth="2.5" />
    <path d="M12 7v5l3 2" stroke="#1D1C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconX: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="#D64545" stroke="#1D1C1C" strokeWidth="2.5" />
    <path d="M15 9l-6 6M9 9l6 6" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const IconExcel: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="3" width="16" height="18" rx="2" fill="#83F582" stroke="#1D1C1C" strokeWidth="2.5" />
    <path d="M8 9l8 6M16 9l-8 6" stroke="#1D1C1C" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const IconBook: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V2H6.5A2.5 2.5 0 004 4.5v15z"
      fill="#FFF48D"
      stroke="#1D1C1C"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconSparkles: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4L12 2z"
      fill="#FFF48D"
      stroke="#1D1C1C"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconAlert: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
      fill="#D64545"
      stroke="#1D1C1C"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path d="M12 9v4M12 17h.01" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const IconInfo: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="#7AF7F7" stroke="#1D1C1C" strokeWidth="2.5" />
    <path d="M12 8h.01M12 12v4" stroke="#1D1C1C" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const IconFilter: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
      fill="#FFF48D"
      stroke="#1D1C1C"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconSend: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
      fill="#83F582"
      stroke="#1D1C1C"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

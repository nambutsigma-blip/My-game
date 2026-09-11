import React from 'react';
import { PetCompanion } from '../types';

interface EvolvedPetSpriteProps {
  pet: PetCompanion;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
  isEvolved?: boolean; // If undefined, defaults to pet.enchantmentLevel >= 5
  isSproutingWings?: boolean; // Triggers wing unfurl / sprout animation during evolution
  glowIntensity?: 'normal' | 'high' | 'ultra';
  className?: string;
}

// Element color maps for custom divine aura and wing hues
export const getElementAuraColors = (element?: string) => {
  switch (element) {
    case 'fire':
      return {
        wingGradientStart: '#f97316',
        wingGradientMid: '#ef4444',
        wingGradientEnd: '#fbbf24',
        glowColor: 'rgba(249, 115, 22, 0.7)',
        haloColor: '#f97316',
        particleColor: 'bg-orange-400',
        elementName: 'Thần Lửa Bất Diệt',
      };
    case 'frost':
      return {
        wingGradientStart: '#38bdf8',
        wingGradientMid: '#06b6d4',
        wingGradientEnd: '#e0f2fe',
        glowColor: 'rgba(56, 189, 248, 0.7)',
        haloColor: '#38bdf8',
        particleColor: 'bg-cyan-300',
        elementName: 'Băng Thần Vĩnh Cửu',
      };
    case 'thunder':
      return {
        wingGradientStart: '#facc15',
        wingGradientMid: '#eab308',
        wingGradientEnd: '#818cf8',
        glowColor: 'rgba(250, 204, 21, 0.8)',
        haloColor: '#facc15',
        particleColor: 'bg-amber-300',
        elementName: 'Lôi Thần Diệt Thế',
      };
    case 'shadow':
    case 'void':
      return {
        wingGradientStart: '#c084fc',
        wingGradientMid: '#9333ea',
        wingGradientEnd: '#3b82f6',
        glowColor: 'rgba(192, 132, 252, 0.8)',
        haloColor: '#c084fc',
        particleColor: 'bg-purple-400',
        elementName: 'Hư Vô Thần Vực',
      };
    case 'cosmic':
    case 'divine':
      return {
        wingGradientStart: '#f59e0b',
        wingGradientMid: '#ec4899',
        wingGradientEnd: '#38bdf8',
        glowColor: 'rgba(245, 158, 11, 0.85)',
        haloColor: '#fde047',
        particleColor: 'bg-amber-300',
        elementName: 'Sáng Thế Vũ Trụ',
      };
    case 'nature':
      return {
        wingGradientStart: '#34d399',
        wingGradientMid: '#10b981',
        wingGradientEnd: '#a7f3d0',
        glowColor: 'rgba(52, 211, 153, 0.75)',
        haloColor: '#34d399',
        particleColor: 'bg-emerald-300',
        elementName: 'Thần Mộc Thái Sơ',
      };
    case 'wind':
      return {
        wingGradientStart: '#2dd4bf',
        wingGradientMid: '#0284c7',
        wingGradientEnd: '#f0fdf4',
        glowColor: 'rgba(45, 212, 191, 0.75)',
        haloColor: '#2dd4bf',
        particleColor: 'bg-teal-300',
        elementName: 'Phong Thần Vô Cực',
      };
    case 'gold':
    default:
      return {
        wingGradientStart: '#facc15',
        wingGradientMid: '#f59e0b',
        wingGradientEnd: '#fef08a',
        glowColor: 'rgba(250, 204, 21, 0.8)',
        haloColor: '#facc15',
        particleColor: 'bg-yellow-300',
        elementName: 'Thần Thánh Hoàng Kim',
      };
  }
};

/**
 * High-definition SVG Wing Component
 * Features multi-layered feathers, glowing rune veins, and dynamic wing curves
 */
const CelestialWing: React.FC<{
  side: 'left' | 'right';
  gradientId: string;
  colors: ReturnType<typeof getElementAuraColors>;
  width: number;
  height: number;
  isSprouting?: boolean;
}> = ({ side, gradientId, colors, width, height, isSprouting }) => {
  const isLeft = side === 'left';
  const animationClass = isSprouting
    ? 'animate-wing-sprout'
    : isLeft
    ? 'animate-wing-left'
    : 'animate-wing-right';

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 ${
        isLeft ? '-left-8 sm:-left-12' : '-right-8 sm:-right-12'
      } ${animationClass}`}
      style={{
        zIndex: 5,
        width: `${width}px`,
        height: `${height}px`,
        transformOrigin: isLeft ? '90% 65%' : '10% 65%',
      }}
    >
      <svg
        viewBox="0 0 140 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_0_12px_rgba(250,204,21,0.7)]"
        style={{
          transform: isLeft ? 'none' : 'scaleX(-1)',
        }}
      >
        <defs>
          <linearGradient id={`${gradientId}-main`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.wingGradientStart} stopOpacity="0.95" />
            <stop offset="60%" stopColor={colors.wingGradientMid} stopOpacity="0.9" />
            <stop offset="100%" stopColor={colors.wingGradientEnd} stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id={`${gradientId}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" stopOpacity="1" />
            <stop offset="45%" stopColor="#fde047" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.8" />
          </linearGradient>

          <filter id={`${gradientId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Feather Layer 1 (Longest primary feather) */}
        <path
          d="M130 115 C110 90, 45 45, 12 10 C32 42, 60 78, 105 125 Z"
          fill={`url(#${gradientId}-main)`}
          filter={`url(#${gradientId}-glow)`}
          opacity="0.95"
        />

        {/* Primary Wing Arch Backbone */}
        <path
          d="M132 118 C108 85, 52 35, 15 12 C18 25, 35 60, 85 105 C108 122, 125 126, 132 118 Z"
          fill={`url(#${gradientId}-gold)`}
          opacity="0.9"
        />

        {/* Secondary Feather Tier 2 */}
        <path
          d="M125 122 C95 95, 48 65, 26 38 C42 66, 68 95, 108 135 Z"
          fill={`url(#${gradientId}-main)`}
          opacity="0.9"
        />

        {/* Tertiary Feather Tier 3 */}
        <path
          d="M120 128 C92 105, 58 82, 42 60 C55 85, 78 112, 106 142 Z"
          fill={`url(#${gradientId}-gold)`}
          opacity="0.85"
        />

        {/* Lower Soft Downy Feather 4 */}
        <path
          d="M115 132 C92 118, 70 102, 58 88 C70 108, 88 128, 110 148 Z"
          fill={`url(#${gradientId}-main)`}
          opacity="0.8"
        />

        {/* Glowing Rune Veins through wing bones */}
        <path
          d="M125 116 Q75 60 22 20"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 6"
          opacity="0.85"
        />
        <path
          d="M105 124 Q65 80 35 48"
          stroke="#fef08a"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Sparkle Nodes */}
        <circle cx="22" cy="20" r="3" fill="#ffffff" filter={`url(#${gradientId}-glow)`} />
        <circle cx="55" cy="50" r="2.5" fill="#fde047" />
        <circle cx="85" cy="85" r="2" fill="#ffffff" />
      </svg>
    </div>
  );
};

/**
 * EvolvedPetSprite
 * Displays companion sprite with dynamic CSS Godhood transformations:
 * - Growing / Flapping Ethereal Wings
 * - Celestial Golden Halo
 * - Multi-layered Pulsing Godhood Aura
 * - Orbiting Elemental Embers
 * - Levitation Animation
 */
export const EvolvedPetSprite: React.FC<EvolvedPetSpriteProps> = ({
  pet,
  size = 'md',
  isEvolved,
  isSproutingWings = false,
  glowIntensity = 'normal',
  className = '',
}) => {
  // If not explicitly passed, check if pet enchantment is 5 or more
  const evolved = isEvolved !== undefined ? isEvolved : (pet.enchantmentLevel || 0) >= 5;
  const colors = getElementAuraColors(pet.element);
  const uniqueGradId = `wing-grad-${pet.id || 'evolved'}`;

  // Dimensions based on size
  let containerSize = 'w-16 h-16';
  let emojiSize = 'text-3xl';
  let wingWidth = 72;
  let wingHeight = 82;
  let haloSize = 'w-10 h-6 -top-4';

  if (size === 'sm') {
    containerSize = 'w-11 h-11';
    emojiSize = 'text-xl';
    wingWidth = 46;
    wingHeight = 54;
    haloSize = 'w-7 h-4 -top-3';
  } else if (size === 'lg') {
    containerSize = 'w-24 h-24';
    emojiSize = 'text-5xl';
    wingWidth = 98;
    wingHeight = 112;
    haloSize = 'w-14 h-8 -top-6';
  } else if (size === 'xl') {
    containerSize = 'w-32 h-32';
    emojiSize = 'text-6xl';
    wingWidth = 135;
    wingHeight = 155;
    haloSize = 'w-18 h-10 -top-8';
  } else if (size === 'giant') {
    containerSize = 'w-48 h-48';
    emojiSize = 'text-8xl';
    wingWidth = 195;
    wingHeight = 220;
    haloSize = 'w-28 h-14 -top-12';
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className} ${
        evolved ? 'animate-pet-levitate' : ''
      }`}
    >
      {/* 1. TRANSCENDED GODHOOD BACKGROUND AURA (When Level 5) */}
      {evolved && (
        <>
          {/* Outer Radiant Shockwave Aura */}
          <div
            className="absolute inset-0 rounded-full animate-god-aura pointer-events-none -z-10"
            style={{
              background: `radial-gradient(circle, ${colors.glowColor} 0%, rgba(192, 132, 252, 0.4) 50%, transparent 75%)`,
              transform: 'scale(1.7)',
            }}
          />

          {/* Rotating Ancient Glyph Ring */}
          <div
            className="absolute inset-0 rounded-full border border-amber-400/40 border-dashed animate-rune-spin pointer-events-none -z-10"
            style={{
              transform: 'scale(1.5)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full border border-purple-400/30 border-dotted animate-rune-reverse pointer-events-none -z-10"
            style={{
              transform: 'scale(1.3)',
            }}
          />

          {/* Orbiting Starlight Embers */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <div className={`absolute w-2.5 h-2.5 rounded-full ${colors.particleColor} shadow-md shadow-amber-300 animate-orbit-1`} />
            <div className="absolute w-2 h-2 rounded-full bg-cyan-300 shadow-md shadow-cyan-300 animate-orbit-2" />
            <div className="absolute w-2 h-2 rounded-full bg-purple-300 shadow-md shadow-purple-300 animate-orbit-3" />
          </div>

          {/* Golden Celestial Halo above head */}
          <div className={`absolute ${haloSize} flex items-center justify-center pointer-events-none z-20 animate-halo-float`}>
            <div className="relative w-full h-full">
              <svg viewBox="0 0 100 40" fill="none" className="w-full h-full filter drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]">
                <ellipse cx="50" cy="20" rx="42" ry="14" stroke="#facc15" strokeWidth="4" strokeDasharray="6 3" />
                <ellipse cx="50" cy="20" rx="38" ry="11" stroke="#ffffff" strokeWidth="2" />
                {/* Radiant halo starburst rays */}
                <circle cx="50" cy="6" r="3" fill="#ffffff" />
                <circle cx="20" cy="14" r="2" fill="#fde047" />
                <circle cx="80" cy="14" r="2" fill="#fde047" />
              </svg>
            </div>
          </div>

          {/* Left Wing (Sprouting or Flapping) */}
          <CelestialWing
            side="left"
            gradientId={`${uniqueGradId}-L`}
            colors={colors}
            width={wingWidth}
            height={wingHeight}
            isSprouting={isSproutingWings}
          />

          {/* Right Wing (Sprouting or Flapping) */}
          <CelestialWing
            side="right"
            gradientId={`${uniqueGradId}-R`}
            colors={colors}
            width={wingWidth}
            height={wingHeight}
            isSprouting={isSproutingWings}
          />
        </>
      )}

      {/* 2. PET SPRITE CONTAINER */}
      <div
        className={`relative z-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${containerSize} ${
          evolved
            ? 'bg-gradient-to-tr from-amber-500/30 via-slate-900 to-purple-600/40 border-2 border-yellow-300 shadow-2xl shadow-yellow-400/50 ring-4 ring-amber-400/30'
            : (pet.enchantmentLevel || 0) >= 3
            ? 'bg-slate-900 border-2 border-purple-400 shadow-lg shadow-purple-950 ring-2 ring-purple-400/20'
            : 'bg-slate-900 border border-slate-700 shadow-md'
        }`}
      >
        {/* Core Emoji Icon Sprite */}
        <span
          className={`${emojiSize} filter transition-transform duration-500 ${
            evolved
              ? 'drop-shadow-[0_0_12px_rgba(250,204,21,0.8)] scale-110'
              : 'scale-100'
          }`}
          role="img"
          aria-label={pet.name}
        >
          {pet.avatarIcon}
        </span>

        {/* Evolved Godhood Crown Badge on Bottom-Right */}
        {evolved && (
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-lg border border-yellow-200 flex items-center gap-0.5 z-30 uppercase tracking-tighter animate-pulse">
            <span>👑</span>
            <span>MAX</span>
          </div>
        )}
      </div>
    </div>
  );
};

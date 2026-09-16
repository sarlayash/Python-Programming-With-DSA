import React, { useState } from 'react';

interface UserAvatarProps {
  photo?: string | null;
  name?: string | null;
  email?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showInitialsOnly?: boolean;
}

/**
 * Extract clean initials from a learner's name or email.
 * Properly handles college roll numbers in parentheses:
 * e.g., "Aryan Sharma (2025PCEACS190)" -> "AS"
 * e.g., "Kapil Narula" -> "KN"
 * e.g., "Shreya (2025PCEACS157)" -> "S"
 * e.g., "2025pceacsshreya157@gmail.com" -> "S"
 */
export function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    // Strip parenthetical roll number or extra tags
    const cleaned = name.replace(/\s*\([^)]*\)/g, '').trim();
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (parts.length === 1 && parts[0].length > 0) {
      return parts[0].slice(0, 2).toUpperCase();
    }
  }

  if (email && email.trim()) {
    const local = email.split('@')[0];
    // Remove leading college year/prefix digits if present
    const alphabetic = local.replace(/^[0-9]+[a-zA-Z]*?(?=[a-zA-Z]{3,})/, '').replace(/[^a-zA-Z]/g, '');
    if (alphabetic.length >= 2) {
      return alphabetic.slice(0, 2).toUpperCase();
    }
    if (alphabetic.length === 1) {
      return alphabetic.toUpperCase();
    }
    if (local.length > 0) {
      return local.slice(0, 2).toUpperCase();
    }
  }

  return 'U';
}

/**
 * Deterministic color palette for learner initials badges
 */
const AVATAR_PALETTE = [
  'bg-emerald-600 text-white',
  'bg-sky-600 text-white',
  'bg-indigo-600 text-white',
  'bg-violet-600 text-white',
  'bg-amber-600 text-white',
  'bg-rose-600 text-white',
  'bg-teal-600 text-white',
  'bg-cyan-700 text-white',
  'bg-blue-600 text-white',
  'bg-orange-600 text-white',
];

export function getAvatarColor(seed?: string | null): string {
  if (!seed) return AVATAR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}

/**
 * Verifies if a profile picture URL is authentic (genuine Google/Gmail account avatar)
 * and strictly rejects fake stock photos or placeholders.
 */
export function isValidProfilePicture(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.length < 10) return false;
  // Ban fake stock photo sources
  if (trimmed.includes('unsplash.com')) return false;
  if (trimmed.includes('placeholder')) return false;
  if (trimmed.includes('via.placeholder.com')) return false;
  if (trimmed.includes('avatar.iran.liara.run')) return false;
  return true;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  photo,
  name,
  email,
  size = 'md',
  className = '',
  showInitialsOnly = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const isValidPhoto = !showInitialsOnly && !imgError && isValidProfilePicture(photo);
  const initials = getInitials(name, email);
  const colorClass = getAvatarColor(email || name || 'default');

  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-10 h-10 text-sm font-semibold',
    xl: 'w-12 h-12 text-base font-bold'
  }[size];

  if (isValidPhoto && photo) {
    return (
      <img
        src={photo}
        alt={name || 'Profile picture'}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 ${sizeClasses} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold shrink-0 select-none shadow-2xs ${colorClass} ${sizeClasses} ${className}`}
      title={name || email || 'Learner'}
    >
      {initials}
    </div>
  );
};

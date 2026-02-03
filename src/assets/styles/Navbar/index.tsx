// src/utils/classes.ts
export const getThemeClasses = (theme: 'light' | 'dark') => {
  const navBg = theme === 'light'
    ? 'bg-gray-100 border-gray-200'
    : 'bg-[#264653] border-gray-700';

  const navText = theme === 'light'
    ? 'text-gray-950 hover:underline hover:text-red-600'
    : 'text-gray-100 hover:underline hover:text-amber-300';

  const socialText = theme === 'light'
    ? 'text-gray-950 hover:underline hover:cursor-pointer hover:text-red-600 '
    : 'text-gray-300 hover:underline hover:cursor-pointer hover:text-amber-300';

  const hoverBg = theme === 'light'
    ? 'text-gray-950 hover:underline hover:text-red-600'
    : 'text-gray-100 hover:underline hover:text-amber-300';

  return { navBg, navText, socialText, hoverBg };
};

import { align } from '@/shared/align';

export const getStandardCategory = (userInput) => {
  if (!userInput) return '';

  const cleanInput = userInput.trim().toLowerCase().replace(/\s+/g, '');

  for (const [standardName, aliases] of Object.entries(align)) {
    if (standardName.replace(/\s+/g, '').includes(cleanInput)) {
      return standardName;
    }

    const isMatched = aliases.some(
      (alias) =>
        alias.toLowerCase().replace(/\s+/g, '') === cleanInput ||
        alias.toLowerCase().replace(/\s+/g, '').includes(cleanInput)
    );

    if (isMatched) return standardName;
  }

  return userInput;
};

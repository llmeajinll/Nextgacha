import { align } from '@/shared/align';

export const getStandardCategory = (userInput) => {
  if (!userInput) return '';

  // 1. 비교를 위해 입력값의 공백을 제거하고 소문자로 변환합니다.
  const cleanInput = userInput.trim().toLowerCase().replace(/\s+/g, '');

  // const Align = Object.entries(align);
  console.log('align', align);

  // 2. align 객체를 순회하며 일치하는 항목을 찾습니다.
  for (const [standardName, aliases] of Object.entries(align)) {
    // 키값(표준명) 자체가 검색어와 일치하는지 확인 (예: '포켓몬스터')
    if (standardName.replace(/\s+/g, '').includes(cleanInput)) {
      return standardName;
    }

    // 별칭 리스트(aliases) 중에 일치하는 것이 있는지 확인 (예: 'pokemon')
    const isMatched = aliases.some(
      (alias) =>
        alias.toLowerCase().replace(/\s+/g, '') === cleanInput ||
        alias.toLowerCase().replace(/\s+/g, '').includes(cleanInput)
    );

    if (isMatched) return standardName;
  }

  // 3. 일치하는 별칭이 없으면 원래 입력값을 그대로 반환합니다.
  return userInput;
};

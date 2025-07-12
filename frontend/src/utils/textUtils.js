// Text utilities for flexible answer validation

export const normalizeText = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    // Remove accents and special characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove common prefixes
    .replace(/^(el |la |los |las |san |santa |puerto |villa |ciudad |municipio |departamento |provincia |estado |región )/i, '')
    // Remove punctuation and extra spaces
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const checkAnswer = (userAnswer, correctAnswers) => {
  const normalizedUser = normalizeText(userAnswer);
  
  if (!normalizedUser) return null;
  
  // Check against all possible answers
  for (const answer of correctAnswers) {
    const normalizedCorrect = normalizeText(answer.name);
    
    if (normalizedUser === normalizedCorrect) {
      return answer;
    }
    
    // Also check if it's a partial match for longer names
    if (normalizedCorrect.includes(normalizedUser) && normalizedUser.length >= 3) {
      return answer;
    }
  }
  
  return null;
};

export const getRandomHint = (remainingAnswers) => {
  if (remainingAnswers.length === 0) return null;
  
  const randomAnswer = remainingAnswers[Math.floor(Math.random() * remainingAnswers.length)];
  const name = randomAnswer.name;
  
  // Reveal first 1-3 characters depending on length
  const revealLength = Math.min(3, Math.max(1, Math.floor(name.length / 3)));
  const hint = name.substring(0, revealLength) + '_'.repeat(name.length - revealLength);
  
  return {
    hint,
    answer: randomAnswer
  };
};
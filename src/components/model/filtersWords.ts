export const filterLearnedWords = JSON.stringify({ 'userWord.optional.isLearned': true });
export const filterHardWords = JSON.stringify({ 'userWord.difficulty': 'hard' });
export const filterTodayWords = JSON.stringify({ 'userWord.optional.startLearningAt': new Date().toLocaleDateString() });

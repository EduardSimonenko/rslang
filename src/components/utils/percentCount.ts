function percentOfCorrectAnswers(allWords: number[], correctAnswers: number[]): number {
  const all = allWords.reduce((pre, cur) => pre + cur, 0);
  const correct = correctAnswers.reduce((pre, cur) => pre + cur, 0);
  const percent = 100;
  return Math.round((correct / all) * percent);
}

export default percentOfCorrectAnswers;

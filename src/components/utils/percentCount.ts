function percentOfCorrectAnswers(allWords: number[], correctAnswers: number[]): number {
  const all = allWords.reduce((pre, cur) => pre + cur, 0);
  const correct = correctAnswers.reduce((pre, cur) => pre + cur, 0);
  const percent = 100;
  const result = Math.round((correct / all) * percent);
  if (result) {
    return result;
  }
  return 0;
}

export default percentOfCorrectAnswers;

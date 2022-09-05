export interface StatisticsData {
  learnedWords: number,
  optional: OptionalStatistics
}

interface OptionalStatistics {
  longTerm: string
  audioCall: GameStatistic,
  sprint: GameStatistic
}

interface GameStatistic {
  data: string,
  newWords: number,
  correctAnswers: number,
  seriesCorrectAnswers: number,
  allWords: number,
}

export interface LongTermStatistics {
  data: string,
  newWords: number
}

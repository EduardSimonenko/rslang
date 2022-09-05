export interface StatisticsData {
  learnedWords: number,
  optional: OptionalStatistics,
  id?: string,
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
  allAnswers: number
}

export interface LongTermStatistics {
  data: string,
  newWords: number
}

export enum GameName {
  audiocall = 'audiocall',
  sprint = 'sprint',
}

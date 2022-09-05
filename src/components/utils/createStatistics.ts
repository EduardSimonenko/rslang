import { StatisticsData } from '../../types/statistics/interfaces';

function createStatistics(): StatisticsData {
  const today = new Date().toLocaleDateString();
  const longTerm: string = JSON.stringify(
    [
      {
        data: today,
        newWords: 0,
      },
    ],
  );

  const statistics: StatisticsData = {
    learnedWords: 0,
    optional: {
      longTerm,
      audioCall: {
        data: today,
        newWords: 0,
        correctAnswers: 0,
        seriesCorrectAnswers: 0,
        allWords: 0,
      },
      sprint: {
        data: today,
        newWords: 0,
        correctAnswers: 0,
        seriesCorrectAnswers: 0,
        allWords: 0,
      },
    },
  };
  return statistics;
}

export default createStatistics;

import { StatisticsData } from '../../types/statistics/interfaces';

function createStatistics(): StatisticsData {
  const today = new Date().toLocaleDateString();
  const longTerm: string = JSON.stringify(
    [
      { /* массив переводим в json иначе не запишет на сервер */
        data: today, /* дата сегодня пример (9/5/2022) */
        newWords: 0, /* колличество новых слов общее во всех играх */
      },
    ],
  );

  const statistics: StatisticsData = {
    learnedWords: 0, /* общее колличество изученнх слов (считам поля isLearned: true) */
    optional: {
      longTerm,
      audioCall: {
        data: today,
        newWords: 0, /* колличество новых слов в данной игре за день */
        correctAnswers: 0,
        seriesCorrectAnswers: 0,
      },
      sprint: {
        data: today,
        newWords: 0,
        correctAnswers: 0,
        seriesCorrectAnswers: 1,
      },
    },
  };
  return statistics;
}

export default createStatistics;

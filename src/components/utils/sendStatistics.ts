import { AuthorizeUserWords, WordStructure } from '../../types/loadServerData/interfaces';
import { GameName, LongTermStatistics, StatisticsData } from '../../types/statistics/interfaces';
import Api from '../controller/textbook/controller';
import { filterLearnedWords, filterTodayWords } from '../model/filtersWords';
import getUserData from './userLogin';

async function makeNewStat(
  correctAnswers: WordStructure[],
  wrongAnswers: WordStructure[],
  gameName: GameName,
  counter: number,
): Promise<StatisticsData> {
  const today = new Date().toLocaleDateString(); // сегодня
  const newStat = await Api.getStatistics(getUserData()); // статистика с сервера
  delete newStat.id;
  const gameStat = gameName === GameName.audiocall
    ? newStat.optional.audioCall : newStat.optional.sprint; // стата конкретно по игре

  const learnedWordsData = await Api.getfilterWords(
    getUserData(),
    filterLearnedWords,
  ) as AuthorizeUserWords[];
  // все слова с isLearned: true
  let learnedWordsNum = 0; // кол-во слов с isLearned: true
  if (learnedWordsData[0].paginatedResults.length !== 0) {
    learnedWordsNum = learnedWordsData[0].totalCount[0].count;
  }
  const longTermObj: LongTermStatistics[] = JSON.parse(newStat.optional.longTerm); // стата объектом
  const newWordsTodayData = await Api.getfilterWords(
    getUserData(),
    filterTodayWords,
  ) as AuthorizeUserWords[];
  const newWordsToday = newWordsTodayData[0].paginatedResults.length;
  newStat.learnedWords = learnedWordsNum;

  if (longTermObj[longTermObj.length - 1].data === today) {
    longTermObj[longTermObj.length - 1].newWords = newWordsToday;
  } else {
    longTermObj.push({ data: today, newWords: newWordsToday });
  }

  newStat.optional.longTerm = JSON.stringify(longTermObj);

  if (gameStat.data === today) {
    gameStat.correctAnswers += correctAnswers.length;
    gameStat.newWords += 20;
    if (gameStat.seriesCorrectAnswers < counter) {
      gameStat.seriesCorrectAnswers = counter;
    }
    gameStat.allWords += (correctAnswers.length + wrongAnswers.length);
  } else {
    gameStat.data = today;
    gameStat.correctAnswers = correctAnswers.length;
    gameStat.newWords = 20;
    gameStat.seriesCorrectAnswers = counter;
    gameStat.allWords = (correctAnswers.length + wrongAnswers.length);
  }
  return newStat;
}

export default makeNewStat;

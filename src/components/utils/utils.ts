// import { WordStructure } from '../../types/loadServerData/interfaces';
// import { Function } from '../../types/audiocall/interfaces';

export function getRandomInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function shuffle(array: any[]) {
  return array.sort(() => 0.5 - Math.random());
}

import { DataUrl } from '../../types/textbook/type';
import CustomStorage from '../controller/storage';

function saveUrlPath(paramUrl: DataUrl): void {
  CustomStorage.setStorage(
    'page',
    `${paramUrl.path}?group=${paramUrl.group}&page=${paramUrl.page}`,
  );
}

export function createUrlPath(paramUrl: DataUrl): void {
  saveUrlPath(paramUrl);
  window.history.pushState(
    `${paramUrl.path}?group=${paramUrl.group}&page=${paramUrl.page}`,
    null,
    `../#${paramUrl.path}?group=${paramUrl.group}&page=${paramUrl.page}`,
  );
}

export function replaceHashHistory(hash: string): void {
  window.history.replaceState(hash, null);
}

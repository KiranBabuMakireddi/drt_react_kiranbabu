import type { Satellite } from '../types/satellite';

const KEY = 'selected_satellites';

export const getSelectedFromStorage = (): Satellite[] => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSelectedToStorage = (selected: Satellite[]) => {
  localStorage.setItem(KEY, JSON.stringify(selected));
};

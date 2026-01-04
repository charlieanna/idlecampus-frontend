import { mockTest1 } from './mock1';

export const ALL_MOCKS = [
  mockTest1
];

export const getMock = (id: string) => ALL_MOCKS.find(m => m.id === id);

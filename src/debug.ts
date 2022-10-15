

import { getData } from './dataStore';
import { DataStore } from './data.types';




export function debug() {
  const data: DataStore = getData();
  console.log(JSON.stringify(data, undefined, 2));
}
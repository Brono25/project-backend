// This file is used to interact with Rest Client on VS code.
// It can be deleted when finsihed.
import { getData } from './dataStore';
import { DataStore } from './data.types';

export function debug() {
  const data: DataStore = getData();
  console.log(JSON.stringify(data, undefined, 2));
  return data;
}

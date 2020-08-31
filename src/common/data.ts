import * as electron from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as types from './types';

const isDevelopment = process.env.NODE_ENV !== 'production'

let dataPath: string;
let settingsPath: string;
let tasksPath: string;
let proxiesPath: string;

let settingsStorage: types.Settings;
let tasksStorage: types.Task[];
let proxiesStorage: types.ProxyList;

export const data: types.DataManager = {

  loadMemory: (): void => {
    if (isDevelopment) {
      dataPath = __dirname;
    } else {
      dataPath = (electron.app || electron.remote.app).getPath('userData');
    }

    // data paths

    settingsPath = path.join(dataPath, 'settings.json');
    tasksPath = path.join(dataPath, 'tasks.json');
    proxiesPath = path.join(dataPath, 'proxies.json');

    // check if exists

    if (!fs.existsSync(tasksPath)) fs.writeFileSync(tasksPath, '[]');
    if (!fs.existsSync(proxiesPath)) fs.writeFileSync(proxiesPath, '{}');
    if (!fs.existsSync(settingsPath)) fs.writeFileSync(settingsPath, JSON.stringify({
      license: '',
      webhook: '',
      monitorDelay: '',
      retryDelay: '',
      twoCaptcha: '',
      antiCaptcha: '',
      autoSolve: '',
    }, null, 2));

    // load storage

    settingsStorage = JSON.parse(fs.readFileSync(settingsPath).toString());
    tasksStorage = JSON.parse(fs.readFileSync(tasksPath).toString());
    proxiesStorage = JSON.parse(fs.readFileSync(proxiesPath).toString());

  },

  /**
   * # getSettings
   * Returns settings
   * @return {types.Settings}
   */
  getSettings: (): types.Settings => {
    return settingsStorage;
  },

  /**
   * # setSetting
   * Sets a setting in settings
   */
  setSetting: (key: keyof types.Settings, value: string): void => {
    settingsStorage[key] = value;
    fs.writeFileSync(settingsPath, JSON.stringify(settingsStorage, null, 2));
  },

  /**
   * # getTasks
   * Returns tasks
   * @return {types.task[]}
   */
  getTasks: (): types.Task[] => {
    return tasksStorage;
  },

  /**
   * # addTasks
   * adds tasks
   */
  addTasks: (tasks: types.Task[]): void => {
    tasksStorage = [...tasksStorage, ...tasks];
    fs.writeFileSync(tasksPath, JSON.stringify(tasksStorage, null, 2));
  },

  /**
   * # clearTasks
   * clears all tasks
   */
  clearTasks: (): void => {
    tasksStorage = []
    fs.writeFileSync(tasksPath, '[]');
  },

    /**
   * # getProxies
   * Returns proxies
   * @return {string[]}
   */
  getProxies: (): types.ProxyList => {
    return proxiesStorage;
  },

  /**
   * # addProxies
   * adds proxy list
   */
  addProxies: (name: string, proxies: string[]): void => {
    proxiesStorage[name] = proxies;
    fs.writeFileSync(proxiesPath, JSON.stringify(proxiesStorage, null, 2));
  },

    /**
   * # deleteProxies
   * deletes proxy list
   */
  deleteProxies: (name: string): void => {
    delete proxiesStorage[name];
    fs.writeFileSync(proxiesPath, JSON.stringify(proxiesStorage, null, 2));
  }

}

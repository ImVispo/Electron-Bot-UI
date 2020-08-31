import { app, BrowserWindow, ipcMain, IpcMainEvent, IpcMain } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';

import * as types from '../common/types';
import { data } from '../common/data';

const isDevelopment = process.env.NODE_ENV !== 'production';

let mainWindow: BrowserWindow | null;

data.loadMemory();

function createMainWindow() {

  // create main window
  mainWindow = new BrowserWindow({
    'minHeight': 800,
    'minWidth': 1300,
    // resizable: false,
    // frame: false,
    title: 'Shibob',
    movable: true,
    webPreferences:
    {
      nodeIntegration: true
    }
  });

  // development
  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    mainWindow.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }));
  }

  mainWindow!.webContents.on('did-finish-load', () => {
    mainWindow!.webContents.send('initial', {});
  });

  // close window
  mainWindow.on('closed', () => {
    mainWindow = null;
  })

}

ipcMain.on('close-main-window', () => {
  if (mainWindow !== null) mainWindow.close();
  mainWindow = null;
});

ipcMain.on('minimize-main-window', () => {
  if (mainWindow !== null) mainWindow.minimize();
});

ipcMain.on('maximize-main-window', () => {
  if (mainWindow !== null) mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});

// Task

ipcMain.on('get-tasks', async (event: IpcMainEvent) => {
  event.returnValue = data.getTasks();
})

ipcMain.on('add-tasks', async (event: IpcMainEvent, tasks: types.Task[]) => {
  data.addTasks(tasks);
  event.returnValue = data.getTasks();
})

ipcMain.on('clear-tasks', async (event: IpcMainEvent) => {
  data.clearTasks();
  event.returnValue = [];
})

// Proxies

ipcMain.on('get-proxies', async (event: IpcMainEvent) => {
  event.returnValue = data.getProxies();
})

ipcMain.on('add-proxies', async (event: IpcMainEvent, name: string, proxies: string[]) => {
  data.addProxies(name, proxies);
  event.returnValue = data.getProxies();
})

ipcMain.on('delete-proxies', async (event: IpcMainEvent, name: string) => {
  data.deleteProxies(name);
  event.returnValue = data.getProxies();
})

// Settings

ipcMain.on('get-settings', async(event: IpcMainEvent) => {
  event.returnValue = data.getSettings();
})

ipcMain.on('set-setting', async(event: IpcMainEvent, key: keyof types.Settings, value: string) => {
  data.setSetting(key, value);
  event.returnValue = data.getSettings();
})

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) createMainWindow();
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  createMainWindow();
  // mainWindow?.setMenu(null);
});
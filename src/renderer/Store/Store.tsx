import { createConnectedStore } from 'undux';
import * as types from '../../common/types';
import { ipcRenderer } from 'electron';

const initialState: types.StoreState = {
  tasks: ipcRenderer.sendSync('get-tasks') as types.Task[],
  TaskCreationModal: {
    visible: false
  },
  proxies: ipcRenderer.sendSync('get-proxies') as types.ProxyList,
  ProxyCreationModal: {
    visible: false
  },
  proxyListActive: '',
  proxySelectedRowKeys: [],
  settings: ipcRenderer.sendSync('get-settings') as types.Settings
};

export default createConnectedStore(initialState);
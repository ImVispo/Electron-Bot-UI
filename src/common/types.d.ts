// Data points

export type Task = {
  id: string;
  store: string;
  input: string;
  emails: string[];
  proxy: string[];
}

export type ProxyList = {
  [ key: string ]: string[];
}

export type TaskCreationModal = {
  visible: boolean
}

export type ProxyCreationModal = {
  visible: boolean
}

export type Settings = {
  license: string;
  webhook: string;
  monitorDelay: string;
  retryDelay: string;
  twoCaptcha: string;
  antiCaptcha: string;
  autoSolve: string;
}

export type StoreState = {
  tasks: Task[];
  TaskCreationModal: TaskCreationModal;
  proxies: ProxyList;
  ProxyCreationModal: TaskCreationModal;
  proxyListActive: string;
  proxySelectedRowKeys: string[];
  settings: Settings;
}

export type DataManager = {
  loadMemory(): void;
  getSettings(): Settings;
  getTasks(): Task[];
  addTasks(task: Task[]): void;
  getProxies(): ProxyList;
  addProxies(name: string, proxies: string[]): void;
  deleteProxies(name: string): void;
  clearTasks(): void;
  setSetting(key: keyof Settings, value: string): void;
}
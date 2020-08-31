import { useHistory } from 'react-router-dom';
import React, { useEffect } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

const RandomComponentInsideRouter = () => {
  const history = useHistory();
  useEffect(() => {
    ipcRenderer.on('initial', (event: IpcRendererEvent) => {
      history.push('/Proxies')
    })
  }, []);
  return (
    <div>
    </div>
  )
}

export default RandomComponentInsideRouter;
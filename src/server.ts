import { createApp } from './app';
import { config } from './config';

createApp().listen(config.port, () => {
  console.log(`Servidor escuchando en el puerto ${config.port}`);
});
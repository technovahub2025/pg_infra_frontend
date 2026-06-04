import { io } from 'socket.io-client';
import { api } from './api';

function getSocketUrl() {
  const explicit = import.meta.env.VITE_SOCKET_URL;
  if (explicit) return explicit;

  const apiBase = api?.defaults?.baseURL || 'http://localhost:5000/api';
  try {
    const url = new URL(apiBase, window.location.origin);
    return `${url.origin}`;
  } catch {
    return 'http://localhost:5000';
  }
}

export const socket = io(getSocketUrl(), {
  autoConnect: false,
  transports: ['websocket'],
});

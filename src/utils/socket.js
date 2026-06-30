import io from 'socket.io-client'

const getSocketUrl = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL?.replace(/\/$/, '');
  const socketUrl = import.meta.env.VITE_SOCKET_URL?.replace(/\/$/, '');

  // Socket.io runs on the main API server — never the BullMQ worker service
  if (socketUrl && !socketUrl.includes('-worker')) {
    return socketUrl;
  }

  if (baseUrl) return baseUrl;

  return 'http://localhost:3001';
};

export const createSocketConnection = () => {
  try {
    const SOCKET_URL = getSocketUrl();

    console.log('🔵 Connecting to Socket.IO:', SOCKET_URL);

    return io(SOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
  } catch (err) {
    console.log('Socket connection error:', err);
    return null;
  }
};

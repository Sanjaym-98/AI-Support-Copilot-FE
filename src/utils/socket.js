import io from 'socket.io-client'

export const createSocketConnection = () => {
  try {
    // Use environment variable for Socket.IO URL
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

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
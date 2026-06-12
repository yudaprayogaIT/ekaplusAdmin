import { io, Socket } from "socket.io-client";

type SocketOptions = {
  path?: string;
  query?: Record<string, string>;
};

let socket: Socket | null = null;

export const connectSocket = (url: string, options: SocketOptions = {}) => {
  if (!socket) {
    socket = io(url, {
      path: options.path || "/socket.io",
      query: options.query || {},
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  return socket;
};

export const useSocket = () => {
  const on = <T>(event: string, callback: (data: T) => void) => {
    if (socket) {
      socket.off(event); // hindari double listener
      socket.on(event, callback);
    }
  };

  const emit = <T>(event: string, data?: T) => {
    if (socket) {
      socket.emit(event, data);
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  return { on, emit, disconnect };
};

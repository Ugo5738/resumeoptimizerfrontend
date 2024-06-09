let socket: WebSocket;

export const connectWebSocket = (url: string) => {
  socket = new WebSocket(url);

  socket.addEventListener('open', () => {
    console.log('Connected to WebSocket server');
  });

  socket.addEventListener('close', () => {
    console.log('Disconnected from WebSocket server');
  });

  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
  });
};

export const sendMessage = (message: any) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not open. Ready state is:', socket.readyState);
  }
};

export const onMessage = (callback: (message: any) => void) => {
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    callback(message);
  });
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
  }
};
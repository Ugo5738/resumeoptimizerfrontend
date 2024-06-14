// websocketService.ts
let socket: WebSocket;

export const connectWebSocket = (url: string) => {
  socket = new WebSocket(url);
  socket.onopen = () => console.log("WebSocket connected");
  socket.onclose = () => console.log("WebSocket disconnected");
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
  }
};

export const sendMessage = (message: object) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error("WebSocket is not open");
  }
};

export const onMessage = (callback: (message: any) => void) => {
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    callback(message);
  };
};

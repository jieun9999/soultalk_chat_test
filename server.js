const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 사용자 목록을 저장할 객체
const users = {};

// 클라이언트 연결 처리
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

// 사용자 등록 이벤트 처리
// 서버는 해당 이벤트 이름에 대한 리스너(on)로 데이터를 수신
socket.on("register", () => {
  users[socket.id] = socket.id; // socket.id를 매핑
  console.log(`Socket ID: ${socket.id}`);
});

// 메시지 전송 이벤트 처리
socket.on("send_message", (data) => {
  const { message } = data;
  const targetSocketId = Object.keys(io.sockets.sockets)[Math.floor(Math.random() * Object.keys(io.sockets.sockets).length)];

  // 대상 사용자에게 메시지 전송
  io.to(targetSocketId).emit("receive_message", {
    from: socket.id,
    message,
  });
  console.log(`Message sent from ${socket.id} to ${targetSocketId}: ${message}`);
});

  // 클라이언트 연결 해제 처리
  // 클라이언트가 테스트를 완료하고 연결을 종료하면 이 코드가 실행됩니다.
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  
  });
});

// 서버 실행
const PORT = process.env.PORT || 3000; // 환경변수 PORT 사용, 기본값 3000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
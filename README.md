# Chat Application with Voice Integration

Một ứng dụng chat hiện đại với tích hợp voice, xây dựng theo nguyên tắc **Clean Architecture** và **SOLID principles**.

## 📁 Cấu Trúc Dự Án

```
chat/
├── config/              # Cấu hình và Dependency Injection
├── controller/          # HTTP Controllers
├── domain/              # Domain Models và DTOs
│   ├── dto/
│   └── model/
├── middleware/          # Express Middlewares
├── repository/          # Data Access Layer
├── router/              # Route definitions
├── service/             # Business Services (nếu cần)
├── usecase/             # Use Cases / Business Logic
├── websocket/           # WebSocket handlers
├── index.js             # Main application file
├── package.json
└── .env                 # Environment variables
```

## 🏗️ Kiến Trúc Ứng Dụng

### Tầng lớp (Layers)

1. **Presentation Layer** - Controllers & Routes
   - Xử lý HTTP requests/responses
   - Gọi các use cases thích hợp

2. **Application Layer** - Use Cases
   - Chứa business logic
   - Điều phối repositories và models
   - Validate input data

3. **Domain Layer** - Models & DTOs
   - Domain entities (User, Message, etc.)
   - Data Transfer Objects

4. **Data Layer** - Repositories
   - Truy cập dữ liệu
   - Implements Repository pattern
   - Hiện tại dùng in-memory, có thể swap với database

### SOLID Principles

- **S**ingle Responsibility: Mỗi class có một trách nhiệm duy nhất
- **O**pen/Closed: Mở rộng nhưng đóng để sửa đổi
- **L**iskov Substitution: Các class con có thể thay thế class cha
- **I**nterface Segregation: Interfaces nhỏ và cụ thể
- **D**ependency Inversion: Phụ thuộc vào abstractions, không concrete

## 🚀 Cài Đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development mode
npm run dev

# Chạy production mode
npm start
```

## 📡 API Endpoints

### Users

#### Tạo người dùng mới

```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "isOnline": false,
    "createdAt": "2026-04-21T..."
  },
  "message": "User tạo thành công"
}
```

#### Lấy thông tin người dùng

```http
GET /api/users/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "isOnline": true,
    "createdAt": "2026-04-21T..."
  }
}
```

#### Lấy tất cả người dùng

```http
GET /api/users
```

### Conversations

#### Tạo cuộc trò chuyện mới

```http
POST /api/conversations
Content-Type: application/json

{
  "name": "Group Chat",
  "type": "group",
  "participants": ["user-id-1", "user-id-2"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Group Chat",
    "type": "group",
    "participants": ["user-id-1", "user-id-2"],
    "createdAt": "2026-04-21T...",
    "updatedAt": "2026-04-21T...",
    "lastMessage": null
  },
  "message": "Conversation tạo thành công"
}
```

#### Lấy tin nhắn của cuộc trò chuyện

```http
GET /api/conversations/:conversationId/messages
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "senderId": "user-id-1",
      "content": "Hello!",
      "conversationId": "conv-id",
      "type": "text",
      "createdAt": "2026-04-21T...",
      "isRead": false
    }
  ]
}
```

## 🔌 WebSocket Events

### Client → Server

#### Người dùng tham gia

```javascript
socket.emit("user:join", {
  userId: "user-id",
  conversationId: "conv-id",
});
```

#### Gửi tin nhắn văn bản

```javascript
socket.emit("message:send", {
  senderId: "user-id",
  content: "Hello everyone!",
  conversationId: "conv-id",
});
```

#### Gửi tin nhắn voice

```javascript
socket.emit("message:voice:send", {
  senderId: "user-id",
  audioUrl: "https://example.com/audio.mp3",
  duration: 5, // seconds
  conversationId: "conv-id",
});
```

#### Đang nhập

```javascript
socket.emit("user:typing", {
  userId: "user-id",
  conversationId: "conv-id",
});
```

#### Dừng nhập

```javascript
socket.emit("user:stop-typing", {
  userId: "user-id",
  conversationId: "conv-id",
});
```

### Server → Client

#### Người dùng đã tham gia

```javascript
socket.on("user:joined", (data) => {
  console.log(data.user);
});
```

#### Nhận tin nhắn

```javascript
socket.on("message:received", (data) => {
  console.log(data.message);
});
```

#### Nhận tin nhắn voice

```javascript
socket.on("message:voice:received", (data) => {
  console.log(data.message);
});
```

#### Người dùng online

```javascript
socket.on("user:online", (data) => {
  console.log(`User ${data.userId} is online`);
});
```

#### Người dùng offline

```javascript
socket.on("user:offline", (data) => {
  console.log(`User ${data.userId} is offline`);
});
```

#### Người dùng đang nhập

```javascript
socket.on("user:typing", (data) => {
  console.log(`User ${data.userId} is typing...`);
});
```

## 📝 Ví Dụ Sử Dụng

### Tạo và sử dụng ứng dụng

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:3000");

// Kết nối và tham gia cuộc trò chuyện
socket.emit("user:join", {
  userId: "my-user-id",
  conversationId: "my-conv-id",
});

// Gửi tin nhắn
socket.emit("message:send", {
  senderId: "my-user-id",
  content: "Hello, everyone!",
  conversationId: "my-conv-id",
});

// Lắng nghe tin nhắn
socket.on("message:received", (data) => {
  console.log("Received:", data.message);
});

// Gửi voice message
socket.emit("message:voice:send", {
  senderId: "my-user-id",
  audioUrl: "https://example.com/audio.mp3",
  duration: 10,
  conversationId: "my-conv-id",
});

// Lắng nghe voice message
socket.on("message:voice:received", (data) => {
  console.log("Voice message received:", data.message);
});
```

## 🔧 Mở Rộng Dự Án

### Thêm Database

1. Tạo file `repository/DatabaseUserRepository.js` kế thừa từ `IUserRepository`
2. Cập nhật `ServiceContainer` để sử dụng database repository

### Thêm Authentication

1. Tạo JWT middleware
2. Thêm vào pipes trước các protected routes

### Thêm Features Mới

1. Tạo Use Case mới (ví dụ: `DeleteConversationUseCase`)
2. Tạo Controller method tương ứng
3. Thêm route mới
4. Cập nhật ServiceContainer

## 💡 Best Practices

- ✅ Sử dụng DTOs để validate input
- ✅ Tất cả business logic ở Use Cases
- ✅ Repositories là nơi duy nhất truy cập dữ liệu
- ✅ Controllers chỉ xử lý HTTP concerns
- ✅ Dependency Injection qua constructor
- ✅ Lỗi được throw từ layer sâu hơn, catch ở controllers

## 📦 Dependencies

- **express**: Web framework
- **socket.io**: Real-time communication
- **dotenv**: Environment variables
- **uuid**: Generate unique IDs

## 📄 License

MIT

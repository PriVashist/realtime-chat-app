
const io = require("socket.io")(8000, {
  cors: {
    origin: "*", // Allow all origins (you can restrict this to specific domains if needed)
    methods: ["GET", "POST"], // Allow specific HTTP methods
  },
});

const users = {};

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A new user connected");

  // Listen for a new user joining
  socket.on("new-user-joined", (name) => {
    console.log("New user joined:", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name); // Notify other users
  });

  // Listen for messages sent by the user
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", { message: message, name: users[socket.id] });
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    if (users[socket.id]) {
      socket.broadcast.emit("left", users[socket.id]); // Notify others that the user left
      delete users[socket.id]; // Remove the user from the list
    }
  });
});

console.log("Socket.IO server running on port 8000");

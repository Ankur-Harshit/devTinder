const socket = require("socket.io");

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:3000", "https://pullrequest.online"], // allow both dev + prod
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.on("connection", (socket)=>{
        // Handle Events //
        socket.on("joinChat", ({firstName, userId, targetUserId, time})=>{
            // now we need to create roomm, every chat have a unique room
            const roomId = [userId, targetUserId].sort().join("_");
            socket.join(roomId);
        });

        socket.on("sendMessage", ({firstName,userId, targetUserId, text, time,})=>{
            const roomId = [userId, targetUserId].sort().join("_");
            io.to(roomId).emit("messageRecieved", {firstName, text, userId, time,});
        });

        socket.on("disconnect", ()=>{});
    });
};

module.exports = initializeSocket;
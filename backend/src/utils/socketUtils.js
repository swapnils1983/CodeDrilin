const socketIO = require('socket.io');

let io;

const initSocket = (server) => {
    io = socketIO(server);
    return io;
};

const emitLeaderboardUpdate = (contestId, leaderboard) => {
    if (io) {
        io.to(`contest_${contestId}`).emit('leaderboard_update', leaderboard);
    }
};

module.exports = {
    initSocket,
    emitLeaderboardUpdate
};
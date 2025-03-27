const { Server } = require("socket.io");
const challengeRooms = {};
const socketToCandidateMap = new Map();

const createSocketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT"],
        },
        transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("startChallenge", () => {
            io.emit("challengeStarted"); // Notifying all clients (interviewer)
        });
        socket.on("endChallenge", () => {
            io.emit("challengeEnded");
        });
        socket.on("saveCode", () => {
            io.emit("codeSaved");
        });
        
        socket.on("joinChallenge", ({ challengeId, role, candidateId }) => {
            console.log(`Join request: ${challengeId} - Role: ${role}`);

            if (!challengeRooms[challengeId]) {
                challengeRooms[challengeId] = {
                    interviewers: [],
                    candidate: null,
                };
            }

            const room = challengeRooms[challengeId];

            if (role === "interviewer") {
                if (!room.interviewers.includes(socket.id)) {
                    room.interviewers.push(socket.id);
                    socket.join(challengeId);
                    console.log(
                        `Interviewer ${socket.id} joined challenge ${challengeId}`
                    );
                    io.to(challengeId).emit("userJoined", { role, socketId: socket.id });
                }
            } else if (role === "candidate") {
                console.log(`Candidate ID: ${candidateId}`);
                if (room.candidate && candidateId !== room.candidate) {
                    socket.emit("error", "Candidate already joined!");
                    return;
                }
                room.candidate = candidateId;
                console.log(`Room Candidate ID: ${room.candidate}`);

                socketToCandidateMap.set(socket.id, room.candidate);
                socket.join(challengeId);
                console.log(
                    `Candidate ${room.candidate} joined challenge ${challengeId}`
                );
                io.to(challengeId).emit("userJoined", {
                    role,
                    candidateId: room.candidate,
                });
            } else {
                socket.emit("error", "Invalid role specified!");
                console.log(`Invalid role '${role}' for challenge ${challengeId}`);
            }
        });

        socket.on("stream", ({ challengeId, frame }) => {
            if (challengeRooms[challengeId]) {
                io.to(challengeId).emit("getStream", frame);
            }
        });

        // socket.on("candidateDisconnect", ({ challengeId, candidateId }) => {
        //   if (
        //     challengeRooms[challengeId] &&
        //     challengeRooms[challengeId].candidate === candidateId
        //   ) {
        //     challengeRooms[challengeId].candidate = null;
        //     socketToCandidateMap.delete(socket.id);
        //     io.to(challengeId).emit("candidateLeft", { candidateId });
        //     cleanupRoom(challengeId);
        //   }
        // });

        // socket.on("disconnect", () => {
        //   const candidateId = socketToCandidateMap.get(socket.id);
        //   for (const challengeId in challengeRooms) {
        //     const room = challengeRooms[challengeId];
        //     if (room.interviewers.includes(socket.id)) {
        //       room.interviewers = room.interviewers.filter(
        //         (id) => id !== socket.id
        //       );
        //       console.log(
        //         `Interviewer ${socket.id} disconnected from challenge ${challengeId}`
        //       );
        //     }
        //     if (room.candidate === candidateId || room.candidate === socket.id) {
        //       room.candidate = null;
        //       socketToCandidateMap.delete(socket.id);
        //       console.log(
        //         `Candidate ${
        //           candidateId || socket.id
        //         } disconnected from challenge ${challengeId}`
        //       );
        //       io.to(challengeId).emit("candidateLeft", {
        //         candidateId: candidateId || socket.id,
        //       });
        //     }
        //     cleanupRoom(challengeId);
        //   }
        //   console.log("Client disconnected:", socket.id);
        // });

        function cleanupRoom(challengeId) {
            const room = challengeRooms[challengeId];
            if (room && room.interviewers.length === 0 && !room.candidate) {
                delete challengeRooms[challengeId];
                console.log(`Challenge ${challengeId} room deleted (empty)`);
            }
        }

    });

    return io;
};

module.exports = createSocketServer;
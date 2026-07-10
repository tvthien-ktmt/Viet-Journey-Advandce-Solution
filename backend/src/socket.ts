import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from './utils/logger';

let io: SocketServer;

export const initSocket = (server: HttpServer) => {
    io = new SocketServer(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        logger.info(`Client connected to websocket: ${socket.id}`);
        
        socket.on('join-booking', (bookingCode) => {
            socket.join(`booking-${bookingCode}`);
            logger.info(`Socket ${socket.id} joined room booking-${bookingCode}`);
        });

        socket.on('join-user', (userId) => {
            socket.join(`user-${userId}`);
            logger.info(`Socket ${socket.id} joined room user-${userId}`);
        });

        socket.on('disconnect', () => {
            logger.info(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

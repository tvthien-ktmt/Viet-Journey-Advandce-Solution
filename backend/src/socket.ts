import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import logger from './utils/logger';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

let io: SocketServer;

export const initSocket = (server: HttpServer) => {
    io = new SocketServer(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        }
    });

    io.use((socket, next) => {
        try {
            const cookies = cookie.parse(socket.request.headers.cookie || '');
            const token = cookies.jwt;
            if (!token) return next(new Error('Authentication error'));
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
            (socket as any).user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        logger.info(`Client connected to websocket: ${socket.id}, User ID: ${(socket as any).user.id}`);
        
        socket.on('join-booking', (bookingCode) => {
            // Note: In real app, verify if user owns this booking
            socket.join(`booking-${bookingCode}`);
            logger.info(`Socket ${socket.id} joined room booking-${bookingCode}`);
        });

        socket.on('join-user', (userId) => {
            if ((socket as any).user.id !== Number(userId)) {
                logger.warn(`Unauthorized room join attempt by socket ${socket.id}`);
                return;
            }
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

import { create } from 'zustand';
import { api } from '@/api/client';
import { io, Socket } from 'socket.io-client';

export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  socket: Socket | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  socket: null,
  fetchNotifications: async () => {
    try {
      const res = await api.get<Notification[]>('/notifications');
      const data = res || [];
      const unreadCount = data.filter(n => !n.isRead).length;
      set({ notifications: data, unreadCount });
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  },
  markAsRead: async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      set((state) => {
        const notifications = state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        );
        const unreadCount = notifications.filter(n => !n.isRead).length;
        return { notifications, unreadCount };
      });
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  },
  initSocket: (userId: string) => {
    const existingSocket = get().socket;
    if (existingSocket) return;

    const socketUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';
    const socket = io(socketUrl);
    
    socket.emit('join-user', userId);
    
    socket.on('notification', (newNotif: Notification) => {
      set((state) => {
        const updated = [newNotif, ...state.notifications];
        const unreadCount = updated.filter(n => !n.isRead).length;
        return { notifications: updated, unreadCount };
      });
    });

    set({ socket });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  }
}));

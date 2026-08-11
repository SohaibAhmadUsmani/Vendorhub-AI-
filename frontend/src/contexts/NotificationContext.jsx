import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const NotificationContext = createContext(null);
const API_BASE_URL = 'http://localhost:5000';

function normalizeNotification(item) {
  const time = item?.time ?? item?.createdAt ?? new Date().toISOString();
  return {
    id: item?.id ?? item?._id ?? `${item?.title ?? 'notification'}-${time}`,
    title: item?.title ?? 'Notification',
    message: item?.message ?? '',
    type: item?.type ?? 'system',
    time,
    unread: Boolean(item?.unread ?? item?.read === false),
    link: item?.link ?? null,
  };
}

function sortNotifications(items) {
  return [...items].sort((a, b) => new Date(b.time) - new Date(a.time));
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/vendor/dashboard/notifications`);
      const payload = await response.json();
      const data = Array.isArray(payload?.data) ? payload.data : payload?.data?.data ?? [];
      setNotifications(sortNotifications(data.map(normalizeNotification)));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (socketRef.current) return undefined;

    const socket = io(`${API_BASE_URL}/notifications`, { transports: ['websocket'] });
    socketRef.current = socket;

    const onConnect = () => {
      socket.emit('vendorhub:join_notifications');
    };

    const onNewNotification = (payload) => {
      const item = normalizeNotification(payload);
      setNotifications((prev) => sortNotifications([item, ...prev.filter((entry) => entry.id !== item.id)]));
    };

    const onUpdatedNotification = (payload) => {
      const id = payload?.id;
      if (!id) return;
      setNotifications((prev) =>
        sortNotifications(
          prev.map((entry) => (entry.id === id ? { ...entry, unread: Boolean(payload.unread ?? entry.unread) } : entry)),
        ),
      );
    };

    const onDeletedNotification = (payload) => {
      const id = payload?.id;
      if (!id) return;
      setNotifications((prev) => prev.filter((entry) => entry.id !== String(id)));
    };

    const onNotificationsUpdated = () => {
      setNotifications((prev) => prev.map((entry) => ({ ...entry, unread: false })));
    };

    socket.on('connect', onConnect);
    socket.on('vendorhub:notification:new', onNewNotification);
    socket.on('vendorhub:notification:updated', onUpdatedNotification);
    socket.on('vendorhub:notification:deleted', onDeletedNotification);
    socket.on('vendorhub:notifications:updated', onNotificationsUpdated);

    return () => {
      socket.off('connect', onConnect);
      socket.off('vendorhub:notification:new', onNewNotification);
      socket.off('vendorhub:notification:updated', onUpdatedNotification);
      socket.off('vendorhub:notification:deleted', onDeletedNotification);
      socket.off('vendorhub:notifications:updated', onNotificationsUpdated);
      socket.emit('vendorhub:leave_notifications');
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const addNotification = async (payload) => {
    const item = normalizeNotification(payload);
    setNotifications((prev) => sortNotifications([item, ...prev]));
    try {
      await fetch(`${API_BASE_URL}/api/vendor/dashboard/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error(err);
    }
    return item.id;
  };

  const markAllRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/vendor/dashboard/notifications/read-all`, { method: 'PATCH' });
      setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
    } catch (err) {
      console.error(err);
    }
  };

  const markRead = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/vendor/dashboard/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/vendor/dashboard/notifications/${id}`, { method: 'DELETE' });
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((item) => item.unread).length;

  const value = useMemo(
    () => ({
      notifications,
      loading,
      error,
      refreshNotifications: fetchNotifications,
      addNotification,
      markAllRead,
      markRead,
      deleteNotification,
      unreadCount,
    }),
    [notifications, loading, error, unreadCount],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

export default NotificationContext;

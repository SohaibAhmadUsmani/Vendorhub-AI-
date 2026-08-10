import { createContext, useContext, useState } from 'react';
import { ReceiptText, TrendingUp, PackageCheck, MessageSquareText, ShieldAlert, Clock3 } from 'lucide-react';

const NotificationContext = createContext(null);

const initialNotifications = [
  {
    id: 1,
    type: 'RFQ received',
    title: 'New RFQ received from Northwind Foods',
    description: 'Procurement team requested 120 units of stainless steel containers.',
    time: '2 min ago',
    accent: 'from-cyan-500 to-sky-600',
    icon: ReceiptText,
    unread: true,
  },
  {
    id: 2,
    type: 'New quotation',
    title: 'Quotation submitted by BluePeak Supplies',
    description: 'Competitive pricing received for 3 SKUs with 8% discount.',
    time: '18 min ago',
    accent: 'from-violet-500 to-indigo-600',
    icon: TrendingUp,
    unread: true,
  },
  {
    id: 3,
    type: 'Order shipped',
    title: 'Shipment update for order #VHB-2048',
    description: 'Your order is now in transit and expected tomorrow.',
    time: '45 min ago',
    accent: 'from-emerald-500 to-green-600',
    icon: PackageCheck,
    unread: false,
  },
  {
    id: 4,
    type: 'Message received',
    title: 'New message from Aster Manufacturing',
    description: 'Vendor confirmed revised delivery schedule for the current order.',
    time: '1 hr ago',
    accent: 'from-amber-500 to-orange-600',
    icon: MessageSquareText,
    unread: false,
  },
  {
    id: 5,
    type: 'Contract expiring',
    title: 'Contract with Meridian Parts expires in 7 days',
    description: 'Renewal review is recommended to avoid service disruption.',
    time: '3 hrs ago',
    accent: 'from-rose-500 to-red-600',
    icon: ShieldAlert,
    unread: false,
  },
  {
    id: 6,
    type: 'Payment reminder',
    title: 'Invoice payment due this week',
    description: 'Payment for invoice INV-8824 is due on Friday.',
    time: '5 hrs ago',
    accent: 'from-slate-500 to-slate-700',
    icon: Clock3,
    unread: false,
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  function addNotification(payload) {
    const id = Date.now();
    const item = {
      id,
      time: payload.time ?? 'just now',
      unread: true,
      ...payload,
    };
    setNotifications((prev) => [item, ...prev]);
    return id;
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function markRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllRead, markRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

export default NotificationContext;

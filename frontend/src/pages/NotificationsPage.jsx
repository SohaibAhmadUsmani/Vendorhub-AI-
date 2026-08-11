import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  ChevronRight,
  Clock3,
  FileText,
  Mail,
  MessageSquareText,
  ShoppingCart,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

const TYPE_STYLES = {
  rfq: { icon: FileText, tint: 'bg-[#EDE9FE] text-[#6D28D9]' },
  order: { icon: ShoppingCart, tint: 'bg-[#E0F2FE] text-[#0F766E]' },
  message: { icon: Mail, tint: 'bg-[#DCFCE7] text-[#15803D]' },
  system: { icon: Sparkles, tint: 'bg-[#FDE68A] text-[#B45309]' },
};

function timeLabel(value) {
  if (!value) return 'just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    error,
    unreadCount,
    markAllRead,
    markRead,
    deleteNotification,
    refreshNotifications,
  } = useNotifications();
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!notifications.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !notifications.some((item) => item.id === selectedId)) {
      const firstUnread = notifications.find((item) => item.unread);
      setSelectedId(firstUnread?.id ?? notifications[0].id);
    }
  }, [notifications, selectedId]);

  const selectedNotification = useMemo(
    () => notifications.find((item) => item.id === selectedId) ?? null,
    [notifications, selectedId],
  );

  const handleOpen = async (item) => {
    if (item?.unread) {
      await markRead(item.id);
    }
    navigate(item?.link ?? '/buyer/notifications');
  };

  const handleMarkAsRead = async (item) => {
    if (!item) return;
    await markRead(item.id);
  };

  const handleDelete = async (item) => {
    if (!item) return;
    await deleteNotification(item.id);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
      <section className="card-surface relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(108,99,255,0.16),_transparent_42%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-card)] bg-[var(--bg-main)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
              <Bell className="h-3.5 w-3.5 text-[var(--primary-purple)]" />
              Live inbox
            </div>
            <div>
              <h1 className="font-heading text-3xl font-semibold leading-tight text-[var(--text-primary)] sm:text-4xl">
                Notifications
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
                Track RFQs, system updates, and buyer activity in one place with the same feel as the rest of the dashboard.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">{unreadCount}</span> unread
              <span className="mx-2 text-[var(--text-muted)]">•</span>
              <span className="font-semibold text-[var(--text-primary)]">{notifications.length}</span> total
            </div>
            <button
              type="button"
              onClick={() => markAllRead()}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] px-4 py-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--primary-purple)] hover:text-[var(--primary-purple)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          </div>
        </div>
      </section>

      <div className="grid min-h-[720px] gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="dash-card flex min-h-[560px] flex-col overflow-hidden p-0">
          <div className="border-b border-[var(--border-card)] bg-[var(--bg-main)]/70 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">Inbox</p>
                <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                  {notifications.length} items • {unreadCount} unread
                </p>
              </div>
              <div className="rounded-full bg-[var(--primary-purple-light)] px-3.5 py-1.5 text-xs font-semibold text-[var(--primary-purple)]">
                {unreadCount > 0 ? `${unreadCount} new` : 'All caught up'}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {loading && (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-2xl border border-[var(--border-card)] bg-[var(--bg-main)]" />
                ))}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                We couldn't load notifications right now.
                <button type="button" onClick={refreshNotifications} className="ml-2 font-semibold underline">
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && notifications.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[var(--border-card)] bg-[var(--bg-main)]/60 p-8 text-center text-sm text-[var(--text-muted)]">
                No notifications yet.
              </div>
            )}

            {!loading && !error && notifications.length > 0 && (
              <div className="space-y-3">
                {notifications.map((item) => {
                  const style = TYPE_STYLES[item.type] ?? TYPE_STYLES.system;
                  const Icon = style.icon;
                  const active = item.id === selectedId;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={`flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition ${
                        active
                          ? 'border-[var(--primary-purple)] bg-[var(--primary-purple-light)]/30 shadow-md'
                          : 'border-[var(--border-card)] bg-[var(--bg-card)] shadow-sm hover:border-[var(--primary-purple)]/40 hover:shadow-md'
                      }`}
                    >
                      <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${style.tint}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span
                            className={`truncate text-[13px] ${
                              item.unread ? 'font-semibold text-[var(--text-primary)]' : 'font-medium text-[var(--text-secondary)]'
                            }`}
                          >
                            {item.title}
                          </span>
                          {item.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--primary-purple)]" />}
                        </span>
                        <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-[var(--text-muted)]">{item.message}</p>
                        <div className="mt-2.5 flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                          <span>{timeLabel(item.time)}</span>
                          {item.unread && <span className="text-[var(--primary-purple)]">new</span>}
                        </div>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        <section className="dash-card flex min-h-[560px] flex-col overflow-hidden">
          {selectedNotification ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-card)] bg-[linear-gradient(135deg,_rgba(108,99,255,0.06),_transparent)] px-6 py-6 sm:px-8">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                      TYPE_STYLES[selectedNotification.type]?.tint ?? TYPE_STYLES.system.tint
                    }`}
                  >
                    {(() => {
                      const Icon = TYPE_STYLES[selectedNotification.type]?.icon ?? Sparkles;
                      return <Icon className="h-6 w-6" />;
                    })()}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-[var(--text-primary)]">{selectedNotification.title}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      {selectedNotification.type}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(selectedNotification)}
                    disabled={!selectedNotification.unread}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] px-3.5 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--primary-purple)] hover:text-[var(--primary-purple)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <CheckCheck className="h-4 w-4" />
                    Mark read
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedNotification)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col bg-[var(--bg-card)] p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  <Clock3 className="h-3.5 w-3.5" />
                  {timeLabel(selectedNotification.time)}
                </div>

                <div className="mt-5 rounded-[24px] border border-[var(--border-card)] bg-[var(--bg-main)]/70 p-5 sm:p-6">
                  <h2 className="text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
                    {selectedNotification.title}
                  </h2>
                  <p className="mt-4 text-[15px] leading-8 text-[var(--text-secondary)]">
                    {selectedNotification.message}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleOpen(selectedNotification)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary-purple)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    <MessageSquareText className="h-4 w-4" />
                    Open related page
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedNotification)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] px-5 py-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-red-200 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete notification
                  </button>
                </div>

                <div className="mt-8 flex-1 rounded-[24px] border border-dashed border-[var(--border-card)] bg-[var(--bg-main)]/50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-[var(--primary-purple-light)] p-2 text-[var(--primary-purple)]">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">Next step</p>
                      <p className="text-sm leading-7 text-[var(--text-secondary)]">
                        Open the related page to continue the workflow or review the full context.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-10 text-center text-sm text-[var(--text-muted)]">
              Pick a notification to read it here.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
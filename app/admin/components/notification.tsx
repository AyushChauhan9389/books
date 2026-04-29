"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Notification = {
  id: string;
  type: "success" | "error";
  message: string;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (type: "success" | "error", message: string) => void;
  removeNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export function useNotification() {
  return useContext(NotificationContext);
}

let notificationCounter = 0;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addNotification = useCallback(
    (type: "success" | "error", message: string) => {
      const id = `notification-${Date.now()}-${++notificationCounter}`;
      const notification: Notification = { id, type, message };
      setNotifications((prev) => [...prev, notification]);

      const timer = setTimeout(() => {
        removeNotification(id);
      }, 5000);
      timersRef.current.set(id, timer);
    },
    [removeNotification],
  );

  // Clean up all timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of Array.from(timers.values())) {
        clearTimeout(timer);
      }
      timers.clear();
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}

      {/* Toast notification container — top-right, stacked vertically */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Notifications"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 400,
          pointerEvents: "none",
        }}
      >
        {notifications.map((notification) => (
          <div
            key={notification.id}
            role="alert"
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "12px 16px",
              borderRadius: 4,
              background: "#2a1810",
              borderLeft: `4px solid ${
                notification.type === "success" ? "#c9a86a" : "#8b2020"
              }`,
              color: notification.type === "success" ? "#f5e9cf" : "#ff9999",
              fontFamily: "var(--font-work-sans), sans-serif",
              fontSize: 14,
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Icon */}
            <span
              style={{
                flexShrink: 0,
                fontSize: 16,
                lineHeight: "20px",
              }}
              aria-hidden="true"
            >
              {notification.type === "success" ? "✓" : "✕"}
            </span>

            {/* Message */}
            <span
              style={{
                flex: 1,
                lineHeight: "20px",
                wordBreak: "break-word",
              }}
            >
              {notification.message}
            </span>

            {/* Close button */}
            <button
              type="button"
              onClick={() => removeNotification(notification.id)}
              aria-label="Dismiss notification"
              style={{
                flexShrink: 0,
                background: "none",
                border: "none",
                color: notification.type === "success" ? "#c9a86a" : "#ff9999",
                cursor: "pointer",
                padding: 2,
                fontSize: 14,
                lineHeight: "20px",
                opacity: 0.7,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.7";
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

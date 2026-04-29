"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

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
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) { clearTimeout(timer); timersRef.current.delete(id); }
  }, []);

  const addNotification = useCallback((type: "success" | "error", message: string) => {
    const id = `notification-${Date.now()}-${++notificationCounter}`;
    setNotifications((prev) => [...prev, { id, type, message }]);
    const timer = setTimeout(() => removeNotification(id), 4000);
    timersRef.current.set(id, timer);
  }, [removeNotification]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => { for (const timer of Array.from(timers.values())) clearTimeout(timer); timers.clear(); };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}

      {/* Toast container */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Notifications"
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          display: "flex", flexDirection: "column-reverse", gap: 8, maxWidth: 380, pointerEvents: "none",
        }}
      >
        {notifications.map((n) => (
          <div
            key={n.id}
            role="alert"
            style={{
              pointerEvents: "auto",
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 16px", borderRadius: 8,
              background: "#1a0f0a",
              border: `1px solid ${n.type === "success" ? "rgba(201,168,106,0.25)" : "rgba(139,32,32,0.35)"}`,
              color: n.type === "success" ? "#f5e9cf" : "#ff9999",
              fontFamily: "var(--font-work-sans), sans-serif", fontSize: 13,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              animation: "slideInRight 0.25s ease-out",
            }}
          >
            {/* Icon */}
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: n.type === "success" ? "rgba(201,168,106,0.12)" : "rgba(139,32,32,0.2)",
                fontSize: 11,
              }}
            >
              {n.type === "success" ? "✓" : "✕"}
            </div>

            <span style={{ flex: 1, lineHeight: "18px", wordBreak: "break-word" }}>{n.message}</span>

            <button
              type="button"
              onClick={() => removeNotification(n.id)}
              aria-label="Dismiss notification"
              style={{
                flexShrink: 0, background: "none", border: "none",
                color: "rgba(245,233,207,0.3)", cursor: "pointer", padding: 2, fontSize: 12,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(245,233,207,0.7)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(245,233,207,0.3)"; }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

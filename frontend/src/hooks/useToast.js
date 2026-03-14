import { useState, useCallback, useRef, useEffect } from "react";

export function useToast(duration = 4500) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);
  const timerIds = useRef([]);

  // Clean up all pending timers when the component using this hook unmounts
  useEffect(() => {
    return () => timerIds.current.forEach(clearTimeout);
  }, []);

  const toast = useCallback((message, type = "info") => {
    const id = ++counter.current;
    setToasts(t => [...t, { id, message, type }]);
    const timer = setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
    timerIds.current.push(timer);
  }, [duration]);

  const dismiss = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}

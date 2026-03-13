/** hooks/useToast.js */
import { useState, useCallback, useRef } from "react";

export function useToast(duration = 4500) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const toast = useCallback((message, type = "info") => {
    const id = ++counter.current;
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  }, [duration]);

  const dismiss = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}

"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut, signInWithCustomToken } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import { hasEditorAccess } from "@/lib/cms/constants";

const AuthContext = createContext(null);

async function restoreFirebaseFromSession(auth) {
  const res = await fetch("/api/admin/session", { credentials: "same-origin" });
  if (!res.ok) return false;
  const { customToken } = await res.json();
  if (!customToken) return false;
  await signInWithCustomToken(auth, customToken);
  return true;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const restoreAttempted = useRef(false);

  useEffect(() => {
    const auth = getClientAuth();
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    async function applyUser(firebaseUser) {
      if (cancelled) return;
      const tokenResult = await firebaseUser.getIdTokenResult();
      const userRole = tokenResult.claims.role || null;

      if (!hasEditorAccess(userRole)) {
        await signOut(auth);
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);
      setRole(userRole);
      setLoading(false);
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (cancelled) return;

      if (firebaseUser) {
        try {
          await applyUser(firebaseUser);
        } catch {
          if (!cancelled) {
            setUser(null);
            setRole(null);
            setLoading(false);
          }
        }
        return;
      }

      if (!restoreAttempted.current) {
        restoreAttempted.current = true;
        try {
          const restored = await restoreFirebaseFromSession(auth);
          if (restored) return;
        } catch {
          // Session restore failed — middleware will handle re-auth if needed.
        }
      }

      if (!cancelled) {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

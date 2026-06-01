/**
 * PasswordGate — simple passphrase protection for the dashboard.
 * The passphrase is stored in localStorage after a successful entry.
 * Default passphrase: "exactaudience2026"
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const PASSPHRASE = "exactaudience2026";
const STORAGE_KEY = "ea_dashboard_auth";

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [, navigate] = useLocation();
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === PASSPHRASE) {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim().toLowerCase() === PASSPHRASE.toLowerCase()) {
      localStorage.setItem(STORAGE_KEY, PASSPHRASE);
      setAuthenticated(true);
      setError(false);
      navigate("/campaigns");
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setInput("");
    }
  }

  if (checking) return null;
  if (authenticated) return <>{children}</>;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #07071a 0%, #1a0840 50%, #07071a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      padding: "24px",
    }}>
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .gate-card { animation: fadeIn 0.5s ease-out; }
        .gate-input:focus { outline: none; border-color: #a855f7 !important; box-shadow: 0 0 0 3px rgba(168,85,247,0.2); }
        .gate-btn:hover { background: #9333ea !important; }
        .gate-btn:active { transform: scale(0.97); }
      `}</style>

      <div className="gate-card" style={{
        background: "rgba(15,15,46,0.95)",
        border: "1px solid #252560",
        borderRadius: 20,
        padding: "48px 40px",
        width: "100%",
        maxWidth: 420,
        textAlign: "center",
        backdropFilter: "blur(12px)",
      }}>
        {/* EA Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
          <img
            src="/ea-logo.png"
            alt="Exact Audience"
            style={{ height: 36, maxWidth: 220, objectFit: "contain", objectPosition: "center", filter: "brightness(1.1)" }}
          />
        </div>

        <div style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>
          Campaign Intelligence
        </div>
        <div style={{ fontSize: 13, color: "#8892b0", marginBottom: 36, lineHeight: 1.5 }}>
          Enter your access passphrase to view<br />the Exact Audience campaign intelligence platform.
        </div>

        <form onSubmit={handleSubmit} style={{ animation: shake ? "shake 0.6s ease" : "none" }}>
          <input
            className="gate-input"
            type="password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            placeholder="Enter passphrase"
            autoFocus
            style={{
              width: "100%",
              background: "#12123a",
              border: `1px solid ${error ? "#f59e0b" : "#252560"}`,
              borderRadius: 10,
              padding: "14px 18px",
              color: "#f1f5f9",
              fontSize: 15,
              marginBottom: 12,
              transition: "border-color 0.2s, box-shadow 0.2s",
              boxSizing: "border-box",
            }}
          />
          {error && (
            <div style={{ fontSize: 12, color: "#f59e0b", marginBottom: 12, textAlign: "left" }}>
              Incorrect passphrase. Please try again.
            </div>
          )}
          <button
            className="gate-btn"
            type="submit"
            style={{
              width: "100%",
              background: "#7c3aed",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              padding: "14px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.04em",
              transition: "background 0.2s, transform 0.1s",
            }}
          >
            Access Dashboard
          </button>
        </form>

        <div style={{ marginTop: 28, fontSize: 11, color: "#4a5568" }}>
          exactaudience.ai · siteid.ai
        </div>
      </div>
    </div>
  );
}

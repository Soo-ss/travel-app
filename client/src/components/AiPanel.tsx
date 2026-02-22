import { useState } from "react";

interface Props {
  onSubmit: (message: string) => void;
}

export default function AiPanel({ onSubmit }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;

    setLoading(true);
    await onSubmit(input);
    setLoading(false);
  };

  return (
    <div style={panelStyle}>
      <h3>AI Travel Planner</h3>

      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. Create a 1-day route in Seoul"
      />

      <button onClick={send} disabled={loading}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  position: "absolute",
  top: 20,
  left: 20,
  width: 300,
  padding: 12,
  background: "#111",
  color: "#fff",
  borderRadius: 8,
  zIndex: 10,
};

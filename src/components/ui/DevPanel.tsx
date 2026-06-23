import React, { useState } from "react";

interface DevPanelProps {
  currentScene: string;
  setScene: (scene: any) => void;
  levelIdx: number;
  setLevelIdx: (idx: number) => void;
  setActivePowerups: (powerups: any) => void;
  setCollected: (count: number) => void;
  setTotalMail: (count: number) => void;
}

export default function DevPanel({
  currentScene,
  setScene,
  levelIdx,
  setLevelIdx,
  setActivePowerups,
  setCollected,
  setTotalMail,
}: DevPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAccess = () => {
    if (isAuthenticated) {
      setIsOpen(!isOpen);
      return;
    }

    const password = prompt("ENTER DEVELOPER PASSPHRASE:");
    if (password === "mayaiscool") {
      setIsAuthenticated(true);
      setIsOpen(true);
    } else if (password !== null) {
      alert("ACCESS DENIED.");
    }
  };

  const warpToLevel = (idx: number) => {
    setLevelIdx(idx);
    // Simulating loading the level parameters instantly
    setCollected(0);
    setTotalMail(20); // Dummy fallback value for safety
    setScene("playing");
    // Trigger a temporary keyboard event to force reload the internal state maps
    const event = new KeyboardEvent("keydown", { key: "r" });
    window.dispatchEvent(event);
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleAccess}
        style={{
          position: "fixed",
          top: "8px",
          right: "8px",
          zIndex: 9999,
          background: "rgba(36, 24, 72, 0.4)",
          border: "1px solid #5028a0",
          color: "#a8ff80",
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "8px",
          padding: "4px 6px",
          cursor: "pointer",
          imageRendering: "pixelated",
        }}
        title="Dev Mode Portal"
      >
        {isAuthenticated ? "[DEV]" : "•"}
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "36px",
        right: "8px",
        zIndex: 9999,
        width: "220px",
        background: "#0a0612",
        border: "3px solid #5028a0",
        boxShadow: "4px 4px 0px #03020a",
        color: "#fff4ff",
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "8px",
        padding: "10px",
        imageRendering: "pixelated",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", borderBottom: "1px solid #5028a0", paddingBottom: "4px" }}>
        <span style={{ color: "#a8ff80" }}>DEV PORTAL</span>
        <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "#ff4848", cursor: "pointer", fontSize: "8px" }}>[X]</button>
      </div>

      <div style={{ marginBottom: "6px" }}>
        CURRENT: <span style={{ color: "#ffe040" }}>{currentScene.toUpperCase()}</span>
      </div>

      {/* === WARP TO STORY LEVELS === */}
      <div style={{ margin: "8px 0 4px", color: "#80d8ff" }}>— WARP STAGES —</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px", marginBottom: "8px" }}>
        {Array.from({ length: 10 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => warpToLevel(idx)}
            style={{
              background: levelIdx === idx && currentScene === "playing" ? "#a8ff80" : "#241848",
              color: levelIdx === idx && currentScene === "playing" ? "#0a0612" : "#fff",
              border: "1px solid #5028a0",
              fontSize: "8px",
              padding: "3px 0",
              cursor: "pointer",
            }}
          >
            L{idx + 1}
          </button>
        ))}
      </div>

      {/* === MINIGAMES & SPECIAL SCENES === */}
      <div style={{ margin: "6px 0 4px", color: "#80d8ff" }}>— SCENE INJECTORS —</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <button
          onClick={() => { setScene("home"); }}
          style={{ background: "#241848", color: "#fff", border: "1px solid #5028a0", padding: "4px", fontSize: "7px", cursor: "pointer", textAlign: "left" }}
        >
          • GO TO WORLD ROAD MAP
        </button>
        <button
          onClick={() => {
            // Force sets parameters to simulate index level clear behavior
            setLevelIdx(9);
            setScene("levelComplete");
          }}
          style={{ background: "#241848", color: "#fff", border: "1px solid #5028a0", padding: "4px", fontSize: "7px", cursor: "pointer", textAlign: "left" }}
        >
          • VOID GAUNTLET CLEAR INTERCEPT
        </button>
        <button
          onClick={() => {
            // Initializes custom sorting parameters
            const seq = ["R", "G", "B", "G", "R", "B"];
            const mockContainer = { type: "sort", seq, idx: 0, score: 0, timer: 300, lastFeedback: 0, feedbackOk: false };
            // Finds the component ref context path to inject dynamically
            const target: any = document.querySelector("canvas");
            if (target) setScene("minigame");
          }}
          style={{ background: "#241848", color: "#fff", border: "1px solid #5028a0", padding: "4px", fontSize: "7px", cursor: "pointer", textAlign: "left" }}
        >
          • FORCE SORT MINIGAME
        </button>
        <button
          onClick={() => { setScene("earthCozy"); }}
          style={{ background: "#241848", color: "#fff", border: "1px solid #5028a0", padding: "4px", fontSize: "7px", cursor: "pointer", textAlign: "left" }}
        >
          • LAUNCH EARTH COZY WORLD
        </button>
      </div>

      {/* === POWERUP CHEATS === */}
      <div style={{ margin: "8px 0 4px", color: "#80d8ff" }}>— CHEAT UTILITIES —</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
        <button
          onClick={() => setActivePowerups(["doubleJump", "speed", "shield", "magnet"])}
          style={{ background: "#1a3a28", color: "#a8ff80", border: "1px solid #3a8848", padding: "4px", fontSize: "7px", cursor: "pointer" }}
        >
          ALL BUFFS
        </button>
        <button
          onClick={() => setActivePowerups([])}
          style={{ background: "#3a1818", color: "#ff4848", border: "1px solid #b04030", padding: "4px", fontSize: "7px", cursor: "pointer" }}
        >
          STRIP BUFFS
        </button>
      </div>
    </div>
  );
}
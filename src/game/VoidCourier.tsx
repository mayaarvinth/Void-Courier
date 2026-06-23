import { useEffect, useRef, useState, useCallback } from "react";
import courierAsset from "@/assets/courier.png";
// CHANGED: import the new repeating void background image so we can paint it behind the gameplay.
import bgAsset from "@/assets/the-void-background.png";


// ============================================================
// VOID COURIER
// ============================================================

const VW = 256;
const VH = 192;
const FRAME_PADDING = 24;

const C = {
  void: "#0a0820",
  voidDeep: "#03020a",
  voidGlow: "#241848",
  voidEdge: "#5028a0",
  star: "#fff4ff",
  outline: "#0a0612",
  ground: "#6a4030",
  groundTop: "#b07848",
  brick: "#c87048",
  brickShade: "#7a3a20",
  uniform: "#3a7adc",
  cap: "#1a2a8a",
  satchel: "#a86028",
  mailWhite: "#fff8d8",
  mailShade: "#d8b888",
  mailStamp: "#ff4848",
  house: "#f0a868",
  houseRoof: "#b04030",
  houseDoor: "#5a2818",
  houseWindow: "#b8e8ff",
  sign: "#8a5a2a",
  signFace: "#f0d8a0",
  signText: "#2a1a08",
  earth: "#4a90f0",
  earthLand: "#48c858",
  crt: "#a8ff80",
  mail: "#ffe040",
  spike: "#e8e8f8",
  spikeShade: "#7878a0",
  hudFg: "#fff4ff",
  pathOff: "#3a2858",
  pathOn: "#a8ff80",
  shield: "#80d8ff",
  speed: "#ffd040",
  magnet: "#ff80a0",
  djump: "#a880ff",
  roadStone: "#c8b890",
  roadStoneEdge: "#7a6a48",
  roadGrass: "#1a3a28",
  grass: "#3a8848",
  grassDark: "#2a6838",
  npcCloak: "#7a4818",
  npcBeard: "#e8e8e8",
} as const;

type Tile = " " | "#" | "M" | "S" | "H";
const TS = 16;

function makeLevel(layout: string[]): Tile[][] {
  return layout.map((row) => row.split("") as Tile[]);
}

const LEVELS: Tile[][][] = [
  makeLevel([
    "                                                            ",
    "                                                            ",
    "                                                            ",
    "                  M                                         ",
    "                                                            ",
    "                              M       M                     ",
    "         M             ###                                  ",
    "                                            M               ",
    "      ####       ##              ####             ###       ",
    "                                                          H ",
    "############     ######     ##########     ###########   ###",
    "############     ######     ##########     ###########   ###",
  ]),
  makeLevel([
    "                                                            ",
    "                                                            ",
    "                M                          M                ",
    "                                                            ",
    "             ####                       ####                ",
    "                          M                                 ",
    "    M                  #####                      M         ",
    "                                                            ",
    "  ###       ##                  ##        ###          ###  ",
    "                                                          H ",
    "######  S  ######  S  ######  S  ######  S  ######      ####",
    "############################################################",
  ]),
  makeLevel([
    "                                                                        ",
    "                              M                                         ",
    "          M                                  M                          ",
    "                       ####                                             ",
    "                                       M           M                    ",
    "       ####                                                 ###         ",
    "                  M             ###          ###                 M      ",
    "  M                                                                     ",
    " ###      ##  S  ###   S   ##  S  ###   S  ##    S    ##           ## H ",
    "                                                                      # ",
    "###  SS  ###  SS  ###  SS  ###  SS  ###  SS  ###  SS  ###  SS  ##  #####",
    "########################################################################",
  ]),
  makeLevel([
    "                                                                                    ",
    "                M                          M                       M                ",
    "             ###                        ####                    ####                ",
    "                                                                                    ",
    "       M                M                                M                          ",
    "    ####             ####       ####                 ####           ####            ",
    "                                                                                    ",
    "  ##           ##              ##         ##              ##              ##        ",
    "                                                                                  H ",
    "    SS   ##  S  ##  S  ##  SS  ##  S  ##  SS  ##  S  ##  SS  ##  S  ##  SS  ##  ####",
    "##  SSS  ##  S  ##  S  ##  SSS ##  S  ##  SSS ##  S  ##  SSS ##  S  ##  SSS ##  ####",
    "################################################################................####",
  ]),
  makeLevel([
    "                                                                                                ",
    "                                                                                                ",
    "          M                  M                  M                  M                 M          ",
    "       ####               ####              #####                ####             ####          ",
    "                                                                                                ",
    "                M                   M                   M                   M                   ",
    "             ###                 ###                 ###                 ###                    ",
    "                                                                                                ",
    "  M                                                                                             ",
    "####     ####       ####       ####       ####       ####       ####       ####         ####  H",
    "                                                                                            ####",
    "                                                                                                ",
  ]),
  makeLevel([
    "                                                                                                            ",
    "                M           M           M           M           M           M           M           M       ",
    "             ###         ####        ####        ####        ####        ####        ####        ####      ",
    "                                                                                                            ",
    "        M                   M                   M                   M                   M           M       ",
    "     ####                ####                ####                ####                ####        ####       ",
    "                                                                                                            ",
    "  ##       ##       ##       ##       ##       ##       ##       ##       ##       ##       ##       ##    ",
    "                                                                                                          H ",
    "  SS   S   SS   S   SS   S   SS   S   SS   S   SS   S   SS   S   SS   S   SS   S   SS   S   SS   S   ##### ",
    "  SSS  SS  SSS  SS  SSS  SS  SSS  SS  SSS  SS  SSS  SS  SSS  SS  SSS  SS  SSS  SS  SSS  SS  SSS  SS  ##### ",
    "############################################################################################################",
  ]),
  // L7 — staircase to the sky
  makeLevel([
    "                                                                          M                 ",
    "                                                                       ####                 ",
    "                                                                  M                         ",
    "                                                               ####                         ",
    "                          M                              M                                  ",
    "                       ####                           ####                                  ",
    "             M                              M                                               ",
    "          ####                           ####                                              H",
    "    M                                                                                     ##",
    " ####    S    ####    SS    ####    S    ####    SS    ####    S    ####    SS    ####  ###",
    "###############     ###################      #######################      ##################",
    "############################################################################################",
  ]),
  // L8 — long gaps + magnet bait
  makeLevel([
    "                                                                                                          ",
    "                M                M                M                M                M                M    ",
    "                                                                                                          ",
    "             ###              ###              ###              ###              ###              ###    ",
    "        M                M                M                M                M                M           ",
    "                                                                                                          ",
    "    ####        ####        ####        ####        ####        ####        ####        ####        ####",
    "                                                                                                          ",
    "                                                                                                       H  ",
    "                                                                                                     ###  ",
    "####  SS  ####  SS  ####  SS  ####  SS  ####  SS  ####  SS  ####  SS  ####  SS  ####  SS  ####  SS  ####",
    "##########################################################################################################",
  ]),
  // L9 — vertical climb with spike forest below
  makeLevel([
    "                                                                                                              ",
    "                                                                                                M             ",
    "                                                                                             ####             ",
    "                                                                                M                             ",
    "                                                                             ####                             ",
    "                                                              M                                               ",
    "                                                           ####                                               ",
    "                M           M           M           M                                                       H ",
    "             ####        ####        ####        ####                                                     ####",
    "                                                                                                              ",
    "  SS   SS   SS   SS   SS   SS   SS   SS   SS   SS   SS   SS   SS   SS   SS   SS   SS   SS   SS   SS   SS  ###",
    "##############################################################################################################",
  ]),
  // L10 — gauntlet finale
  makeLevel([
    "                                                                                                                        ",
    "                M           M           M           M           M           M           M           M           M       ",
    "             ####        ####        ####        ####        ####        ####        ####        ####        ####      ",
    "                                                                                                                        ",
    "        M           M           M           M           M           M           M           M           M           M   ",
    "     ####        ####        ####        ####        ####        ####        ####        ####        ####        ####  ",
    "                                                                                                                        ",
    "  ##     ##     ##     ##     ##     ##     ##     ##     ##     ##     ##     ##     ##     ##     ##     ##     ##   ",
    "                                                                                                                      H ",
    "  SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S ####",
    "  SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S SSS S ####",
    "############################################################################################################################",
  ]),
];

const TOTAL_LEVELS = LEVELS.length;

// Endless procedural
function generateEndlessChunk(seed: number, length: number): Tile[][] {
  const LH = 12;
  const rows: Tile[][] = Array.from({ length: LH }, () => Array(length).fill(" ") as Tile[]);
  for (let c = 0; c < length; c++) rows[LH - 1][c] = "#";
  let x = 2;
  let rng = seed;
  const rand = () => { rng = (rng * 9301 + 49297) % 233280; return rng / 233280; };
  while (x < length - 6) {
    const r = rand();
    if (r < 0.35) {
      const w = 2 + Math.floor(rand() * 4);
      const h = 7 + Math.floor(rand() * 2);
      for (let i = 0; i < w; i++) if (x + i < length) rows[h][x + i] = "#";
      if (rand() < 0.7) rows[h - 1][x + Math.floor(w / 2)] = "M";
      x += w + 1 + Math.floor(rand() * 3);
    } else if (r < 0.6) {
      const w = 1 + Math.floor(rand() * 2);
      for (let i = 0; i < w; i++) if (x + i < length) rows[LH - 2][x + i] = "S";
      x += w + 2;
    } else if (r < 0.8) {
      const gap = 2 + Math.floor(rand() * 3);
      for (let i = 0; i < gap; i++) if (x + i < length) rows[LH - 1][x + i] = " ";
      x += gap + 1;
    } else {
      rows[5 + Math.floor(rand() * 3)][x] = "M";
      x += 2;
    }
  }
  return rows;
}

// ---------- Road / world map ----------
const ROAD_P0 = { x: 16, y: VH - 22 };
const ROAD_P1 = { x: VW * 0.5, y: 30 };
const ROAD_P2 = { x: VW - 30, y: 60 };
function roadPos(t: number) {
  const u = 1 - t;
  return {
    x: u * u * ROAD_P0.x + 2 * u * t * ROAD_P1.x + t * t * ROAD_P2.x,
    y: u * u * ROAD_P0.y + 2 * u * t * ROAD_P1.y + t * t * ROAD_P2.y,
  };
}

// ---------- Cozy Earth ----------
const COZY_W = 256;
const COZY_H = VH;
const COZY_COLORS = [
  { key: "red", col: "#ff5868" },
  { key: "blue", col: "#5890ff" },
  { key: "green", col: "#58d878" },
  { key: "yellow", col: "#ffd048" },
];

interface CozyHouse { x: number; y: number; key: string; col: string; }
interface CozyScroll { x: number; y: number; key: string; col: string; taken: boolean; delivered: boolean; bob: number; }

function buildCozy() {
  const houses: CozyHouse[] = [];
  const positions = [
    { x: 40, y: 34 }, { x: 200, y: 34 }, { x: 40, y: 150 }, { x: 200, y: 150 },
  ];
  const shuffled = [...COZY_COLORS].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 4; i++) houses.push({ ...positions[i], ...shuffled[i] });
  const scrolls: CozyScroll[] = COZY_COLORS.map((c) => ({
    x: 60 + Math.random() * (COZY_W - 120),
    y: 56 + Math.random() * (COZY_H - 112),
    key: c.key, col: c.col, taken: false, delivered: false, bob: Math.random() * Math.PI * 2,
  }));
  return { houses, scrolls };
}

// ---------- Game ----------
type Scene =
  | "intro"
  | "falling"
  | "briefing"
  | "home"
  | "playing"
  | "levelComplete"
  | "levelFailed"
  | "minigame"
  | "minigameResult"
  | "homeArrival"
  | "homeFinale"
  | "earthCozy"
  | "earthCozyDone"
  | "dead"
  | "endlessDead";

type Mode = "story" | "endless";
type Powerup = "doubleJump" | "speed" | "shield" | "magnet";
type MinigameType = "sort" | "catch";

interface Player {
  x: number; y: number; vx: number; vy: number;
  onGround: boolean; facing: 1 | -1; runFrame: number; jumpsLeft: number;
}
interface Mail { x: number; y: number; collected: boolean; bob: number; }

const POWERUP_NAMES: Record<Powerup, string> = {
  doubleJump: "DOUBLE JUMP", speed: "SPEED BOOST", shield: "SHIELD", magnet: "MAIL MAGNET",
};
const POWERUP_COLORS: Record<Powerup, string> = {
  doubleJump: C.djump, speed: C.speed, shield: C.shield, magnet: C.magnet,
};

const MAIL_QUOTA = 0.7;

export default function VoidCourier() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<Scene>("intro");
  const [showSign, setShowSign] = useState(false);
  const [mode, setMode] = useState<Mode>("story");
  const [levelIdx, setLevelIdx] = useState(0);
  const [collected, setCollected] = useState(0);
  const [totalMail, setTotalMail] = useState(0);
  const [activePowerups, setActivePowerups] = useState<Powerup[]>([]);
  const [endlessScore, setEndlessScore] = useState(0);
  const [endlessBest, setEndlessBest] = useState(0);
  const [lastReward, setLastReward] = useState<Powerup | null>(null);

  const INTRO_SLIDES = [
    "LONG AGO, EARTH'S MAIL SHIP TORE OPEN OVER THE VOID...",
    "EVERY LETTER, EVERY PARCEL, EVERY LOST KEEPSAKE SPILLED INTO THE DARK.",
    "YOU ARE THE LAST COURIER LEFT STANDING.",
    "GATHER WHAT THE VOID STOLE.  CARRY IT HOME.",
  ];
  const [introSlide, setIntroSlide] = useState(0);
  const [introTyped, setIntroTyped] = useState(0);

  // Typewriter ticker effect
  useEffect(() => {
    if (scene !== "intro") return;
    const interval = setInterval(() => {
      setIntroTyped((prev) => {
        if (prev < INTRO_SLIDES[introSlide].length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [scene, introSlide]);

  const sceneRef = useRef<Scene>("intro"); sceneRef.current = scene;
  const levelRef = useRef(0); levelRef.current = levelIdx;
  const modeRef = useRef<Mode>("story"); modeRef.current = mode;
  const powerupsRef = useRef<Powerup[]>([]); powerupsRef.current = activePowerups;

  const playerRef = useRef<Player>({ x: 32, y: 0, vx: 0, vy: 0, onGround: false, facing: 1, runFrame: 0, jumpsLeft: 1 });
  const mailsRef = useRef<Mail[]>([]);
  const cameraRef = useRef(0);
  const voidEdgeRef = useRef(0);
  const keysRef = useRef<Record<string, boolean>>({});
  const starsRef = useRef<{ x: number; y: number; s: number }[]>([]);
  const fallYRef = useRef(-40);
  const tickRef = useRef(0);
  const jumpHeldRef = useRef(false);
  const endlessLevelRef = useRef<Tile[][]>([]);
  const endlessDistRef = useRef(0);
  const minigameRef = useRef<any>({});

  const arrivalTRef = useRef(0);
  const cozyRef = useRef<{ houses: CozyHouse[]; scrolls: CozyScroll[]; px: number; py: number; held: CozyScroll | null }>({
    houses: [], scrolls: [], px: COZY_W / 2, py: COZY_H / 2, held: null,
  });

  const buildMails = (lvl: Tile[][]): Mail[] => {
    const mails: Mail[] = [];
    for (let r = 0; r < lvl.length; r++) {
      for (let c = 0; c < lvl[r].length; c++) {
        if (lvl[r][c] === "M") mails.push({ x: c * TS + 4, y: r * TS + 5, collected: false, bob: Math.random() * Math.PI * 2 });
      }
    }
    return mails;
  };

  const loadStoryLevel = useCallback((idx: number) => {
    const lvl = LEVELS[idx];
    const mails = buildMails(lvl);
    mailsRef.current = mails;
    setTotalMail(mails.length);
    setCollected(0);
    playerRef.current = { x: 24, y: 0, vx: 0, vy: 0, onGround: false, facing: 1, runFrame: 0, jumpsLeft: 2 };
    cameraRef.current = 0;
    voidEdgeRef.current = -40;
  }, []);

  const loadEndlessLevel = useCallback(() => {
    const lvl = generateEndlessChunk(Date.now() & 0xffff, 200);
    endlessLevelRef.current = lvl;
    mailsRef.current = buildMails(lvl);
    setTotalMail(mailsRef.current.length);
    setCollected(0);
    playerRef.current = { x: 24, y: 0, vx: 0, vy: 0, onGround: false, facing: 1, runFrame: 0, jumpsLeft: 2 };
    cameraRef.current = 0;
    voidEdgeRef.current = -40;
    endlessDistRef.current = 0;
    setEndlessScore(0);
  }, []);

  useEffect(() => {
    starsRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * VW, y: Math.random() * VH, s: Math.random() < 0.2 ? 2 : 1,
    }));
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysRef.current[k] = true;
      if (["arrowleft", "arrowright", "arrowup", "arrowdown", " ", "a", "d", "w", "s"].includes(k)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysRef.current[k] = false;
      if (k === "arrowup" || k === "w" || k === " ") jumpHeldRef.current = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const c = canvasRef.current!;
    const fit = () => {
      const aw = Math.max(64, window.innerWidth - FRAME_PADDING);
      const ah = Math.max(64, window.innerHeight - FRAME_PADDING);
      const scale = Math.min(aw / VW, ah / VH);
      c.style.width = `${Math.floor(VW * scale)}px`;
      c.style.height = `${Math.floor(VH * scale)}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const getLvl = (): Tile[][] => (modeRef.current === "endless" ? endlessLevelRef.current : LEVELS[levelRef.current]);
  const tileAt = (lvl: Tile[][], tx: number, ty: number): Tile => {
    if (ty < 0 || ty >= lvl.length) return " ";
    if (tx < 0 || tx >= lvl[0].length) return " ";
    return lvl[ty][tx];
  };
  const solidAt = (lvl: Tile[][], px: number, py: number): boolean => {
    const tx = Math.floor(px / TS); const ty = Math.floor(py / TS);
    return tileAt(lvl, tx, ty) === "#";
  };

  const consumeShield = (): boolean => {
    if (powerupsRef.current.includes("shield")) {
      setActivePowerups((p) => p.filter((x) => x !== "shield"));
      return true;
    }
    return false;
  };

  // FIXED: Implementation of missing renderBriefing function
  const renderBriefing = (ctx: CanvasRenderingContext2D, t: number) => {
    ctx.fillStyle = "rgba(10,6,18,0.9)";
    ctx.fillRect(0, 0, VW, VH);
    drawCourier(ctx, VW / 2 - 8, VH / 2 + 10, 1, false, 1.2);
    ctx.fillStyle = C.signFace;
    ctx.fillRect(24, VH / 2 - 44, VW - 48, 44);
    ctx.strokeStyle = C.outline;
    ctx.lineWidth = 1;
    ctx.strokeRect(24, VH / 2 - 44, VW - 48, 44);
    drawTextPixel(ctx, "BRIEFING FROM HEADQUARTERS:", VW / 2, VH / 2 - 38, C.houseRoof, true, 1);
    drawTextPixel(ctx, "SECURE THE SATCHEL. AVOID VOID.", VW / 2, VH / 2 - 26, C.signText, true, 1);
    drawTextPixel(ctx, "PRESS SPACE TO START JOURNEY", VW / 2, VH / 2 - 12, C.crt, true, 1);
  };

  // Main loop
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = VW;
    canvas.height = VH;
    ctx.imageSmoothingEnabled = false;
    let raf = 0;

    const loop = () => {
      tickRef.current++;
      const t = tickRef.current;
      const s = sceneRef.current;

      // ===== UPDATE =====
      if (s === "falling") {
        fallYRef.current += 0.6;
        if (fallYRef.current > VH / 2 - 8) fallYRef.current = VH / 2 - 8;
      } else if (s === "homeArrival") {
        arrivalTRef.current = Math.min(1, arrivalTRef.current + 0.005);
        if (arrivalTRef.current >= 1) setScene("homeFinale");
      } else if (s === "playing") {
        const lvl = getLvl();
        const p = playerRef.current;
        const k = keysRef.current;
        const pu = powerupsRef.current;

        let ax = 0;
        if (k["arrowleft"] || k["a"]) { ax = -1; p.facing = -1; }
        if (k["arrowright"] || k["d"]) { ax = 1; p.facing = 1; }
        const speedMult = pu.includes("speed") ? 1.5 : 1;
        p.vx = ax * 1.4 * speedMult;
        if (ax !== 0) p.runFrame += 0.2;

        const jumpPressed = (k["arrowup"] || k["w"] || k[" "]) && !jumpHeldRef.current;
        if (jumpPressed) {
          jumpHeldRef.current = true;
          const maxJumps = pu.includes("doubleJump") ? 2 : 1;
          if (p.onGround) { p.vy = -4.2; p.onGround = false; p.jumpsLeft = maxJumps - 1; }
          else if (p.jumpsLeft > 0) { p.vy = -3.8; p.jumpsLeft--; }
        }

        p.vy += 0.22;
        if (p.vy > 6) p.vy = 6;

        p.x += p.vx;
        const pw = 8, ph = 14;
        if (p.vx > 0) {
          if (solidAt(lvl, p.x + pw, p.y) || solidAt(lvl, p.x + pw, p.y + ph - 1))
            p.x = Math.floor((p.x + pw) / TS) * TS - pw - 0.01;
        } else if (p.vx < 0) {
          if (solidAt(lvl, p.x, p.y) || solidAt(lvl, p.x, p.y + ph - 1))
            p.x = (Math.floor(p.x / TS) + 1) * TS + 0.01;
        }
        p.y += p.vy;
        const wasGround = p.onGround;
        p.onGround = false;
        if (p.vy > 0) {
          if (solidAt(lvl, p.x + 1, p.y + ph) || solidAt(lvl, p.x + pw - 1, p.y + ph)) {
            p.y = Math.floor((p.y + ph) / TS) * TS - ph - 0.01;
            p.vy = 0; p.onGround = true;
            const maxJumps = pu.includes("doubleJump") ? 2 : 1;
            p.jumpsLeft = maxJumps - 1;
          }
        } else if (p.vy < 0) {
          if (solidAt(lvl, p.x + 1, p.y) || solidAt(lvl, p.x + pw - 1, p.y)) {
            p.y = (Math.floor(p.y / TS) + 1) * TS + 0.01; p.vy = 0;
          }
        }
        if (!wasGround && p.onGround) {
          const maxJumps = pu.includes("doubleJump") ? 2 : 1;
          p.jumpsLeft = maxJumps - 1;
        }

        const target = p.x - VW / 3;
        cameraRef.current += (target - cameraRef.current) * 0.1;
        if (cameraRef.current < 0) cameraRef.current = 0;
        const maxCam = lvl[0].length * TS - VW;
        if (cameraRef.current > maxCam) cameraRef.current = maxCam;

        const lvlForSpeed = modeRef.current === "endless" ? Math.floor(endlessDistRef.current / 800) : levelRef.current;
        voidEdgeRef.current += 0.3 + lvlForSpeed * 0.15;
        const minEdge = cameraRef.current - Math.max(10, 40 - lvlForSpeed * 4);
        if (voidEdgeRef.current < minEdge) voidEdgeRef.current = minEdge;

        const hasMagnet = pu.includes("magnet");
        for (const m of mailsRef.current) {
          if (m.collected) continue;
          m.bob += 0.1;
          if (hasMagnet) {
            const dx = p.x + 4 - m.x; const dy = p.y + 7 - m.y;
            const d = Math.hypot(dx, dy);
            if (d < 48 && d > 0.1) { m.x += (dx / d) * 1.2; m.y += (dy / d) * 1.2; }
          }
          if (p.x + pw > m.x && p.x < m.x + 8 && p.y + ph > m.y && p.y < m.y + 6) {
            m.collected = true;
            setCollected((n) => n + 1);
          }
        }

        let dead = false;
        for (let r = 0; r < lvl.length && !dead; r++) {
          for (let c = 0; c < lvl[r].length && !dead; c++) {
            if (lvl[r][c] !== "S") continue;
            const sx = c * TS, sy = r * TS + 10;
            if (p.x + pw > sx && p.x < sx + TS && p.y + ph > sy && p.y < sy + 6) {
              if (consumeShield()) p.vy = -3; else dead = true;
            }
          }
        }

        if (!dead && modeRef.current === "story") {
          for (let r = 0; r < lvl.length; r++) {
            for (let c = 0; c < lvl[r].length; c++) {
              if (lvl[r][c] !== "H") continue;
              const hx = c * TS - 8, hy = r * TS - 4;
              if (p.x + pw > hx && p.x < hx + 24 && p.y + ph > hy && p.y < hy + 24) {
                const needed = Math.ceil(totalMail * MAIL_QUOTA);
                setScene(collected >= needed ? "levelComplete" : "levelFailed");
              }
            }
          }
        }

        if (modeRef.current === "endless") {
          endlessDistRef.current = Math.max(endlessDistRef.current, p.x);
          setEndlessScore(Math.floor(endlessDistRef.current / 8) + collected * 10);
          if (p.x > lvl[0].length * TS - 80) {
            const newChunk = generateEndlessChunk(Date.now() & 0xffff, 200);
            const offset = lvl[0].length;
            for (let r = 0; r < lvl.length; r++) lvl[r] = lvl[r].concat(newChunk[r]);
            for (let r = 0; r < newChunk.length; r++) {
              for (let c = 0; c < newChunk[r].length; c++) {
                if (newChunk[r][c] === "M") {
                  mailsRef.current.push({ x: (c + offset) * TS + 4, y: r * TS + 5, collected: false, bob: Math.random() * Math.PI * 2 });
                }
              }
            }
          }
        }

        if (!dead && p.x + pw < voidEdgeRef.current) {
          if (consumeShield()) voidEdgeRef.current = p.x - 30; else dead = true;
        }
        if (!dead && p.y > VH + 40) dead = true;
        if (dead) {
          if (modeRef.current === "endless") {
            setEndlessBest((b) => Math.max(b, endlessScore));
            setScene("endlessDead");
          } else setScene("dead");
        }
      } else if (s === "minigame") {
        updateMinigame();
      } else if (s === "earthCozy") {
        updateCozy();
      }

      // ===== RENDER =====
      if (s === "earthCozy" || s === "earthCozyDone") {
        renderCozy(ctx, t);
      } else {
        ctx.fillStyle = C.void;
        ctx.fillRect(0, 0, VW, VH);
        if (bgReady && bgImg) {
          const bw = Math.max(1, Math.ceil(bgImg.width * (VH / bgImg.height)));
          const scrollX = (s === "playing" || s === "dead" || s === "levelComplete" || s === "levelFailed" || s === "endlessDead")
            ? cameraRef.current * 0.45
            : t * 0.15;
          const offset = ((scrollX % bw) + bw) % bw;
          for (let bx = -offset; bx < VW; bx += bw) {
            ctx.drawImage(bgImg, Math.floor(bx), 0, bw, VH);
          }
        }
        for (const st of starsRef.current) {
          ctx.fillStyle = (t + st.x) % 80 < 40 ? C.star : "#9a8acc";
          ctx.fillRect(st.x, st.y, st.s, st.s);
        }
        ctx.fillStyle = C.voidGlow;
        ctx.fillRect(0, VH - 14, VW, 14);
      }

      if (s === "intro") {
        // Render background only; Text layer handles typing overlay
      } else if (s === "falling") {
        drawTextPixel(ctx, "VOID COURIER", VW / 2, 18, C.crt, true, 1);
        drawTextPixel(ctx, "delivery #" + Math.floor((t / 4) % 9999), VW / 2, 30, C.hudFg, true, 1);
        const py = fallYRef.current;
        drawCourier(ctx, VW / 2 - 12, py, 1, true, 1.6);
        for (let i = 0; i < 8; i++) {
          const ly = (t * 4 + i * 24) % VH;
          ctx.fillStyle = C.voidEdge;
          ctx.fillRect(VW / 2 + Math.sin(i) * 30, ly, 1, 6);
        }
        if (py > VH / 2 - 12) {
          drawSign(ctx, VW / 2 - 12, VH - 56);
          drawTextPixel(ctx, "CLICK THE PLAY SIGN", VW / 2, VH - 8, C.hudFg, true, 1);
        }
      } else if (s === "briefing") {
        renderBriefing(ctx, t);
      } else if (s === "home" || s === "homeArrival" || s === "homeFinale") {
        renderHome(ctx, t, s);
      } else if (s === "playing" || s === "levelComplete" || s === "levelFailed" || s === "dead" || s === "endlessDead") {
        renderPlay(ctx, t, s);
      } else if (s === "minigame") {
        renderMinigame(ctx, t);
      } else if (s === "minigameResult") {
        renderMinigameResult(ctx);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [collected, totalMail, lastReward, endlessScore, endlessBest, bgReady]);

  // ---------- Render: Play ----------
  const renderPlay = (ctx: CanvasRenderingContext2D, t: number, s: Scene) => {
    const lvl = getLvl();
    const cam = Math.floor(cameraRef.current);
    const startCol = Math.max(0, Math.floor(cam / TS) - 1);
    const endCol = Math.min(lvl[0].length, startCol + Math.ceil(VW / TS) + 2);
    for (let r = 0; r < lvl.length; r++) {
      for (let c = startCol; c < endCol; c++) {
        const tile = lvl[r][c];
        const x = c * TS - cam;
        const y = r * TS;
        if (tile === "#") {
          ctx.fillStyle = C.outline; ctx.fillRect(x, y, TS, TS);
          ctx.fillStyle = C.brick; ctx.fillRect(x + 1, y + 1, TS - 2, TS - 3);
          ctx.fillStyle = C.groundTop; ctx.fillRect(x + 1, y + 1, TS - 2, 2);
          ctx.fillStyle = C.brickShade;
          ctx.fillRect(x + 8, y + 3, 1, 4); ctx.fillRect(x + 4, y + 9, 1, 4); ctx.fillRect(x + 12, y + 9, 1, 4);
        } else if (tile === "S") {
          drawSpike(ctx, x, y + 8); drawSpike(ctx, x + 8, y + 8);
        } else if (tile === "H") {
          drawHouse(ctx, x - 4, y - 4);
        }
      }
    }

    for (const m of mailsRef.current) {
      if (m.collected) continue;
      const mx = m.x - cam;
      if (mx < -8 || mx > VW) continue;
      const off = Math.sin(m.bob) * 1;
      ctx.fillStyle = C.mail;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(mx - 2, m.y + off + 1, 12, 6);
      ctx.globalAlpha = 1;
      drawMail(ctx, mx, m.y + off);
    }

    const p = playerRef.current;
    drawCourier(ctx, Math.floor(p.x - cam) - 4, Math.floor(p.y) - 4, p.facing, !p.onGround);

    if (powerupsRef.current.includes("shield")) {
      ctx.strokeStyle = C.shield; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(Math.floor(p.x - cam) + 4, Math.floor(p.y) + 7, 10 + Math.sin(t * 0.2), 0, Math.PI * 2);
      ctx.stroke();
    }

    const edgeScreen = voidEdgeRef.current - cam;
    if (edgeScreen > 0) {
      ctx.fillStyle = C.voidDeep;
      ctx.fillRect(0, 0, Math.min(VW, edgeScreen - 24), VH);
    }
    const bandStart = Math.max(0, edgeScreen - 24);
    const bandEnd = Math.min(VW, edgeScreen + 8);
    for (let x = bandStart; x < bandEnd; x++) {
      const ratio = 1 - (x - bandStart) / (bandEnd - bandStart || 1);
      for (let i = 0; i < 50 * ratio; i++) {
        const y = (Math.random() * VH) | 0;
        ctx.fillStyle = Math.random() < 0.5 ? C.voidDeep : C.voidEdge;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    for (let i = 0; i < 14; i++) {
      const y = (Math.random() * VH) | 0;
      ctx.fillStyle = i % 3 === 0 ? C.crt : C.star;
      ctx.fillRect(edgeScreen + (Math.random() * 6 - 3), y, 1, 1);
    }

    ctx.fillStyle = "rgba(10,6,18,0.85)";
    ctx.fillRect(0, 0, VW, 14);
    const needed = Math.ceil(totalMail * MAIL_QUOTA);
    if (modeRef.current === "story") {
      drawTextPixel(ctx, `LV ${levelRef.current + 1}/${TOTAL_LEVELS}`, 4, 4, C.hudFg, false, 1);
      drawTextPixel(ctx, `MAIL ${collected}/${totalMail}  NEED ${needed}`, VW / 2, 4, collected >= needed ? C.crt : C.mail, true, 1);
    } else {
      drawTextPixel(ctx, `DIST ${Math.floor(endlessDistRef.current / 8)}`, 4, 4, C.hudFg, false, 1);
      drawTextPixel(ctx, `SCORE ${endlessScore}  BEST ${Math.max(endlessBest, endlessScore)}`, VW / 2, 4, C.crt, true, 1);
    }
    let px = VW - 4;
    for (const pu of powerupsRef.current) {
      px -= 10;
      ctx.fillStyle = POWERUP_COLORS[pu]; ctx.fillRect(px, 4, 8, 6);
      ctx.fillStyle = C.outline; ctx.fillRect(px, 4, 8, 1); ctx.fillRect(px, 9, 8, 1);
    }

    if (s === "levelComplete") {
      ctx.fillStyle = "rgba(10,6,18,0.85)"; ctx.fillRect(0, 0, VW, VH);
      drawTextPixel(ctx, "DELIVERED!", VW / 2, VH / 2 - 28, C.crt, true, 2);
      drawTextPixel(ctx, `${collected} / ${totalMail} MAIL`, VW / 2, VH / 2 - 8, C.hudFg, true, 1);
      drawTextPixel(ctx, levelRef.current === TOTAL_LEVELS - 1 ? "SPACE  REACH EARTH" : "SPACE  MINI-GAME", VW / 2, VH / 2 + 10, C.mail, true, 1);
    }
    if (s === "levelFailed") {
      ctx.fillStyle = "rgba(40,6,18,0.85)"; ctx.fillRect(0, 0, VW, VH);
      drawTextPixel(ctx, "DELIVERY REJECTED", VW / 2, VH / 2 - 28, C.mailStamp, true, 2);
      drawTextPixel(ctx, `ONLY ${collected} OF ${needed} NEEDED`, VW / 2, VH / 2 - 8, C.hudFg, true, 1);
      drawTextPixel(ctx, "PRESS R TO RETRY LEVEL", VW / 2, VH / 2 + 10, C.mail, true, 1);
    }
    if (s === "dead") {
      ctx.fillStyle = "rgba(10,6,18,0.85)"; ctx.fillRect(0, 0, VW, VH);
      drawTextPixel(ctx, "CONSUMED BY VOID", VW / 2, VH / 2 - 10, C.mailStamp, true, 2);
      drawTextPixel(ctx, "PRESS R TO RETRY", VW / 2, VH / 2 + 14, C.hudFg, true, 1);
    }
    if (s === "endlessDead") {
      ctx.fillStyle = "rgba(10,6,18,0.85)"; ctx.fillRect(0, 0, VW, VH);
      drawTextPixel(ctx, "ENDLESS OVER", VW / 2, VH / 2 - 30, C.mailStamp, true, 2);
      drawTextPixel(ctx, `SCORE ${endlessScore}`, VW / 2, VH / 2 - 8, C.crt, true, 1);
      drawTextPixel(ctx, `BEST  ${Math.max(endlessBest, endlessScore)}`, VW / 2, VH / 2 + 4, C.hudFg, true, 1);
      drawTextPixel(ctx, "R RETRY    M HOME", VW / 2, VH / 2 + 22, C.mail, true, 1);
    }
  };

  const renderHome = (ctx: CanvasRenderingContext2D, t: number, s: Scene) => {
    drawTextPixel(ctx, "VOID COURIER", VW / 2, 6, C.crt, true, 1);
    const earth = roadPos(1);
    drawEarth(ctx, Math.round(earth.x), Math.round(earth.y), 10, t);
    drawRoad(ctx, t);

    for (let i = 0; i < TOTAL_LEVELS; i++) {
      const tPos = i / (TOTAL_LEVELS - 1) * 0.92;
      const p = roadPos(tPos);
      const reached = i < levelIdx || (s !== "home" && i <= levelIdx) || s === "homeFinale";
      drawStop(ctx, Math.round(p.x), Math.round(p.y), i + 1, reached, i === levelIdx && s === "home");
    }

    let spriteT: number;
    if (s === "homeArrival") spriteT = arrivalTRef.current * 0.92 + (1 - 0.92) * arrivalTRef.current;
    else if (s === "homeFinale") spriteT = 1;
    else spriteT = Math.min(levelIdx, TOTAL_LEVELS - 1) / (TOTAL_LEVELS - 1) * 0.92;
    const sp = roadPos(spriteT);
    const bob = s === "home" ? Math.sin(t * 0.1) * 0.5 : 0;
    drawCourier(ctx, Math.round(sp.x) - 8, Math.round(sp.y) - 18 + bob, 1, false);

    ctx.fillStyle = "rgba(10,6,18,0.85)";
    ctx.fillRect(0, VH - 26, VW, 26);

    if (s === "home") {
      drawTextPixel(ctx, `STAGE ${levelIdx + 1} OF ${TOTAL_LEVELS}`, VW / 2, VH - 22, C.mail, true, 1);
      drawTextPixel(ctx, "SPACE  START STAGE", VW / 2, VH - 12, C.hudFg, true, 1);
      drawTextPixel(ctx, "E  ENDLESS MODE", VW / 2, VH - 4, C.shield, true, 1);
    } else if (s === "homeArrival") {
      drawTextPixel(ctx, "JOURNEY HOME...", VW / 2, VH - 14, C.crt, true, 1);
    } else if (s === "homeFinale") {
      drawNPC(ctx, Math.round(earth.x) - 22, Math.round(earth.y) - 4, t);
      ctx.fillStyle = C.signFace;
      ctx.fillRect(20, VH - 56, VW - 40, 30);
      ctx.fillStyle = C.outline;
      ctx.fillRect(20, VH - 56, VW - 40, 1);
      ctx.fillRect(20, VH - 27, VW - 40, 1);
      ctx.fillRect(20, VH - 56, 1, 30);
      ctx.fillRect(VW - 21, VH - 56, 1, 30);
      drawTextPixel(ctx, "WELCOME HOME, COURIER.", VW / 2, VH - 52, C.signText, true, 1);
      drawTextPixel(ctx, "EVERY LOST THING IS DELIVERED.", VW / 2, VH - 42, C.signText, true, 1);
      drawTextPixel(ctx, "SPACE  EXPLORE EARTH", VW / 2, VH - 20, C.crt, true, 1);
      drawTextPixel(ctx, "E ENDLESS    R RESTART", VW / 2, VH - 8, C.mail, true, 1);
    }
  };

  const updateCozy = () => {
    const c = cozyRef.current;
    const k = keysRef.current;
    let vx = 0, vy = 0;
    if (k["arrowleft"] || k["a"]) vx -= 1.1;
    if (k["arrowright"] || k["d"]) vx += 1.1;
    if (k["arrowup"] || k["w"]) vy -= 1.1;
    if (k["arrowdown"] || k["s"]) vy += 1.1;
    c.px = Math.max(8, Math.min(COZY_W - 8, c.px + vx));
    c.py = Math.max(20, Math.min(COZY_H - 8, c.py + vy));
    if (!c.held) {
      for (const s of c.scrolls) {
        if (s.taken || s.delivered) continue;
        s.bob += 0.08;
        if (Math.abs(s.x - c.px) < 8 && Math.abs(s.y - c.py) < 10) {
          s.taken = true; c.held = s;
        }
      }
    }
    if (c.held) {
      for (const h of c.houses) {
        if (Math.abs(h.x - c.px) < 12 && Math.abs(h.y + 8 - c.py) < 14 && h.key === c.held.key) {
          c.held.delivered = true; c.held = null;
          break;
        }
      }
    }
    if (c.scrolls.every((s) => s.delivered)) setScene("earthCozyDone");
  };

  const renderCozy = (ctx: CanvasRenderingContext2D, t: number) => {
    ctx.fillStyle = C.grass;
    ctx.fillRect(0, 0, COZY_W, COZY_H);
    for (let i = 0; i < 60; i++) {
      const gx = (i * 37 + 11) % COZY_W;
      const gy = (i * 53 + 19) % COZY_H;
      ctx.fillStyle = C.grassDark;
      ctx.fillRect(gx, gy, 2, 1);
      ctx.fillRect(gx + 1, gy + 1, 1, 1);
    }
    ctx.fillStyle = C.roadStone;
    for (let i = 0; i < COZY_W; i += 6) {
      const y = COZY_H / 2 + Math.sin(i * 0.05) * 18;
      ctx.fillRect(i, y, 5, 5);
    }

    const c = cozyRef.current;
    for (const h of c.houses) drawCozyHouse(ctx, h.x, h.y, h.col);
    for (const s of c.scrolls) {
      if (s.delivered || s.taken) continue;
      drawScroll(ctx, s.x, s.y + Math.sin(s.bob) * 1, s.col);
    }
    drawCourier(ctx, Math.round(c.px) - 8, Math.round(c.py) - 14, 1, false);
    if (c.held) drawScroll(ctx, c.px, c.py - 22, c.held.col);

    ctx.fillStyle = "rgba(10,30,18,0.85)";
    ctx.fillRect(0, 0, COZY_W, 14);
    drawTextPixel(ctx, "EARTH  COZY DELIVERY", COZY_W / 2, 4, C.crt, true, 1);
    const left = c.scrolls.filter((s) => !s.delivered).length;
    drawTextPixel(ctx, `${4 - left}/4`, 4, 4, C.hudFg, false, 1);
    drawTextPixel(ctx, "ARROWS  WANDER", COZY_W - 4, 4, C.hudFg, false, 1, "right");

    if (sceneRef.current === "earthCozyDone") {
      ctx.fillStyle = "rgba(10,40,20,0.65)";
      ctx.fillRect(0, 0, COZY_W, COZY_H);
      drawTextPixel(ctx, "ALL DELIVERED.", COZY_W / 2, COZY_H / 2 - 16, C.crt, true, 2);
      drawTextPixel(ctx, "LOVELY DAY.", COZY_W / 2, COZY_H / 2 + 2, C.hudFg, true, 1);
      drawTextPixel(ctx, "R HOME    SPACE PLAY AGAIN", COZY_W / 2, COZY_H / 2 + 18, C.mail, true, 1);
    }
  };

  const startMinigame = useCallback(() => {
    const type: MinigameType = Math.random() < 0.5 ? "sort" : "catch";
    if (type === "sort") {
      const seq = Array.from({ length: 6 }, () => ["R", "G", "B"][Math.floor(Math.random() * 3)]);
      minigameRef.current = { type, seq, idx: 0, score: 0, timer: 300, lastFeedback: 0, feedbackOk: false };
    } else {
      minigameRef.current = { type, basketX: VW / 2, items: [], score: 0, timer: 600, spawn: 0 };
    }
    setScene("minigame");
  }, []);

  const updateMinigame = () => {
    const m = minigameRef.current;
    if (!m) return;
    m.timer--;
    if (m.type === "sort") {
      if (m.lastFeedback > 0) m.lastFeedback--;
      const k = keysRef.current;
      const pressed = k["r"] ? "R" : k["g"] ? "G" : k["b"] ? "B" : null;
      if (pressed && m.lastFeedback === 0 && m.idx < m.seq.length) {
        const correct = pressed === m.seq[m.idx];
        if (correct) m.score++;
        m.feedbackOk = correct; m.lastFeedback = 20; m.idx++;
      }
      if (m.idx >= m.seq.length || m.timer <= 0) finishMinigame(m.score);
    } else {
      const k = keysRef.current;
      if (k["arrowleft"] || k["a"]) m.basketX -= 2.5;
      if (k["arrowright"] || k["d"]) m.basketX += 2.5;
      m.basketX = Math.max(12, Math.min(VW - 12, m.basketX));
      m.spawn--;
      if (m.spawn <= 0) {
        m.spawn = 20 + Math.floor(Math.random() * 20);
        m.items.push({ x: 12 + Math.random() * (VW - 24), y: -8, bad: Math.random() < 0.25, vy: 1 + Math.random() * 1.2 });
      }
      for (const it of m.items) it.y += it.vy;
      const by = VH - 16;
      for (const it of m.items) {
        if (it.y > by - 4 && it.y < by + 6 && Math.abs(it.x - m.basketX) < 12) {
          if (it.bad) m.score = Math.max(0, m.score - 1); else m.score++;
          it.y = VH + 100;
        }
      }
      m.items = m.items.filter((it: any) => it.y < VH + 20);
      if (m.timer <= 0) finishMinigame(m.score);
    }
  };

  const finishMinigame = (score: number) => {
    let reward: Powerup | null = null;
    if (score > 0) {
      const pool: Powerup[] = ["doubleJump", "speed", "shield", "magnet"];
      reward = pool[Math.floor(Math.random() * pool.length)];
    }
    setLastReward(reward);
    if (reward) setActivePowerups((p) => Array.from(new Set([...p, reward!])));
    setScene("minigameResult");
  };

  const renderMinigame = (ctx: CanvasRenderingContext2D, t: number) => {
    const m = minigameRef.current;
    ctx.fillStyle = "rgba(10,6,18,0.6)";
    ctx.fillRect(0, 14, VW, VH);
    if (!m) return;
    if (m.type === "sort") {
      drawTextPixel(ctx, "SORT THE MAIL", VW / 2, 4, C.crt, true, 1);
      drawTextPixel(ctx, "PRESS R  G  B", VW / 2, 18, C.hudFg, true, 1);
      const bins = [
        { ch: "R", x: VW / 2 - 60, col: C.mailStamp },
        { ch: "G", x: VW / 2, col: C.crt },
        { ch: "B", x: VW / 2 + 60, col: C.shield },
      ];
      for (const b of bins) {
        ctx.fillStyle = b.col; ctx.fillRect(b.x - 10, VH - 30, 20, 14);
        ctx.fillStyle = C.outline; ctx.fillRect(b.x - 10, VH - 30, 20, 2);
        drawTextPixel(ctx, b.ch, b.x, VH - 26, C.outline, true, 1);
      }
      if (m.idx < m.seq.length) {
        const ch = m.seq[m.idx];
        const col = ch === "R" ? C.mailStamp : ch === "G" ? C.crt : C.shield;
        const ex = VW / 2;
        const ey = 50 + Math.sin(t * 0.1) * 3;
        ctx.fillStyle = C.mailWhite; ctx.fillRect(ex - 12, ey, 24, 16);
        ctx.fillStyle = C.outline;
        ctx.fillRect(ex - 12, ey, 24, 1); ctx.fillRect(ex - 12, ey + 15, 24, 1);
        ctx.fillRect(ex - 12, ey, 1, 16); ctx.fillRect(ex + 11, ey, 1, 16);
        ctx.fillStyle = col; ctx.fillRect(ex + 4, ey + 3, 6, 5);
      }
      if (m.lastFeedback > 0) {
        drawTextPixel(ctx, m.feedbackOk ? "GOOD" : "MISS", VW / 2, 80, m.feedbackOk ? C.crt : C.mailStamp, true, 2);
      }
      drawTextPixel(ctx, `${m.idx}/${m.seq.length}`, 4, 30, C.hudFg, false, 1);
      drawTextPixel(ctx, `SCORE ${m.score}`, VW - 4, 30, C.crt, false, 1, "right");
    } else {
      drawTextPixel(ctx, "CATCH THE MAIL", VW / 2, 4, C.crt, true, 1);
      drawTextPixel(ctx, "ARROWS  AVOID BOMBS", VW / 2, 18, C.hudFg, true, 1);
      ctx.fillStyle = C.satchel; ctx.fillRect(m.basketX - 12, VH - 16, 24, 10);
      ctx.fillStyle = C.outline; ctx.fillRect(m.basketX - 12, VH - 16, 24, 2);
      for (const it of m.items) {
        if (it.bad) {
          ctx.fillStyle = C.outline; ctx.fillRect(it.x - 4, it.y - 4, 8, 8);
          ctx.fillStyle = C.mailStamp; ctx.fillRect(it.x - 3, it.y - 3, 6, 6);
        } else drawMail(ctx, it.x - 4, it.y - 3);
      }
      drawTextPixel(ctx, `TIME ${Math.ceil(m.timer / 60)}`, 4, 30, C.hudFg, false, 1);
      drawTextPixel(ctx, `SCORE ${m.score}`, VW - 4, 30, C.crt, false, 1, "right");
    }
  };

  const renderMinigameResult = (ctx: CanvasRenderingContext2D) => {
    drawTextPixel(ctx, "POWERUP EARNED", VW / 2, 30, C.crt, true, 2);
    if (lastReward) {
      ctx.fillStyle = POWERUP_COLORS[lastReward];
      ctx.fillRect(VW / 2 - 16, 56, 32, 20);
      ctx.fillStyle = C.outline;
      ctx.fillRect(VW / 2 - 16, 56, 32, 1); ctx.fillRect(VW / 2 - 16, 75, 32, 1);
      ctx.fillRect(VW / 2 - 16, 56, 1, 20); ctx.fillRect(VW / 2 + 15, 56, 1, 20);
      drawTextPixel(ctx, POWERUP_NAMES[lastReward], VW / 2, 86, C.hudFg, true, 1);
    } else {
      drawTextPixel(ctx, "NOTHING THIS TIME", VW / 2, 66, C.hudFg, true, 1);
    }
    drawTextPixel(ctx, "PRESS SPACE TO CONTINUE", VW / 2, VH - 14, C.mail, true, 1);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (scene !== "falling") return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * VW;
    const y = ((e.clientY - rect.top) / rect.height) * VH;
    if (x > VW / 2 - 14 && x < VW / 2 + 14 && y > VH - 58 && y < VH - 32) setShowSign(true);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      // FIXED: Added handling to progress from intro and briefing scenes via keyboard spacebar
      if (scene === "intro") {
        if (k === " " || k === "enter") {
          if (introSlide < INTRO_SLIDES.length - 1) {
            setIntroSlide((s) => s + 1);
            setIntroTyped(0);
          } else {
            setScene("falling");
          }
        }
      } else if (scene === "briefing") {
        if (k === " ") {
          setScene("home");
        }
      } else if (scene === "home") {
        if (k === " ") {
          setMode("story"); loadStoryLevel(levelIdx); setScene("playing");
        } else if (k === "e") {
          setMode("endless"); setActivePowerups([]); loadEndlessLevel(); setScene("playing");
        }
      } else if (scene === "dead" && k === "r") {
        if (mode === "endless") loadEndlessLevel(); else loadStoryLevel(levelIdx);
        setScene("playing");
      } else if (scene === "levelFailed" && k === "r") {
        loadStoryLevel(levelIdx); setScene("playing");
      } else if (scene === "levelComplete" && k === " ") {
        if (levelIdx === TOTAL_LEVELS - 1) {
          setLevelIdx(TOTAL_LEVELS);
          arrivalTRef.current = (TOTAL_LEVELS - 1) / (TOTAL_LEVELS - 1) * 0.92;
          setScene("homeArrival");
        } else startMinigame();
      } else if (scene === "minigameResult" && k === " ") {
        const next = levelIdx + 1;
        setLevelIdx(next);
        setScene("home");
      } else if (scene === "homeFinale") {
        if (k === " ") {
          cozyRef.current = { ...buildCozy(), px: COZY_W / 2, py: COZY_H / 2, held: null };
          setScene("earthCozy");
        } else if (k === "e") {
          setMode("endless"); setActivePowerups([]); loadEndlessLevel(); setScene("playing");
        } else if (k === "r") {
          setLevelIdx(0); setActivePowerups([]); setScene("home");
        }
      } else if (scene === "earthCozyDone") {
        if (k === "r") { setLevelIdx(0); setActivePowerups([]); setScene("home"); }
        else if (k === " ") {
          cozyRef.current = { ...buildCozy(), px: COZY_W / 2, py: COZY_H / 2, held: null };
          setScene("earthCozy");
        }
      } else if (scene === "endlessDead") {
        if (k === "r") { loadEndlessLevel(); setScene("playing"); }
        else if (k === "m") setScene("home");
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [scene, levelIdx, mode, loadStoryLevel, loadEndlessLevel, startMinigame, introSlide, INTRO_SLIDES.length]);

  const startGame = () => {
    setShowSign(false);
    // CHANGED: Progress to the briefing scene instead of immediately jumping to the world map
    setScene("briefing");
  };

  return (
    <div ref={containerRef} className="relative flex h-dvh w-screen items-center justify-center overflow-hidden bg-[#03020a] p-3">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, rgba(90,40,160,0.25), transparent 60%)" }}
      />
      <div className="relative max-h-full max-w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="block cursor-pointer"
          style={{ imageRendering: "pixelated" }}
        />
        <div className="crt-overlay" />
        <div className="crt-vignette" />
      </div>

      {/* FIXED: Added missing typewriter backstory presentation layers for the intro screen */}
      {scene === "intro" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 px-6 font-mono text-xs text-[#a8ff80]">
          <div className="max-w-md space-y-4 tracking-wider leading-relaxed">
            <p>
              {INTRO_SLIDES[introSlide].substring(0, introTyped)}
              {introTyped < INTRO_SLIDES[introSlide].length && <span className="animate-pulse">_</span>}
            </p>
            {introTyped >= INTRO_SLIDES[introSlide].length && (
              <div className="pt-6 text-center text-[#fff4ff] opacity-60 text-[10px] animate-bounce">
                PRESS SPACEBAR TO CONTINUE
              </div>
            )}
          </div>
        </div>
      )}

      {showSign && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-4 py-4 overflow-auto">
          <div className="max-w-md border-4 border-[#8a5a2a] bg-[#f0d8a0] p-5 text-[10px] leading-relaxed text-[#2a1a08] shadow-[8px_8px_0_#0a0612]">
            <div className="mb-3 text-center text-[14px] text-[#5a2818]">— NOTICE TO COURIER —</div>
            <p className="mb-2 text-[#5a2818]">YOU HAVE FALLEN INTO <b>THE VOID</b>.</p>
            <p className="mb-2">
              Gather lost parcels and carry them to the house at the edge of each stage —
              every delivery walks you closer along the road back to <b>EARTH</b>.
            </p>
            <p className="mb-2"><b>QUOTA:</b> deliver at least <b>70%</b> of mail or redo the stage.</p>
            <p className="mb-2"><b>BETWEEN STAGES:</b> postal mini-game grants a random powerup.</p>
            <p className="mb-2"><b>10 STAGES</b> stand between you and Earth.</p>
            <p className="mb-2">
              MOVE <b>ARROWS / A D</b> &nbsp; JUMP <b>SPACE / W</b> &nbsp; RETRY <b>R</b>
            </p>
            <div className="flex justify-center">
              <button
                onClick={startGame}
                className="border-2 border-[#2a1a08] bg-[#5a2818] px-4 py-2 text-[10px] text-[#f8f0d8] shadow-[3px_3px_0_#2a1a08] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#2a1a08]"
              >
                BEGIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Courier sprite ----------
const courierImg: HTMLImageElement | null = typeof Image !== "undefined" ? new Image() : null;
let courierReady = false;
if (courierImg) {
  courierImg.onload = () => { courierReady = true; };
  // FIXED: Changed courierAsset.url to direct courierAsset
  courierImg.src = courierAsset;
}

const bgImg: HTMLImageElement | null = typeof Image !== "undefined" ? new Image() : null;
let bgReady = false;
if (bgImg) {
  bgImg.onload = () => { bgReady = true; };
  // FIXED: Changed bgAsset.url to direct bgAsset
  bgImg.src = bgAsset;
}

function drawCourier(ctx: CanvasRenderingContext2D, x: number, y: number, facing: 1 | -1, airborne: boolean, scale = 1) {
  const baseW = 16, baseH = 20;
  const W = Math.round(baseW * scale);
  const H = Math.round(baseH * scale);
  ctx.fillStyle = C.outline;
  ctx.fillRect(x - 1, y, W + 2, H);
  ctx.fillRect(x, y - 1, W, H + 2);
  if (!courierReady || !courierImg) {
    ctx.fillStyle = "#5a3a8a"; ctx.fillRect(x, y, W, H); return;
  }
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  const dy = airborne ? -1 : 0;
  if (facing === -1) {
    ctx.translate(x + W, y + dy); ctx.scale(-1, 1);
    ctx.drawImage(courierImg, 0, 0, W, H);
  } else {
    ctx.drawImage(courierImg, x, y + dy, W, H);
  }
  ctx.restore();
}


function drawMail(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = C.outline; ctx.fillRect(x - 1, y - 1, 10, 8);
  ctx.fillStyle = C.mailWhite; ctx.fillRect(x, y, 8, 6);
  ctx.fillStyle = C.mailShade; ctx.fillRect(x, y, 8, 1);
  ctx.fillStyle = C.mailStamp; ctx.fillRect(x + 5, y + 3, 2, 2);
  ctx.fillStyle = C.mailShade;
  ctx.fillRect(x + 1, y + 1, 6, 1); ctx.fillRect(x + 1, y + 2, 1, 3); ctx.fillRect(x + 6, y + 2, 1, 3);
}

function drawSpike(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = C.outline;
  for (let i = 0; i < 8; i++) {
    const h = Math.min(8, 8 - Math.abs(i - 3.5) * 1.4 + 2);
    ctx.fillRect(x + i, y + 8 - h, 1, h);
  }
  ctx.fillStyle = C.spike;
  for (let i = 1; i < 7; i++) {
    const h = Math.min(6, 6 - Math.abs(i - 3.5) * 1.2 + 1);
    ctx.fillRect(x + i, y + 8 - h, 1, h);
  }
  ctx.fillStyle = C.spikeShade; ctx.fillRect(x, y + 7, 8, 1);
}

function drawHouse(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = C.outline;
  for (let i = 0; i <= 12; i++) ctx.fillRect(x + 12 - i, y + 1 + i, 1 + i * 2, 1);
  ctx.fillStyle = C.houseRoof;
  for (let i = 0; i <= 11; i++) ctx.fillRect(x + 13 - i, y + 2 + i, i * 2 - 1, 1);
  ctx.fillStyle = C.outline; ctx.fillRect(x + 1, y + 13, 22, 11);
  ctx.fillStyle = C.house; ctx.fillRect(x + 2, y + 14, 20, 9);
  ctx.fillStyle = C.outline;
  ctx.fillRect(x + 4, y + 15, 5, 4); ctx.fillRect(x + 15, y + 15, 5, 4);
  ctx.fillStyle = C.houseWindow;
  ctx.fillRect(x + 5, y + 16, 3, 2); ctx.fillRect(x + 16, y + 16, 3, 2);
  ctx.fillStyle = C.houseDoor; ctx.fillRect(x + 10, y + 18, 4, 5);
}

function drawRoad(ctx: CanvasRenderingContext2D, t: number) {
  const steps = 70;
  for (let i = 0; i <= steps; i++) {
    const tt = (i / steps) * 0.94;
    const p = roadPos(tt);
    ctx.fillStyle = C.roadGrass;
    ctx.fillRect(Math.round(p.x) - 5, Math.round(p.y) - 3, 10, 7);
    ctx.fillStyle = C.roadStoneEdge;
    ctx.fillRect(Math.round(p.x) - 4, Math.round(p.y) - 2, 8, 5);
    ctx.fillStyle = C.roadStone;
    ctx.fillRect(Math.round(p.x) - 4, Math.round(p.y) - 2, 8, 4);
    if (i % 4 === 0) {
      ctx.fillStyle = C.mail;
      ctx.fillRect(Math.round(p.x) - 1, Math.round(p.y), 2, 1);
    }
  }
}

function drawStop(ctx: CanvasRenderingContext2D, x: number, y: number, n: number, reached: boolean, isCurrent: boolean) {
  ctx.fillStyle = C.outline; ctx.fillRect(x - 4, y - 10, 8, 8);
  ctx.fillStyle = reached ? C.pathOn : C.pathOff;
  ctx.fillRect(x - 3, y - 9, 6, 6);
  ctx.fillStyle = C.outline; ctx.fillRect(x - 1, y - 2, 2, 4);
  if (isCurrent) {
    ctx.strokeStyle = C.mail; ctx.lineWidth = 1;
    ctx.strokeRect(x - 5, y - 11, 10, 10);
  }
  drawTextPixel(ctx, String(n), x, y - 8, C.outline, true, 1);
}

function drawEarth(ctx: CanvasRenderingContext2D, ex: number, ey: number, r: number, t: number) {
  ctx.fillStyle = C.outline;
  ctx.fillRect(ex - r - 1, ey - r - 1, 2 * r + 3, 2 * r + 3);
  for (let yy = -r; yy <= r; yy++) {
    for (let xx = -r; xx <= r; xx++) {
      const d = Math.sqrt(xx * xx + yy * yy);
      if (d > r) continue;
      const land = (Math.sin((xx + t * 0.05) * 0.6) + Math.cos(yy * 0.7)) > 0.3;
      ctx.fillStyle = land ? C.earthLand : C.earth;
      if (d > r - 1) ctx.fillStyle = "#1a4a98";
      ctx.fillRect(ex + xx, ey + yy, 1, 1);
    }
  }
}

function drawNPC(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  ctx.fillStyle = C.outline; ctx.fillRect(x - 1, y, 12, 18);
  ctx.fillStyle = C.npcCloak; ctx.fillRect(x, y + 6, 10, 12);
  ctx.fillStyle = "#ffd8a8"; ctx.fillRect(x + 2, y + 2, 6, 6);
  ctx.fillStyle = C.cap; ctx.fillRect(x + 1, y, 8, 3);
  ctx.fillStyle = C.npcBeard; ctx.fillRect(x + 2, y + 6, 6, 2);
  const wave = Math.sin(t * 0.15) > 0 ? -1 : 0;
  ctx.fillStyle = C.npcCloak;
  ctx.fillRect(x + 9, y + 7 + wave, 2, 4);
  ctx.fillStyle = "#ffd8a8"; ctx.fillRect(x + 10, y + 6 + wave, 2, 2);
}

function drawCozyHouse(ctx: CanvasRenderingContext2D, x: number, y: number, col: string) {
  ctx.fillStyle = C.outline;
  for (let i = 0; i <= 10; i++) ctx.fillRect(x - i, y + i, 1 + i * 2, 1);
  ctx.fillStyle = col;
  for (let i = 0; i <= 9; i++) ctx.fillRect(x - i + 1, y + i + 1, i * 2 - 1, 1);
  ctx.fillStyle = C.outline; ctx.fillRect(x - 9, y + 11, 19, 11);
  ctx.fillStyle = "#f8e8c8"; ctx.fillRect(x - 8, y + 12, 17, 9);
  ctx.fillStyle = col; ctx.fillRect(x - 2, y + 16, 5, 5);
  ctx.fillStyle = C.outline; ctx.fillRect(x - 2, y + 16, 5, 1);
  ctx.fillStyle = C.outline; ctx.fillRect(x - 7, y + 13, 4, 3);
  ctx.fillStyle = C.houseWindow; ctx.fillRect(x - 6, y + 14, 2, 1);
}

function drawScroll(ctx: CanvasRenderingContext2D, x: number, y: number, col: string) {
  ctx.fillStyle = C.outline; ctx.fillRect(x - 4, y - 3, 9, 7);
  ctx.fillStyle = "#fff4d8"; ctx.fillRect(x - 3, y - 2, 7, 5);
  ctx.fillStyle = col; ctx.fillRect(x - 3, y, 7, 1);
  ctx.fillStyle = col; ctx.fillRect(x - 4, y - 3, 1, 7);
  ctx.fillStyle = col; ctx.fillRect(x + 4, y - 3, 1, 7);
}

const FONT: Record<string, string[]> = {
  A: ["010","101","111","101","101"], B: ["110","101","110","101","110"],
  C: ["011","100","100","100","011"], D: ["110","101","101","101","110"],
  E: ["111","100","110","100","111"], F: ["111","100","110","100","100"],
  G: ["011","100","101","101","011"], H: ["101","101","111","101","101"],
  I: ["111","010","010","010","111"], J: ["001","001","001","101","010"],
  K: ["101","110","100","110","101"], L: ["100","100","100","100","111"],
  M: ["101","111","111","101","101"], N: ["101","111","111","111","101"],
  O: ["010","101","101","101","010"], P: ["110","101","110","100","100"],
  Q: ["010","101","101","111","011"], R: ["110","101","110","101","101"],
  S: ["011","100","010","001","110"], T: ["111","010","010","010","010"],
  U: ["101","101","101","101","011"], V: ["101","101","101","101","010"],
  W: ["101","101","111","111","101"], X: ["101","101","010","101","101"],
  Y: ["101","101","010","010","010"], Z: ["111","001","010","100","111"],
  "0": ["111","101","101","101","111"], "1": ["010","110","010","010","111"],
  "2": ["110","001","010","100","111"], "3": ["110","001","010","001","110"],
  "4": ["101","101","111","001","001"], "5": ["111","100","110","001","110"],
  "6": ["011","100","110","101","010"], "7": ["111","001","010","100","100"],
  "8": ["010","101","010","101","010"], "9": ["010","101","011","001","110"],
  " ": ["000","000","000","000","000"], "/": ["001","001","010","100","100"],
  "#": ["101","111","101","111","101"], "-": ["000","000","111","000","000"],
  "!": ["010","010","010","000","010"], ".": ["000","000","000","000","010"],
  ",": ["000","000","000","010","100"], ":": ["000","010","000","010","000"],
};

function drawTextPixel(
  ctx: CanvasRenderingContext2D, text: string, x: number, y: number,
  color: string, center = false, scale = 1, align: "left" | "right" = "left",
) {
  const upper = text.toUpperCase();
  const charW = 4 * scale;
  const totalW = upper.length * charW;
  let startX = x;
  if (center) startX = x - totalW / 2;
  else if (align === "right") startX = x - totalW;
  ctx.fillStyle = color;
  for (let i = 0; i < upper.length; i++) {
    const glyph = FONT[upper[i]] || FONT[" "];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 3; c++) {
        if (glyph[r][c] === "1") ctx.fillRect(startX + i * charW + c * scale, y + r * scale, scale, scale);
      }
    }
  }
}

function drawSign(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#5a3018"; ctx.fillRect(x + 10, y + 16, 4, 24);
  ctx.fillStyle = "#5a3018"; ctx.fillRect(x - 2, y - 2, 28, 20);
  ctx.fillStyle = C.signFace; ctx.fillRect(x, y, 24, 16);
  ctx.fillStyle = C.signText;
  for (let i = 0; i < 6; i++) ctx.fillRect(x + 3 + Math.floor(i / 2), y + 4 + i, Math.max(1, 4 - Math.abs(i - 2.5)), 1);
  drawTextPixel(ctx, "PLAY", x + 15, y + 6, C.signText, true, 1);
}
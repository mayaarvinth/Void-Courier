import { useEffect, useRef, useState, useCallback } from "react";
import courierAsset from "@/assets/courier.png";
import DevPanel from "../components/ui/DevPanel";
import bgAsset from "@/assets/the-void-background.png";
import bgmSrc from "@/assets/2015-09-25_-_Old_Video_Game_Music_1_-_David_Fesliyan.mp3";
import cozySrc from "@/assets/8BitNostalgia.mp3";
import jumpSrc from "@/assets/dragon-studio-cartoon-jump-463196.mp3";
import deathSrc from "@/assets/freesound_community-videogame-death-sound-43894.mp3";
import levelUpSrc from "@/assets/latent-rick-retro-arcade-level-up-552982.mp3";

const VW = 256;
const VH = 144;

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
    "             ####        M               ####                ",                     
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
    "                  M               ###      ###                 M      ",
    "  M                           ####                                              ",
    " ###      ##  S  ###   S ##    S  ###   S  ##    S    ##           ## H ",
    "                                                                      # ",
    "###  SS  ###  SS  ###  SS  ###  SS  ###  SS  ###  SS  ###  SS  ##  #####",
    "########################################################################",
  ]),
  makeLevel([
    "                                                                                    ",
    "                M                          M                       M                ",
    "             ###                        ####                    ####                ",
    "       M                M                               M                          ",
    "    ####             ####       ####                 ####           ####            ",
    "                                                                                    ",
    "  ##           ##              ##         ##                     ##                     ",
    "                                                                                  H ",
    "    SS   ##  S  ##  S  ##  SS  ##  S  ##  SS  ##  S  ##  SS  ##  S  ##  SS  ##  ####",
    "##  SSS  ##  S  ##  S  ##  SSS ##  S  ##  SSS ##  S  ##  SSS ##  S  ##  SSS ##  ####",
    "####################################################################################",
  ]),
  makeLevel([
    "                                                                                                ",
    "                                                                                                ",
    "          M                  M                  M                  M                 M          ",
    "       ####               ####              #####                ####             ####          ",
    "              M                     M                   M                   M                   ",
    "             ###      ##           ###                 ###                 ###                    ",
    "  M                                                                                             ",
    "####     ####       ####       ####       ####       ####       ####       ####         ####  H",
    "                                                                                            ####",
    "                                                                                                ",
  ]),
  makeLevel([
    "                                                                                                            ",
    "                M                            M          M           M           M           M       ",
    "             ###                      ####        ####        ####        ####        ####        ####      ",
    "        M                   M                   M                   M                   M           M       ",
    "     ####                ####                ####                ####                ####        ####       ",
    "                                                                                                            ",
    "  ##       ##       ##       ##       ##       ##       ##       ##       ##       ##       ##       ##    ",
    "                                                                                                          H ",
    "  SS   S   SS   S   SS   S   SS   S   SS   S   SS   S   SS   S   SS   S   SS   S   SS   S   SS   S   ##### ",
    "  SSS  SS  SSS  SS  SSS  SS  SSS  SS  SSS  SS  SSS  SS  SSS  SS  SSS  SS  SSS  SS  SSS  SS  SSS  SS  ##### ",
    "................................................................................................############",
  ]),
  makeLevel([
    "                                                                          M                 ",
    "                                                                       ####                 ",
    "                                                                  M                         ",
    "                                                               ####                         ",
    "                          M                              M                                  ",
    "                       ####                           ####                                  ",
    "             M   ##                      M    ###                                           ",
    "          ####                           ####                                              H",
    "    M                                                                                     ##",
    " ####    S    ####    SS    ####    ####    SS    ####    S    ####    SS    ####  ###",
    "###############     ###################      #######################      ##################",
    "############################################################################################",
  ]),
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
const COZY_W = 256;
const COZY_H = 144;
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
    { x: 40, y: 30 }, { x: 200, y: 30 }, { x: 40, y: 110 }, { x: 200, y: 110 },
  ];
  const shuffled = [...COZY_COLORS].sort(() => Math.random() - 0.5);
  for (let i = 0; i < 4; i++) houses.push({ ...positions[i], ...shuffled[i] });
  const scrolls: CozyScroll[] = COZY_COLORS.map((c) => ({
    x: 60 + Math.random() * (COZY_W - 120),
    y: 50 + Math.random() * (COZY_H - 80),
    key: c.key, col: c.col, taken: false, delivered: false, bob: Math.random() * Math.PI * 2,
  }));
  return { houses, scrolls };
}

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
  const [introPhase, setIntroPhase] = useState(0);
  const [mode, setMode] = useState<Mode>("story");
  const [levelIdx, setLevelIdx] = useState(0);
  const [collected, setCollected] = useState(0);
  const [totalMail, setTotalMail] = useState(0);
  const [activePowerups, setActivePowerups] = useState<Powerup[]>([]);
  const [endlessScore, setEndlessScore] = useState(0);
  const [endlessBest, setEndlessBest] = useState(0);
  const [lastReward, setLastReward] = useState<Powerup | null>(null);

  // ─── Audio refs ───────────────────────────────────────────────────────────
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const cozyRef2 = useRef<HTMLAudioElement | null>(null);
  const jumpAudioRef = useRef<HTMLAudioElement | null>(null);
  const deathAudioRef = useRef<HTMLAudioElement | null>(null);
  const levelUpAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialise audio elements once
  useEffect(() => {
    const bgm = new Audio(bgmSrc);
    bgm.loop = true;
    bgm.volume = 0.45;
    bgmRef.current = bgm;

    const cozy = new Audio(cozySrc);
    cozy.loop = true;
    cozy.volume = 0.45;
    cozyRef2.current = cozy;

    jumpAudioRef.current = new Audio(jumpSrc);
    jumpAudioRef.current.volume = 0.55;

    deathAudioRef.current = new Audio(deathSrc);
    deathAudioRef.current.volume = 0.6;

    levelUpAudioRef.current = new Audio(levelUpSrc);
    levelUpAudioRef.current.volume = 0.65;

    return () => {
      bgm.pause();
      cozy.pause();
    };
  }, []);

  const playJump = useCallback(() => {
    if (!jumpAudioRef.current) return;
    jumpAudioRef.current.currentTime = 0;
    jumpAudioRef.current.play().catch(() => {});
  }, []);

  const playDeath = useCallback(() => {
    if (!deathAudioRef.current) return;
    deathAudioRef.current.currentTime = 0;
    deathAudioRef.current.play().catch(() => {});
  }, []);

  const playLevelUp = useCallback(() => {
    if (!levelUpAudioRef.current) return;
    levelUpAudioRef.current.currentTime = 0;
    levelUpAudioRef.current.play().catch(() => {});
  }, []);

  // Switch between BGM / cozy music based on scene
  useEffect(() => {
    const isCozy = scene === "earthCozy" || scene === "earthCozyDone";
    if (isCozy) {
      bgmRef.current?.pause();
      if (cozyRef2.current && cozyRef2.current.paused) {
        cozyRef2.current.play().catch(() => {});
      }
    } else {
      cozyRef2.current?.pause();
      if (bgmRef.current && bgmRef.current.paused) {
        bgmRef.current.play().catch(() => {});
      }
    }
  }, [scene]);
  // ─────────────────────────────────────────────────────────────────────────

  const STORY_SLIDES = [
    { title: "On a normal Tuesday...", lines: ["Elijah Ward was just a normal mailman, exiting his bus to turn in the mails", "An eerie feeling washed over him as he stepped on the doorstep of the house", '"Is anyone there?"'] },
    { title: "THE VOID...", lines: ["A rumble shook beneath him", "As he wobbled to grasp the door", "the floor beneath him fell apart.", '"HELP, SOMEBODY HELP--"', "Before he could finish, he fell into the strange looking tunnel"] },
    { title: "YOUR MISSION", lines: ['"Who is there!" he yelled, only to hear his echo', "As Elijah Ward, your duty is to return him back to Earth"] },
  ];

  const INTRO_SLIDES = ["LONG AGO, EARTH'S MAIL SHIP TORE OPEN OVER THE VOID...", "EVERY LETTER, EVERY PARCEL, EVERY LOST KEEPSAKE SPILLED INTO THE DARK.", "YOU ARE THE LAST COURIER LEFT STANDING.", "GATHER WHAT THE VOID STOLE.  CARRY IT HOME."];
  const [introSlide, setIntroSlide] = useState(0);
  const [introTyped, setIntroTyped] = useState(0);

  const sceneRef = useRef<Scene>("intro"); sceneRef.current = scene;
  const introPhaseRef = useRef(0); introPhaseRef.current = introPhase;
  const levelRef = useRef(0); levelRef.current = levelIdx;
  const modeRef = useRef<Mode>("story"); modeRef.current = mode;
  const powerupsRef = useRef<Powerup[]>([]); powerupsRef.current = activePowerups;

  const collectedRef = useRef(0);
  const totalMailRef = useRef(0);
  const scoreRef = useRef(0);
  const bestRef = useRef(0);

  

  useEffect(() => { collectedRef.current = collected; }, [collected]);
  useEffect(() => { totalMailRef.current = totalMail; }, [totalMail]);
  useEffect(() => { scoreRef.current = endlessScore; }, [endlessScore]);
  useEffect(() => { bestRef.current = endlessBest; }, [endlessBest]);

  const playerRef = useRef<Player>({ x: 32, y: 0, vx: 0, vy: 0, onGround: false, facing: 1, runFrame: 0, jumpsLeft: 1 });
  const mailsRef = useRef<Mail[]>([]);
  const cameraRef = useRef(0);
  const cameraYRef = useRef(0);
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
    cameraYRef.current = 0;
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
    cameraYRef.current = 0;
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
      const aw = window.innerWidth;
      const ah = window.innerHeight;
      const scaleX = aw / VW;
      const scaleY = ah / VH;
      const scale = Math.min(scaleX, scaleY);
      c.style.width = `${VW * scale}px`;
      c.style.height = `${VH * scale}px`;
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
      setActivePowerups((p: Powerup[]) => p.filter((x: Powerup) => x !== "shield"));
      return true;
    }
    return false;
  };

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
      const p = playerRef.current;
      ctx.fillStyle = C.void;
      ctx.fillRect(0, 0, VW, VH);

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
        p.vx = ax * 2.4 * speedMult;
        if (ax !== 0) p.runFrame += 0.2;

        const jumpPressed = (k["arrowup"] || k["w"] || k[" "]) && !jumpHeldRef.current;
        if (jumpPressed) {
          jumpHeldRef.current = true;
          const maxJumps = pu.includes("doubleJump") ? 2 : 1;
          if (p.onGround) { p.vy = -6.4; p.onGround = false; p.jumpsLeft = maxJumps - 1; playJump(); }
          else if (p.jumpsLeft > 0) { p.vy = -5.8; p.jumpsLeft--; playJump(); }
        }

        p.vy += 0.28;
        if (p.vy > 6) p.vy = 6;

        p.x += p.vx;
        const pw = 16, ph = 28;
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

        // Vertical camera: keep player centered on Y axis
        const targetCamY = p.y - VH / 2;
        cameraYRef.current += (targetCamY - cameraYRef.current) * 0.12;
        if (cameraYRef.current < 0) cameraYRef.current = 0;
        const maxCamY = Math.max(0, lvl.length * TS - VH);
        if (cameraYRef.current > maxCamY) cameraYRef.current = maxCamY;

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
            collectedRef.current += 1;
            setCollected(collectedRef.current);
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
                const needed = Math.ceil(totalMailRef.current * MAIL_QUOTA);
                if (collectedRef.current >= needed) {
                  setScene("levelComplete");
                  playLevelUp();
                } else {
                  setScene("levelFailed");
                  playDeath();
                }
              }
            }
          }
        }

        if (modeRef.current === "endless") {
          endlessDistRef.current = Math.max(endlessDistRef.current, p.x);
          const nextScore = Math.floor(endlessDistRef.current / 8) + collectedRef.current * 10;
          scoreRef.current = nextScore;
          setEndlessScore(nextScore);

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
        if (!dead && p.y > lvl.length * TS + 16) dead = true;
        if (dead) {
          if (modeRef.current === "endless") {
            setEndlessBest((b) => Math.max(b, scoreRef.current));
            setScene("endlessDead");
          } else setScene("dead");
          playDeath();
        }
      } else if (s === "minigame") {
        updateMinigame();
      } else if (s === "earthCozy") {
        updateCozy();
      }

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
          const scrollYBg = (s === "playing" || s === "dead" || s === "levelComplete" || s === "levelFailed" || s === "endlessDead")
            ? Math.floor(cameraYRef.current * 0.25)
            : 0;
          const offset = ((scrollX % bw) + bw) % bw;
          for (let bx = -offset; bx < VW + bw; bx += bw) {
            ctx.drawImage(bgImg, Math.floor(bx), -scrollYBg, bw, VH + scrollYBg + 2);
          }
        }

        for (const st of starsRef.current) {
          ctx.fillStyle = (t + st.x) % 80 < 40 ? C.star : "#9a8acc";
          ctx.fillRect(st.x, st.y, st.s, st.s);
        }

        if (s === "intro") {
          if (Math.floor(t / 28) % 2 === 0) {
            drawTextPixel(ctx, "PRESS I TO START!", VW / 2, VH / 2 - 6, C.mail, true, 2);
          }
        }

        if (s === "falling") {
          const py = fallYRef.current;
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          const scale = 2.5;
          const cw = 16 * scale, ch = 20 * scale;
          ctx.translate(Math.floor(VW / 2 - cw / 2), Math.floor(py - ch / 2));
          ctx.scale(scale, scale);
          drawCourier(ctx, 0, 0, 1, true);
          ctx.restore();

          const bx = VW / 2 - 14, by = VH - 60;
          ctx.fillStyle = C.sign; ctx.fillRect(VW / 2 - 1, by + 18, 2, 8);
          ctx.fillStyle = C.outline; ctx.fillRect(bx - 1, by - 1, 30, 20);
          ctx.fillStyle = C.sign;    ctx.fillRect(bx,     by,     28, 18);
          ctx.fillStyle = C.signFace; ctx.fillRect(bx + 2, by + 2, 24, 14);
          ctx.fillStyle = C.signText;
          for (let i = 0; i < 5; i++) {
            ctx.fillRect(bx + 8 + i, by + 4 + i, 1, 10 - i * 2);
            ctx.fillRect(bx + 19 - i, by + 4 + i, 1, 10 - i * 2);
          }
          ctx.fillRect(bx + 13, by + 9, 2, 2);
          if (Math.floor(t / 20) % 2 === 0) {
            drawTextPixel(ctx, "PRESS I TO", VW / 2, VH - 30, C.mail, true, 2);
            drawTextPixel(ctx, "START!", VW / 2, VH - 16, C.mail, true, 2);
          }
        }

        if (s === "playing" || s === "dead" || s === "levelComplete" || s === "levelFailed" || s === "endlessDead") renderPlay(ctx, t, s);
        if (s === "home" || s === "homeArrival" || s === "homeFinale") renderHome(ctx, t, s);
        if (s === "minigame") renderMinigame(ctx, t);
        if (s === "minigameResult") renderMinigameResult(ctx);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [collected, totalMail, lastReward, endlessScore, endlessBest, bgReady, playJump, playDeath, playLevelUp]);

  const renderPlay = (ctx: CanvasRenderingContext2D, t: number, s: Scene) => {
    const lvl = getLvl();
    const cam = Math.floor(cameraRef.current);
    const camY = Math.floor(cameraYRef.current);
    const startCol = Math.max(0, Math.floor(cam / TS) - 1);
    const endCol = Math.min(lvl[0].length, startCol + Math.ceil(VW / TS) + 2);
    for (let r = 0; r < lvl.length; r++) {
      for (let c = startCol; c < endCol; c++) {
        const tile = lvl[r][c];
        const x = c * TS - cam;
        const y = r * TS - camY;
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
      ctx.fillRect(mx - 2, m.y + off - camY + 1, 12, 6); 
      ctx.globalAlpha = 1;
      drawMail(ctx, mx, m.y + off - camY);
    }

    const p = playerRef.current;
    const deadzone = 40;
    drawCourier(ctx, Math.floor(p.x - cam) - 4, Math.floor(p.y) - camY - 4, p.facing, !p.onGround);

    if (powerupsRef.current.includes("shield")) {
      ctx.strokeStyle = C.shield; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(Math.floor(p.x - cam) + 4, Math.floor(p.y) - camY + 7, 10 + Math.sin(t * 0.2), 0, Math.PI * 2);
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
    const needed = Math.ceil(totalMailRef.current * MAIL_QUOTA);
    if (modeRef.current === "story") {
      drawTextPixel(ctx, `LV ${levelRef.current + 1}/${TOTAL_LEVELS}`, 4, 4, C.hudFg, false, 1);
      drawTextPixel(ctx, `MAIL ${collectedRef.current}/${totalMailRef.current}  NEED ${needed}`, VW / 2, 4, collectedRef.current >= needed ? C.crt : C.mail, true, 1);
    } else {
      drawTextPixel(ctx, `DIST ${Math.floor(endlessDistRef.current / 8)}`, 4, 4, C.hudFg, false, 1);
      drawTextPixel(ctx, `SCORE ${scoreRef.current}  BEST ${Math.max(bestRef.current, scoreRef.current)}`, VW / 2, 4, C.crt, true, 1);
    }
    let px = VW - 4;
    for (const pu of powerupsRef.current) {
      px -= 10;
      ctx.fillStyle = POWERUP_COLORS[pu as Powerup]; ctx.fillRect(px, 4, 8, 6);
      ctx.fillStyle = C.outline; ctx.fillRect(px, 4, 8, 1); ctx.fillRect(px, 9, 8, 1);
    }

    if (s === "levelComplete") {
      ctx.fillStyle = "rgba(10,6,18,0.92)"; ctx.fillRect(0, 0, VW, VH);
      // Pixelated box
      ctx.fillStyle = C.crt; ctx.fillRect(VW/2 - 72, VH/2 - 48, 144, 96);
      ctx.fillStyle = "#000";  ctx.fillRect(VW/2 - 72, VH/2 - 48, 144, 4);
      ctx.fillStyle = "#000";  ctx.fillRect(VW/2 - 72, VH/2 + 44, 144, 4);
      ctx.fillStyle = "#000";  ctx.fillRect(VW/2 - 72, VH/2 - 48, 4, 96);
      ctx.fillStyle = "#000";  ctx.fillRect(VW/2 + 68, VH/2 - 48, 4, 96);
      ctx.fillStyle = "#0a0820"; ctx.fillRect(VW/2 - 68, VH/2 - 44, 136, 88);
      // Corner pixels
      ctx.fillStyle = C.crt;
      ctx.fillRect(VW/2 - 68, VH/2 - 44, 8, 4); ctx.fillRect(VW/2 + 60, VH/2 - 44, 8, 4);
      ctx.fillRect(VW/2 - 68, VH/2 + 40, 8, 4); ctx.fillRect(VW/2 + 60, VH/2 + 40, 8, 4);
      drawTextPixel(ctx, "DELIVERED!", VW / 2, VH / 2 - 32, C.crt, true, 3);
      drawTextPixel(ctx, `${collectedRef.current} / ${totalMailRef.current} MAIL`, VW / 2, VH / 2 + 4, C.hudFg, true, 2);
      drawTextPixel(ctx, levelRef.current === TOTAL_LEVELS - 1 ? "SPACE: REACH EARTH" : "SPACE: MINI-GAME", VW / 2, VH / 2 + 26, C.mail, true, 1);
    }
    if (s === "levelFailed") {
      ctx.fillStyle = "rgba(40,6,18,0.92)"; ctx.fillRect(0, 0, VW, VH);
      ctx.fillStyle = C.mailStamp; ctx.fillRect(VW/2 - 80, VH/2 - 48, 160, 96);
      ctx.fillStyle = "#000"; ctx.fillRect(VW/2 - 80, VH/2 - 48, 160, 4);
      ctx.fillStyle = "#000"; ctx.fillRect(VW/2 - 80, VH/2 + 44, 160, 4);
      ctx.fillStyle = "#000"; ctx.fillRect(VW/2 - 80, VH/2 - 48, 4, 96);
      ctx.fillStyle = "#000"; ctx.fillRect(VW/2 + 76, VH/2 - 48, 4, 96);
      ctx.fillStyle = "#280618"; ctx.fillRect(VW/2 - 76, VH/2 - 44, 152, 88);
      ctx.fillStyle = C.mailStamp;
      ctx.fillRect(VW/2 - 76, VH/2 - 44, 8, 4); ctx.fillRect(VW/2 + 68, VH/2 - 44, 8, 4);
      ctx.fillRect(VW/2 - 76, VH/2 + 40, 8, 4); ctx.fillRect(VW/2 + 68, VH/2 + 40, 8, 4);
      drawTextPixel(ctx, "REJECTED", VW / 2, VH / 2 - 32, C.mailStamp, true, 3);
      drawTextPixel(ctx, `ONLY ${collectedRef.current} OF ${needed}`, VW / 2, VH / 2 + 4, C.hudFg, true, 2);
      drawTextPixel(ctx, "R: RETRY LEVEL", VW / 2, VH / 2 + 26, C.mail, true, 1);
    }
    if (s === "dead") {
      ctx.fillStyle = "rgba(10,6,18,0.92)"; ctx.fillRect(0, 0, VW, VH);
      ctx.fillStyle = C.mailStamp; ctx.fillRect(VW/2 - 72, VH/2 - 44, 144, 88);
      ctx.fillStyle = "#000"; ctx.fillRect(VW/2 - 72, VH/2 - 44, 144, 4);
      ctx.fillStyle = "#000"; ctx.fillRect(VW/2 - 72, VH/2 + 40, 144, 4);
      ctx.fillStyle = "#000"; ctx.fillRect(VW/2 - 72, VH/2 - 44, 4, 88);
      ctx.fillStyle = "#000"; ctx.fillRect(VW/2 + 68, VH/2 - 44, 4, 88);
      ctx.fillStyle = "#0a0820"; ctx.fillRect(VW/2 - 68, VH/2 - 40, 136, 80);
      ctx.fillStyle = C.mailStamp;
      ctx.fillRect(VW/2 - 68, VH/2 - 40, 8, 4); ctx.fillRect(VW/2 + 60, VH/2 - 40, 8, 4);
      ctx.fillRect(VW/2 - 68, VH/2 + 36, 8, 4); ctx.fillRect(VW/2 + 60, VH/2 + 36, 8, 4);
      drawTextPixel(ctx, "VOID", VW / 2, VH / 2 - 28, C.mailStamp, true, 3);
      drawTextPixel(ctx, "CONSUMED", VW / 2, VH / 2 - 8, C.mailStamp, true, 3);
      drawTextPixel(ctx, "R: RETRY", VW / 2, VH / 2 + 22, C.hudFg, true, 2);
    }
    if (s === "endlessDead") {
      ctx.fillStyle = "rgba(10,6,18,0.92)"; ctx.fillRect(0, 0, VW, VH);
      ctx.fillStyle = C.mailStamp; ctx.fillRect(VW/2 - 76, VH/2 - 52, 152, 104);
      ctx.fillStyle = "#000"; ctx.fillRect(VW/2 - 76, VH/2 - 52, 152, 4);
      ctx.fillStyle = "#000"; ctx.fillRect(VW/2 - 76, VH/2 + 48, 152, 4);
      ctx.fillStyle = "#000"; ctx.fillRect(VW/2 - 76, VH/2 - 52, 4, 104);
      ctx.fillStyle = "#000"; ctx.fillRect(VW/2 + 72, VH/2 - 52, 4, 104);
      ctx.fillStyle = "#0a0820"; ctx.fillRect(VW/2 - 72, VH/2 - 48, 144, 96);
      ctx.fillStyle = C.mailStamp;
      ctx.fillRect(VW/2 - 72, VH/2 - 48, 8, 4); ctx.fillRect(VW/2 + 64, VH/2 - 48, 8, 4);
      ctx.fillRect(VW/2 - 72, VH/2 + 44, 8, 4); ctx.fillRect(VW/2 + 64, VH/2 + 44, 8, 4);
      drawTextPixel(ctx, "ENDLESS", VW / 2, VH / 2 - 38, C.mailStamp, true, 3);
      drawTextPixel(ctx, "OVER", VW / 2, VH / 2 - 18, C.mailStamp, true, 3);
      drawTextPixel(ctx, `SCORE ${scoreRef.current}`, VW / 2, VH / 2 + 8, C.crt, true, 2);
      drawTextPixel(ctx, `BEST  ${Math.max(bestRef.current, scoreRef.current)}`, VW / 2, VH / 2 + 22, C.hudFg, true, 2);
      drawTextPixel(ctx, "R RETRY    M HOME", VW / 2, VH / 2 + 38, C.mail, true, 1);
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
    ctx.fillRect(0, VH - 34, VW, 34);

    if (s === "home") {
      drawTextPixel(ctx, `STAGE ${levelIdx + 1} OF ${TOTAL_LEVELS}`, VW / 2, VH - 30, C.mail, true, 1);
      drawTextPixel(ctx, "SPACE  START STAGE", VW / 2, VH - 20, C.hudFg, true, 1);
      drawTextPixel(ctx, "E  ENDLESS MODE", VW / 2, VH - 10, C.shield, true, 1);
    } else if (s === "homeArrival") {
      drawTextPixel(ctx, "JOURNEY HOME...", VW / 2, VH - 18, C.crt, true, 1);
    } else if (s === "homeFinale") {
      drawNPC(ctx, Math.round(earth.x) - 22, Math.round(earth.y) - 4, t);
      ctx.fillStyle = C.signFace;
      ctx.fillRect(20, VH - 64, VW - 40, 30);
      ctx.fillStyle = C.outline;
      ctx.fillRect(20, VH - 64, VW - 40, 1);
      ctx.fillRect(20, VH - 35, VW - 40, 1);
      ctx.fillRect(20, VH - 64, 1, 30);
      ctx.fillRect(VW - 21, VH - 64, 1, 30);
      drawTextPixel(ctx, "WELCOME HOME, COURIER.", VW / 2, VH - 60, C.signText, true, 1);
      drawTextPixel(ctx, "EVERY LOST THING IS DELIVERED.", VW / 2, VH - 50, C.signText, true, 1);
      drawTextPixel(ctx, "SPACE  EXPLORE EARTH", VW / 2, VH - 24, C.crt, true, 1);
      drawTextPixel(ctx, "E ENDLESS    R RESTART", VW / 2, VH - 12, C.mail, true, 1);
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
    if (c.scrolls.every((s: CozyScroll) => s.delivered)) setScene("earthCozyDone");
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
    const left = c.scrolls.filter((s: CozyScroll) => !s.delivered).length;
    drawTextPixel(ctx, `${4 - left}/4`, 4, 4, C.hudFg, false, 1);
    drawTextPixel(ctx, "ARROWS  WANDER", COZY_W - 4, 4, C.hudFg, false, 1, "right");

    if (sceneRef.current === "earthCozyDone") {
      ctx.fillStyle = "rgba(10,40,20,0.88)";
      ctx.fillRect(0, 0, COZY_W, COZY_H);
      ctx.fillStyle = C.crt; ctx.fillRect(COZY_W/2 - 72, COZY_H/2 - 44, 144, 88);
      ctx.fillStyle = "#000"; ctx.fillRect(COZY_W/2 - 72, COZY_H/2 - 44, 144, 4);
      ctx.fillStyle = "#000"; ctx.fillRect(COZY_W/2 - 72, COZY_H/2 + 40, 144, 4);
      ctx.fillStyle = "#000"; ctx.fillRect(COZY_W/2 - 72, COZY_H/2 - 44, 4, 88);
      ctx.fillStyle = "#000"; ctx.fillRect(COZY_W/2 + 68, COZY_H/2 - 44, 4, 88);
      ctx.fillStyle = "#0a2010"; ctx.fillRect(COZY_W/2 - 68, COZY_H/2 - 40, 136, 80);
      ctx.fillStyle = C.crt;
      ctx.fillRect(COZY_W/2 - 68, COZY_H/2 - 40, 8, 4); ctx.fillRect(COZY_W/2 + 60, COZY_H/2 - 40, 8, 4);
      ctx.fillRect(COZY_W/2 - 68, COZY_H/2 + 36, 8, 4); ctx.fillRect(COZY_W/2 + 60, COZY_H/2 + 36, 8, 4);
      drawTextPixel(ctx, "ALL DELIVERED", COZY_W / 2, COZY_H / 2 - 28, C.crt, true, 2);
      drawTextPixel(ctx, "LOVELY DAY!", COZY_W / 2, COZY_H / 2 - 8, C.hudFg, true, 2);
      drawTextPixel(ctx, "R HOME   SPACE AGAIN", COZY_W / 2, COZY_H / 2 + 20, C.mail, true, 1);
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
    if (reward) setActivePowerups((p: Powerup[]) => Array.from(new Set([...p, reward!])));
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
    ctx.fillStyle = "rgba(10,6,18,0.92)"; ctx.fillRect(0, 0, VW, VH);
    ctx.fillStyle = C.crt; ctx.fillRect(VW/2 - 76, VH/2 - 60, 152, 120);
    ctx.fillStyle = "#000"; ctx.fillRect(VW/2 - 76, VH/2 - 60, 152, 4);
    ctx.fillStyle = "#000"; ctx.fillRect(VW/2 - 76, VH/2 + 56, 152, 4);
    ctx.fillStyle = "#000"; ctx.fillRect(VW/2 - 76, VH/2 - 60, 4, 120);
    ctx.fillStyle = "#000"; ctx.fillRect(VW/2 + 72, VH/2 - 60, 4, 120);
    ctx.fillStyle = "#0a0820"; ctx.fillRect(VW/2 - 72, VH/2 - 56, 144, 112);
    ctx.fillStyle = C.crt;
    ctx.fillRect(VW/2 - 72, VH/2 - 56, 8, 4); ctx.fillRect(VW/2 + 64, VH/2 - 56, 8, 4);
    ctx.fillRect(VW/2 - 72, VH/2 + 52, 8, 4); ctx.fillRect(VW/2 + 64, VH/2 + 52, 8, 4);
    drawTextPixel(ctx, "POWERUP", VW / 2, VH / 2 - 48, C.crt, true, 3);
    drawTextPixel(ctx, "EARNED!", VW / 2, VH / 2 - 28, C.crt, true, 3);
    if (lastReward) {
      ctx.fillStyle = POWERUP_COLORS[lastReward as Powerup];
      ctx.fillRect(VW / 2 - 20, VH / 2 - 4, 40, 24);
      ctx.fillStyle = "#000";
      ctx.fillRect(VW / 2 - 20, VH / 2 - 4, 40, 3); ctx.fillRect(VW / 2 - 20, VH / 2 + 21, 40, 3);
      ctx.fillRect(VW / 2 - 20, VH / 2 - 4, 3, 24); ctx.fillRect(VW / 2 + 17, VH / 2 - 4, 3, 24);
      drawTextPixel(ctx, POWERUP_NAMES[lastReward as Powerup], VW / 2, VH / 2 + 30, C.hudFg, true, 1);
    } else {
      drawTextPixel(ctx, "NOTHING", VW / 2, VH / 2 + 4, C.hudFg, true, 2);
      drawTextPixel(ctx, "THIS TIME", VW / 2, VH / 2 + 20, C.hudFg, true, 2);
    }
    drawTextPixel(ctx, "SPACE: CONTINUE", VW / 2, VH / 2 + 46, C.mail, true, 1);
  };

  const handleCanvasClick = (_e: React.MouseEvent) => {};

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      
      if (k === "i" && (sceneRef.current === "falling" || sceneRef.current === "intro")) {
        setIntroPhase(p => p === 0 ? 1 : 0);
        return;
      }
      if (k === "escape") {
        setIntroPhase(0);
        return;
      }

      if (scene === "intro") {
        if (k === " " || k === "enter") {
          if (introSlide < INTRO_SLIDES.length - 1) {
            setIntroSlide((s) => s + 1);
            setIntroTyped(0);
          } else {
            setScene("falling");
          }
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
    setIntroPhase(0);
    setLevelIdx(0);
    setActivePowerups([]);
    setScene("home");
  };

  return (
    <div ref={containerRef} style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", overflow: "hidden", background: "#03020a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ pointerEvents: "none", position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(90,40,160,0.25), transparent 60%)" }} />

      <div style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
        <canvas ref={canvasRef} style={{ display: "block", imageRendering: "pixelated", cursor: "pointer" }} />
        <div className="crt-overlay" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
        <div className="crt-vignette" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      </div>

      {scene === "falling" && introPhase === 0 && (
        <div style={{ position: "absolute", inset: 0, zIndex: 30, cursor: "pointer" }} onClick={() => setIntroPhase(1)} />
      )}

      {introPhase > 0 && (
        <IntroOverlay
          phase={introPhase}
          setPhase={setIntroPhase}
          storySlides={STORY_SLIDES}
          onStart={startGame}
          npcColors={{ cloak: C.npcCloak, beard: C.npcBeard, outline: C.outline, mail: C.mail, crt: C.crt }}
        />
      )}

      <DevPanel
        currentScene={scene}
        setScene={setScene}
        levelIdx={levelIdx}
        setLevelIdx={setLevelIdx}
        setActivePowerups={setActivePowerups}
        setCollected={setCollected}
        setTotalMail={setTotalMail}
      />
    </div>
  );
}

interface SlideData { title: string; lines: string[]; }
interface NpcColors { cloak: string; beard: string; outline: string; mail: string; crt: string; }

function TypewriterLine({ text, speed = 26, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    setShown(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(i);
      if (i >= text.length) { clearInterval(id); onDone?.(); }
    }, speed);
    return () => clearInterval(id);
  }, [text]);
  return <>{text.slice(0, shown)}{shown < text.length && <span style={{ opacity: 0.7 }}>▌</span>}</>;
}

function PixelBorder({ color, bg, children, shadow = true }: { color: string; bg: string; children: React.ReactNode; shadow?: boolean }) {
  // Pure CSS pixel-art border: 8px solid outline + 4px inset step in corners
  return (
    <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
      {shadow && <div style={{ position: "absolute", top: "8px", left: "8px", right: "-8px", bottom: "-8px", background: "#000", zIndex: 0 }} />}
      <div style={{
        position: "relative", zIndex: 1,
        background: bg,
        border: `8px solid ${color}`,
        boxShadow: `inset 0 0 0 4px #000, inset 0 0 0 6px ${color}`,
        imageRendering: "pixelated",
      }}>
        {children}
      </div>
    </div>
  );
}

function PixelBtn({ label, onClick, color, bg, fontSize = "11px" }: { label: string; onClick: () => void; color: string; bg: string; fontSize?: string | number }) {
  return (
    <button onClick={onClick} style={{
      display: "block", width: "100%", padding: "12px 0",
      fontFamily: '"Press Start 2P", monospace', fontSize: fontSize, letterSpacing: "0.1em",
      color, background: bg,
      border: `6px solid #000`,
      boxShadow: `6px 6px 0 #000`,
      transform: "translate(-3px,-3px)",
      cursor: "pointer", imageRendering: "pixelated",
      outline: `3px solid ${color}`,
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.3)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = ""; }}
      onMouseDown={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = "translate(3px,3px)"; b.style.boxShadow = "none"; }}
      onMouseUp={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = "translate(-3px,-3px)"; b.style.boxShadow = `6px 6px 0 #000`; }}
    >{label}</button>
  );
}

function IntroOverlay({ phase, setPhase, storySlides, onStart, npcColors }: {
  phase: number; setPhase: (n: number) => void;
  storySlides: SlideData[]; onStart: () => void;
  npcColors: NpcColors;
}) {
  const isStory = phase >= 1 && phase <= 3;
  const slide = isStory ? storySlides[phase - 1] : null;

  const [lineIdx, setLineIdx] = useState(0);
  const [allDone, setAllDone] = useState(false);
  useEffect(() => { setLineIdx(0); setAllDone(false); }, [phase]);

  const advance = () => {
    if (!allDone) { setLineIdx(slide ? slide.lines.length : 0); setAllDone(true); return; }
    if (phase < 3) setPhase(phase + 1);
    else if (phase === 3) setPhase(4);
    else onStart();
  };

  // Palettes
  const PARCH   = "#f0ddb0";
  const BOARD   = "#d4b87a";
  const BROWN   = "#6b3a12";
  const DKBRN   = "#2e1506";
  const GOLD    = "#c8a030";
  const DGOLD   = "#7a5a10";
  const BGDARK  = "#0a0604";

  // ── STORY SLIDES ─────────────────────────────────────────────────────────
  if (isStory && slide) {
    return (
      <div
        style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,4,2,0.95)", fontFamily: '"Press Start 2P", monospace', cursor: "pointer" }}
        onClick={advance}
      >
        {/* CRT scanlines */}
        <div style={{ pointerEvents: "none", position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.25) 2px, rgba(0,0,0,0.25) 4px)", zIndex: 10 }} />

        <div style={{ position: "relative", width: "min(700px, 92vw)" }} onClick={e => e.stopPropagation()}>
          <PixelBorder color={BROWN} bg={BOARD}>
            {/* Board texture stripes */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 7px, rgba(0,0,0,0.07) 7px, rgba(0,0,0,0.07) 8px)`, pointerEvents: "none" }} />

            {/* Pin row top */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px 0", position: "relative", zIndex: 1 }}>
              {[0,1,2,3,4,5,6].map(i => (
                <div key={i} style={{ width: "12px", height: "12px", background: DKBRN, border: `3px solid #000`, boxShadow: "2px 2px 0 #000" }} />
              ))}
            </div>

            <div style={{ padding: "10px 32px 24px", position: "relative", zIndex: 1 }}>
              {/* header 1-3*/}
              <div style={{ textAlign: "center", fontSize: "11px", color: DKBRN, letterSpacing: "0.2em", marginBottom: "10px", opacity: 0.8 }}>
                — {phase} / 3 —
              </div>

              {/* Thick dashed divider */}
              <div style={{ height: "6px", background: `repeating-linear-gradient(90deg, ${BROWN} 0, ${BROWN} 10px, ${BOARD} 10px, ${BOARD} 14px)`, margin: "0 0 16px", border: `2px solid ${DKBRN}` }} />

              {/* Slide title */}
              <div style={{ fontSize: "20px", fontWeight: "bold", color: BROWN, textAlign: "center", marginBottom: "20px", lineHeight: 1.4, textShadow: `3px 3px 0 ${DKBRN}`, letterSpacing: "0.06em" }}>
                {slide.title}
              </div>

              {/* Body text on inner parchment panel */}
              <div style={{ background: PARCH, border: `6px solid ${DKBRN}`, boxShadow: `inset 0 0 0 3px ${BROWN}`, padding: "20px 24px", minHeight: "180px", marginBottom: "16px" }}>
                <div style={{ fontSize: "18px", color: DKBRN, lineHeight: "2.6", letterSpacing: "0.05em" }}>
                  {slide.lines.slice(0, lineIdx).map((l, i) => (
                    <div key={i} style={{ marginBottom: "4px" }}>{l}</div>
                  ))}
                  {lineIdx < slide.lines.length && (
                    <div>
                      <TypewriterLine
                        text={slide.lines[lineIdx]}
                        onDone={() => {
                          if (lineIdx + 1 < slide.lines.length) setTimeout(() => setLineIdx(idx => idx + 1), 350);
                          else setTimeout(() => setAllDone(true), 400);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Thick dashed divider */}
              <div style={{ height: "6px", background: `repeating-linear-gradient(90deg, ${BROWN} 0, ${BROWN} 10px, ${BOARD} 10px, ${BOARD} 14px)`, margin: "0 0 16px", border: `2px solid ${DKBRN}` }} />

              {/* Footer row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {/* Progress squares */}
                <div style={{ display: "flex", gap: "10px" }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{ width: "16px", height: "16px", background: i === phase ? BROWN : "transparent", border: `4px solid ${BROWN}`, boxShadow: i === phase ? `2px 2px 0 ${DKBRN}` : "none" }} />
                  ))}
                </div>
                <PixelBtn
                  label={allDone ? (phase < 3 ? "NEXT  >" : "CONTINUE  >") : "SKIP  >>"}
                  onClick={advance}
                  color={PARCH}
                  bg={BROWN}
                />
              </div>
            </div>

            {/* Pin row bottom */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0 20px 10px", position: "relative", zIndex: 1 }}>
              {[0,1,2,3,4,5,6].map(i => (
                <div key={i} style={{ width: "12px", height: "12px", background: DKBRN, border: `3px solid #000`, boxShadow: "2px 2px 0 #000" }} />
              ))}
            </div>
          </PixelBorder>
        </div>

        {/* hint */}
        <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", fontSize: "8px", color: BROWN, fontFamily: '"Press Start 2P", monospace', opacity: 0.7, letterSpacing: "0.1em" }}>
          CLICK / SPACE TO CONTINUE
        </div>
      </div>
    );
  }

  // ── CURATOR BRIEFING — full-width RPG speech bubble ──────────────────────
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", background: "rgba(8,4,2,0.85)", fontFamily: '"Press Start 2P", monospace' }}>
      {/* CRT scanlines */}
      <div style={{ pointerEvents: "none", position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)", zIndex: 10 }} />

      {/* Full-width speech box at bottom */}
      <div style={{ position: "relative", width: "100%", zIndex: 5 }}>

        {/* NPC portrait — sits above box on the left */}
        <div style={{ position: "absolute", bottom: "100%", left: "32px", marginBottom: "0px", zIndex: 6 }}>
          {/* Portrait frame */}
          <div style={{ background: PARCH, border: `8px solid ${DKBRN}`, boxShadow: `inset 0 0 0 3px #000, 6px 6px 0 #000`, width: "88px", height: "96px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            {/* NPC pixel art — scaled up */}
            <div style={{ position: "relative", width: "52px", height: "68px" }}>
              <div style={{ position: "absolute", top: "0px", left: "6px", width: "40px", height: "28px", background: npcColors.cloak, border: "3px solid #000" }} />
              <div style={{ position: "absolute", top: "6px", left: "14px", width: "26px", height: "16px", background: "#e8c89a", border: "3px solid #000" }} />
              <div style={{ position: "absolute", top: "10px", left: "18px", width: "4px", height: "4px", background: "#000" }} />
              <div style={{ position: "absolute", top: "10px", left: "30px", width: "4px", height: "4px", background: "#000" }} />
              <div style={{ position: "absolute", top: "18px", left: "14px", width: "26px", height: "8px", background: npcColors.beard }} />
              <div style={{ position: "absolute", top: "28px", left: "2px", width: "48px", height: "40px", background: npcColors.cloak, border: "3px solid #000" }} />
              <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "6px", height: "84px", background: "#6a4010", border: "3px solid #000" }} />
              <div style={{ position: "absolute", top: "-8px", right: "-10px", width: "14px", height: "8px", background: npcColors.mail, border: "3px solid #000" }} />
            </div>
            {/* Name tag below portrait */}
            <div style={{ position: "absolute", bottom: "-28px", left: "-8px", right: "-8px", background: GOLD, border: `4px solid #000`, padding: "4px 0", textAlign: "center", fontSize: "6px", color: "#000", letterSpacing: "0.05em" }}>
              THE CURATOR
            </div>
          </div>
        </div>

        {/* Pixel speech tail — stepped squares pointing left-down toward NPC */}
        <div style={{ position: "absolute", bottom: "100%", left: "96px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0px" }}>
          <div style={{ width: "16px", height: "16px", background: GOLD }} />
          <div style={{ width: "12px", height: "12px", background: GOLD, marginLeft: "4px" }} />
          <div style={{ width: "8px",  height: "8px",  background: GOLD, marginLeft: "8px" }} />
        </div>

        {/* Main speech box */}
        <div style={{ background: PARCH, borderTop: `8px solid ${GOLD}`, borderLeft: `8px solid ${GOLD}`, borderRight: `8px solid ${GOLD}`, borderBottom: "none", boxShadow: `inset 0 0 0 4px #000`, padding: "20px 28px 24px" }}>
          {/* Speaker name bar */}
          <div style={{ background: GOLD, border: `4px solid #000`, padding: "8px 16px", marginBottom: "14px", display: "inline-block", boxShadow: `4px 4px 0 #000` }}>
            <span style={{ fontSize: "12px", color: "#000", letterSpacing: "0.1em" }}>THE CURATOR</span>
            <span style={{ fontSize: "10px", color: BGDARK, marginLeft: "12px", opacity: 0.8 }}>— KEEPER OF LOST THINGS</span>
          </div>

          {/* Speech text */}
          <div style={{ fontSize: "20px", color: "rgba(65, 42, 25, 0.99)", lineHeight: "2.4", marginBottom: "18px", minHeight: "56px", maxWidth: "860px" }}>
            <TypewriterLine text={`Ah. Another one who slipped through. Don't worry — I've catalogued worse. This place is an alternate reality to the real world-- we must deliver the proper packages in order for you to return home. Every parcel is a step back home. Good luck!`} speed={16} />
          </div>

          {/* Mission + controls in two side-by-side pixel panels */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" }}>
            {/* Mission panel */}
            <div style={{ background:PARCH, border: `6px solid ${DKBRN}`, boxShadow: `inset 0 0 0 2px #000`, padding: "12px 14px" }}>
              <div style={{ fontSize: "16px", color: BGDARK, letterSpacing: "0.12em", marginBottom: "10px", paddingBottom: "6px", borderBottom: `3px solid ${DGOLD}` }}>YOUR MISSION</div>
              <div style={{ fontSize: "13px", color: DKBRN, lineHeight: "2.4" }}>
                <div>&#x25B8; COLLECT LOST MAIL</div>
                <div>&#x25B8; REACH THE HOUSE</div>
                <div>&#x25B8; COMPLETE 10 STAGES TOTAL</div>
                <div>&#x25B8; RETURN HOME</div>
              </div>
            </div>
            {/* Controls panel */}
            <div style={{ background: PARCH, border: `6px solid ${DKBRN}`, boxShadow: `inset 0 0 0 2px #000`, padding: "12px 14px" }}>
              <div style={{ fontSize: "16px", color: DKBRN, letterSpacing: "0.12em", marginBottom: "10px", paddingBottom: "6px", borderBottom: `3px solid ${DGOLD}` }}>CONTROLS</div>
              <div style={{ fontSize: "13px", color: BGDARK, lineHeight: "2.4" }}>
                <div><span style={{ color: "rgb(222, 0, 0)" }}>A / D</span>  MOVE LEFT/RIGHT</div>
                <div><span style={{ color: "rgb(222, 0, 0)" }}>W / SPACE</span>  JUMP</div>
                <div><span style={{ color: "rgb(222, 0, 0)" }}>R</span>  RETRY LEVEL</div>
                <div><span style={{ color: "rgb(222, 0, 0)" }}>M</span>  MAP / HOME</div>
              </div>
            </div>
          </div>

          {/* Begin button */}
          <PixelBtn label="[ BEGIN DELIVERY ]" onClick={onStart} color={"rgb(222, 0, 0)"} bg={PARCH} fontSize={"16px"}/>
        </div>
      </div>
    </div>
  );
}

const courierImg: HTMLImageElement | null = typeof Image !== "undefined" ? new Image() : null;
let courierReady = false;
if (courierImg) {
  courierImg.onload = () => { courierReady = true; };
  courierImg.src = courierAsset;
}

const bgImg: HTMLImageElement | null = typeof Image !== "undefined" ? new Image() : null;
let bgReady = false;
if (bgImg) {
  bgImg.onload = () => { bgReady = true; };
  bgImg.src = bgAsset;
}

function drawCourier(ctx: CanvasRenderingContext2D, x: number, y: number, facing: 1 | -1, airborne: boolean, scale = 2) {
  const baseW = 16, baseH = 20;
  const W = Math.round(baseW * scale);
  const H = Math.round(baseH * scale);
  
  if (!courierReady || !courierImg) {
    ctx.fillStyle = C.outline;
    ctx.fillRect(x, y, W, H); 
    return;
  }
  
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  const dy = airborne ? -1 : 0;
  
  if (facing === -1) {
    ctx.translate(x + W, y + dy); 
    ctx.scale(-1, 1);
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
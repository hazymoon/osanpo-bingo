/**
 * Web Audio API による効果音。依存ゼロ・資産ゼロで合成する。
 * speech.ts と同じく、使えない環境では黙って無視する方針。
 */
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  // 構築や resume が投げても「使えない環境では黙って無視する」方針を守る（speech.ts と同様）
  try {
    if (!ctx) {
      const w = window as Window & { webkitAudioContext?: typeof AudioContext };
      const AC = window.AudioContext ?? w.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    // iOS: ユーザー操作内で resume する必要がある（音はタップ起点なので解錠される）
    if (ctx.state === "suspended") void ctx.resume().catch(() => {});
    return ctx;
  } catch {
    return null;
  }
}

/** 単音を鳴らす内部ヘルパ（周波数・長さ・開始オフセット秒・波形・音量）。 */
function tone(
  freq: number,
  durationMs: number,
  startAt: number,
  type: OscillatorType,
  gain: number,
): void {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;

  const t = ac.currentTime + startAt;
  const dur = durationMs / 1000;
  // クリックノイズ防止のためアタックと指数リリースを付ける
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur);
}

/** マーク音：短い「ポッ」。頻繁に鳴るので控えめに。 */
export function playMark(enabled: boolean): void {
  if (!enabled) return;
  tone(660, 90, 0, "triangle", 0.18);
  tone(990, 70, 0.05, "sine", 0.12); // 軽い倍音で明るさを足す
}

/** ビンゴ音：上昇アルペジオ（ド・ミ・ソ・ド）。達成時に1回。 */
export function playBingo(enabled: boolean): void {
  if (!enabled) return;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((f, i) => tone(f, 320, i * 0.12, "triangle", 0.22));
}

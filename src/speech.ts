/**
 * Web Speech API による読み上げ。字が読めない幼児向けの補助。
 * ja-JP 音声の有無は OS 依存。使えない環境では黙って無視する。
 */
export function speak(text: string, enabled: boolean): void {
  if (!enabled || typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\s/g, ""));
    u.lang = "ja-JP";
    u.rate = 0.95;
    u.pitch = 1.15;
    window.speechSynthesis.speak(u);
  } catch {
    /* noop */
  }
}

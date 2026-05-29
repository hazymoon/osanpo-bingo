import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw, Settings, Volume2, VolumeX } from "lucide-react";
import { CATALOG, TILE_COLORS } from "./catalog";
import { buildLines, centerIndex, winningCells } from "./bingo";
import { shuffle } from "./random";
import { speak } from "./speech";
import { load, save } from "./storage";
import type { CatalogItem } from "./types";
import { Tile } from "./components/Tile";
import { WinOverlay } from "./components/WinOverlay";
import { SettingsSheet } from "./components/SettingsSheet";

type Cell = CatalogItem & { color: string };

function buildCard(ids: string[]): Cell[] {
  const byId = new Map(CATALOG.map((c) => [c.id, c]));
  return ids
    .map((id, i): Cell | null => {
      const item = byId.get(id);
      return item ? { ...item, color: TILE_COLORS[i % TILE_COLORS.length] } : null;
    })
    .filter((x): x is Cell => x !== null);
}

export default function App() {
  const saved = useRef(load());
  const [size, setSize] = useState(saved.current?.size ?? 3);
  const [freeCenter, setFreeCenter] = useState(saved.current?.freeCenter ?? true);
  const [readAloud, setReadAloud] = useState(saved.current?.readAloud ?? true);
  const [showSettings, setShowSettings] = useState(false);

  const [cardIds, setCardIds] = useState<string[]>(saved.current?.cardIds ?? []);
  const [marked, setMarked] = useState<Set<number>>(new Set(saved.current?.marked ?? []));
  const [celebrated, setCelebrated] = useState(false);
  const [showWin, setShowWin] = useState(false);

  const center = useMemo(() => centerIndex(size), [size]);
  const lines = useMemo(() => buildLines(size), [size]);
  const card = useMemo(() => buildCard(cardIds), [cardIds]);

  const newCard = useCallback(() => {
    const n = size * size;
    const ids = shuffle(CATALOG)
      .slice(0, n)
      .map((c) => c.id);
    const init = new Set<number>();
    if (freeCenter && center >= 0) init.add(center);
    setCardIds(ids);
    setMarked(init);
    setCelebrated(false);
    setShowWin(false);
  }, [size, freeCenter, center]);

  // 初回 or サイズ変更でカードが合わなければ作り直す（保存済みカードがあれば復元）
  useEffect(() => {
    if (cardIds.length !== size * size) newCard();
  }, [size, cardIds.length, newCard]);

  // 中央サービス枠のON/OFFをマークに反映
  useEffect(() => {
    if (center < 0) return;
    setMarked((prev) => {
      const next = new Set(prev);
      if (freeCenter) next.add(center);
      else next.delete(center);
      return next;
    });
  }, [freeCenter, center]);

  // 永続化（散歩の中断・再開に対応）
  useEffect(() => {
    save({ size, freeCenter, readAloud, cardIds, marked: [...marked] });
  }, [size, freeCenter, readAloud, cardIds, marked]);

  const wins = useMemo(() => winningCells(lines, marked), [lines, marked]);

  useEffect(() => {
    if (wins.size > 0 && !celebrated) {
      setCelebrated(true);
      setShowWin(true);
      speak("ビンゴ！", readAloud);
    }
  }, [wins, celebrated, readAloud]);

  const toggle = useCallback(
    (idx: number) => {
      if (freeCenter && idx === center) return;
      setMarked((prev) => {
        const next = new Set(prev);
        if (next.has(idx)) {
          next.delete(idx);
        } else {
          next.add(idx);
          speak(card[idx]?.name ?? "", readAloud);
        }
        return next;
      });
    },
    [freeCenter, center, card, readAloud],
  );

  return (
    <div className="ob-root">
      <div className="ob-head">
        <h1 className="ob-title">おさんぽビンゴ</h1>
        <div className="ob-actions">
          <button
            type="button"
            className="ob-iconbtn"
            onClick={() => setReadAloud((v) => !v)}
            aria-label="よみあげ"
          >
            {readAloud ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
          <button
            type="button"
            className="ob-iconbtn"
            onClick={() => setShowSettings(true)}
            aria-label="せってい"
          >
            <Settings size={22} />
          </button>
          <button
            type="button"
            className="ob-iconbtn"
            onClick={newCard}
            aria-label="あたらしいカード"
          >
            <RefreshCw size={22} />
          </button>
        </div>
      </div>

      <div className="ob-grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {card.map((item, idx) => (
          <Tile
            key={idx}
            item={item}
            isFree={freeCenter && idx === center}
            isMarked={marked.has(idx)}
            isWin={wins.has(idx)}
            onToggle={() => toggle(idx)}
          />
        ))}
      </div>

      {showWin && <WinOverlay onClose={() => setShowWin(false)} />}

      {showSettings && (
        <SettingsSheet
          size={size}
          freeCenter={freeCenter}
          readAloud={readAloud}
          onSize={setSize}
          onFreeCenter={setFreeCenter}
          onReadAloud={setReadAloud}
          onNewCard={newCard}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

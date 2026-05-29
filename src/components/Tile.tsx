import type { CatalogItem } from "../types";

interface TileProps {
  item: CatalogItem & { color: string };
  isFree: boolean;
  isMarked: boolean;
  isWin: boolean;
  onToggle: () => void;
}

export function Tile({ item, isFree, isMarked, isWin, onToggle }: TileProps) {
  const className = ["ob-tile", isWin && "ob-win-cell", isFree && "ob-free"]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      style={{ background: item.color }}
      onClick={onToggle}
    >
      <span className="ob-emoji">{isFree ? "⭐" : item.emoji}</span>
      <span className="ob-name">{isFree ? "サービス" : item.name}</span>
      {isMarked && (
        <span className="ob-mark ob-pop" aria-hidden>
          <svg viewBox="0 0 100 100">
            <path
              d="M14 20 L86 82"
              stroke="#e23b4e"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M86 18 L14 84"
              stroke="#e23b4e"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
          </svg>
        </span>
      )}
    </button>
  );
}

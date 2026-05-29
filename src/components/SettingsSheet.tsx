import { X } from "lucide-react";

interface SettingsSheetProps {
  size: number;
  freeCenter: boolean;
  readAloud: boolean;
  onSize: (n: number) => void;
  onFreeCenter: (v: boolean) => void;
  onReadAloud: (v: boolean) => void;
  onNewCard: () => void;
  onClose: () => void;
}

export function SettingsSheet({
  size,
  freeCenter,
  readAloud,
  onSize,
  onFreeCenter,
  onReadAloud,
  onNewCard,
  onClose,
}: SettingsSheetProps) {
  return (
    <div className="ob-overlay" onClick={onClose}>
      <div
        className="ob-card"
        style={{ textAlign: "left", minWidth: 260 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: 20 }}>せってい</strong>
          <button type="button" className="ob-iconbtn" onClick={onClose} aria-label="とじる">
            <X size={20} />
          </button>
        </div>

        <div className="ob-set-row">
          <span>おおきさ</span>
          <div className="ob-seg">
            <button type="button" className={size === 3 ? "on" : ""} onClick={() => onSize(3)}>
              3×3
            </button>
            <button type="button" className={size === 4 ? "on" : ""} onClick={() => onSize(4)}>
              4×4
            </button>
          </div>
        </div>

        <div className="ob-set-row">
          <span>まんなか サービス</span>
          <button
            type="button"
            className={`ob-toggle ${freeCenter ? "on" : ""}`}
            onClick={() => onFreeCenter(!freeCenter)}
            aria-pressed={freeCenter}
          >
            <span className="ob-knob" />
          </button>
        </div>

        <div className="ob-set-row">
          <span>よみあげ</span>
          <button
            type="button"
            className={`ob-toggle ${readAloud ? "on" : ""}`}
            onClick={() => onReadAloud(!readAloud)}
            aria-pressed={readAloud}
          >
            <span className="ob-knob" />
          </button>
        </div>

        <button
          type="button"
          className="ob-btn"
          style={{ width: "100%" }}
          onClick={() => {
            onNewCard();
            onClose();
          }}
        >
          あたらしいカードで はじめる
        </button>
      </div>
    </div>
  );
}

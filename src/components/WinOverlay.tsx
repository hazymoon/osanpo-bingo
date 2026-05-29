interface WinOverlayProps {
  onClose: () => void;
}

export function WinOverlay({ onClose }: WinOverlayProps) {
  return (
    <div className="ob-overlay" onClick={onClose}>
      <div className="ob-card" onClick={(e) => e.stopPropagation()}>
        <div className="ob-confetti">🎉✨🎊</div>
        <h2 className="ob-bingo">ビンゴ！</h2>
        <p style={{ fontWeight: 700, margin: 0 }}>よく みつけたね！</p>
        <button type="button" className="ob-btn" onClick={onClose}>
          つづける
        </button>
      </div>
    </div>
  );
}

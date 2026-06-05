import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { Language } from '../../types';

interface Props { onClose: () => void }

export function PrintModal({ onClose }: Props) {
  const [lang, setLang]     = useState<Language>('sanskrit');
  const [withSL, setWithSL] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  async function handleDownload() {
    setStatus('loading');

    const store    = useGameStore.getState();
    const prevLang = store.language;
    const prevSL   = store.slVisible;

    store.setLanguage(lang);
    store.setSlVisible(withSL);

    // Wait for SVG recompute (debounced at 150ms inside Board)
    await new Promise(r => setTimeout(r, 450));

    const scrollWrap = document.getElementById('board-scroll') as HTMLElement | null;
    if (!scrollWrap) { setStatus('idle'); return; }

    const prevTransform    = scrollWrap.style.transform;
    const prevMarginBottom = scrollWrap.style.marginBottom;
    scrollWrap.style.transform    = 'none';
    scrollWrap.style.marginBottom = '0';
    scrollWrap.setAttribute('data-printing', '');

    // Let layout settle after removing scale transform
    await new Promise(r => setTimeout(r, 60));

    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(scrollWrap, { pixelRatio: 3, cacheBust: true });
      const a = document.createElement('a');
      a.download = `mokshapat-${lang}.png`;
      a.href = dataUrl;
      a.click();
      setStatus('done');
    } catch (e) {
      console.error(e);
      setStatus('idle');
    } finally {
      scrollWrap.style.transform    = prevTransform;
      scrollWrap.style.marginBottom = prevMarginBottom;
      scrollWrap.removeAttribute('data-printing');
      store.setLanguage(prevLang);
      store.setSlVisible(prevSL);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={[
          'bg-gradient-to-br from-parchment-100 to-parchment-200',
          'border-2 border-brown-500 rounded-2xl shadow-2xl',
          'p-6 mx-4 w-full max-w-sm flex flex-col gap-5',
        ].join(' ')}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-brown-700">🖨 Download Board</h2>
          <button
            onClick={onClose}
            className="text-brown-500 hover:text-brown-700 text-[20px] leading-none"
          >
            ✕
          </button>
        </div>

        {/* Language */}
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-bold text-brown-700">Language</span>
          <div className="inline-flex rounded-full border-2 border-brown-500 bg-parchment-300 overflow-hidden self-start">
            {(['sanskrit', 'english'] as Language[]).map((l, i) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={[
                  'px-4 py-1.5 text-[13px] font-bold transition-all duration-200',
                  i > 0 ? 'border-l-2 border-brown-500' : '',
                  lang === l
                    ? 'bg-saddle text-parchment-100 shadow-inner'
                    : 'text-brown-700 hover:bg-parchment-200',
                ].join(' ')}
              >
                {l === 'english' ? 'English' : 'संस्कृत'}
              </button>
            ))}
          </div>
        </div>

        {/* Snakes & Ladders toggle */}
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-brown-700">Show Snakes & Ladders</span>
          <button
            onClick={() => setWithSL(v => !v)}
            className={[
              'relative w-11 h-6 rounded-full border-2 transition-colors duration-200',
              withSL ? 'bg-saddle border-saddle' : 'bg-parchment-400 border-brown-500',
            ].join(' ')}
            aria-checked={withSL}
            role="switch"
          >
            <span className={[
              'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
              withSL ? 'translate-x-[22px]' : 'translate-x-0.5',
            ].join(' ')} />
          </button>
        </div>

        {/* Note */}
        <p className="text-[11px] text-brown-500 leading-relaxed">
          Downloads a PNG at 3× resolution — open in any viewer and print.
          Best printed on A3 paper.
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={status === 'loading'}
            className={[
              'flex-1 py-2.5 text-[14px] font-bold rounded-xl',
              'bg-gradient-to-br from-parchment-400 to-parchment-500',
              'border-2 border-brown-500 text-brown-800',
              'shadow-md transition-all duration-200',
              'hover:enabled:from-parchment-300 disabled:opacity-60',
            ].join(' ')}
          >
            {status === 'loading' ? '⏳ Rendering…' : status === 'done' ? '✓ Downloaded' : '⬇ Download PNG'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-[13px] font-bold rounded-xl border-2 border-brown-500 text-brown-600 hover:bg-parchment-300 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

import { useGameStore } from '../../store/gameStore';
import { LanguageDropdown } from '../atoms/LanguageDropdown';

export function IntroScreen() {
  const { language, setShowIntro } = useGameStore();

  function startGame() {
    setShowIntro(false);
  }

  const title = 'Mokshapat';
  const startLabel  = language === 'english' ? '🎲 Start Game' : '🎲 क्रीडाम् आरभ';

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col" style={{
      background: 'radial-gradient(ellipse at 50% 0%, rgba(201,161,74,0.16) 0%, transparent 45%), radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.5) 100%), linear-gradient(180deg,#211826 0%,#1d1420 35%,#190f18 65%,#220a0e 100%)',
    }}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2a1c10] to-[#1c1209] px-5 py-3.5 flex justify-between items-center shadow-[0_3px_12px_rgba(0,0,0,0.5)] border-b-2 border-[#b8902f]">
        <h1 className="font-display text-[24px] font-bold m-0 tracking-[0.12em]" style={{ color: '#e7c168', textShadow: '0 0 16px rgba(201,161,74,0.4), 0 2px 4px rgba(0,0,0,0.6)' }}>
          ॐ {title} ॐ
        </h1>
        <LanguageDropdown />
      </div>

      {/* Scrollable content — parchment scroll on dark ground */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="max-w-[900px] w-full mx-auto bg-gradient-to-b from-parchment-50 to-parchment-100 text-brown-800 rounded-xl border-2 border-[#b8902f]/60 shadow-[0_6px_30px_rgba(0,0,0,0.6)] px-6 py-5">
          {language === 'english'  ? <EnglishContent /> : <SanskritContent />}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-br from-[#2a1c10] to-[#150c06] px-5 py-4 text-center flex flex-col items-center gap-2 border-t-2 border-[#b8902f]">
        <button
          onClick={startGame}
          className={[
            'px-12 py-3.5 text-[20px] font-bold',
            'bg-gradient-to-br from-parchment-100 to-parchment-300 text-brown-800',
            'rounded-[30px]',
            'shadow-[0_4px_15px_rgba(0,0,0,0.5)]',
            'hover:scale-[1.05] hover:shadow-[0_0_24px_rgba(201,161,74,0.55)]',
            'transition-all duration-300 cursor-pointer',
          ].join(' ')}
          style={{ border: '3px solid #c9a14a' }}
        >
          {startLabel}
        </button>
        <p className="text-parchment-300/80 text-[11px] mt-1">
          rebuilt with ❤️ by{' '}
          <a
            href="https://dhawal-pandya.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[#e0b85a] hover:text-[#f4d488] transition-colors"
          >
            Dhawal Pandya
          </a>
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h2 className="font-display text-saddle border-b-2 border-saddle pb-2 mt-5 mb-3 text-[20px] font-bold tracking-wide">{title}</h2>
      {children}
    </>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h3 className="text-[#8a4b14] mt-3 mb-2 text-[16px] font-semibold">{title}</h3>
      {children}
    </>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-r from-brown-500/10 to-transparent pl-4 border-l-4 border-saddle my-3 py-2 pr-2 text-brown-800 leading-relaxed">
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="leading-[1.7] mb-3 text-brown-800">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="ml-5 mb-4 list-disc text-brown-800 space-y-2">{children}</ul>;
}

function LI({ children }: { children: React.ReactNode }) {
  return <li className="leading-[1.6]">{children}</li>;
}

function SanskritContent() {
  return (
    <>
      <Section title="मोक्षपटः — क्रीडा-परिचयः">
        <P>
          <strong>मोक्षपटः</strong>, यः <em>कैवल्यपटः</em> अथवा <em>श्रौतक्रीडाविशेषः</em> इति अपि उच्यते,
          संत-ज्ञानेश्वर-परम्परायाः प्राचीनः भारतीयः आध्यात्मिकः पट-क्रीडा अस्ति। अयं क्रीडा
          केवलं मनोरञ्जनं नास्ति — इयं आध्यात्मिकी साधना अस्ति। प्रत्येकं घरम्, प्रत्येकः सर्पः,
          प्रत्येकं सोपानं च आत्मनः मोक्षयात्रायाः अवस्थाः निरूपयति।
        </P>
        <Highlight>
          <strong>परमं लक्ष्यम्:</strong> <strong>कैवल्यम्</strong> (परम-मोक्षः) प्राप्तुम्,
          यत्र <strong>परा-भक्तिः</strong> सर्वोत्तमा अवस्था। स्वर्गलोकाः, नरकाः, विविध-लोकाश्च
          इस्मिन् मार्गे विचलनानि मात्र सन्ति।
        </Highlight>
      </Section>

      <Section title="नियम-सारः">
        <Sub title="मूल-क्रीडा">
          <UL>
            <LI>खेलकाः <strong>मनुष्यलोकात्</strong> (गृह-क्रमाङ्कः १) पाशक्षेपेण प्रगच्छन्ति</LI>
            <LI><strong>सोपानानि</strong> = आध्यात्मिक-उत्थानम्; <strong>सर्पाः</strong> = आध्यात्मिक-पतनम्</LI>
            <LI>सोपाने पतेत् → उपरि आरोहेत्; सर्प-मुखे पतेत् → पुच्छं यावत् अवरोहेत्</LI>
            <LI>सामान्य-घराणि = तत्र तिष्ठेत् प्रतीक्षेत च (स्थिरास्तित्व-कालः)</LI>
          </UL>
        </Sub>
        <Sub title="विशेष-गन्तव्यानि">
          <UL>
            <LI><strong>महानरकः:</strong> अत्र पतित्वा क्षुद्रनरकं गत्वा पुनः मनुष्यलोकात् आरभेत</LI>
            <LI><strong>मृत्युः (मृत्यू उर्फ कबर):</strong> त्रि-वारं तत्र तिष्ठेत्, ततः महानरकं यायात्</LI>
            <LI><strong>ब्रह्मलोकः, शिवलोकः, वैकुण्ठः:</strong> "सुरक्षित-क्षेत्राणि" — सर्पाः शक्तिहीनाः</LI>
            <LI><strong>गृह-क्रमाङ्काः २८३–२८५:</strong> मोक्षसमीपे। गृह-क्रमाङ्कः २८५ = परम-विजयः</LI>
          </UL>
        </Sub>
        <Sub title="मुख्य-अपवादाः">
          <UL>
            <LI>उच्च-दिव्य-लोकेषु (मोक्षावस्थासु) स्थिताः खेलकाः सर्पैः न पतन्ति</LI>
            <LI>म्लेच्छमत-घरम् (क्रमाङ्कः ३८) → बेहस्तलोकः, किन्तु तत्र सर्पः मृत्युं नयति</LI>
            <LI>उच्च-लोकेभ्यः अवताराः नरके न पतन्ति — ते सेवाय अवतरन्ति, पीडाय न</LI>
          </UL>
        </Sub>
        <Sub title="आध्यात्मिक-आचरण-नियमाः">
          <UL>
            <LI>कोऽङ्कः आवश्यकः इति <strong>न गणयेत्</strong> — निष्काम-कर्मणा क्रीडेत्</LI>
            <LI><strong>न वञ्चयेत्</strong> — मोक्षः कपटेन न लभ्यते</LI>
            <LI><strong>अहङ्कारं त्यजेत्</strong> — "एतत् मम मोहरा" इति वदनं अथवा मुक्त-खेलकस्य अवमाननं आध्यात्मिक-पतनम् आनयति</LI>
            <LI>प्रत्येकं क्रीडारम्भे स्व-कुलदेवतां गुरुं वा स्मरेत्</LI>
            <LI>"अहमेव तत् मोहरा अस्मि" — आत्म-यात्रया एकतां भावयेत्</LI>
          </UL>
        </Sub>
        <Highlight>
          <strong>दर्शनम्:</strong> दिव्यजागृतेः क्षुद्रैः पुनः पुनः क्षणैः, एकतया मैत्र्या च,
          कृपया च व्यक्तिगत-प्रयत्नेन च — एवं त्रिविधेन — आध्यात्मिकी प्रगतिः भवति।
          मोक्षप्राप्तिः दैवी-संरेखनं व्यक्तिगत-परिपक्वतां च अपेक्षते।
        </Highlight>
      </Section>
    </>
  );
}

function EnglishContent() {
  return (
    <>
      <Section title="Game Introduction">
        <P>
          <strong>Mokshapat</strong>, also called <em>Kaivalyapat</em> (The Chart of Liberation)
          or <em>Shrouta Krida Vishesh</em> (A Special Vedic Game), is an ancient Indian spiritual
          board game created in the tradition of Saint Dnyaneshwar. It is the philosophical ancestor
          of modern Snakes &amp; Ladders, but with profound spiritual meaning — each square, snake,
          and ladder represents a stage of the soul's journey toward liberation (Moksha).
        </P>
        <P>
          The game transforms entertainment into spiritual practice. The ultimate goal is to reach{' '}
          <strong>Kaivalya</strong> (Absolute Liberation), with <strong>Parabhakti</strong> (Supreme
          Devotion) as the highest state. All other realms — heavens, hells, and various lokas — are
          merely detours on this path.
        </P>
      </Section>

      <Section title="Core Rules">
        <Sub title="Basic Gameplay">
          <UL>
            <LI>Players start from <strong>Manushyaloka</strong> (human realm, cell 1) and move by rolling dice</LI>
            <LI><strong>Ladders</strong> = spiritual ascent; <strong>Snakes</strong> = spiritual fall</LI>
            <LI>Land on a ladder → climb to its top; land on a snake's head → descend to its tail</LI>
            <LI>Neutral squares = stay and wait (periods of steady existence)</LI>
          </UL>
        </Sub>

        <Sub title="Special Destinations">
          <UL>
            <LI><strong>Mahanarak (Great Hell):</strong> Roll to move to Kshudranarak, then restart from the human realm</LI>
            <LI><strong>Mrityu (Death / Grave):</strong> Must stay 3 turns, then automatically descend to Mahanarak</LI>
            <LI><strong>Brahmaloka, Shivaloka, Vaikuntha:</strong> "Safe zones" where snakes lose their power</LI>
            <LI><strong>Cells 283–285:</strong> Near Moksha. Cell 285 = ultimate victory</LI>
          </UL>
        </Sub>

        <Sub title="Key Exceptions">
          <UL>
            <LI>Players in high celestial realms (Moksha states) cannot fall via snakes</LI>
            <LI>Mlechha Mata (cell 38) leads to Behasta Lok (temporary paradise), but a snake there leads to Mrityu</LI>
            <LI>Avatars (incarnations from high lokas) are immune to hell — they descend to serve, not to suffer</LI>
          </UL>
        </Sub>

        <Sub title="Spiritual Conduct">
          <UL>
            <LI><strong>No calculating</strong> what number you need — play with detachment (Nishkama Karma)</LI>
            <LI><strong>No cheating</strong> — liberation cannot be attained through deceit</LI>
            <LI><strong>No ego</strong> — saying "this is MY piece" or insulting liberated players causes spiritual demotion</LI>
            <LI>Begin each game by remembering your Kuladevata (family deity) or Guru</LI>
            <LI>Maintain the feeling <em>"I am that piece"</em> — identification with the soul's journey</LI>
          </UL>
        </Sub>

        <Highlight>
          <strong>The Philosophy:</strong> The game teaches that spiritual progress comes through
          small, repeated moments of divine awareness (not just intense meditation); unity and
          friendship (no ill-will among players); and both grace AND personal effort — liberation
          requires cosmic alignment and individual readiness.
        </Highlight>
      </Section>
    </>
  );
}


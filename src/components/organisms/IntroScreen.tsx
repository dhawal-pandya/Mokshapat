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
      background: 'radial-gradient(ellipse at center, transparent 40%, rgba(80,50,20,0.3) 100%), linear-gradient(180deg,#f4e4c1 0%,#e8d5a3 30%,#dcc896 70%,#d4bc84 100%)',
    }}>
      {/* Header */}
      <div className="bg-gradient-to-br from-saddle to-[#6b3410] text-parchment-100 px-5 py-3.5 flex justify-between items-center shadow-[0_3px_10px_rgba(0,0,0,0.3)]">
        <h1 className="text-[22px] font-bold text-parchment-100 m-0" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.4)' }}>
          {title}
        </h1>
        <LanguageDropdown />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 max-w-[900px] w-full mx-auto">
        {language === 'english'  ? <EnglishContent /> : <SanskritContent />}
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-br from-[#6b3410] to-saddle px-5 py-4 text-center flex flex-col items-center gap-2">
        <button
          onClick={startGame}
          className={[
            'px-12 py-3.5 text-[20px] font-bold',
            'bg-gradient-to-br from-parchment-100 to-parchment-200 text-saddle',
            'border-3 border-parchment-400 rounded-[30px]',
            'shadow-[0_4px_15px_rgba(0,0,0,0.3)]',
            'hover:scale-[1.05] hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)]',
            'transition-all duration-300 cursor-pointer',
          ].join(' ')}
          style={{ border: '3px solid #d4bc84' }}
        >
          {startLabel}
        </button>
        <p className="text-parchment-300/80 text-[11px] mt-1">
          rebuilt with ❤️ by{' '}
          <a
            href="https://dhawal-pandya.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-parchment-100 transition-colors"
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
      <h2 className="text-saddle border-b-2 border-saddle pb-2 mt-5 mb-3 text-[20px] font-bold">{title}</h2>
      {children}
    </>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h3 className="text-[#6b3410] mt-3 mb-2 text-[16px] font-semibold">{title}</h3>
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
        <P><strong>मोक्षपटः</strong>, यः <em>कैवल्यपटः</em> अथवा <em>श्रौतक्रीडाविशेषः</em> इति अपि उच्यते, संत-ज्ञानेश्वर-परम्परायाः प्राचीनः भारतीयः आध्यात्मिकः पट-क्रीडा अस्ति।</P>
        <Highlight><strong>परमं लक्ष्यम्:</strong> <strong>कैवल्यम्</strong> (मोक्षः) प्राप्तुम् — <strong>परा-भक्तिः</strong> सर्वोत्तमा अवस्था।</Highlight>
      </Section>
      <Section title="नियम-सारः">
        <Sub title="मूल-क्रीडा">
          <UL>
            <LI>खेलकाः <strong>मनुष्यलोकात्</strong> (गृह-क्रमाङ्कः १) आरभन्ते; पाशेन प्रगच्छन्ति</LI>
            <LI><strong>सोपानानि</strong> = आध्यात्मिक-उत्थानम्; <strong>सर्पाः</strong> = आध्यात्मिक-पतनम्</LI>
            <LI>सोपाने पतेत् → उपरि आरोहेत्; सर्प-मुखे पतेत् → पुच्छं यावत् अवरोहेत्</LI>
          </UL>
        </Sub>
        <Sub title="आध्यात्मिक-आचरण-नियमाः">
          <UL>
            <LI>कोऽङ्कः आवश्यकः इति <strong>न गणयेत्</strong> — निष्काम-कर्म</LI>
            <LI><strong>न वञ्चयेत्</strong> — मोक्षः कपटेन न लभ्यते</LI>
            <LI><strong>अहङ्कारं त्यजेत्</strong> — "इदं मम" इति वदनं आध्यात्मिक-पतनम् आनयति</LI>
          </UL>
        </Sub>
        <Highlight><strong>दर्शनम्:</strong> दिव्यजागृतेः क्षुद्रैः पुनः पुनः क्षणैः, एकतया, कृपया च व्यक्तिगत-प्रयत्नेन च आध्यात्मिकी प्रगतिः भवति।</Highlight>
      </Section>
    </>
  );
}

function EnglishContent() {
  return (
    <>
      <Section title="Mokshapat — Game Introduction">
        <P><strong>Mokshapat</strong>, also called <em>Kaivalyapat</em> (The Chart of Liberation) or <em>Shrouta Krida Vishesh</em>, is an ancient Indian spiritual board game created in the tradition of Saint Dnyaneshwar. It is the philosophical ancestor of modern Snakes &amp; Ladders.</P>
        <Highlight><strong>Ultimate Goal:</strong> Reach <strong>Kaivalya</strong> (Absolute Liberation), with <strong>Parabhakti</strong> (Supreme Devotion) as the highest state.</Highlight>
      </Section>
      <Section title="Core Rules">
        <Sub title="Basic Gameplay">
          <UL>
            <LI>Players start from <strong>Manushyaloka</strong> (cell 1) and move by rolling dice</LI>
            <LI><strong>Ladders</strong> = spiritual ascent; <strong>Snakes</strong> = spiritual fall</LI>
            <LI>Land on a ladder → climb to its top; land on a snake's head → descend to its tail</LI>
            <LI>Neutral squares = stay and wait</LI>
          </UL>
        </Sub>
        <Sub title="Special Destinations">
          <UL>
            <LI><strong>Mahanarak (Great Hell):</strong> Roll to move to Kshudranarak, then restart from cell 1</LI>
            <LI><strong>Mrityu (Death/Grave):</strong> Stay 3 turns, then descend to Mahanarak</LI>
            <LI><strong>Cells 283–285:</strong> Near Moksha. Cell 285 = ultimate victory</LI>
          </UL>
        </Sub>
        <Sub title="Spiritual Conduct">
          <UL>
            <LI><strong>No calculating</strong> — play with detachment (Nishkama Karma)</LI>
            <LI><strong>No cheating</strong> — liberation cannot be attained through deceit</LI>
            <LI><strong>No ego</strong> — claiming ownership of the piece causes spiritual demotion</LI>
          </UL>
        </Sub>
        <Highlight><strong>Philosophy:</strong> The game teaches that spiritual progress comes through small, repeated moments of divine awareness, unity and friendship, and both grace AND personal effort.</Highlight>
      </Section>
    </>
  );
}


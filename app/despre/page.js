import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import building from "@/public/img/building.jpg";

export const metadata = { title: "Despre noi" };

export default function Despre() {
  return (
    <>
      <PageHero
        crumb="Despre noi"
        kicker="Prezentarea unității"
        title="O grădiniță cu suflet, în inima Dejului"
        lead="Istoria, misiunea și valorile care ne ghidează în fiecare zi alături de copii."
        image={building}
        imageAlt="Clădirea grădiniței Piticot Dej"
      />

      <section className="section">
        <div className="container split">
          <div className="reveal prose">
            <span className="kicker">Cine suntem</span>
            <h2>Un loc unde copilăria e luată în serios</h2>
            <p>
              Grădinița cu Program Prelungit „Piticot" Dej este o instituție de
              învățământ preșcolar de stat, dedicată educației timpurii de calitate
              pentru copiii cu vârste între 2 și 6 ani. Cu o tradiție de peste trei
              decenii în comunitatea dejeană, am crescut generații întregi de copii
              într-un mediu cald, sigur și stimulativ.
            </p>
            <p>
              Funcționăm cu grupe în secțiile română și maghiară, oferind atât program
              prelungit, cât și program normal. Punem accent pe un act educațional de
              performanță, menit să dezvolte copii sănătoși, creativi și eficienți.
            </p>
            <p>
              Abordarea noastră este holistică și integrată: îmbinăm metode moderne,
              activ-participative, cu grija pentru nevoile emoționale ale fiecărui copil.
            </p>
          </div>
          <div className="reveal facts">
            {facts.map((f) => (
              <div key={f.label} className="fact">
                <span className="fact-num">{f.num}</span>
                <span className="fact-label">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sand">
        <div className="container">
          <div className="grid grid-3">
            {pillars.map((p) => (
              <article key={p.title} className="card reveal">
                <div className={`ico ${p.tint}`}><Icon name={p.icon} /></div>
                <h3>{p.title}</h3>
                <p style={{ color: "var(--ink-soft)", margin: 0 }}>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">Valorile noastre</span>
            <h2>Principiile care ne ghidează</h2>
          </div>
          <div className="grid grid-3">
            {values.map((v) => (
              <div key={v.t} className="val reveal">
                <span className="val-ico"><Icon name={v.i} size={22} /></span>
                <div>
                  <strong>{v.t}</strong>
                  <p>{v.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="band reveal">
            <div>
              <h3 style={{ color: "#fff", marginBottom: 6 }}>Vrei să ne cunoști mai bine?</h3>
              <p style={{ color: "rgba(255,255,255,0.9)", margin: 0 }}>
                Echipa, conducerea și documentele instituției sunt la un click distanță.
              </p>
            </div>
            <div className="band-btns">
              <Link href="/echipa" className="btn btn-light">Cunoaște echipa</Link>
              <Link href="/conducere" className="btn band-ghost">Conducerea <Icon name="arrow" /></Link>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .split { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 56px; align-items: start; }
        .facts { display: grid; gap: 16px; position: sticky; top: 100px; }
        .fact { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 24px 26px; box-shadow: var(--shadow-xs); }
        .fact-num { display: block; font-family: var(--font-display); font-weight: 400; font-size: 2rem; color: var(--clay-deep); }
        .fact-label { color: var(--ink-soft); font-weight: 500; font-size: 0.92rem; }
        .val { display: flex; gap: 18px; padding: 10px 0; }
        .val-ico { flex-shrink: 0; width: 52px; height: 52px; border-radius: 14px; background: var(--clay-soft); color: var(--clay-deep); display: grid; place-items: center; }
        .val strong { font-family: var(--font-display); font-weight: 500; font-size: 1.12rem; }
        .val p { color: var(--ink-soft); margin: 4px 0 0; font-size: 0.94rem; }
        .band { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; background: var(--ink); border-radius: var(--radius-lg); padding: 38px 44px; }
        .band-btns { display: flex; gap: 12px; flex-wrap: wrap; }
        .band-ghost { background: rgba(255,255,255,0.16); border: 1.5px solid rgba(255,255,255,0.4); color: #fff; }
        .band-ghost:hover { background: rgba(255,255,255,0.26); transform: translateY(-2px); }
        @media (max-width: 860px) { .split { grid-template-columns: 1fr; } .facts { position: static; grid-template-columns: 1fr 1fr; } }
      ` }} />
    </>
  );
}

const facts = [
  { num: "30+", label: "ani de experiență" },
  { num: "8", label: "grupe educative" },
  { num: "RO & HU", label: "două secții" },
  { num: "06:30–17:30", label: "program prelungit" },
];

const pillars = [
  { icon: "target", tint: "clay", title: "Misiunea noastră", text: "Să oferim fiecărui copil un start educațional solid, într-un mediu sigur și afectuos, care încurajează curiozitatea, autonomia și bucuria de a învăța." },
  { icon: "star", tint: "sun", title: "Viziunea noastră", text: "O grădiniță reper în comunitate, unde excelența educațională se întâlnește cu grija autentică pentru dezvoltarea armonioasă a fiecărui copil." },
  { icon: "book", tint: "sage", title: "Istoricul nostru", text: "De peste 30 de ani însoțim copiii din Dej la primii pași în educație, adaptându-ne continuu la nevoile fiecărei generații." },
];

const values = [
  { i: "heart", t: "Grijă & siguranță", d: "Binele și securitatea copilului sunt mereu pe primul loc." },
  { i: "palette", t: "Creativitate", d: "Încurajăm imaginația și exprimarea liberă prin joc și artă." },
  { i: "users", t: "Respect & incluziune", d: "Fiecare copil și familie sunt primiți cu căldură, indiferent de origine." },
  { i: "leaf", t: "Dezvoltare armonioasă", d: "Sprijinim creșterea fizică, emoțională, socială și cognitivă." },
  { i: "book", t: "Educație de calitate", d: "Personal calificat și metode moderne, centrate pe copil." },
  { i: "building", t: "Comunitate", d: "Construim împreună cu părinții o a doua familie pentru copii." },
];

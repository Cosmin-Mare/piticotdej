import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import culture from "@/public/img/p7.jpg";

export const metadata = { title: "Activități" };

export default function Activitati() {
  return (
    <>
      <PageHero
        crumb="Activități"
        kicker="Domenii experiențiale"
        title="Activități care aprind curiozitatea"
        lead="Învățăm prin joc, mișcare, artă și descoperire — un program echilibrat care dezvoltă fiecare latură a copilului."
        image={culture}
        imageAlt="Copii în activitate tematică"
      />

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {domains.map((d, i) => (
              <article key={d.t} className="card reveal" style={{ transitionDelay: `${i * 50}ms` }}>
                <div className={`ico ${d.tint}`}><Icon name={d.i} /></div>
                <h3>{d.t}</h3>
                <p style={{ color: "var(--ink-soft)", margin: 0 }}>{d.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sand">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">Activități opționale</span>
            <h2>Mai mult decât o zi obișnuită</h2>
            <p className="lead">Activități extracurriculare care îmbogățesc experiența celor mici (în funcție de grupă și opțiuni).</p>
          </div>
          <div className="grid grid-4">
            {extras.map((e) => (
              <div key={e.t} className="extra reveal">
                <span className="extra-ico"><Icon name={e.i} size={24} /></span>
                <strong>{e.t}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">Calendar</span>
            <h2>Evenimente de peste an</h2>
          </div>
          <div className="events reveal">
            {events.map((e) => (
              <div key={e.t} className="event">
                <div className="event-when">{e.when}</div>
                <div className="event-body">
                  <h3>{e.t}</h3>
                  <p>{e.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .extra { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; box-shadow: var(--shadow-xs); transition: transform 0.2s; }
        .extra:hover { transform: translateY(-4px); }
        .extra-ico { width: 50px; height: 50px; border-radius: 14px; background: var(--sand); color: var(--clay-deep); display: grid; place-items: center; }
        .extra strong { font-family: var(--font-display); font-weight: 500; }
        .events { display: grid; gap: 14px; max-width: 820px; margin: 0 auto; }
        .event { display: grid; grid-template-columns: 140px 1fr; gap: 22px; background: #fff; border: 1px solid var(--line); border-left: 4px solid var(--clay); border-radius: var(--radius); padding: 24px 28px; box-shadow: var(--shadow-xs); }
        .event-when { font-family: var(--font-display); font-weight: 500; color: var(--clay-deep); }
        .event-body h3 { font-size: 1.18rem; margin-bottom: 4px; }
        .event-body p { color: var(--ink-soft); margin: 0; font-size: 0.93rem; }
        @media (max-width: 560px) { .event { grid-template-columns: 1fr; gap: 6px; } }
      ` }} />
    </>
  );
}

const domains = [
  { i: "chat", tint: "clay", t: "Limbă și comunicare", d: "Povești, poezii și jocuri de vocabular care dezvoltă exprimarea liberă." },
  { i: "compass", tint: "sky", t: "Științe & matematică", d: "Numere, forme și mici experimente care explică lumea prin joc." },
  { i: "palette", tint: "rose", t: "Arte & creativitate", d: "Desen, pictură, modelaj și colaje pentru imaginație fără limite." },
  { i: "music", tint: "sun", t: "Muzică & ritm", d: "Cântece, dans și instrumente care bucură și calmează." },
  { i: "run", tint: "sage", t: "Educație fizică", d: "Mișcare, jocuri sportive și coordonare pentru un corp sănătos." },
  { i: "globe", tint: "clay", t: "Om și societate", d: "Reguli, emoții și relații — primele lecții despre a trăi împreună." },
];

const extras = [
  { i: "globe", t: "Limba engleză" },
  { i: "music", t: "Dans" },
  { i: "chat", t: "Teatru & roluri" },
  { i: "spark", t: "Joc educativ digital" },
  { i: "leaf", t: "Mișcare & natură" },
  { i: "palette", t: "Atelier de artă" },
  { i: "book", t: "Ateliere de lectură" },
  { i: "heart", t: "Educație emoțională" },
];

const events = [
  { when: "Septembrie", t: "Bun venit la grădiniță!", d: "Zile de acomodare și cunoaștere a noilor prieteni și educatoare." },
  { when: "Decembrie", t: "Serbarea de Crăciun", d: "Spectacole, colinde și vizita lui Moș Crăciun pentru fiecare grupă." },
  { when: "Martie", t: "Mărțișor & Ziua Mamei", d: "Ateliere de creație și surprize pregătite cu drag pentru părinți." },
  { when: "Iunie", t: "Serbarea de absolvire", d: "Grupa mare își ia rămas bun, gata de școală, într-o zi de sărbătoare." },
];

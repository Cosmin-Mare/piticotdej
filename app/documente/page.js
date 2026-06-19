import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";

export const metadata = { title: "Documente" };

export default function Documente() {
  return (
    <>
      <PageHero
        crumb="Documente"
        kicker="Transparență instituțională"
        title="Documente publice"
        lead="Conform Legii nr. 544/2001 privind liberul acces la informațiile de interes public, legislației ARACIP și a reglementărilor în vigoare."
      />

      <section className="section">
        <div className="container">
          {groups.map((g) => (
            <div key={g.title} className="doc-group reveal">
              <div className="dg-head">
                <span className={`ico ${g.tint}`} style={{ marginBottom: 0 }}><Icon name={g.icon} /></span>
                <h2>{g.title}</h2>
              </div>
              <div className="grid grid-3">
                {g.docs.map((d) => (
                  <a key={d} href="#" className="doc">
                    <span className="doc-ico"><Icon name="doc" size={22} /></span>
                    <span className="doc-name">{d}</span>
                    <span className="doc-dl">PDF</span>
                  </a>
                ))}
              </div>
            </div>
          ))}

          <p className="doc-disclaimer reveal">
            Documentele vor fi încărcate ca fișiere PDF reale la realizarea site-ului final.
          </p>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .doc-group { margin-bottom: 56px; }
        .dg-head { display: flex; align-items: center; gap: 18px; margin-bottom: 26px; }
        .dg-head h2 { margin: 0; font-size: clamp(1.4rem, 2.4vw, 1.9rem); }
        .doc { display: flex; align-items: center; gap: 14px; background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 18px 20px; box-shadow: var(--shadow-xs); transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s; }
        .doc:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: var(--clay); }
        .doc-ico { color: var(--clay-deep); flex-shrink: 0; }
        .doc-name { flex: 1; font-weight: 400; color: var(--ink); font-size: 0.94rem; line-height: 1.4; }
        .doc-dl { font-weight: 600; font-size: 0.72rem; letter-spacing: 0.05em; color: var(--clay-deep); background: var(--clay-soft); padding: 5px 11px; border-radius: var(--radius-pill); flex-shrink: 0; }
        .doc-disclaimer { text-align: center; color: var(--muted); font-size: 0.9rem; background: var(--sand); border-radius: var(--radius); padding: 20px; }
      ` }} />
    </>
  );
}

const groups = [
  {
    title: "Prezentare & organizare", icon: "building", tint: "clay",
    docs: [
      "Prezentarea unității (istoric, misiune, viziune)",
      "Structura organizatorică a unității",
      "Organigrama instituției",
      "Componența Consiliului de Administrație",
      "Componența Consiliului Profesoral",
    ],
  },
  {
    title: "Regulamente & documente școlare", icon: "doc", tint: "sky",
    docs: [
      "Regulamentul de organizare și funcționare (ROFUIP)",
      "Regulamentul intern al unității",
      "Procedura de înscriere a preșcolarilor",
      "Codul de etică",
    ],
  },
  {
    title: "Strategie & management", icon: "target", tint: "sage",
    docs: [
      "Strategia de dezvoltare instituțională",
      "Plan managerial anual",
      "Plan operațional",
      "Raport anual de evaluare internă (ARACIP)",
      "Plan de îmbunătățire CEAC",
    ],
  },
  {
    title: "Buget & transparență financiară", icon: "euro", tint: "sun",
    docs: [
      "Bugetul de venituri și cheltuieli",
      "Execuția bugetară",
      "Situații financiare",
    ],
  },
  {
    title: "Integritate & declarații", icon: "scale", tint: "rose",
    docs: [
      "Declarații de avere",
      "Declarații de interese",
      "Plan de integritate",
    ],
  },
  {
    title: "Proiecte & protecția datelor", icon: "lock", tint: "clay",
    docs: [
      "Proiecte educaționale / PNRR / Erasmus+",
      "Politica de confidențialitate (GDPR)",
      "Programul de funcționare / orar",
      "Date de contact și program audiențe",
    ],
  },
];

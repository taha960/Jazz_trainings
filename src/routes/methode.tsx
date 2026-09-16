import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/methode")({ component: Methode });

function Methode() {
  return (
    <main className="flex-1 px-5 sm:px-8 pb-20">
      <article className="max-w-2xl mx-auto">
        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted mb-3">Méthode</p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight leading-tight">
          Exercice → possibilité motrice → disponibilité → standard.
        </h1>
        <p className="mt-6 text-muted leading-relaxed">
          Tu as déjà l’instrument, le rock, le blues, la pentatonique. Le travail ici n’est pas d’apprendre
          la guitare, ni de refaire un cursus d’harmonie. C’est d’installer une intuition jazz sur le manche
          — par deux familles complémentaires, jamais concurrentes.
        </p>

        <section className="mt-12 grid gap-8 sm:grid-cols-2">
          <div className="rounded-lg bg-surface p-5">
            <h2 className="font-display text-2xl">Larsen</h2>
            <p className="text-xs uppercase tracking-widest text-muted mt-1">Coordonnées</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Où sont les structures harmoniques importantes, et comment les utiliser ? Gamme, tierces,
              triades, arpèges, shells, chord tones, puis phrase.
            </p>
            <ol className="mt-4 space-y-2 text-sm">
              <li>1 · Melodic Harmony</li>
              <li>2 · Shell voicings</li>
              <li>3 · Chord-tone soloing</li>
              <li>4 · Composer lentement</li>
              <li>5 · Être plus mélodique</li>
            </ol>
          </div>
          <div className="rounded-lg bg-surface p-5">
            <h2 className="font-display text-2xl">HTPB10</h2>
            <p className="text-xs uppercase tracking-widest text-muted mt-1">Trajectoires</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Quels chemins mélodiques la main peut-elle parcourir ? Cellules de quatre notes, chunking,
              mouvement conjoint, jonctions chromatiques, flux de croches. Source : transcription
              Htpb1O — rien n’est inventé, rien n’est « corrigé ».
            </p>
          </div>
        </section>

        <section className="mt-12 space-y-4 text-[0.975rem] leading-relaxed text-muted">
          <p>
            Une future phrase peut contenir un fragment d’arpège, un tétra, un chromatisme, une chord tone —
            sans que tu aies à nommer ces catégories en jouant. L’analyse appartient à l’acquisition. Le but
            est que ces objets deviennent des gestes entendus.
          </p>
          <p>
            Les standards restent le deuxième pôle. Ils n’entrent pas de force dans chaque exercice. À la fin
            d’une séance, un transfert facultatif, court : jouer librement, observer si quelque chose
            apparaît.
          </p>
          <p>
            La réussite n’est pas la vitesse. C’est l’absence d’hésitation, la continuité, une phrase que tu
            trouves vraiment musicale.
          </p>
        </section>

        <Link
          to="/"
          className="inline-flex mt-12 h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground"
        >
          Générer une séance
        </Link>
      </article>
    </main>
  );
}

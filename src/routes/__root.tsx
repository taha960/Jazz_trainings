import { createRootRoute, HeadContent, Link, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppErrorComponent } from "@/lib/error-component";
import appCss from "../styles.css?url";

const APP_NAME = "Séance";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Générateur de séances d’exercices de guitare jazz — Larsen et HTPB10. Une séance, une tonalité, un geste.",
      },
      { name: "theme-color", content: "#12110f" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Mono:wght@400;500&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;1,400&display=swap",
      },
    ],
  }),
  errorComponent: AppErrorComponent,
  component: Root,
});

function Root() {
  return (
    <html lang="fr" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-bg text-fg font-sans">
        <PreviewHostBridge />
        <AuthProvider>
          <div className="min-h-dvh flex flex-col">
            <header className="px-5 sm:px-8 py-4 flex items-baseline justify-between gap-4">
              <Link to="/" className="font-display text-xl tracking-tight text-fg">
                Séance
              </Link>
              <nav className="flex gap-5 text-sm text-muted">
                <Link to="/" className="hover:text-fg transition-colors duration-[var(--motion-quick)]">
                  Atelier
                </Link>
                <Link
                  to="/methode"
                  className="hover:text-fg transition-colors duration-[var(--motion-quick)]"
                >
                  Méthode
                </Link>
                <Link
                  to="/historique"
                  className="hover:text-fg transition-colors duration-[var(--motion-quick)]"
                >
                  Historique
                </Link>
              </nav>
            </header>
            <Outlet />
          </div>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

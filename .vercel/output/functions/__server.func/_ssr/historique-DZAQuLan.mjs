import { a as useHydrated, i as useApp } from "./store-CesfUo57.mjs";
import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/historique-DZAQuLan.js
var import_jsx_runtime = require_jsx_runtime();
function Historique() {
	const history = useApp((s) => s.history);
	const load = useApp((s) => s.load);
	const hydrated = useHydrated();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "flex-1 px-5 sm:px-8 pb-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl mx-auto",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.65rem] uppercase tracking-[0.2em] text-muted mb-3",
					children: "Historique"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: "Séances précédentes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "Conservées sur cet appareil. Rouvrir une séance ne la régénère pas."
				}),
				!hydrated || history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-10 text-muted",
					children: hydrated ? "Pas encore de séance." : "…"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 divide-y divide-border",
					children: history.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "py-4 flex items-baseline justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-muted",
							children: s.sessionKey
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-lg mt-0.5",
							children: [
								s.kind === "HTPB10" ? "Trajectoires" : "Coordonnées",
								" · ",
								s.destKey
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							onClick: () => load(s),
							className: "text-sm text-accent hover:text-fg transition-colors min-h-11 inline-flex items-center",
							children: "Rouvrir"
						})]
					}, s.sessionKey + s.createdAt))
				})
			]
		})
	});
}
//#endregion
export { Historique as component };

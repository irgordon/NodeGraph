<p align="center">
  <img src="resources/banner-hires.png" width="100%" alt="NodeGraph — Structure the paper. Don't just read it." />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/VS%20Code-Extension-007ACC?logo=visualstudiocode&logoColor=white&style=for-the-badge" alt="VS Code Extension" />
  <img src="https://img.shields.io/badge/version-0.0.0-orange?style=for-the-badge" alt="Version 0.0.0" />
  <img src="https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge" alt="MIT License" />
</p>

---

<p align="center"><b>Read one paper closely. See what many papers say together.</b></p>

NodeGraph turns research PDFs into visual, source-backed notes. Use an AI agent to build a graph, or create one by hand. Each claim can link to an exact quote, so you can open the source PDF and check the text for yourself.

This fork begins a new NodeGraph application built for multi-paper research. It starts from the working NodeGraph 0.7.2 editor while beginning its own version history at 0.0.0.

> **Development status:** Phase 1 is now implemented in the development branch. NodeGraph can create a local literature project, register paper graphs and PDFs, search paper metadata, check source links, rebuild indexes, and reject outdated writes. Existing `.nodegraph.json` files keep their current format and continue to open, edit, verify, and export as before. Comparison screens and later synthesis workflows are still planned.

---

## Built for Doctoral Research

The workspace is designed to support doctoral-level work that examines many PDFs and analyzes the papers together. Phase 1 creates a trusted project foundation for a large reading list while keeping each paper linked to its source PDF.

The full product direction will help you:

- Bring many paper graphs into one research project.
- Compare papers by topic, method, population, theory, setting, and finding.
- See where studies agree, disagree, add limits, or use different definitions.
- Open any major claim and follow it back to the finding, exact quote, and source PDF.
- Review AI suggestions before they become accepted research notes.
- Test a possible research gap against the full paper collection before relying on it.
- Connect research gaps to research questions and evidence.
- Build chapter outlines, comparison tables, and review reports from approved work.

This approach is meant for literature reviews, dissertation planning, qualifying papers, evidence reviews, and other projects where the quality of the source trail matters as much as the final insight.

### What is ready and what comes next

| Available now | Planned for later phases |
|---|---|
| Visual editing, PDF quote checks, and HTML export for one paper | Shared comparison fields and synthesis matrix views |
| Local projects that register many paper graphs and PDFs | Cross-paper claims and conflict review |
| Search across indexed title, author, year, DOI, paper ID, and tags | Gap testing and research-question workflows |
| Checks for missing files, changed PDFs, stale quotes, and broken evidence links | Researcher review screens and dissertation planning |
| Rebuildable paper and evidence indexes | Comparison tables, outlines, and synthesis reports |
| Safe project writes with revision checks and an audit record | A visual workflow for merging competing edits |

Phase 1 provides the project structure and trust checks needed before deeper analysis is added. Later phases will add comparison views, research claims, conflict review, gap testing, research-question support, and dissertation planning.

Read the product and technical plans:

- [Literature project guide](docs/PROJECTS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Research model](docs/SYNTHESIS_DOMAIN_MODEL.md)
- [Research workflows](docs/SYNTHESIS_WORKFLOWS.md)
- [Roadmap](docs/ROADMAP.md)

---

## See NodeGraph in Action

<p align="center">
  <img src="resources/demo-ex4.webp" width="100%" alt="Full agent run building the demo/ex4 nodegraph from the 3D Gaussian Splatting paper, sped up, looping" />
</p>
<p align="center"><b>An AI agent reads one paper and builds a complete graph linked to the source.</b></p>

**Start with one paper in four steps:**

1. Install **NodeGraph** from the VS Code Marketplace
2. Right-click your paper's folder and run `NodeGraph: Copy Agent Spec to Workspace`
3. Paste the generated `.prompt/english.md` (or `korean.md`) into your agent, filling in the PDF's path
4. Open the finished `.nodegraph.json`

---

## Why Researchers Use NodeGraph

- **Understand the full argument.** Break a paper into claims, questions, evidence, and links instead of keeping a flat summary.
- **Check AI work.** Keep the source quote beside the note and jump to the matching text in the PDF.
- **Handle technical papers.** Put math, tables, images, and notes together in the same visual card.
- **Keep control of your files.** Store the graph as plain JSON on your computer, with no account or online service.
- **Share the result.** Export a graph as one interactive HTML file that opens in a browser.

---

## From Reading to Understanding

A paper is a straight line of text, but its ideas are connected. A finding may depend on a method, a population, an earlier claim, or a limit that appears many pages later. NodeGraph makes those links visible.

The single-paper editor helps you take one paper apart and verify your notes against the source. The literature project now organizes many of those graphs, searches their metadata, and checks that their source trail remains intact. Planned comparison tools will make agreements, conflicts, limits, and missing evidence visible instead of blending every paper into one summary.

AI can speed up the work, but the researcher stays in charge. AI-created notes and links will remain suggestions until a researcher reviews them. Important conclusions will keep a clear path back to the PDFs that support them.

---

## Screenshots

<p align="center">
  <img src="resources/screenshot-html-export.png" width="100%" alt="Editor on the left and the exported standalone HTML on the right, rendering the same node tree identically" />
</p>
<p align="center"><b>Editor and exported HTML side by side — same layout, same content</b></p>

<p align="center">
  <img src="resources/screenshot-debug-grid.png" width="100%" alt="Debug grid overlay in the editor and exported HTML, marking hop-level and main-topic-cluster boundaries, with the Ctrl+F search panel open and matching nodes highlighted in red" />
</p>
<p align="center"><b>Debug grid and Ctrl+F search<br/>hop-level/main-topic-cluster boundaries, plus in-canvas search with matching nodes highlighted, in both the editor and the export</b></p>

<p align="center">
  <img src="resources/screenshot-pdf-jump.png" width="100%" alt="An original-text quote outlined in a red box in the editor, connected by a red arrow to the matching highlighted sentence in the source PDF on the right" />
</p>
<p align="center"><b>PDF quote-jump<br/>right-click an original-text quote to open the source PDF and highlight the matching sentence (red box/arrow added for illustration)</b></p>

---

## Features

The single-paper features below remain available in the 0.0.0 development baseline.

| | |
|---|---|
| **Rich node content** | Put Markdown tables, math, images, and folded sections in the same card. |
| **Automatic layout** | Expand a branch without pushing unrelated branches out of place. |
| **Clear connections** | Wires route around cards and remain easy to follow as the graph grows. |
| **PDF quote check** | Right-click a source quote to open the PDF, jump to the page, and highlight the matching text. |
| **Search** | Search titles, notes, source quotes, and folded sections, with matches marked inside each card. |
| **Layout guide** | Turn on a grid to find spacing and layout problems. |
| **HTML export** | Share one interactive file with search, highlighting, and the same graph layout. |
| **AI-ready format** | Give an AI agent the included guide so it can read and write graph files. |

See [the complete feature list](docs/FEATURES.md) for editing, layout, search, images, files, and export details.

---

## Agent / AI Editing

Before asking an AI agent to work on a paper, run `NodeGraph: Copy Agent Spec to Workspace` once. The command adds these files to the folder you choose:

- `.agent/NODEGRAPH_SPEC.md` — the graph format and writing rules.
- `.agent/ENVIRONMENT.md` — the PDF and image tools available on your computer.
- `.prompt/english.md` and `.prompt/korean.md` — prompts you can give to an agent.

Right-click a folder in the Explorer to place the files there. If you use the Command Palette, NodeGraph uses the only open workspace folder or asks you to choose one. The agent guide is added only when you run this command.

> **AI agents: read these two files before doing anything:**
> 1. `.agent/NODEGRAPH_SPEC.md` — full JSON schema, syntax rules, and constraints
> 2. `.agent/ENVIRONMENT.md` — lists which Python libraries and CLI tools are installed on this machine (PDF reading, image processing, etc.)
>
> Key rules from the spec:
> - Backslashes in KaTeX **must be doubled** in JSON strings (`\\frac`, `\\sqrt`, `\\text`)
> - Prefer `$$...$$` display blocks for formulas — inline `$...$` only for short in-sentence symbols
> - Literal currency dollars must be escaped: `\$4.28/GB` (in JSON strings: `\\$4.28/GB`) — a bare `$` opens an inline-math region
> - When writing content in a non-English language, pair each key technical term with its original English form (see `.agent/NODEGRAPH_SPEC.md` for the exact convention)
> - A paper may have more than one major contribution; include each one
> - `toggleItems[].content` renders exactly like `node.content` — Markdown tables, KaTeX, and `[[IMG:filename:WxH]]` tokens all work inside toggles too
> - Always update the `"modified"` timestamp after every edit

The included `.agent/NODEGRAPH_SPEC.md` tells an AI agent how to build a valid graph. It covers the JSON format, IDs, math and Markdown rules, and the steps for turning a PDF into a node graph.

Five AI-built examples ship with the extension, so you can review a finished graph before making your own:

- `demo/ex1` — "Attention Is All You Need"
- `demo/ex2` — "Point Transformer"
- `demo/ex3` — "Mooncake"
- `demo/ex4` — "3D Gaussian Splatting"
- `demo/ex5` — "Mental Illness Terms and Hermeneutic Hijacking"

Together, they show math, tables, folded sections, and detailed question nodes. The fifth example is a philosophy paper, which shows that NodeGraph is not limited to computer science or papers with a standard methods section.

**Typical agent workflow:**

1. Right-click the project folder and run `NodeGraph: Copy Agent Spec to Workspace`. If the folder is the workspace root, right-click the empty space below the file list.
2. Tell your agent to read `.agent/NODEGRAPH_SPEC.md` and `.agent/ENVIRONMENT.md`
3. Read or create the target `.nodegraph.json`
4. Edit the JSON directly
5. Click **Reload** in the toolbar to see the updated graph without closing/reopening the file

### Example prompt

<b>English</b> | <a href="https://github.com/Jeong-jin-Han/NodeGraph/blob/main/docs/ko/README.md#example-prompt">한국어</a>

After running `NodeGraph: Copy Agent Spec to Workspace`, fill in the PDF path and give this prompt to your agent. The command also saves this prompt as `.prompt/english.md`, along with a Korean version.

```
PDF_ABSOLUTE_PATH = <PDF_ABSOLUTE_PATH>
PROJECT_FOLDER = dirname(PDF_ABSOLUTE_PATH)

PROJECT_FOLDER/.agent/NODEGRAPH_SPEC.md and PROJECT_FOLDER/.agent/ENVIRONMENT.md
are already prepared for you — read both in full.

Based on the paper and those two files, briefly explain what kind of
nodegraph you can build from it. This extension ships a worked example
at demo/ex1/attention-is-all-you-need.nodegraph.json (inside its own
install folder) as a reference for depth/structure — check it if
useful, then build ours the same way for this paper.

Write all node content in English.

Follow the spec exactly, save the result inside PROJECT_FOLDER, and run
end to end without asking me anything. Tell me when done.
```

> **Benchmark** — an agent read the PDF, planned, and wrote each nodegraph end to end with no manual cleanup, on papers it had never seen before. Tested with Claude Code; other agentic coding tools should work the same way, since all it needs is the plain-markdown spec and prompt in `.agent`/`.prompt`:

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-ffffff?logo=data:image/svg%2bxml;base64,PHN2ZyBoZWlnaHQ9IjIwMCIgc3R5bGU9ImZsZXg6bm9uZTtsaW5lLWhlaWdodDoxIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPkNsYXVkZSBDb2RlPC90aXRsZT48cGF0aCBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMC45OTggMTAuOTQ5SDI0djMuMTAyaC0zdjMuMDI4aC0xLjQ4N1YyMEgxOHYtMi45MjFoLTEuNDg3VjIwSDE1di0yLjkyMUg5VjIwSDcuNDg4di0yLjkyMUg2VjIwSDQuNDg3di0yLjkyMUgzVjE0LjA1SDBWMTAuOTVoM1Y1aDE3Ljk5OHY1Ljk0OXpNNiAxMC45NDloMS40ODhWOC4xMDJINnYyLjg0N3ptMTAuNTEgMEgxOFY4LjEwMmgtMS40OXYyLjg0N3oiIGZpbGw9IiNEOTc3NTciIGZpbGwtcnVsZT0iZXZlbm9kZCI+PC9wYXRoPjwvc3ZnPg==&style=for-the-badge" alt="Claude Code" />
  <img src="https://img.shields.io/badge/Codex-ffffff?logo=data:image/svg%2bxml;base64,PHN2ZyBoZWlnaHQ9IjIwMCIgc3R5bGU9ImZsZXg6bm9uZTtsaW5lLWhlaWdodDoxIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRpdGxlPkNvZGV4PC90aXRsZT48cGF0aCBkPSJNMTkuNTAzIDBINC40OTZBNC40OTYgNC40OTYgMCAwMDAgNC40OTZ2MTUuMDA3QTQuNDk2IDQuNDk2IDAgMDA0LjQ5NiAyNGgxNS4wMDdBNC40OTYgNC40OTYgMCAwMDI0IDE5LjUwM1Y0LjQ5NkE0LjQ5NiA0LjQ5NiAwIDAwMTkuNTAzIDB6IiBmaWxsPSIjZmZmIj48L3BhdGg+PHBhdGggZD0iTTkuMDY0IDMuMzQ0YTQuNTc4IDQuNTc4IDAgMDEyLjI4NS0uMzEyYzEgLjExNSAxLjg5MS41NCAyLjY3MyAxLjI3NS4wMS4wMS4wMjQuMDE3LjAzNy4wMjFhLjA5LjA5IDAgMDAuMDQzIDAgNC41NSA0LjU1IDAgMDEzLjA0Ni4yNzVsLjA0Ny4wMjIuMTE2LjA1N2E0LjU4MSA0LjU4MSAwIDAxMi4xODggMi4zOTljLjIwOS41MS4zMTMgMS4wNDEuMzE1IDEuNTk1YTQuMjQgNC4yNCAwIDAxLS4xMzQgMS4yMjMuMTIzLjEyMyAwIDAwLjAzLjExNWMuNTk0LjYwNy45ODggMS4zMyAxLjE4MyAyLjE3LjI4OSAxLjQyNS0uMDA3IDIuNzEtLjg4NyAzLjg1NGwtLjEzNi4xNjZhNC41NDggNC41NDggMCAwMS0yLjIwMSAxLjM4OC4xMjMuMTIzIDAgMDAtLjA4MS4wNzZjLS4xOTEuNTUxLS4zODMgMS4wMjMtLjc0IDEuNDk0LS45IDEuMTg3LTIuMjIyIDEuODQ2LTMuNzExIDEuODM4LTEuMTg3LS4wMDYtMi4yMzktLjQ0LTMuMTU3LTEuMzAyYS4xMDcuMTA3IDAgMDAtLjEwNS0uMDI0Yy0uMzg4LjEyNS0uNzguMTQzLTEuMjA0LjEzOGE0LjQ0MSA0LjQ0MSAwIDAxLTEuOTQ1LS40NjYgNC41NDQgNC41NDQgMCAwMS0xLjYxLTEuMzM1Yy0uMTUyLS4yMDItLjMwMy0uMzkyLS40MTQtLjYxN2E1LjgxIDUuODEgMCAwMS0uMzctLjk2MSA0LjU4MiA0LjU4MiAwIDAxLS4wMTQtMi4yOTguMTI0LjEyNCAwIDAwLjAwNi0uMDU2LjA4NS4wODUgMCAwMC0uMDI3LS4wNDggNC40NjcgNC40NjcgMCAwMS0xLjAzNC0xLjY1MSAzLjg5NiAzLjg5NiAwIDAxLS4yNTEtMS4xOTIgNS4xODkgNS4xODkgMCAwMS4xNDEtMS42Yy4zMzctMS4xMTIuOTgyLTEuOTg1IDEuOTMzLTIuNjE4LjIxMi0uMTQxLjQxMy0uMjUxLjYwMS0uMzMuMjE1LS4wODkuNDMtLjE2NC42NDYtLjIyN2EuMDk4LjA5OCAwIDAwLjA2NS0uMDY2IDQuNTEgNC41MSAwIDAxLjgyOS0xLjYxNSA0LjUzNSA0LjUzNSAwIDAxMS44MzctMS4zODh6bTMuNDgyIDEwLjU2NWEuNjM3LjYzNyAwIDAwMCAxLjI3MmgzLjYzNmEuNjM3LjYzNyAwIDEwMC0xLjI3MmgtMy42MzZ6TTguNDYyIDkuMjNhLjYzNy42MzcgMCAwMC0xLjEwNi42MzFsMS4yNzIgMi4yMjQtMS4yNjYgMi4xMzZhLjYzNi42MzYgMCAxMDEuMDk1LjY0OWwxLjQ1NC0yLjQ1NWEuNjM2LjYzNiAwIDAwLjAwNS0uNjRMOC40NjIgOS4yM3oiIGZpbGw9InVybCgjbG9iZS1pY29ucy1jb2RleC1fUl8wXykiPjwvcGF0aD48ZGVmcz48bGluZWFyR3JhZGllbnQgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJsb2JlLWljb25zLWNvZGV4LV9SXzBfIiB4MT0iMTIiIHgyPSIxMiIgeTE9IjMiIHkyPSIyMSI+PHN0b3Agc3RvcC1jb2xvcj0iI0IxQTdGRiI+PC9zdG9wPjxzdG9wIG9mZnNldD0iLjUiIHN0b3AtY29sb3I9IiM3QTlERkYiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMzOTQxRkYiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48L3N2Zz4=&style=for-the-badge" alt="Codex" />
  <img src="https://img.shields.io/badge/Antigravity-ffffff?logo=data:image/webp;base64,UklGRrIDAABXRUJQVlA4WAoAAAAQAAAALwAAKwAAQUxQSPYBAAABkG3btiFJN51t27Zt27Zt27Zt27ZtPdnutFWxH+JGxLn5BRExAYzSVHfHe6//y5HWiVl8Zlz+H1zPrrxxkf0MVD4oFgcpD0L1razC9BNj6rDOIqr0T2j0NBFk2grNl5KLKf9fW7CVEP0KEB63isjxnsJeTkSvGAVm6ejMx0D6KBVdwZ80vlp0fRJoMEdHZdwP4jvJqLK9p7KXoWoWppKGEumWgPywiSb5XboP2WhK2ejCTWkGSHRYqKMw7oPA28kosrwVYStJ0SikIuHr9UMHL72PqJAGEugWQvlJ/zyJDXprtk7XEhRw0KQtxQOF6KZsTDHNHL/Cp5zaKrt5sVVJmUrz+CAv2l6Tbjr4x1Ix1dbVEgfbDFpS3OW9Lcw0ZrrLe59dS00vJ9yXaW7o5ES7adCvAPdUMm2mdRwct6jL8Y5jq84IC3zg2MqpG5rAWWmk0I2OybBUrybdY8jf5mOkaW9zPudX0z8qiwzU0bCmHhnm6ZWyvYT8VHJGbF7L+V5SwbhAkn0tw8hzPpNhX2JeYzsABPro6Fij/7JgP52s8CsASFhqYQINI4MA8L06YyzXNch3pWJCrQsiAPCqFMt6DgCkvemZ4KRLwgDwqMgmCUBoVWomPPFkFwCctAH4MjARi0NjuzcA7Ltd/w5XZnFadNPHL4sAVlA4IJYBAADwCwCdASowACwAPlEgjkUjoaETnAZIOAUEtgBOmZMB887/ID2BKR/UvwBlG/gH5n/qOkB5gH6V7iXdAP2Z6wD0APNA/6P7K/Ax+4f7RhY3rOf/bHbWzsVWQTsV737jNfO8fGRK9sztAAD+//4Yrv/mpJYuHa/+C3OBzKdd7re+LJR8LRRoyx3XNJzCEHewK1K/tFMOcN+tIj1Wq96CEScrks1H6+9+oDzZuQBp3fJqXj1nP9gP//5/8OberbHfqQW3J7haX1CMLLYT4j9LJfrI7SFuCfhDaIq65N6wC+ZBtm9iORuF7TtMKLlscft0JR5GKZ/aRS9VWKYr9xLuKuITu2fIfIWx/1SrwHyHwxOgIfMS/V7UN3PGSsShRPSkW6e1Ghx/hiGeH9EnWFMeLr2H8dDwi+uK8xN3f4ixMHbN17Hr3rfx3+xjihxxNHjlZXD/qtssyNA5/9XrqD1KYgR2dv3f/9OYLAP8qeXGMJRoNwGLV1g+YyM3EAel8ghEMt0kMD9FwJJ0nx5uLiobwqnIaoWiAAAA&style=for-the-badge" alt="Antigravity" />
  <img src="https://img.shields.io/badge/Cursor-ffffff?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAABAGlDQ1BpY2MAABiVY2BgPMEABCwGDAy5eSVFQe5OChGRUQrsDxgYgRAMEpOLCxhwA6Cqb9cgai/r4lGHC3CmpBYnA+kPQKxSBLQcaKQIkC2SDmFrgNhJELYNiF1eUlACZAeA2EUhQc5AdgqQrZGOxE5CYicXFIHU9wDZNrk5pckIdzPwpOaFBgNpDiCWYShmCGJwZ3AC+R+iJH8RA4PFVwYG5gkIsaSZDAzbWxkYJG4hxFQWMDDwtzAwbDuPEEOESUFiUSJYiAWImdLSGBg+LWdg4I1kYBC+wMDAFQ0LCBxuUwC7zZ0hHwjTGXIYUoEingx5DMkMekCWEYMBgyGDGQCm1j8/yRb+6wAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABVlBMVEUAAAABAQEDAwMkJCQCAgIUFBSUlJT6+vr7+/sEBARsbGzr6+v////9/f1ra2tFRUXT09P+/v7S0tJERESwsLCxsbElJSUODg6IiIj39/f8/PyJiYkPDw9gYGDl5eXm5uZhYWE7OzvKyso8PDwdHR2lpaUICAiBgYH5+fmAgICoqKjW1tbh4eHo6Ojg4OCnp6dpaWkNDQ0MDAwJCQkKCgoLCwvR0dHc3NzPz8/FxcU2NjY5OTmkpKTAwMDOzs7Q0NDy8vJ7e3vd3d1SUlIQEBDf39++vr4xMTGFhYWZmZkWFhYpKSn19fXu7u5xcXEFBQWpqanX19dHR0fn5+cRERFqamrt7e2Pj48wMDCzs7NQUFAIBwh1dXUdHB3s7Ox+fn7z8/P09PR/f38eHh6mpqY4ODi8vLxbW1vb29uKiorx8fF6eno0NDTDw8Pq6uqTk5MjIyMiIiKVsA4TAAAAAWJLR0QMgbNRYwAAAAd0SU1FB+oHHAwDNj5pmU0AAAJTSURBVFjD7ZZpb9NAEIbHjlPb5F1gU66YEkpoQzhKoIEQznJDC+W+byj3zf//wuzajpIm7a4dCQkpI0W2HM+zM7PjfYdobGP7H8xxRnN3idwREOxeKOhLPnePihN+MFEkLw+CncINJQiB0sZQwbInv2kzRCBlIFCezFoKfruwBcpXSkXB1m2aaRu9R9t3VBBFyl39+K6yc0o9t0ze2VVFxOuyuzK+CSLsnnasSsHR76npsBP3FCFQ22uRh0czs1L6gRiwwJdydoZMMdT3NXqX7jeJyv66Yf0DOHhorrqWHZ5D0xBDGUdCOjrfOjbUjlP7hCGFDnDyFK3RNB6dRscAaINrdYZrFQ5C+NM+i3MGwAJ3TYTzF1pD2salaaBtBui2uXhpSPtfvmIJ4D4SuHptVdu4dB0NK4Bu/wDR4lJvHg7duMl/WgHS9l++dbt3C+4gsAak7X93Mt1Sj+5ByAwAhRA+7s93S1BDlA3ApZAoPYhDcOkhAmQEAAKPYoBDS1XOwL6IqwEuPVYB5AZ49KShz7f8gKfx85wAl57xDkgrQIffHIzgeVlVEGoXTJ/zgq5VP8ClF/FTyZf1I/CoCb/nQNYAj16+UgGo3vSNR1rr9ZtUUVJASIsqAK0vb9+1DCl4tPJeJpqWAOiDkInCNVeMx3q/sMSAj/qQsRSWfmljQJE+8cZkkDbqFVeB5an6Z/gsrl+sxTXJQ8t7hK/hN1Syyjt1B4wI1e8l5BgwqDvilH7gZ54RR+ehhqzA/5VzyNIIot9/8o95NPqgSSOPumMb27+yv+96VN+UlYqTAAAAHnRFWHRpY2M6Y29weXJpZ2h0AEdvb2dsZSBJbmMuIDIwMTasCzM4AAAAFHRFWHRpY2M6ZGVzY3JpcHRpb24Ac1JHQrqQcwcAAAAASUVORK5CYII=&style=for-the-badge" alt="Cursor" />
  <img src="https://img.shields.io/badge/Kimi_Code-ffffff?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAABAGlDQ1BpY2MAABiVY2BgPMEABCwGDAy5eSVFQe5OChGRUQrsDxgYgRAMEpOLCxhwA6Cqb9cgai/r4lGHC3CmpBYnA+kPQKxSBLQcaKQIkC2SDmFrgNhJELYNiF1eUlACZAeA2EUhQc5AdgqQrZGOxE5CYicXFIHU9wDZNrk5pckIdzPwpOaFBgNpDiCWYShmCGJwZ3AC+R+iJH8RA4PFVwYG5gkIsaSZDAzbWxkYJG4hxFQWMDDwtzAwbDuPEEOESUFiUSJYiAWImdLSGBg+LWdg4I1kYBC+wMDAFQ0LCBxuUwC7zZ0hHwjTGXIYUoEingx5DMkMekCWEYMBgyGDGQCm1j8/yRb+6wAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABwlBMVEUAAAAAAQIAAAEBBQsGGjQEESEHIEAWdOEZhv8Yg/0QT5oAAgQCCBIXeuQZiv8XgfwXgvsakf8NP3kAAQMIJ0oXgPoYgv4XgfsYh/8UaMYBAQEEBAQDAwMBAgQIKlIZif8Xgv0Xf/kYif8TZLwAAQECAgIJK1MZjv8XhPsYhf4Yh/0ajf8JLVgoKCh5eXlxcXFwcHB6enozMzNOTk58fHx0dHR1dXV2dnZycnKAgIAaGx0JJUYYe+8XduUVb9gKMmBmZmb////7+/v6+vp/f39oaGj+/v78/PzLy8sMDAwBAQICBQkCBQpkZGT29vZ9fX1paWm6uroICAh+fn5ra2v9/f28vLwJCQltbW1vb2+5ubm3t7cHBwe1tbUGBgazs7MFBQWxsbF3d3ewsLCvr6+qqqry8vL5+fkQEBDm5uZGRkaJiYnIyMgkJCTn5+c0NDSIiIjz8/NeXl4sLCxPT0/s7OyioqIrKyscHBy/v7/a2to5OTkqKiqBgYGdnZ01NTWCgoJDQ0Pl5eXV1dUPDw8UFBQXFxfx8fEWFhb4+Pg4ODjv7+8KCgrk5ORLS0vFxcXExMTW1tZJSUmPj4+oqKgODg5LrXqmAAAAAWJLR0RBid5sTgAAAAd0SU1FB+oHHAwDNj5pmU0AAAIwSURBVFjD7ZX3c9MwGIbflFFmGaUMS2zMHi0Q0rI/mcqU0hQKZnaw92rZZVNWoWz4f5GtxEk4aCTzE3d+z7lLdPc8+j75swOkSfM/JlPzb3jhkzQ1GDN2HJLXkMH42gkTJ01Ovv+UqXXTps+YifpkgnrMqmuYPWfuvCpNOEzFKV/hLMp8LFjYsGjxkqVYZrezG1ewfMXKVavXrB21BQfr1m9obNqIuAaOTZuzW3LNLVuxbXvtjp27Ru+AYzcJj/aAFRYYWklK8mlvG/a1t+/PVDkBjg7K56mzKGA4oIQiTwe74k6qCKIKDhUEDIdJBOTRkaNwYJJKAcMxzav9XSO+UsBwnIRU/AljvkLA0Kj5k93GfLmAoVnzPb2G/VcKGLKa7ztlwZcEXchp/jSz4UuDhDOaP8scG74oaEFnyPt0jtvxWiCoqVXz58HseC2QdOFiIEn61HNJrSQQqM1l+AgFdPkKuPEMlFUQwoGS+AFd5VZFFAWKF1LhgaBr120OIm6Bbty8FeJSUP8AXLtRjvjbwJ275KnvPt1rA7N5GqU6vPtgHA8ehk9z4NHgI9NxjASKfxyenLqehD2oSzx91m0u8Og5esNfLseLl7oNSUOvTKqIR7lw6xhe95HwSXrU/8ZCUHorcwdZQZ4azLfvzAQdNDxceiurfwqO94PqhgYfDAW/VRCtjeQ+knELn4Y+f/k6UDG+roORb99//DS6DX/zWsRx/vQO4aajmCZNmjRJ8wureJLPVqVymgAAAB50RVh0aWNjOmNvcHlyaWdodABHb29nbGUgSW5jLiAyMDE2rAszOAAAABR0RVh0aWNjOmRlc2NyaXB0aW9uAHNSR0K6kHMHAAAAAElFTkSuQmCC&style=for-the-badge" alt="Kimi Code" />
</p>

| Example | Paper | Agent | Time | Tokens |
|---|---|---|---|---|
| `demo/ex2` | [Point Transformer](https://arxiv.org/abs/2012.09164) | Opus 5 | ~16 minutes | ~65k |
| `demo/ex3` | [Mooncake](https://arxiv.org/abs/2407.00079) | Opus 5 | ~10 minutes | ~40k |
| `demo/ex4` | [3D Gaussian Splatting](https://arxiv.org/abs/2308.04079) | Opus 5 | ~11 minutes | ~45k |
| `demo/ex5` | [Mental Illness Terms and Hermeneutic Hijacking](https://philarchive.org/rec/KEIMIT) | Opus 5 | ~11 minutes | ~40k |

`demo/ex5` is a philosophy paper, not CS/ML, included to show the workflow isn't limited to empirical papers with a methods/results structure — the agent used the same default node templates and it held up fine.

The `demo/ex4` run above was recorded on **v0.6.3**, using `NodeGraph: Copy Agent Spec to Workspace` exactly as described in the four steps above — no README copy-pasting, no manual setup.

[Watch the full demo/ex4 run (59s, no sound)](https://github.com/Jeong-jin-Han/NodeGraph/blob/main/resources/demo-ex4.mp4)

---

## Mouse & Keyboard Controls

<details>
<summary><b>Full control reference</b> (canvas, node, toolbar, search)</summary>

### Canvas

| Action | Control |
|--------|---------|
| Pan canvas | Left-drag on background |
| Deselect / close search | Left-click on background |
| Zoom (0.05×–8×) | Scroll wheel — centered on the cursor |
| Box-select nodes & images | Right-drag on background |
| Select node | Left-click anywhere on the node |
| Add to selection | `Shift`/`Ctrl`+click |
| **Drag node** | **Left-drag the tag badge** (e.g. "Gap / Idea") — dropping it reorders it among same-parent, same-side siblings based on where it lands, rather than just placing it at a free-form position; with a multi-selection, all selected nodes move together (without the single-node drop reordering) |
| Pin generation highlight | Click the tag badge — node + parents + children + wires turn red |
| Clear highlight / selection | `Escape` (background clicks keep the highlight) |
| Delete selection | `Delete` or `Backspace` — canvas images first, then a selected wire, then nodes |
| Select wire | Left-click a wire (turns blue) |
| Draw edge | Drag from a port dot (appears on hover) onto the other node's body, in either direction — becomes an arrow only between two Main topic nodes, a plain line otherwise |

### Node

| Action | Control |
|--------|---------|
| **Fold / Unfold content** | **Click node title** |
| **Edit node title** | **Right-click node title** |
| Edit content / original | Click text area |
| **Search original quote in PDF** | **Right-click the original-text quote** (requires `source.pdf`) |
| Add image | Copy an image, then `Ctrl+V` with the node selected or hovered — inserted as an `[[IMG:...]]` token; pasting on the background creates a floating canvas image, which can be dragged onto a node or table cell |
| Add toggle / original / link | `+ Toggle` · `+ Original` · `+ Link` buttons at the bottom of an expanded node |
| Resize node | Drag the right / bottom / corner handles of an expanded node (min 160×60) |

### Toolbar

The toolbar is two rows — editing controls on top, view/graph-navigation controls below:

| Row | Control | Description |
|-----|---------|-------------|
| Edit | Undo / Redo | History (also `Ctrl+Z` / `Ctrl+Y` / `Ctrl+Shift+Z`) |
| Edit | Template dropdown + `+ Add Node` | With exactly one node selected, adds a child of the chosen type to it (auto-positioned into the hop layout); with none or multiple selected, creates an unparented node in the nearest free spot around the view center |
| Edit | Delete | Deletes all selected nodes (shows a live count, e.g. `Delete (3)`, once more than one is selected) |
| Edit | Type & font controls | Shown while nodes are selected — switch the node's template; set font size by typing a number or picking a preset (8–72) |
| View | Collapse / Expand | Fold/unfold the selected subtree, or everything when nothing is selected — collapsing *everything* also auto-runs Fit View |
| View | Node-type filter (next to Collapse/Expand) | When set to a type instead of `None`: `Collapse` closes everything, `Expand` opens only that type's nodes and closes the rest |
| View | Fit View | Zoom to fit all nodes |
| View | Grid | Toggle the layout debug grid (hop-level vertical lines, main-topic-cluster horizontal lines) |
| View | Export HTML | Write `<name>.html` next to the JSON |
| View | Reload | Re-read the JSON from disk |
| View | Help | Open the bundled README's Features section in a Markdown preview beside the editor |

When the window is narrower than the toolbar content, both rows slide horizontally together (`Shift`+wheel or touch swipe) — button positions never change.

### Search (Ctrl+F)

| Action | Control |
|--------|---------|
| Open search | `Ctrl+F` (or `Cmd+F` on Mac) |
| Close search | `Escape` or ✕ button |
| Navigate results | `↑` / `↓` — moves dropdown highlight **and** flies viewport to that node |
| Select node | `Enter` — expands selected node, collapses other matches |
| Reopen after select | Click search input — resumes from last selected position |

Matched text inside each node is additionally marked (inverse template color + underline), so you can see *where* in the node the query appears — in the editor and in the exported HTML.

</details>

---

## Installation

Install **NodeGraph** from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=JeongjinHan.nodegraph), or search "NodeGraph" in VS Code's Extensions view (`Ctrl+Shift+X`) and click Install. A packaged `.vsix` (`packages/nodegraph-<version>.vsix`) is also available in this repo if you'd rather install that directly.

> The Marketplace release provides the upstream single-paper experience. The new 0.0.0 project foundation is currently available from this fork's development build.

<details>
<summary><b>Getting started</b></summary>

1. Run **NodeGraph: New Graph** (`Ctrl+Shift+P`) to create a `.nodegraph.json` file — or open an existing one, the custom editor opens automatically
2. **Drag nodes** by the colored tag badge; **click the title** to fold/unfold; **right-click the title** to rename it
3. Use the toolbar — **Expand / Collapse / Fit View / Export HTML / Reload / Help** — and **Ctrl+F** to search

Installing from the `.vsix` directly:

```bash
code --install-extension packages/nodegraph-<version>.vsix
```

To build the `.vsix` yourself:

```bash
npm install
node esbuild.js --production
npx vsce package -o packages/nodegraph-<version>.vsix
```

</details>

---

## Node Content Syntax

| Feature | Syntax |
|---------|--------|
| Markdown table | `\| col \| col \|` (GFM style) |
| Inline LaTeX | `$formula$` |
| Block LaTeX | `$$formula$$` |
| Bold | `**text**` (markers hidden when rendered) |
| Literal dollar (currency) | `\$` — a bare `$` would open an inline-math region (in JSON strings write `\\$`) |
| Image token | `[[IMG:filename.png:400x300]]` |

Images are stored in a `.<graphname>-imgs/` folder next to the JSON file.

---

## File Format

<details>
<summary><b>Full JSON schema example</b></summary>

```jsonc
{
  "version": "1.0.0",
  "title": "My Research Graph",
  "created": "2026-07-06T00:00:00.000Z",
  "modified": "2026-07-06T00:00:00.000Z",
  "source": {                             // optional — omit entirely if there's no source PDF
    "pdf": "paper.pdf",
    "authors": "Author et al.",
    "venue": "NeurIPS 2017",
    "doi": "arXiv:1706.03762",
    "pages": 15
  },
  "nodeTemplates": {
    "main_topic": { "label": "Main topic", "color": "#4B8BBE", "icon": "file-text", "shape": "sharp" },
    "question":   { "label": "Question",   "color": "#E5A835", "icon": "help-circle", "shape": "rounded" }
  },
  "nodes": [
    {
      "id": "node_001",
      "template": "main_topic",
      "title": "Introduction",
      "content": "Summary text with $\\LaTeX$ and\n[[IMG:figure1.png:500x300]]",
      "original": { "title": "Optional custom label", "text": "Exact quote from paper.", "location": "§1, p.1" },
      "toggleItems": [                    // optional — omit if the node has no toggle sections
        { "id": "toggle_001", "title": "Table 1", "content": "| Col | Val |\n|-----|-----|\n| A | 1 |", "expanded": false }
      ],
      "contentExpanded": true,
      "originalExpanded": false,
      "childrenExpanded": false,
      "position": { "x": 0, "y": 0 },
      "children": ["node_002"],
      "links": [],                        // { type: 'url'|'pdf'|'obsidian'|'internal', target, label }[]
      "fontSize": 14,                     // optional — per-node title font size override
      "nodeWidth": 432,                   // optional — persisted card width after a manual resize
      "nodeHeight": 220,                  // optional — persisted card height after a manual resize
      "nodeNaturalY": 0                   // optional — Y position as last set by dragging; leave this to the editor
    }
  ],
  "edges": [
    { "id": "edge_001", "source": "node_001", "target": "node_002", "type": "arrow", "label": "" },
    { "id": "edge_002", "source": "node_002", "target": "node_003", "type": "line", "label": "" }
  ],
  "viewport": { "x": 0, "y": 0, "zoom": 1 },
  "canvasImages": []                      // optional — floating images pasted onto the background, not into a node
}
```

</details>

---

## Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| `NodeGraph: New Graph` | — | Create a new empty graph. Right-click a folder in the Explorer to target it directly; from the Command Palette it targets the workspace's only folder, or prompts you to pick one if there are several |
| `NodeGraph: Search Nodes` | `Ctrl+F` / `Cmd+F` | Open search dropdown |
| `NodeGraph: Copy Agent Spec to Workspace` | — | Write `.agent/NODEGRAPH_SPEC.md`, `.agent/ENVIRONMENT.md`, and `.prompt/{korean,english}.md` into a folder so an AI agent can read them. Same folder-targeting as New Graph above |
| `NodeGraph: Create Literature Project` | — | Create a local multi-paper project and its authoritative records |
| `NodeGraph: Open Literature Project` | — | Open a project manifest and lightweight indexes without loading every graph |
| `NodeGraph: Register Project Paper` | — | Register an existing graph and its source PDF without changing either file |
| `NodeGraph: Unregister Project Paper` | — | Remove a paper registration without deleting the graph or PDF |
| `NodeGraph: Validate Literature Project` | — | Check files, paths, source hashes, evidence links, and index freshness |
| `NodeGraph: Rebuild Project Indexes` | — | Recreate disposable paper and evidence indexes from authoritative files |
| `NodeGraph: Search Project Papers` | — | Search indexed paper metadata across the project |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Platform | VS Code Extension (Custom Editor API) |
| UI | React + TypeScript |
| Math / rendering | KaTeX, custom Markdown-lite renderer, SVG wire routing (A*) |
| PDF | `pdfjs-dist` (custom minimal renderer, not the prebuilt viewer toolkit) |
| Build | esbuild |
| Storage | Plain local JSON for paper graphs and project records — no accounts or hosted database |
| Project safety | Schema checks, contained paths, source hashes, per-file revisions, atomic writes, and append-only audit events |

---

## Privacy

NodeGraph does **not** collect, store, or send any data to external servers. The multi-paper project foundation follows the same local-first approach.

- Single-paper work lives in the `.nodegraph.json` file and local image assets next to it
- Multi-paper project records and indexes are stored as local JSON and JSONL files
- There are no accounts, telemetry, or analytics
- The editor loads KaTeX from the extension's own bundled assets (no CDN, no network)
- The one exception: opening an **exported HTML file** in a browser loads KaTeX from a CDN, since that file is meant to be viewed outside VS Code — the editor itself never does this

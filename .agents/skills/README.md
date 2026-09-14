# Skill condivise

Ogni skill vive in una cartella `<nome>/` con un file `SKILL.md` che inizia con frontmatter YAML:

```markdown
---
name: <nome>
description: <una riga: quando usare questa skill>
---

Istruzioni della skill.
```

Questa cartella è letta nativamente da Codex CLI (`.agents/skills/`) e da Claude Code tramite il
symlink `.claude/skills -> ../.agents/skills`. Le skill sono condivise tra i tool: scrivi
istruzioni neutre, senza riferimenti a un tool specifico.

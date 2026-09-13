#!/usr/bin/env bash
# SessionStart hook: prints the current git context (read-only).
# Registered in .claude/settings.json; see CLAUDE.md.
echo "Branch: $(git branch --show-current)"
echo "Ultimi commit:"; git log --oneline -5
echo "File modificati non committati:"; git status --short
exit 0

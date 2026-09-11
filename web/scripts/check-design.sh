#!/usr/bin/env bash
# Guardia del redesign: fallisce se restano residui del design "Cielo".
# Uso: bash scripts/check-design.sh            → controlla app/ e components/
#      bash scripts/check-design.sh components → controlla solo components/
set -u
cd "$(dirname "$0")/.."
targets="${1:-app components}"
fail=0

check() {
  local label="$1" pattern="$2" hits
  # shellcheck disable=SC2086
  hits=$(grep -rnE --include='*.tsx' --include='*.ts' --include='*.css' "$pattern" $targets 2>/dev/null || true)
  if [ -n "$hits" ]; then
    echo "✗ $label"
    echo "$hits" | head -20
    fail=1
  else
    echo "✓ $label"
  fi
}

check "font Nunito"                 'Nunito|font-nunito'
check "raggi scritti a mano"        'rounded(-t|-b)?-\[[0-9]+px\]'
check "bordi 1.5px"                 'border-\[1\.5px\]'
check "font-extrabold"              'font-extrabold'
check "tracking vecchi"             'tracking-tightest|tracking-tighter'
check "token accent (corallo)"      '(bg|text|border)-accent(-soft)?\b|--accent'
check "parole colorate nei titoli"  '<span className="text-primary">'
check "simboli decorativi"          '✈|✨|💬|✦|→|←|✓'
check "ombre su superfici statiche" "['\" ]shadow['\" ]"

exit $fail

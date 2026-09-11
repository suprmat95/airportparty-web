#!/usr/bin/env bash
# Guardia del redesign: fallisce se restano residui del design "Cielo".
# Uso: bash scripts/check-design.sh            → controlla app/ e components/
#      bash scripts/check-design.sh components → controlla solo components/
set -u
cd "$(dirname "$0")/.."
targets="${1:-app components}"
fail=0

# BSD grep (macOS default) silently reports zero matches instead of a
# nonzero/error exit when -r is combined with --include on a target that
# does not exist, so the grep-exit-code guard in check() below never fires
# for that case. Fail fast here with an explicit grep-style error instead.
for t in $targets; do
  if [ ! -e "$t" ]; then
    echo "✗ target \"$t\" (grep error: $t: No such file or directory)"
    fail=1
  fi
done

check() {
  local label="$1" pattern="$2" hits rc
  # shellcheck disable=SC2086
  hits=$(grep -rnE --include='*.tsx' --include='*.ts' --include='*.css' "$pattern" $targets 2>&1); rc=$?
  if [ "$rc" -gt 1 ]; then echo "✗ $label (grep error $rc: $hits)"; fail=1; return; fi
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

check_shadow_lg() {
  local hits
  hits=$(grep -rnE --include='*.tsx' 'shadow-lg' $targets 2>&1 | grep -vE 'components/layout/(BottomSheet|DateTimeModal)\.tsx|app/airport/page\.tsx' || true)
  if [ -n "$hits" ]; then echo "✗ shadow-lg fuori da modale/sheet/dropdown"; echo "$hits" | head -20; fail=1; else echo "✓ shadow-lg fuori da modale/sheet/dropdown"; fi
}
check_shadow_lg

exit $fail

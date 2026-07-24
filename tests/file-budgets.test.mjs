// Governance-file size budgets (owner directive 2026-07-24): the constitution and its
// satellites are read by EVERY session and scheduled run — their size is a per-run tax and
// bloat erodes careful reading. Exceeding a budget fails CI: compact or archive before adding.
// Never raise a budget to make a commit fit; raising budgets is an owner decision.
import { test } from "node:test";
import assert from "node:assert/strict";
import { statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// bytes; set ~25-60% above 2026-07-24 actuals to leave working room, not sprawl room
const BUDGETS = {
  "CLAUDE.md": 3000,
  "OPERATIONS.md": 20000,
  "reports/LEARNINGS.md": 8000,   // compaction rule: a learning enforced by a CI test or defect class graduates to one line
  "reports/DECISIONS.md": 8000,   // roll entries older than a quarter into reports/archive/
  "reports/AUDIT.md": 10000,      // keep latest audits; archive the rest to reports/archive/
  "backlog/opportunities.md": 10000, // graveyard entries compact to one line each
  ".claude/skills/specs-loop/SKILL.md": 5000,
  ".claude/skills/data-quality/SKILL.md": 6500,
};

for (const [file, budget] of Object.entries(BUDGETS)) {
  test(`budget: ${file} <= ${budget} bytes`, () => {
    const size = statSync(join(ROOT, file)).size;
    assert.ok(
      size <= budget,
      `${file} is ${size} bytes (budget ${budget}) — compact or archive (reports/archive/), do not raise the budget`
    );
  });
}

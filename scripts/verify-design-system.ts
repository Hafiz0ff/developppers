import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

interface CheckRule {
  id: string;
  name: string;
  command: string;
  target: number;
  condition: "equal" | "less_or_equal";
  description: string;
}

const RULES: CheckRule[] = [
  {
    id: "micro-fonts",
    name: "Sub-12px Micro-fonts (text-[8..11px])",
    command: 'git grep -nE "text-\\[(8|9|10|11)px\\]" -- "src/"',
    target: 0,
    condition: "equal",
    description: "All sub-12px fonts must be replaced by standard text-xs (12px) or larger.",
  },
  {
    id: "neon-glows",
    name: "Neon Glows (shadow-[0_0_...)",
    command: 'git grep -nE "shadow-\\[0_0_" -- "src/"',
    target: 0,
    condition: "equal",
    description: "Neon glow utilities cause visual fatigue and are forbidden.",
  },
  {
    id: "colored-shadows",
    name: "Colored Shadows (shadow-(emerald|teal|cyan|green)-...)",
    command: 'git grep -nE "shadow-(emerald|teal|cyan|green)-" -- "src/"',
    target: 0,
    condition: "equal",
    description: "Colored drop shadows are replaced by neutral tier elevations.",
  },
  {
    id: "important-in-globals",
    name: "globals.css !important directives",
    command: 'git grep -nE "!important" -- "src/app/globals.css"',
    target: 0,
    condition: "equal",
    description: "globals.css must not use !important overrides.",
  },
  {
    id: "colored-ui-variants",
    name: "Colored button/badge variants in src/components/ui/",
    command: 'git grep -nE "variant:\\s*\'(emerald|neon|gradient)\'" -- "src/components/ui/"',
    target: 0,
    condition: "equal",
    description: "Base primitives must only expose semantic variants.",
  },
  {
    id: "bg-50-triplets",
    name: "Raw palette -50 backgrounds in TSX (bg-(emerald|amber|...)-50)",
    command: 'git grep -nE "bg-(emerald|amber|rose|blue|purple|sky|teal)-50([^0-9]|$)" -- "src/**/*.tsx"',
    target: 0,
    condition: "equal",
    description: "Tinted background rectangles must use neutral tokens or Quiet Alert styles.",
  },
  {
    id: "raw-hex-classes",
    name: "Raw HEX in TSX utility classes (excluding WhatsApp & Telegram constants)",
    command: 'git grep -nE -- "(bg|text|border)-\\[#[0-9a-fA-F]{6}\\]" -- "src/**/*.tsx"',
    target: 10,
    condition: "less_or_equal",
    description: "HEX colors in classes are restricted to external brand integrations (#25D366, #182533, #64b5f6).",
  },
];

console.log("\n📐 Maskani Design System Governance & Linter Verification");
console.log("=========================================================\n");

let failures = 0;

for (const rule of RULES) {
  let count = 0;
  let matches: string[] = [];

  try {
    const stdout = execSync(rule.command, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] });
    matches = stdout.trim().split("\n").filter(Boolean);
    count = matches.length;
  } catch (err: unknown) {
    // git grep exits with code 1 if no matches are found, which means count = 0
    count = 0;
    matches = [];
  }

  const passed =
    rule.condition === "equal"
      ? count === rule.target
      : count <= rule.target;

  const icon = passed ? "✅ [PASS]" : "❌ [FAIL]";
  console.log(`${icon} ${rule.name}: found ${count} (target: ${rule.condition === "equal" ? "" : "<="}${rule.target})`);

  if (!passed) {
    failures++;
    console.log(`   ⚠️ Violation: ${rule.description}`);
    console.log("   First 3 occurrences:");
    matches.slice(0, 3).forEach((m) => console.log(`     -> ${m}`));
  }
}

console.log("\n=========================================================");
if (failures > 0) {
  console.error(`❌ Governance check failed with ${failures} error(s).\n`);
  process.exit(1);
} else {
  console.log("🎉 All 7 Design System Governance rules passed successfully!\n");
  process.exit(0);
}

import fs from "fs";
import path from "path";

interface FileNode {
  filePath: string;
  relativePath: string;
  layer: "schema" | "dal_lib" | "api_route" | "state_hook" | "ui_component" | "page_route" | "test" | "config_types";
  imports: string[];
  importedBy: string[];
}

const ROOT_DIR = path.resolve(__dirname, "../../../../");
const SRC_DIR = path.join(ROOT_DIR, "src");

function classifyLayer(relPath: string): FileNode["layer"] {
  if (relPath.endsWith(".test.ts") || relPath.endsWith(".test.tsx")) return "test";
  if (relPath.startsWith("src/db/")) return "schema";
  if (relPath.startsWith("src/app/api/")) return "api_route";
  if (relPath.startsWith("src/app/") && (relPath.endsWith("/page.tsx") || relPath.endsWith("/route.ts") || relPath.endsWith("/layout.tsx"))) return "page_route";
  if (relPath.startsWith("src/hooks/") || relPath.startsWith("src/context/")) return "state_hook";
  if (relPath.startsWith("src/components/")) return "ui_component";
  if (relPath.startsWith("src/types/")) return "config_types";
  if (relPath.startsWith("src/lib/")) return "dal_lib";
  return "dal_lib";
}

function resolveImportPath(currentRelPath: string, importString: string, allFiles: Set<string>): string | null {
  // Handle alias "@/..."
  let target: string;
  if (importString.startsWith("@/")) {
    target = path.join("src", importString.slice(2));
  } else if (importString.startsWith("./") || importString.startsWith("../")) {
    const dir = path.dirname(currentRelPath);
    target = path.normalize(path.join(dir, importString));
  } else {
    return null; // External package
  }

  // Check extensions
  const candidates = [
    target,
    `${target}.ts`,
    `${target}.tsx`,
    `${target}.js`,
    `${target}.jsx`,
    path.join(target, "index.ts"),
    path.join(target, "index.tsx"),
  ];

  for (const c of candidates) {
    if (allFiles.has(c)) {
      return c;
    }
  }

  return null;
}

function collectFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== ".git") {
        collectFiles(fullPath, fileList);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

export function buildGraph(): Map<string, FileNode> {
  const allFullPaths = collectFiles(SRC_DIR);
  const graph = new Map<string, FileNode>();
  const allRelPaths = new Set<string>();

  for (const full of allFullPaths) {
    const rel = path.relative(ROOT_DIR, full);
    allRelPaths.add(rel);
    graph.set(rel, {
      filePath: full,
      relativePath: rel,
      layer: classifyLayer(rel),
      imports: [],
      importedBy: [],
    });
  }

  const importRegex = /(?:import|export)\s+(?:(?:(?:\w+|\{[^}]*\}|\*\s+as\s+\w+)\s+from\s+)?['"]([^'"]+)['"]|(?:['"]([^'"]+)['"]))/g;

  for (const [rel, node] of graph.entries()) {
    try {
      const content = fs.readFileSync(node.filePath, "utf-8");
      let match: RegExpExecArray | null;
      while ((match = importRegex.exec(content)) !== null) {
        const importSpecifier = match[1] || match[2];
        if (!importSpecifier) continue;
        const resolved = resolveImportPath(rel, importSpecifier, allRelPaths);
        if (resolved && resolved !== rel) {
          if (!node.imports.includes(resolved)) {
            node.imports.push(resolved);
          }
          const targetNode = graph.get(resolved);
          if (targetNode && !targetNode.importedBy.includes(rel)) {
            targetNode.importedBy.push(rel);
          }
        }
      }
    } catch {}
  }

  return graph;
}

export function traceChain(targetQuery: string) {
  const graph = buildGraph();
  const matched: FileNode[] = [];

  for (const [rel, node] of graph.entries()) {
    if (rel.toLowerCase().includes(targetQuery.toLowerCase())) {
      matched.push(node);
    }
  }

  if (matched.length === 0) {
    console.log(`\n❌ No files matching "${targetQuery}" found in repository.\n`);
    return;
  }

  console.log(`\n================================================================================`);
  console.log(`🔍 ARCHITECTURAL DEPENDENCY TRACER: Found ${matched.length} match(es) for "${targetQuery}"`);
  console.log(`================================================================================\n`);

  for (const node of matched) {
    console.log(`📦 FILE: ${node.relativePath}`);
    console.log(`🏛️  LAYER: [${node.layer.toUpperCase()}]`);

    // Trace upstream (what this file depends on)
    console.log(`\n  ⬆️  UPSTREAM DEPENDENCIES (Imports ${node.imports.length} modules):`);
    if (node.imports.length === 0) {
      console.log(`     (None / Base Leaf)`);
    } else {
      const groupedImports: Record<string, string[]> = {};
      for (const imp of node.imports) {
        const impNode = graph.get(imp);
        const l = impNode ? impNode.layer : "unknown";
        groupedImports[l] = groupedImports[l] || [];
        groupedImports[l].push(imp);
      }
      for (const [layer, list] of Object.entries(groupedImports)) {
        console.log(`     ├─ [${layer.toUpperCase()}]:`);
        for (const item of list) {
          console.log(`     │   • ${item}`);
        }
      }
    }

    // Trace downstream (who depends on this file)
    console.log(`\n  ⬇️  DOWNSTREAM CONSUMERS (Imported by ${node.importedBy.length} modules):`);
    if (node.importedBy.length === 0) {
      console.log(`     (None / Top-level Entry Point)`);
    } else {
      const groupedConsumers: Record<string, string[]> = {};
      for (const consumer of node.importedBy) {
        const cNode = graph.get(consumer);
        const l = cNode ? cNode.layer : "unknown";
        groupedConsumers[l] = groupedConsumers[l] || [];
        groupedConsumers[l].push(consumer);
      }
      for (const [layer, list] of Object.entries(groupedConsumers)) {
        console.log(`     ├─ [${layer.toUpperCase()}]:`);
        for (const item of list) {
          console.log(`     │   • ${item}`);
        }
      }
    }

    // Trace associated tests
    const associatedTests = node.importedBy.filter(c => c.endsWith(".test.ts") || c.endsWith(".test.tsx"));
    console.log(`\n  🧪 ASSOCIATED TESTS: ${associatedTests.length > 0 ? associatedTests.join(", ") : "⚠️ No direct unit test"}`);

    // Architectural Impact Chain
    console.log(`\n  🔄 FULL FLOW IMPACT CHAIN:`);
    console.log(`     Database Schema ➔ Data Access/Lib ➔ API Handlers ➔ Hooks/Context ➔ UI Components ➔ Page Routes`);
    console.log(`     Status: If you modify this file, verify downstream consumers across the chain!\n`);
    console.log(`--------------------------------------------------------------------------------\n`);
  }
}

// CLI Execution
if (require.main === module) {
  const query = process.argv[2];
  if (!query) {
    const graph = buildGraph();
    const stats: Record<string, number> = {};
    for (const node of graph.values()) {
      stats[node.layer] = (stats[node.layer] || 0) + 1;
    }
    console.log(`\n================================================================================`);
    console.log(`🏗️  SOGD-REALTY / MASKANI.TJ — CODEBASE ARCHITECTURE SUMMARY`);
    console.log(`================================================================================`);
    console.log(`Total Source Files Analyzed: ${graph.size}`);
    console.log(`Layer Breakdown:`);
    for (const [layer, count] of Object.entries(stats)) {
      console.log(`  • ${layer.padEnd(16)}: ${count} files`);
    }
    console.log(`\nUsage:`);
    console.log(`  npx tsx .agents/skills/codebase-architecture/scripts/trace-dependency-chain.ts <file_or_keyword>`);
    console.log(`Example:`);
    console.log(`  npx tsx .agents/skills/codebase-architecture/scripts/trace-dependency-chain.ts parking`);
    console.log(`  npx tsx .agents/skills/codebase-architecture/scripts/trace-dependency-chain.ts classifieds`);
    console.log(`  npx tsx .agents/skills/codebase-architecture/scripts/trace-dependency-chain.ts crm-leads\n`);
  } else {
    traceChain(query);
  }
}

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildGraph } from "../../.agents/skills/codebase-architecture/scripts/trace-dependency-chain";

describe("Architecture & Dependency Chain Tracer", () => {
  test("builds graph with all architectural layers represented", () => {
    const graph = buildGraph();
    assert.ok(graph.size > 100, `Graph should contain >100 files, found: ${graph.size}`);

    const layers = new Set<string>();
    for (const node of graph.values()) {
      layers.add(node.layer);
    }

    assert.ok(layers.has("schema"), "Must have schema layer");
    assert.ok(layers.has("dal_lib"), "Must have dal_lib layer");
    assert.ok(layers.has("api_route"), "Must have api_route layer");
    assert.ok(layers.has("state_hook"), "Must have state_hook layer");
    assert.ok(layers.has("ui_component"), "Must have ui_component layer");
    assert.ok(layers.has("page_route"), "Must have page_route layer");
    assert.ok(layers.has("test"), "Must have test layer");
  });

  test("correctly traces upstream and downstream connections for parking-storage", () => {
    const graph = buildGraph();
    const parkingLib = graph.get("src/lib/parking-storage.ts");
    assert.ok(parkingLib, "src/lib/parking-storage.ts must exist in graph");

    // Must import types
    assert.ok(
      parkingLib.imports.includes("src/types/parking-storage.ts"),
      "parking-storage.ts should import parking-storage.ts types"
    );

    // Must be imported by components or tests
    assert.ok(
      parkingLib.importedBy.some((c) => c.includes("project-parking-storage-manager.tsx")),
      "parking-storage.ts should be consumed by developer-admin component"
    );
  });

  test("correctly traces classifieds flow", () => {
    const graph = buildGraph();
    const classifiedDetail = graph.get("src/app/classifieds/[slug]/page.tsx");
    assert.ok(classifiedDetail, "Classified detail page must exist in graph");

    // Must import format utils and metrics hook
    assert.ok(
      classifiedDetail.imports.some((i) => i.includes("format-utils")),
      "Classified detail page must import format-utils"
    );
    assert.ok(
      classifiedDetail.imports.some((i) => i.includes("use-entity-metrics")),
      "Classified detail page must import use-entity-metrics"
    );
  });
});

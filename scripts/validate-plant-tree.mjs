import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../plant-tree-data.js", import.meta.url), "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: "plant-tree-data.js" });

const data = sandbox.window.PLANT_TREE_DATA;
const errors = [];
const allowedRanks = new Set(["clade", "grade", "order", "family", "genus"]);
const rankOrder = new Map([
  ["clade", 1],
  ["grade", 1],
  ["order", 2],
  ["family", 3],
  ["genus", 4]
]);

if (!data || typeof data !== "object") fail("PLANT_TREE_DATA is missing.");
if (!data.rootId) fail("rootId is missing.");
if (!Array.isArray(data.nodes)) fail("nodes must be an array.");
if (!data.sources || typeof data.sources !== "object") fail("sources must be an object.");

const nodes = new Map();
for (const node of data.nodes || []) {
  if (!node.id) fail("A node is missing id.");
  if (nodes.has(node.id)) fail(`Duplicate node id: ${node.id}`);
  nodes.set(node.id, node);
}

if (!nodes.has(data.rootId)) fail(`rootId does not exist as a node: ${data.rootId}`);

for (const [sourceId, sourceRecord] of Object.entries(data.sources || {})) {
  if (!sourceRecord.label) fail(`Source ${sourceId} is missing label.`);
  if (!sourceRecord.citation) fail(`Source ${sourceId} is missing citation.`);
  if (!sourceRecord.url) fail(`Source ${sourceId} is missing url.`);
}

for (const node of nodes.values()) {
  if (!node.name) fail(`${node.id} is missing name.`);
  if (!allowedRanks.has(node.rank)) fail(`${node.id} has unsupported rank: ${node.rank}`);
  if (!node.source) fail(`${node.id} is missing source.`);
  if (node.source && !data.sources[node.source]) fail(`${node.id} references unknown source: ${node.source}`);
  if (node.children && !Array.isArray(node.children)) fail(`${node.id} children must be an array.`);
  if (node.facts && !Array.isArray(node.facts)) fail(`${node.id} facts must be an array.`);
  for (const [index, fact] of (node.facts || []).entries()) {
    if (!fact.text) fail(`${node.id} fact ${index + 1} is missing text.`);
    if (!fact.source) fail(`${node.id} fact ${index + 1} is missing source.`);
    if (fact.source && !data.sources[fact.source]) {
      fail(`${node.id} fact ${index + 1} references unknown source: ${fact.source}`);
    }
  }
  if ((node.rank === "clade" || node.rank === "grade") && node.photoTaxon && !node.photoTaxonSource) {
    fail(`${node.id} has photoTaxon but is missing photoTaxonSource.`);
  }
  if (node.photoTaxon && typeof node.photoTaxon !== "string") {
    fail(`${node.id} photoTaxon must be a string.`);
  }
  if (node.photoTaxonSource && typeof node.photoTaxonSource !== "string") {
    fail(`${node.id} photoTaxonSource must be a string.`);
  }
  if ((node.rank === "clade" || node.rank === "grade") && node.autoPhotoLookup) {
    fail(`${node.id} is an informal ${node.rank}; autoPhotoLookup is not allowed.`);
  }

  for (const childId of node.children || []) {
    const child = nodes.get(childId);
    if (!child) {
      fail(`${node.id} references missing child: ${childId}`);
      continue;
    }
    if (rankOrder.get(child.rank) < rankOrder.get(node.rank)) {
      fail(`${node.id} (${node.rank}) cannot contain ${child.id} (${child.rank}).`);
    }
    if (node.rank === "order" && child.rank !== "family") {
      fail(`${node.id} is an order; child ${child.id} must be a family.`);
    }
    if (node.rank === "family" && child.rank !== "genus") {
      fail(`${node.id} is a family; child ${child.id} must be a genus.`);
    }
    if (node.rank === "genus") {
      fail(`${node.id} is a genus and should not have children.`);
    }
  }
}

for (const node of nodes.values()) {
  if (node.rank === "order" && !hasChildRank(node, "family")) {
    fail(`${node.id} is an order but has no family examples.`);
  }
  if (node.rank === "family" && !hasChildRank(node, "genus")) {
    fail(`${node.id} is a family but has no example genera.`);
  }
}

const seen = new Set();
const active = new Set();
walk(data.rootId);
for (const nodeId of nodes.keys()) {
  if (!seen.has(nodeId)) fail(`${nodeId} is unreachable from root ${data.rootId}.`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${nodes.size} nodes and ${Object.keys(data.sources).length} sources.`);

function walk(nodeId) {
  if (active.has(nodeId)) {
    fail(`Cycle detected at ${nodeId}.`);
    return;
  }
  if (seen.has(nodeId)) return;
  seen.add(nodeId);
  active.add(nodeId);
  for (const childId of nodes.get(nodeId)?.children || []) walk(childId);
  active.delete(nodeId);
}

function hasChildRank(node, rank) {
  return (node.children || []).some((childId) => nodes.get(childId)?.rank === rank);
}

function fail(message) {
  errors.push(message);
}

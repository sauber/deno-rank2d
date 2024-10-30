import { Rank2D, type Cell } from "./mod.ts";

// Define list of student scores in the format of:
// [name, math score, psychology score]
type Name = string;
type MathScore = number;
type PsychologyScore = number;
type Student = [Name, MathScore, PsychologyScore];
const students: Student[] = [
  ["James Smith", 80, 89],
  ["Jim Brown", 65, 71],
  ["Robert Smith", 66, 78],
  ["Maria Garcia", 89, 85],
  ["David Smith", 76, 52],
  ["Liz Smith", 94, 44],
  ["Maria Martinez", 92, 85],
  ["Henry James", 65, 45],
  ["Mary Smith", 45, 94],
  ["John Smith", 61, 88],
  ["Charles Henry", 72, 83],
];

// Convert to ranking elements.
const items: Cell[] = students.map((student: Student) => ({
  item: student[0],
  x: student[1],
  y: student[2],
}));

// Import items in 2D Ranking Grid.
const rank = new Rank2D(items);

// Optimal repositioning of items.
rank.optimize();

// Export items in 2D grid.
const grid: (Cell | null)[][] = rank.table;

// Print results to console.
//
// Items with low X value (Math Score) are positioned towards the right.
// Items with high X value (Math Score) are positioned towards the left.
// Items with low Y value (Psychology Score) are positioned towards the bottom.
// Items with high Y value (Psychology Score) are positioned towards the top.
//
// Expected output:
// ┌───────┬──────────────────────┬───────────────────────┬────────────────────────┐
// │ (idx) │ 0                    │ 1                     │ 2                      │
// ├───────┼──────────────────────┼───────────────────────┼────────────────────────┤
// │     0 │ "Mary Smith,45,94"   │ "James Smith,80,89"   │ "Maria Garcia,89,85"   │
// │     1 │ "John Smith,61,88"   │ "Charles Henry,72,83" │ "Maria Martinez,92,85" │
// │     2 │ "Robert Smith,66,78" │ "Jim Brown,65,71"     │ ""                     │
// │     3 │ "Henry James,65,45"  │ "David Smith,76,52"   │ "Liz Smith,94,44"      │
// └───────┴──────────────────────┴───────────────────────┴────────────────────────┘
const strings: string[][] = grid.map((row) =>
  row.map((cell) => Object.values(cell || {}).join())
);
console.table(strings);

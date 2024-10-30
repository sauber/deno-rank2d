# Rank2D

Position elements in a 2D grid based on two different ranking factors.

See `example.ts` for usage.

```bash
~$ deno run https://jsr.io/@sauber/rank2d/0.1.1/example.ts
┌───────┬──────────────────────┬───────────────────────┬────────────────────────┐
│ (idx) │ 0                    │ 1                     │ 2                      │
├───────┼──────────────────────┼───────────────────────┼────────────────────────┤
│     0 │ "Mary Smith,45,94"   │ "James Smith,80,89"   │ "Maria Garcia,89,85"   │
│     1 │ "John Smith,61,88"   │ "Charles Henry,72,83" │ "Maria Martinez,92,85" │
│     2 │ "Robert Smith,66,78" │ "Jim Brown,65,71"     │ ""                     │
│     3 │ "Henry James,65,45"  │ "David Smith,76,52"   │ "Liz Smith,94,44"      │
└───────┴──────────────────────┴───────────────────────┴────────────────────────┘
```

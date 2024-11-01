/** Format of input data */
export type DataSet = Array<Cell>;

/** A line may have Cells with content or without */
export type Line = Array<Cell | null>;

/** Format of output data */
export type Table = Array<Line>;

type Position = {
  x: number;
  y: number;
};

/** An item and its X and Y rank */
export type Cell = {
  x: number;
  y: number;
  item: unknown;
};

type Box = {
  target: Position;
  item: Cell;
};

type Row = Array<Slot>;
type Matrix = Array<Row>;

////////////////////////////////////////////////////////////////////////

/** A Slot can have a box inserted and ejected */
class Slot {
  private box: Box[] = [];

  constructor(private readonly position: Position) {}

  /** Insert a box in slot */
  public insert(box: Box): void {
    if (!this.isEmpty) throw new Error("Inserting box in occupied slot");
    this.box.push(box);
  }

  /** Eject box from slot */
  public eject(): Box {
    if (this.isEmpty) throw new Error("Removing non-existing box from slot");
    return this.box.pop() as Box;
  }

  /** Check if a box is in slot */
  public get isEmpty(): boolean {
    return this.box.length == 0;
  }

  /** Swap box with another slot */
  public swap(other: Slot): void {
    const box = other.eject();
    other.insert(this.eject());
    this.insert(box);
  }

  /** How far away from target is box */
  public displacement(box?: Box): number {
    let target: Position;
    if (box) target = box.target;
    else if (this.isEmpty) return 0;
    else target = this.target;
    const x = 0.5 + this.position.x - target.x;
    const y = 0.5 + this.position.y - target.y;
    return Math.sqrt(x * x + y * y);
  }

  /** Look at item in box */
  public get item(): Cell {
    return this.box[0].item;
  }

  /** Look at target for item in box */
  public get target(): Position {
    return this.box[0].target;
  }
}

////////////////////////////////////////////////////////////////////////

/** Positioning of ranked items in a grid */
export class Rank2D {
  private readonly matrix: Matrix;
  private readonly colcount: number;
  private readonly rowcount: number;
  private readonly xmin: number;
  private readonly xmax: number;
  private readonly ymin: number;
  private readonly ymax: number;

  /**
   * @param list - List of cells {x: number, y: number, item: any}
   */
  constructor(list: DataSet) {
    this.matrix = Rank2D.generateMatrix(list);

    this.colcount = this.matrix[0]?.length || 0;
    this.rowcount = this.matrix.length;
    this.xmin = Math.min(...list.map((i) => i.x));
    this.xmax = Math.max(...list.map((i) => i.x));
    this.ymin = Math.min(...list.map((i) => i.y));
    this.ymax = Math.max(...list.map((i) => i.y));

    for (const item of list) this.insert(item);
  }

  /** Generate a matrix of empty slots */
  private static generateMatrix(list: DataSet): Matrix {
    const slots = [];
    const avgsize = Math.sqrt(list.length);
    const rowcount = Math.ceil(list.length / avgsize);
    const colcount = Math.ceil(list.length / rowcount);
    for (let r = 0; r < rowcount; r++) {
      const row: Row = [];
      for (let c = 0; c < colcount; c++) {
        row.push(new Slot({ x: c, y: r }));
      }
      slots.push(row);
    }
    return slots;
  }

  /** Calculate target in Matrix for item */
  private targetPosition(item: Cell): Position {
    const xwid: number = (this.xmax - this.xmin) * 1.001;
    const yhei: number = (this.ymax - this.ymin) * 1.001;
    const cwid: number = xwid / this.colcount;
    const rhei: number = yhei / this.rowcount;
    const x: number = cwid == 0 ? 0.5 : (item.x - this.xmin) / cwid;
    const y: number = rhei == 0 ? 0.5 : (item.y - this.ymin) / rhei;
    return { x, y };
  }

  /** A flat list of all slots */
  private get flat(): Row {
    return this.matrix.flat();
  }

  /** Locate an empty slot */
  private get emptySlot(): Slot {
    const slot = this.flat.find((slot) => slot.isEmpty) as Slot;
    return slot;
  }

  /** Insert Item in Matrix at any free slot */
  private insert(item: Cell): void {
    // Generate a box
    const box: Box = { item, target: this.targetPosition(item) };
    // Insert box in an empty slot
    this.emptySlot.insert(box);
  }

  /** Swap boxes of two slots, if it makes combined displacement less */
  private minimize(a: Slot, b: Slot): void {
    if (a.isEmpty) [a, b] = [b, a];
    if (b.isEmpty) {
      if (a.isEmpty) return; // Both are empty
      // Slot b is empty
      const dist = a.displacement();
      const test = b.displacement(a);
      if (test < dist) b.insert(a.eject());
      return;
    }

    // Iitem in both slots
    const dist = a.displacement() + b.displacement();
    const test = a.displacement(b) + b.displacement(a);
    if (test < dist) a.swap(b);
  }

  /** Calculate sum of displacements */
  public get displacement(): number {
    return this.flat
      .map((slot) => slot.displacement())
      .reduce((sum, d) => sum + d, 0);
  }

  /** Compare all pairs of slots */
  private sweep(): void {
    const flat: Row = this.flat;
    if (flat.length < 2) return;
    for (let i = 0; i < flat.length - 1; i++) {
      for (let j = i + 1; j < flat.length; j++) {
        this.minimize(flat[i], flat[j]);
      }
    }
    this.minimize(flat[0], flat[1]);
  }

  /** Swap slots until displacement no longer changes */
  public optimize(): void {
    let prev = Infinity;
    while (this.displacement < prev) {
      prev = this.displacement;
      this.sweep();
    }
  }

  /** Export content in table */
  public get table(): Table {
    const table = [];
    for (let r = 0; r < this.rowcount; r++) {
      const row = [];
      for (let c = 0; c < this.colcount; c++) {
        const slot: Slot = this.matrix[r][c];
        row.push(slot.isEmpty ? null : slot.item);
      }
      table.unshift(row);
    }
    return table;
  }
}

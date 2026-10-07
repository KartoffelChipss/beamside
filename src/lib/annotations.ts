export type Point = { x: number; y: number };

export type Stroke = { color: string; size: number; points: Point[] };

export const TOOLS = ['none', 'laser', 'pen', 'eraser'] as const;
export type Tool = (typeof TOOLS)[number];

export const PEN_COLORS = {
    red: '#ef4444',
    yellow: '#facc15',
    green: '#22c55e',
    blue: '#3b82f6',
    white: '#ffffff',
    black: '#111111',
} as const;
export type PenColor = keyof typeof PEN_COLORS;

export const PEN_SIZES = { small: 0.004, medium: 0.008, large: 0.016 } as const;
export type PenSize = keyof typeof PEN_SIZES;

export const ERASER_RADIUS = 0.02;

export const strokePath = ({ points }: Stroke, width: number, height: number) => {
    const p = points.map(({ x, y }) => [x * width, y * height] as const);
    if (p.length === 1) return `M${p[0][0]} ${p[0][1]}l0.01 0`;
    let d = `M${p[0][0]} ${p[0][1]}`;
    for (let i = 1; i < p.length - 1; i++) {
        const mx = (p[i][0] + p[i + 1][0]) / 2;
        const my = (p[i][1] + p[i + 1][1]) / 2;
        d += `Q${p[i][0]} ${p[i][1]} ${mx} ${my}`;
    }
    const last = p[p.length - 1];
    return `${d}L${last[0]} ${last[1]}`;
};

const distanceToSegment = (p: Point, a: Point, b: Point, aspect: number) => {
    const [px, py, ax, ay, bx, by] = [p.x, p.y * aspect, a.x, a.y * aspect, b.x, b.y * aspect];
    const dx = bx - ax;
    const dy = by - ay;
    const lengthSquared = dx * dx + dy * dy;
    const t = lengthSquared
        ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared))
        : 0;
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};

export const hitsStroke = (stroke: Stroke, point: Point, aspect: number) => {
    const reach = ERASER_RADIUS + stroke.size / 2;
    const { points } = stroke;
    if (points.length === 1) return distanceToSegment(point, points[0], points[0], aspect) <= reach;
    return points.some(
        (p, i) => i > 0 && distanceToSegment(point, points[i - 1], p, aspect) <= reach
    );
};

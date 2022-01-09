export interface Edge<T> {
    id: string;
    source: string;
    target: string;
    data: T;
    styles?: EdgeStyles;
}


export interface EdgeStyles {
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
}
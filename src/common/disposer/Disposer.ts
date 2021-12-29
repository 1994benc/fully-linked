export interface Disposable {
    dispose: () => void;
}

export class Disposer {
    private _disposers: Disposable[] = [];

    public add(disposer: Disposable): void {
        this._disposers.push(disposer);
    }

    public dispose(): void {
        for (const disposer of this._disposers) {
            disposer.dispose();
        }
    }
}


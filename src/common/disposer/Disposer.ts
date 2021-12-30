export interface Disposable {
    dispose: () => void;
}

export class Disposer {
    private _disposers: Disposable[] = [];
    private _specificDisposers: { [key: string]: Disposable[] } = {};

    public add(disposer: Disposable): void {
        this._disposers.push(disposer);
    }

    public dispose(): void {
        for (const disposer of this._disposers) {
            disposer.dispose();
        }

        for (const key in this._specificDisposers) {
            for (const disposer of this._specificDisposers[key]) {
                disposer.dispose();
            }
        }
    }

    public addSpecific(key: string, disposer: Disposable): void {
        if (!this._specificDisposers[key]) {
            this._specificDisposers[key] = [];
        }
        this._specificDisposers[key].push(disposer);
    }
}


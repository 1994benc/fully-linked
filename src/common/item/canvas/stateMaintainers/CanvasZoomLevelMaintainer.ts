export class CanvasZoomLevelMaintainer {
    private _currentZoom: number = 1;

    public get currentZoom(): number {
        return this._currentZoom;
    }

    public set currentZoom(value: number) {
        this._currentZoom = value;
    }

    public reset() {
        this._currentZoom = 1;
    }
}
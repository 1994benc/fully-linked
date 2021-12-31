export class CanvasZoomAndTransformMaintainer {
    private _currentZoom: number = 1;
    private _transformX: number = 0;
    private _transformY: number = 0;

    public get transformX(): number {
        return this._transformX;
    }

    public get transformY(): number {
        return this._transformY;
    }

    public set transformX(value: number) {
        this._transformX = value;
    }

    public set transformY(value: number) {
        this._transformY = value;
    }


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
export class CreateNewEdgeStateMaintainer {
    private _creatingNewEdge: boolean = false;
    public newEdgeMetadata: {
        source: string | null;
        target: string | null;
      } = {
        source: null,
        target: null,
      };

    public get creatingNewEdge(): boolean {
        return this._creatingNewEdge;
    }

    public set creatingNewEdge(value: boolean) {
        this._creatingNewEdge = value;
    }
}
import { useEffect, useRef, useState } from "react";
import { FullyLinked } from "../..";
import { FullyLinkedData } from "../../common/data/types/FullyLinkedData";
import { datasetById, MyEdgeType, MyNodeType } from "./datasets";

export function App() {
  const [fullyLinkedInstance, setFullyLinkedInstance] = useState<FullyLinked<
    MyNodeType,
    MyEdgeType
  > | null>(null);
  const graphContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!graphContent.current) {
      return;
    }

    if (fullyLinkedInstance) {
      fullyLinkedInstance.destroy();
    }

    const fl = new FullyLinked<MyNodeType, MyEdgeType>({
      container: graphContent.current,
      id: "graph",
    });

    
    fl.setData(datasetById.test_1);
    
    fl.render();

    setFullyLinkedInstance(fl);

    return () => {
      fullyLinkedInstance?.destroy();
    };
  }, []);

  const changeData = (dataset: FullyLinkedData<MyNodeType, MyEdgeType>) => {
    fullyLinkedInstance?.updateData(dataset);
  };

  return (
    <div>
      <button onClick={() => changeData(datasetById.test_1)}>Data 1</button>
      <button onClick={() => changeData(datasetById.test_2)}>Data 2</button>
      <div
        ref={graphContent}
        className="graphContent"
        style={{
          width: "90vw",
          height: "90vh",
          overflow: "hidden",
          border: "solid 3px black",
        }}
      ></div>
    </div>
  );
}

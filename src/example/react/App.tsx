import { useEffect, useRef, useState } from "react";
import { FullyLinked } from "../..";
import { FullyLinkedData } from "../../common/data/types/FullyLinkedData";
import { FullyLinkedEventEnum } from "../../common/event/FullyLinkedEventEnum";
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
      initialCamera: {
        panX: 0.2,
        panY: 0.5,
        zoomLevel: 0.5,
      }
    });

    // Set up any event listeners
    setUpFullyLinkedEventListeners(fl);

    // Set the data
    fl.setData(datasetById.test_1);

    // Render the FullyLinked graph
    fl.render();

    // Save the FullyLinked instance as a React state
    // so we can access it in the rest of the component
    setFullyLinkedInstance(fl);

    return () => {
      // Don't forget to destroy the instance when the component unmounts
      fullyLinkedInstance?.destroy();
    };
  }, []);

  function setUpFullyLinkedEventListeners(
    fl: FullyLinked<MyNodeType, MyEdgeType>
  ) {
    fl.on(FullyLinkedEventEnum.beforeSetData, (e) => {
      console.log("beforeSetData", e);
    });

    fl.on(FullyLinkedEventEnum.afterSetData, (e) => {
      console.log("beforeSetData", e);
    });

    fl.on(FullyLinkedEventEnum.edgeClick, (e) => {
      console.log("edgeClick", e);
    });

    fl.on(FullyLinkedEventEnum.edgeRightClick, (e) => {
      console.log("edgeRightClick", e);
    });

    fl.on(FullyLinkedEventEnum.nodeDragStart, (e) => {
      console.log("nodeDragStart", e);
    });

    fl.on(FullyLinkedEventEnum.nodeDrag, (e) => {
      console.log("nodeDrag", e);
    });

    fl.on(FullyLinkedEventEnum.nodeDragEnd, (e) => {
      console.log("nodeDragEnd", e);
      console.log(fl?.getZoomLevel(), fl?.getCanvasZoomAndPan());

    });

    fl.on(FullyLinkedEventEnum.manualEdgeCreationStart, (e) => {
      console.log("manualEdgeCreationStart", e);
    })

    fl.on(FullyLinkedEventEnum.manualEdgeCreationEndSuccessfully, (e) => {
      console.log("edgeCreated", e);
    });

    fl.on(FullyLinkedEventEnum.beforeCanvasPanAndZoom, (e) => {
      console.log("beforeCanvasPanAndZoom", e);
    });

    fl.on(FullyLinkedEventEnum.canvasPanAndZoom, (e) => {
      console.log("canvasPanAndZoom", e);
    });

    fl.on(FullyLinkedEventEnum.afterCanvasPanAndZoom, (e) => {
      console.log("afterCanvasPanAndZoom", e);
    });
  }

  const changeData = (dataset: FullyLinkedData<MyNodeType, MyEdgeType>) => {
    // Change data without recreating the entire FullyLinked graph
    // FullyLinked will internally figure out which items have changed and update them accordingly
    fullyLinkedInstance?.updateData(dataset);
  };

  return (
    <div>
      <button onClick={() => changeData(datasetById.test_1)}>Data 1</button>
      <button onClick={() => changeData(datasetById.test_2)}>Data 2</button>

      {/* The container for our FullyLinked graph is a div and has a ref prop set to graphContent */}
      <div
        ref={graphContent}
        className="graphContent"
        style={{
          // FullyLinked requires that the container a width and height so that it can render the graph inside it
          width: "90vw",
          height: "90vh",
          overflow: "hidden",
          border: "solid 3px black",
        }}
      ></div>
    </div>
  );
}

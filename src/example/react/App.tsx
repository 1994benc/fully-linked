import { useEffect, useRef, useState } from "react";
import { FullyLinked } from "../..";
import { InternalNode } from "../../common/item/node/types/Node";

interface MyNodeType {
  id: string;
  label: string;
  imageUrl: string;
}

interface MyEdgeType {
  label: string;
  id: string;
}

function NodeComponent(props: { node: InternalNode<MyNodeType> }) {
  const onClick = () => {
    console.log(`Clicked node ${props.node.data.label}`);
  };

  return (
    <div
      onClick={onClick}
      style={{
        width: props.node.width + "px",
        height: props.node.height + "px",
        background: "lightgrey",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <div style={{ padding: "15px" }}>Name: {props.node.data.label}</div>
      <div style={{ width: "100%", height: "100px", overflow: "hidden", flex: "3" }}>
        <img
          src={props.node.data.imageUrl}
          style={{ objectFit: "fill"}}
          alt="Node Image"
        />
      </div>
    </div>
  );
}

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

    setFullyLinkedInstance(fl);

    const getNodeElement = (node: InternalNode<any>) => {
      return <NodeComponent node={node}></NodeComponent>;
    };

    fl.setData({
      nodes: [
        {
          id: "1",
          width: 300,
          height: 200,
          x: 50,
          y: 50,
          data: {
            id: "1",
            label: "Node 1",
            imageUrl: "https://picsum.photos/id/0/300",
          },
          customNodeElementAsReactComponent: getNodeElement,
        },
        {
          id: "2",
          width: 300,
          height: 200,
          x: 500,
          y: 250,
          data: {
            id: "2",
            label: "Node 2",
            imageUrl: "https://picsum.photos/id/2/300",
          },
          customNodeElementAsReactComponent: getNodeElement,
        },
        {
          id: "3",
          width: 300,
          height: 200,
          x: 1000,
          y: 450,
          data: {
            id: "3",
            label: "Node 3",
            imageUrl: "https://picsum.photos/id/10/300",
          },
          customNodeElementAsReactComponent: getNodeElement,
        },
        {
          id: "4",
          width: 300,
          height: 200,
          x: 1000,
          y: 700,
          data: {
            id: "4",
            label: "Node 4",
            imageUrl: "https://picsum.photos/id/50/300",
          },
          customNodeElementAsReactComponent: getNodeElement,
        },
        {
          id: "5",
          width: 300,
          height: 200,
          x: 1600,
          y: 850,
          data: {
            id: "5",
            label: "Node 5",
            imageUrl: "https://picsum.photos/id/40/300",
          },
          customNodeElementAsReactComponent: getNodeElement,
        },
        {
          id: "6",
          width: 300,
          height: 200,
          x: 50,
          y: 1000,
          data: {
            id: "6",
            label: "Node 6",
            imageUrl: "https://picsum.photos/id/11/300",
          },
          customNodeElementAsReactComponent: getNodeElement,
        },
      ],
      edges: [
        {
          id: "1",
          source: "1",
          target: "2",
          data: { id: "1", label: "Edge 1" },
        },
        {
          id: "2",
          source: "2",
          target: "3",
          data: { id: "2", label: "Edge 2" },
        },
        {
          id: "3",
          source: "2",
          target: "4",
          data: { id: "3", label: "Edge 3" },
        },
        {
          id: "4",
          source: "4",
          target: "5",
          data: { id: "4", label: "Edge 4" },
        },
      ],
      id: "test",
    });

    fl.render();

    return () => {
      fullyLinkedInstance?.destroy();
    };
  }, []);

  return (
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
  );
}

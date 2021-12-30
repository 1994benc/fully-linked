import { FullyLinkedData } from "../../common/data/types/FullyLinkedData";
import { InternalNode } from "../../common/item/node/types/Node";
import { NodeComponent } from "./NodeComponent";
export interface MyNodeType {
  id: string;
  label: string;
  imageUrl: string;
}

export interface MyEdgeType {
  label: string;
  id: string;
}

const getNodeElement = (node: InternalNode<any>) => {
  return <NodeComponent node={node}></NodeComponent>;
};

export const datasetById: {
  [id: string]: FullyLinkedData<MyNodeType, MyEdgeType>;
} = {
  test_1: {
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
      {
        id: "5",
        source: "4",
        target: "50",
        data: { id: "5", label: "Edge 5" },
      },
    ],
    id: "test_1",
  },
  test_2: {
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
      {
        id: "7",
        width: 300,
        height: 200,
        x: 300,
        y: 1000,
        data: {
          id: "7",
          label: "Node 7",
          imageUrl: "https://picsum.photos/id/12/300",
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
        id: "4",
        source: "4",
        target: "5",
        data: { id: "4", label: "Edge 4" },
      },
      {
        id: "5",
        source: "4",
        target: "50",
        data: { id: "5", label: "Edge 5" },
      },
      {
        id: "6",
        source: "4",
        target: "6",
        data: { id: "6", label: "Edge 6" },
      },
      {
        id: "7",
        source: "4",
        target: "7",
        data: { id: "7", label: "Edge 7" },
      },
      {
        id: "8",
        source: "6",
        target: "7",
        data: { id: "8", label: "Edge 8" },
      },
    ],
    id: "test_2",
  },
};

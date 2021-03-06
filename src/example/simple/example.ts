
import { ProcessedNode } from "../../common/item/node/types/Node";
import { FullyLinked } from "../../index";

interface MyNodeDataType {
  id: string;
  label: string;
}

interface MyEdgeDataType {
  id: string;
  label: string;
}

const fullyLinked = new FullyLinked<MyNodeDataType, MyEdgeDataType, any>({
  id: "test-graph",
  container: document.getElementById("container") as HTMLDivElement,
});

const getNodeElement = (node: ProcessedNode<MyNodeDataType, any>) => {
  const nodeElement = document.createElement("div");
  nodeElement.style.width = `${node.width}px`;
  nodeElement.style.height = `${node.height}px`;
  nodeElement.style.backgroundColor = "#eeee";
  nodeElement.style.borderRadius = "10px";
  const content = document.createElement('div');
  content.style.padding = "15px";
  content.innerText = node.data.label;
  nodeElement.appendChild(content);
  return nodeElement;
};

fullyLinked.setData({
  nodes: [
    {
      id: "1",
      width: 300,
      height: 80,
      x: 50,
      y: 50,
      data: { id: "1", label: "Node 1" },
      customNodeElement: getNodeElement,
    },
    {
      id: "2",
      width: 300,
      height: 80,
      x: 500,
      y: 250,
      data: { id: "2", label: "Node 2" },
      customNodeElement: getNodeElement,
    },
    {
      id: "3",
      width: 300,
      height: 80,
      x: 1000,
      y: 450,
      data: { id: "3", label: "Node 3" },
      customNodeElement: getNodeElement,
    },
    {
      id: "4",
      width: 300,
      height: 80,
      x: 1000,
      y: 650,
      data: { id: "4", label: "Node 4" },
      customNodeElement: getNodeElement,
    },
    {
      id: "5",
      width: 300,
      height: 80,
      x: 1600,
      y: 850,
      data: { id: "5", label: "Node 5" },
      customNodeElement: getNodeElement,
    },
    {
      id: "6",
      width: 300,
      height: 80,
      x: 50,
      y: 1000,
      data: { id: "6", label: "Node 6" },
      customNodeElement: getNodeElement,
    },
  ],
  edges: [
    { id: "1", source: "1", target: "2", data: { id: "1", label: "Edge 1" } },
    { id: "2", source: "2", target: "3", data: { id: "2", label: "Edge 2" } },
    { id: "3", source: "2", target: "4", data: { id: "3", label: "Edge 3" } },
    { id: "4", source: "4", target: "5", data: { id: "4", label: "Edge 4" } },
  ],
  id: "test",
});

fullyLinked.render();

import { InternalNode } from "../../common/item/node/types/Node";
import { MyNodeType } from "./datasets";

export function NodeComponent(props: { node: InternalNode<MyNodeType>; }) {
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
      <div style={{ padding: "15px" }}>Name: {props.node.data.label} {props.node.id}</div>
      <div style={{ width: "100%", height: "100px", overflow: "hidden", flex: "3" }}>
        <img
          src={props.node.data.imageUrl}
          style={{ objectFit: "fill" }}
          draggable={false}
          alt="Node Image" />
      </div>
    </div>
  );
}

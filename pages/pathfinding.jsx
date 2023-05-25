import { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import Graph, { Node } from "../pathfinding/Graph";

const styles = {
  parent: {
    display: "flex",
    padding: "3rem",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    width: "85%",
    maxWidth: "1100px",
    padding: "3rem",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40rem",
    flexWrap: "wrap",
  },
  graphCell: {
    width: "20px",
    height: "20px",
    backgroundColor: "white",
    margin: "1px",
  },
  pathCell: {
    width: "20px",
    height: "20px",
    backgroundColor: "yellow",
    margin: "1px",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  horizontalEdge: {
    width: "20px",
    height: "2px",
    backgroundColor: "lightGray",
    marginLeft: "2px",
    marginRight: "2px",
  },
  verticalEdge: {
    width: "2px",
    height: "20px",
    backgroundColor: "lightGray",
  },
};

function Cell(props) {
  const { type } = props;

  // TODO: Will add more types later.
  const style = !type ? styles.graphCell : styles.pathCell;

  return <div style={style}></div>;
}

function Edge(props) {
  const { direction } = props;
  const style =
    direction === "vertical" ? styles.verticalEdge : styles.horizontalEdge;

  return <div style={style}></div>;
}

// Handles the logic for rendering an individual row.
function Row(props) {
  const { width, border, path, y } = props;

  // Checks to see if a given cell is in the path
  function inPath(x, y) {
    return path.find((cell) => cell.x === x && cell.y === y) ? true : false;
  }

  function generateRow() {
    const output = [];
    for (let i = 0; i < width; i++) {
      if (border) {
        output.push(<Edge direction={"horizontal"} />);
      } else {
        let cellType = null;
        if (inPath(i, y)) {
          cellType = "path";
        }
        output.push(<Cell type={cellType} />);
        // Handle the in-between Edges.
        if (i !== width - 1 && !border)
          output.push(<Edge direction={"vertical"} />);
      }
    }
    return <div style={styles.row} children={output}></div>;
  }

  return generateRow();
}

export default function Pathfinding() {
  const WIDTH = 15;
  const HEIGHT = 15;

  const graph = new Graph(WIDTH, HEIGHT);
  const [graphDisplay, setGraphDisplay] = useState([[]]);
  const [path, setPath] = useState([]);

  const handleSubmit = () => {
    console.log("entry");
    const path = graph.findPath(new Node(0, 0), new Node(14, 14));
    setPath(path);
  };

  useEffect(() => {
    // Generate HEIGHT # of Rows
    // Parent div contains Rows
    const output = [];
    for (let i = 0; i < HEIGHT; i++) {
      // Create actual divs.
      output.push(
        <Row
          style={styles.row}
          graph={graph}
          path={path}
          y={i}
          height={HEIGHT}
          width={WIDTH}
        >
          Path
        </Row>
      );
      // Create row of border divs, except for the very last one.
      if (i !== WIDTH - 1)
        output.push(
          <Row
            style={styles.row}
            path={path}
            border={true}
            height={HEIGHT}
            width={WIDTH}
          ></Row>
        );
    }
    console.log("output", output);
    setGraphDisplay(output);
  }, [path]);

  return (
    <>
      <div style={styles.parent}>
        {graphDisplay}
        <button onClick={handleSubmit}>Find Path</button>
      </div>
    </>
  );
}

import Graph, { Node, removeExplored } from "../pathfinding/Graph";

describe("Serialize path", () => {
  test("Serialize path should serialize sorted nodes properly", () => {
    const graph = new Graph(5, 5);
    const path = graph.serializePath(new Node(0, 0), new Node(0, 1));
    expect(path).toMatch("(0,0)(0,1)");
  });

  test("Serialize path should sort nodes based on the X value if possible", () => {
    const graph = new Graph(5, 5);
    const path = graph.serializePath(new Node(1, 0), new Node(0, 1));
    expect(path).toMatch("(0,1)(1,0)");
  });

  test("Serialize path should sort nodes by Y value if X values are the same", () => {
    const graph = new Graph(3, 3);
    const path = graph.serializePath(new Node(1, 1), new Node(1, 0));
    expect(path).toMatch("(1,0)(1,1)");
  });
});

describe("Adjacent nodes", () => {
  test("Adjacent nodes should include all adjacent nodes", () => {
    const graph = new Graph(3, 3);
    const adjacentNodes = graph
      .findAdjacentNodes(new Node(1, 1))
      .map((node) => node.toString());
    expect(adjacentNodes).toContain("(0,1)");
    expect(adjacentNodes).toContain("(1,0)");
    expect(adjacentNodes).toContain("(1,2)");
    expect(adjacentNodes).toContain("(2,1)");
  });

  test("Adjacent nodes should not include left-out-of-bounds nodes", () => {
    const graph = new Graph(3, 3);
    const adjacentNodes = graph
      .findAdjacentNodes(new Node(0, 1))
      .map((node) => node.toString());
    expect(adjacentNodes.length).toBe(3);
    expect(adjacentNodes).toContain("(1,1)");
    expect(adjacentNodes).toContain("(0,0)");
    expect(adjacentNodes).toContain("(0,2)");
  });

  test("Adjacent nodes should not include right-out-of-bounds nodes", () => {
    const graph = new Graph(3, 3);
    const adjacentNodes = graph
      .findAdjacentNodes(new Node(2, 1))
      .map((node) => node.toString());
    expect(adjacentNodes.length).toBe(3);
    expect(adjacentNodes).toContain("(1,1)");
    expect(adjacentNodes).toContain("(2,0)");
    expect(adjacentNodes).toContain("(2,2)");
  });

  test("Adjacent nodes should not include up-out-of-bounds nodes", () => {
    const graph = new Graph(3, 3);
    const adjacentNodes = graph
      .findAdjacentNodes(new Node(1, 0))
      .map((node) => node.toString());
    expect(adjacentNodes.length).toBe(3);
    expect(adjacentNodes).toContain("(1,1)");
    expect(adjacentNodes).toContain("(0,0)");
    expect(adjacentNodes).toContain("(2,0)");
  });

  test("Adjacent nodes should not include down-out-of-bounds nodes", () => {
    const graph = new Graph(3, 3);
    const adjacentNodes = graph
      .findAdjacentNodes(new Node(1, 2))
      .map((node) => node.toString());
    expect(adjacentNodes.length).toBe(3);
    expect(adjacentNodes).toContain("(1,1)");
    expect(adjacentNodes).toContain("(0,2)");
    expect(adjacentNodes).toContain("(2,2)");
  });
});

describe("Blocked paths", () => {
  test("Adjacent nodes should not include blocked paths", () => {
    const graph = new Graph(3, 3);
    graph.blockPath(new Node(0, 0), new Node(0, 1));
    const adjacentNodes = graph
      .findAdjacentNodes(new Node(0, 0))
      .map((node) => node.toString());
    expect(adjacentNodes.length).toBe(1);
    expect(adjacentNodes).toContain("(1,0)");
  });

  test("Should be able to unblock paths", () => {
    const graph = new Graph(3, 3);
    graph.blockPath(new Node(0, 0), new Node(0, 1));
    const adjacentNodes = graph
      .findAdjacentNodes(new Node(0, 0))
      .map((node) => node.toString());
    expect(adjacentNodes.length).toBe(1);
    expect(adjacentNodes).toContain("(1,0)");

    graph.unblockPath(new Node(0, 0), new Node(0, 1));
    const unblockedNodes = graph
      .findAdjacentNodes(new Node(0, 0))
      .map((node) => node.toString());
    expect(unblockedNodes.length).toBe(2);
    expect(unblockedNodes).toContain("(0,1)");
    expect(unblockedNodes).toContain("(1,0)");
  });
});

test("createUnexploredSet should generate a set with all nodes in a graph", () => {
  const graph = new Graph(3, 3);
  const unexploredSet = graph.createUnexploredSet();
  expect(unexploredSet.size).toBe(9);
});

test("Remove explored should remove explored nodes from a list of nodes", () => {
  const graph = new Graph(3, 3);
  const unexploredSet = new Set();
  unexploredSet.add(new Node(0, 1).toString());
  const nodes = [new Node(0, 0), new Node(0, 1), new Node(0, 2)];
  const unexplored = graph.removeExplored(unexploredSet, nodes);
  expect(unexplored.length).toBe(2);
});

test("getNextNode should return the lowest node in a set", () => {
  const graph = new Graph(1, 3);
  const unexploredSet = graph.createUnexploredSet();
  const node0 = new Node(0, 0);
  const node1 = new Node(0, 1);
  const node2 = new Node(0, 2);
  const distances = {};
  distances[node0] = 1;
  distances[node1] = 2;
  distances[node2] = 3;
  const { nextNode } = graph.popNextNode(unexploredSet, distances);
  expect(nextNode.toString()).toEqual("(0,0)");
  const { nextNode: nextNextNode } = graph.popNextNode(
    unexploredSet,
    distances
  );
  expect(nextNextNode.toString()).toEqual("(0,1)");
  const { nextNode: nextNextNextNode } = graph.popNextNode(
    unexploredSet,
    distances
  );
  expect(nextNextNextNode.toString()).toEqual("(0,2)");
});

test("getNextNode will pop an arbitrary node if distances are uninitialized", () => {
  const graph = new Graph(1, 3);
  const unexploredSet = graph.createUnexploredSet();
  const distances = {};
  const { nextNode } = graph.popNextNode(unexploredSet, distances);
  expect(nextNode.toString()).toEqual("(0,0)");
  expect(unexploredSet.size).toBe(2);
});

describe("Path finding", () => {
  test("lets see what happens lol", () => {
    const graph = new Graph(1, 3);
    graph.findPath(new Node(0, 0), new Node(0, 2));
  });
});

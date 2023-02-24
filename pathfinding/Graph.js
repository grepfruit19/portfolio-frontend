export class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `(${this.x},${this.y})`;
  }
}

export default class Graph {
  /*
    The graph is represented by a 2D array.
    Working with the assumption that adjacent squares (non-diagonal) have a distance of 1
  */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.blocks = {};
  }

  // Serializes a path between two nodes to a standardized string format for blocks
  serializePath(node1, node2) {
    let firstNode;
    let secondNode;
    // Sort the two nodes, first by X value, then by Y value if necessary.
    if (node1.x < node2.x) {
      firstNode = node1;
      secondNode = node2;
    } else if (node1.x > node2.x) {
      firstNode = node2;
      secondNode = node1;
    } else {
      // The X's are equal
      if (node1.y < node2.y) {
        firstNode = node1;
        secondNode = node2;
      } else {
        firstNode = node2;
        secondNode = node1;
      }
    }
    return firstNode.toString() + secondNode.toString();
  }

  blockPath(node1, node2) {
    this.blocks[this.serializePath(node1, node2)] = true;
  }

  unblockPath(node1, node2) {
    this.blocks[this.serializePath(node1, node2)] = false;
  }

  isBlocked(node1, node2) {
    // This converts null/undefined to false.
    if (this.blocks[this.serializePath(node1, node2)]) {
      return true;
    }
    return false;
  }

  // Returns a list of Node objects that are adjacent to the given node.
  // Accounts for out of bounds and blocked paths
  findAdjacentNodes(node) {
    const adjacentNodes = [];
    if (node.x !== 0) {
      // Push the left node
      const leftNode = new Node(node.x - 1, node.y);
      if (!this.isBlocked(node, leftNode)) adjacentNodes.push(leftNode);
    }
    if (node.y !== 0) {
      const aboveNode = new Node(node.x, node.y - 1);
      if (!this.isBlocked(node, aboveNode)) adjacentNodes.push(aboveNode);
    }
    if (node.x !== this.width - 1) {
      // Push the right node
      const rightNode = new Node(node.x + 1, node.y);
      if (!this.isBlocked(node, rightNode)) adjacentNodes.push(rightNode);
    }
    if (node.y !== this.height - 1) {
      // Push the below node
      const belowNode = new Node(node.x, node.y + 1);
      if (!this.isBlocked(node, belowNode)) adjacentNodes.push(belowNode);
    }
    if (adjacentNodes.length === 0) throw new Error("No adjacent nodes");
    return adjacentNodes;
  }

  /**
   * Removes explored nodes from a list of Nodes
   * @param {Set} unexplored - Set of unexplored nodes
   * @param {Node} adjacentNodes - Array of Node objects to filter explored nodes out of
   */
  removeExplored(unexplored, nodes) {
    if (nodes.length === 0)
      throw new Error("removeExplored received an empty array");
    return nodes.filter((node) => {
      const stringifiedNode = node.toString();
      return !unexplored.has(stringifiedNode);
    });
  }

  // Generates a path
  backtrack(parents, node) {
    const path = [];
    // Include the end in the path.
    path.push(node);

    let previousNode = parents[node];
    while (previousNode) {
      path.push(previousNode);
      previousNode = parents[previousNode];
    }
    // The path is backwards since we're backtracking.
    return path.reverse();
  }

  createUnexploredSet() {
    const unexplored = new Set();
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        unexplored.add(new Node(i, j));
      }
    }
    return unexplored;
  }

  // Returns the next node, which is the node that has lowest distance.
  // Note that this function modifies unexplored.
  popNextNode(unexplored, distances) {
    let nextNode = null;
    let lowestDistance = Infinity;

    // Pop the lowest distance node
    unexplored.forEach((current) => {
      const currentDistance = distances[current] || Infinity;
      if (currentDistance < lowestDistance) {
        nextNode = current;
        lowestDistance = currentDistance;
      }
    });

    // If we could not find the lowest distance, just pick one.
    // This will happen on first iteration for example.
    if (!nextNode) {
      nextNode = Array.from(unexplored)[0];
    }
    unexplored.delete(nextNode);
    return {
      nextNode,
      unexplored,
    };
  }

  populateDistances(unexplored, start) {
    const distances = {};
    unexplored.forEach((node) => {
      if (node.x === start.x && node.y === start.y) {
        distances[node] = 0;
      } else {
        distances[node] = Infinity;
      }
    });
    return distances;
  }

  findPath(start, end) {
    if (start.x === end.x && start.y === end.y) return start;
    // All Node objects should come from unexplored.
    // Using/initializing other Node objects will create reference errors
    const unexplored = this.createUnexploredSet();
    const distances = this.populateDistances(unexplored, start);
    const parents = {};

    while (unexplored.size > 0) {
      const nextNodeValues = this.popNextNode(unexplored, distances);
      const { nextNode: currentNode } = nextNodeValues;

      if (currentNode.x === end.x && currentNode.y === end.y) {
        const path = this.backtrack(parents, currentNode);
        // If there is no viable path, we'll just get a node of length 1
        // that only contains the end node. In that case we just want to return []
        // for consistency.
        // We cover the case where start === end in the beginning.
        if (path.length === 1) return [];
        return this.backtrack(parents, currentNode);
      }

      let adjacentNodes;
      try {
        adjacentNodes = this.removeExplored(
          unexplored,
          this.findAdjacentNodes(currentNode)
        );
      } catch (err) {
        if (err.message.includes("No adjacent nodes")) {
          return [];
        }
      }
      adjacentNodes.forEach((adjacentNode) => {
        const newDistance = distances[currentNode] + 1;
        const oldDistance = distances[adjacentNode];
        if (newDistance < oldDistance) {
          distances[adjacentNode] = newDistance;
          parents[adjacentNode] = currentNode;
        }
      });
    }
  }
}

import remarkParse from "remark-parse";
import { unified } from "unified";
import { normalizeSrc } from "./parseUtils";
import { Node, NodeElement } from "./types";

/**
 * Embed html in markdown is not supported
 */
export function parseMarkdown(markdown: string) {
  // https://github.com/syntax-tree/mdast
  const root = unified().use(remarkParse, { fragment: true }).parse(markdown);
  return root.children.map(convertToTgNode);
}

function convertToTgNode(node: any): Node {
  if (node.type === "text") {
    return node.value;
  }
  const nodeElement: NodeElement = {} as NodeElement;

  switch (node.type) {
    case "heading": {
      if (node.depth === 1) {
        nodeElement.tag = "h3";
      }
      if (node.depth >= 2) {
        nodeElement.tag = "h4";
      }
      break;
    }
    case "list": {
      if (node.ordered) {
        nodeElement.tag = "ol";
      } else {
        nodeElement.tag = "ul";
      }
      break;
    }

    case "link": {
      nodeElement.tag = "a";
      if (node.url) {
        nodeElement.attrs = {
          href: node.url,
        };
      }
      break;
    }

    case "image": {
      nodeElement.tag = "img";
      if (node.url) {
        nodeElement.attrs = {
          src: normalizeSrc(node.url, "img"),
        };
      }
    }

    default: {
      for (const [type, tag] of Object.entries({
        blockquote: "blockquote",
        break: "br",
        code: "pre",
        inlineCode: "code",
        emphasis: "i",
        listItem: "li",
        paragraph: "p",
        strong: "strong",
        thematicBreak: "hr",
      } as const)) {
        if (node.type === type) {
          nodeElement.tag = tag;
          break;
        }
      }
      if (!nodeElement.tag) {
        throw new Error(`Not allowed node type ${node.type}`);
      }
    }
  }

  nodeElement.children = node.children.map(convertToTgNode);
  return nodeElement;
}

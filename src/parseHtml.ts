import rehypeParse from "rehype-parse";
import { unified } from "unified";
import { Node, NodeElement } from "./types";
import { normalizeSrc, avaiableTags } from "./parseUtils";

/**
 * [note]: h1,h2,h5,h6 are not allowed, use h3,h4
 */
export function parseHtml(html: string) {
  // https://github.com/syntax-tree/hast
  const root = unified().use(rehypeParse, { fragment: true }).parse(html);
  return root.children
    .map(convertToTgNode)
    .filter((node) => (typeof node === "string" ? node.length > 0 : true));
}

function convertToTgNode(node: any): Node {
  if (node.type === "text") {
    return node.value.trim();
  }
  if (node.type === "element") {
    if (!avaiableTags.includes(node.tagName)) {
      throw new Error(`tagName ${node.tagName} is not allowed`);
    }
    const nodeElement: NodeElement = {
      tag: node.tagName,
    };

    if (Object.keys(node.properties).length > 0) {
      const attrs: {
        href?: string;
        src?: string;
      } = {};
      if (node.properties.href) attrs.href = node.properties.href;
      if (node.properties.src)
        attrs.src = normalizeSrc(node.properties.src, node.tagName);
      nodeElement.attrs = attrs;
    }

    nodeElement.children = node.children
      .map(convertToTgNode)
      .filter((node: Node) =>
        typeof node === "string" ? node.length > 0 : true
      );
    return nodeElement;
  }
  throw new Error(`Not allowed node type ${node.type}`);
}

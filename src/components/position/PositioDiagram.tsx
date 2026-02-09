import type { Position } from "@/lib/types/position.type";
import { Plus } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

type OrgNode = {
  id: string;
  name: string;
  company_id: string;
  children?: OrgNode[];
};

const TreeNode = ({
  node,
  isRoot = false,
}: {
  node: OrgNode;
  isRoot?: boolean;
}) => {
  const [childPositions, setChildPositions] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasChildren = node.children && node.children.length > 0;

  useEffect(() => {
    if (hasChildren && containerRef.current) {
      const timer = setTimeout(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const childNodes = container.querySelectorAll(
          ":scope > .children-wrapper > .child-node",
        );
        const positions: number[] = [];

        childNodes.forEach((childNode) => {
          const card = childNode.querySelector(".node-card");
          if (card) {
            const rect = card.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2 - containerRect.left;
            positions.push(centerX);
          }
        });

        if (positions.length === node.children?.length) {
          setChildPositions(positions);
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [hasChildren, node.children]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Node Box */}
      <div className="relative z-10">
        <div
          className={`node-card border-2 rounded-lg p-2 transition-all max-w-[100px] text-center shadow-md ${
            isRoot
              ? "border-purple-500 bg-purple-100"
              : hasChildren
                ? "border-blue-500 bg-blue-50"
                : "border-gray-400 bg-white"
          }`}
        >
          <div className="font-semibold text-xs text-gray-800 wrap-break-words">
            {node.name}
          </div>

          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-primary rounded-full border border-white shadow-sm">
            {/* {true ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : ( */}
            <Plus className="w-4 h-4 text-white" />
            {/* )} */}
          </div>
        </div>
      </div>

      {/* Children Container */}
      {hasChildren && (
        <>
          {/* Vertical Line from parent */}
          <div className="w-0.5 h-8 bg-gray-400"></div>

          {/* Container for horizontal line and vertical drops */}
          <div
            className="flex flex-col items-center relative w-full"
            ref={containerRef}
          >
            {node.children &&
              node.children.length > 1 &&
              childPositions.length === node.children.length && (
                <div className="relative w-full h-8">
                  {/* Horizontal line connecting first to last child */}
                  <div
                    className="h-0.5 bg-gray-400 absolute"
                    style={{
                      top: 0,
                      left: `${childPositions[0]}px`,
                      width: `${
                        childPositions[childPositions.length - 1] -
                        childPositions[0]
                      }px`,
                    }}
                  ></div>

                  {/* Vertical lines to each child */}
                  {childPositions.map((pos, index) => (
                    <div
                      key={index}
                      className="w-0.5 h-8 bg-gray-400 absolute"
                      style={{
                        top: 0,
                        left: `${pos}px`,
                      }}
                    ></div>
                  ))}
                </div>
              )}

            {node.children && node.children.length === 1 && (
              <div className="w-0.5 h-8 bg-gray-400"></div>
            )}

            {/* Child Nodes */}
            <div className="children-wrapper flex items-start justify-center gap-1">
              {node.children &&
                node.children.map((child, index) => (
                  <div
                    key={child.id || index}
                    className="flex flex-col items-center child-node"
                  >
                    <TreeNode node={child} />
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const PositionDiagram: React.FC<{ data: Position[] }> = ({ data }) => {
  const buildTree = (data: Position[]) => {
    const nodeMap: { [key: string]: OrgNode & { children: OrgNode[] } } = {};

    data?.forEach((item) => {
      nodeMap[item.id] = {
        id: item.id,
        name: item.name,
        company_id: item.company_id,
        children: [],
      };
    });

    let root = null;
    data?.forEach((item) => {
      const node = nodeMap[item.id];

      if (!item.parent) {
        root = node;
      } else {
        const parentNode = nodeMap[item.parent.id];
        if (parentNode) {
          parentNode.children.push(node);
        }
      }
    });

    return root;
  };

  const treeData = useMemo(() => buildTree(data), [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8 overflow-x-auto">
      <div className="min-w-max mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Struktur Organisasi Perusahaan
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Struktur Organisasi Lengkap
          </p>
          <div className="mt-12 flex justify-center">
            {treeData ? (
              <TreeNode node={treeData} isRoot={true} />
            ) : (
              <div className="text-gray-500">Data tidak tersedia</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionDiagram;

// @flow
/*
  Copyright(c) 2018 Uber Technologies, Inc.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
          http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import React, { useMemo } from 'react';
import { INode } from './node';
import GraphUtils from '../utilities/graph-util';
import { DEFAULT_NODE_SIZE } from '../constants';
import { EMPTY_TYPE } from "./graph_config";

type NodeShapePropsT = {
  data: INode,
  nodeTypes: any,
  nodeSubtypes: any,
  nodeKey: string,
  nodeSize?: number,
  nodeWidth?: number,
  nodeHeight?: number,
  selected: boolean,
  hovered: boolean,
};

export function getShapeID(types: any, type?: null | string) {
  if (!!type && types[type]) {
    return types[type].shapeId;
  } else if (types.emptyNode) {
    return types.emptyNode.shapeId;
  }

  return null;
}

export default function NodeShape({
  data,
  nodeTypes,
  nodeSubtypes,
  nodeKey,
  nodeSize,
  nodeWidth,
  nodeHeight,
  selected = false,
  hovered = false,
}: NodeShapePropsT) {
  let height = nodeSize || nodeHeight || DEFAULT_NODE_SIZE;
  let width = nodeSize || nodeWidth || DEFAULT_NODE_SIZE;

  const nodeShapeContainerClassName = GraphUtils.classNames('shape');
  const nodeClassName = useMemo(
    () => GraphUtils.classNames('node', { selected, hovered }),
    [selected, hovered]
  );
  const nodeSubtypeClassName = useMemo(
    () =>
      GraphUtils.classNames('subtype-shape', {
        selected,
      }),
    [selected]
  );
  const nodeTypeHref = getShapeID(nodeTypes, EMPTY_TYPE) || '';
  const nodeSubtypeHref = getShapeID(nodeSubtypes, data.subtype) || '';

  // get width and height defined on def element
  const defSvgNodeElement: any = useMemo(() => {
    return nodeTypeHref ? document.querySelector(`defs>${nodeTypeHref}`) : null;
  }, [nodeTypeHref]);
  const nodeWidthAttr = defSvgNodeElement
    ? defSvgNodeElement.getAttribute('width')
    : 0;
  const nodeHeightAttr = defSvgNodeElement
    ? defSvgNodeElement.getAttribute('height')
    : 0;

  // calculate node shape based on priority
  width = nodeWidthAttr ? parseInt(nodeWidthAttr, 10) : width;
  height = nodeHeightAttr ? parseInt(nodeHeightAttr, 10) : height;
  let priority = data.priority ? (26 - 3 * data.priority) / 10 : 0;
  width = width * (priority)
  height = height * (priority)

  return (
    <g
      className={nodeShapeContainerClassName}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
    >
      {!!data.subtype && (
        <use
          className={nodeSubtypeClassName}
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          href={nodeSubtypeHref}
          xmlns="http://www.w3.org/2000/svg"
        />
      )}
      <use
        className={nodeClassName}
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        href={nodeTypeHref}
        xmlns="http://www.w3.org/2000/svg"
      />
    </g>
  );
}
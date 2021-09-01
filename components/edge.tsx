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

import React, { useRef } from 'react';
import GraphUtils from '../utilities/graph-util';
import { EMPTY_EDGE_TYPE } from "./graph_config";
import {
  getPathDescription
} from '../helpers/edge-helpers';

// Modified from https://github.com/uber/react-digraph/blob/master/src/components/edge.js
export type IEdge = {
  source: number,
  target: number,
};

export type ITargetPosition = {
  x: number,
  y: number,
  [key: string]: any,
};

// Modified from https://github.com/uber/react-digraph/blob/master/src/components/edge.js
type IEdgeProps = {
  data: IEdge,
  nodeSize?: number,
  sourceNode: ITargetPosition | null,
  targetNode: ITargetPosition,
  isSelected: boolean,
  nodeKey: string,
  viewWrapperElem: HTMLDivElement,
  isBeingDragged: boolean,
};

function Edge({
  data,
  viewWrapperElem,
  isSelected = false,
  nodeSize = 0,
  sourceNode,
  targetNode,
  nodeKey,
  isBeingDragged = false,
}: IEdgeProps) {
  const edgePathRef = useRef();
  const edgeOverlayRef = useRef();

  // Removed edge handle functionalities https://github.com/uber/react-digraph/blob/master/src/components/edge.js

  const pathDescription = getPathDescription(
    data,
    sourceNode,
    targetNode,
    nodeKey,
    nodeSize,
    viewWrapperElem
  );

  if (!viewWrapperElem) {
    return null;
  }

  const id = `${data.source != null ? data.source : ''}_${data.target}`;
  const className = GraphUtils.classNames('edge', EMPTY_EDGE_TYPE, {
    selected: isSelected,
  });
  const isBeingDraggedStyle = {
    pointerEvents: isBeingDragged ? 'none' : 'auto',
  };

  return (
    <g
      className="edge-container"
      data-source={data.source}
      data-target={data.target}
    >
      <g className={className}>
        <path
          ref={edgePathRef}
          className="edge-path"
          d={pathDescription || undefined}
          style={{
            ...isBeingDraggedStyle,
          }}
        />
      </g>
      <g className="edge-mouse-handler">
        <path
          className="edge-overlay-path"
          ref={edgeOverlayRef}
          id={id}
          data-source={data.source}
          data-target={data.target}
          d={pathDescription || undefined}
          style={{
            ...isBeingDraggedStyle,
          }}
        />
      </g>
    </g>
  );
}

export default Edge;
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

import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import GraphUtils from '../utilities/graph-util';
import { INode } from './node';
import {
  DEFAULT_NODE_TEXT_MAX_TITLE_CHARS,
  DEFAULT_NODE_TEXT_LINE_OFFSET,
  DEFAULT_NODE_TEXT_MAX_LINE_LEN
} from '../constants';

type INodeTextProps = {
  data: INode,
  nodeTypes: any,
  isSelected: boolean,
  maxTitleChars?: number,
  lineOffset?: number,
};

function getTypeText(data: INode, nodeTypes: any) {
  if (data.type && nodeTypes[data.type]) {
    return nodeTypes[data.type].typeText;
  } else if (nodeTypes.emptyNode) {
    return nodeTypes.emptyNode.typeText;
  } else {
    return null;
  }
}

function NodeText({
    data,
    nodeTypes,
    isSelected,
    maxTitleChars = DEFAULT_NODE_TEXT_MAX_TITLE_CHARS,
    lineOffset = DEFAULT_NODE_TEXT_LINE_OFFSET,
}: INodeTextProps) {
  const nodeTextRef = useRef();

  const title = data.title;
  let description = data.description;
  
  const className = useMemo(
    () =>
      GraphUtils.classNames('node-text', {
        selected: isSelected,
      }),
    [isSelected]
  );

  // prevents the SVG click event from firing when the node text is selected
  const handleTextClick = useCallback((event: any) => {
    event.stopPropagation();
  }, []);

  const typeText = useMemo(() => getTypeText(data, nodeTypes), [
    data,
    nodeTypes,
  ]);

  useEffect(() => {
    d3.select(nodeTextRef.current).on('click', () => handleTextClick);
  }, [handleTextClick]);

  // trim text to have length of maxLen
  const trimmed = (text: string, maxLen: number) => {
    return text.substr(0, maxLen)
  }

  // break up text into lines
  const addNewLines = (text: string, lineLen: number) => {
    let i = 0;
    let phrases = []
    let textLength = text.length

    while (i < textLength) {
      let breakIdx;
      let subText = text.substr(0, lineLen)
      let lastWhiteSpace = subText.lastIndexOf(" ")

      if (lastWhiteSpace == -1 || lastWhiteSpace == 0) {
        breakIdx = subText.length
      } else {
        breakIdx = Math.min(subText.length, lastWhiteSpace)
      }
      phrases.push(text.substr(0, breakIdx))
      text = text.substr(breakIdx)
      i += breakIdx

      if (breakIdx == 0) {
        break;
      }
    }
    phrases[phrases.length - 1] += '...'
    return phrases
  }

  if (description.length > maxTitleChars) {
    description = description.substr(0, Math.min(trimmed(description, maxTitleChars).length, 
                                                  trimmed(description, maxTitleChars).lastIndexOf(" ")))
  }

  return (
    <>
    <text
      ref={nodeTextRef}
      className={className}
      textAnchor="middle"
      xmlns="http://www.w3.org/2000/svg"
    >
      {!!typeText && <tspan  fontSize="30px">{title}</tspan>}
    </text>
    {addNewLines(description, DEFAULT_NODE_TEXT_MAX_LINE_LEN).map((phrase, i) => {
      return <text 
      key={i}
      textAnchor="middle"
      x={0}
      dy={lineOffset * (i + 1)}
      fontSize="12px"
      style={{fontStyle: 'italic', whiteSpace: 'pre-wrap'}}
      xmlns="http://www.w3.org/2000/svg"
      >{phrase}</text>
    })}
    </>
  );
}

export default NodeText;
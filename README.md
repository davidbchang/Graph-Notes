# Graph-Notes
<p>Directed graph editor for note-taking and planning. Written in React and Django.</p>


![github](https://user-images.githubusercontent.com/29415393/131959817-4a9e9778-639e-41a5-aef7-5b3bfdcd8392.gif)



## Overview
### Problem
<p>
  A big issue with the main types of documents people use to present information (word docs, presentation slides, spreadsheets) is that they are not compatible with the way people mentally represent information. Our thoughts and the interconnecting links between our thoughts are abstract and fluid, and they closely resemble a directed graph structure, where each edge represents a particular line of reasoning from a parent thought to a child thought. However, word docs and slides are linear in structure, and projecting our mental graph structure down to a linear structure essentially requires forcing us to think in a topological sort.
</p>

### Solution
<p>
  A graph structure is an information interface that better aligns with peoples' thought processes, and so a directed graph editor would be a better note-taking tool than traditional mediums of written information such as word docs and slides.
</p>

### My Approach
<p>
  I built a fully interactive directed graph editor using React, which gets and sets data via requests to a REST API that I designed using Django. This note-taker/planner allows users to specify the priority level of each task, which is used to determine the size of the nodes (priority 1 tasks are the biggest nodes, and priority 5 tasks are the smallest). Each node displays the title of the task and a short preview of the description. Full information for a task is displayed when the user selects a node. Every element in the graph visualizer is draggable and clickable. I used some code from <a href="https://github.com/uber/react-digraph">react-digraph</a> to provide the ui and the layout engine functionalities. 
</p>

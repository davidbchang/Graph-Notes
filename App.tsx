import GraphView from './components/graph-view';
import { Edge, IEdge } from './components/edge';
import { Node, INode } from './components/node';
import {
    SelectionT,
} from './components/graph-view-props';
import React from "react";
import produce from "immer";
import axios from "axios";
import CustomModal from "./components/Modal"; 
import ViewModal from './components/ViewModal';

import { setAutoFreeze } from 'immer';
setAutoFreeze(false);
import './styles/custom.scss';
import {
  Button, 
  Navbar
} from "react-bootstrap";
import Box from '@material-ui/core/Box';

import * as d3 from "d3";
import GraphConfig, {
    NODE_KEY
} from "./components/graph_config";
import 'bootstrap/dist/css/bootstrap.min.css';


export type LayoutEngineType =
  | 'None'
  | 'SnapToGrid'
  | 'VerticalTree'
  | 'HorizontalTree';
  
type IGraphProps = {};

type IGraphState = {
  selected: SelectionT | null,
  layoutEngineType?: LayoutEngineType,
  allowMultiselect: boolean,
  modal: boolean,
  activeItem: any,
  viewModalShow: boolean,
  graph: any,
};
  
class App extends React.Component<IGraphProps, IGraphState> {
    GraphView: any;
  
    constructor(props: IGraphProps) {
        super(props);
    
        this.state = {
            layoutEngineType: undefined,
            selected: null,
            allowMultiselect: false,
            modal: false,
            activeItem: {
                id: 0,
                title: "",
                description: "",
                completed: false,
                priority: 1,
                x: 1,
                y: 1
            },
            viewModalShow: false,
            graph: {nodes: [], edges: []},
        };
    
        this.GraphView = React.createRef();
    }

    async componentDidMount() {
        this.getGraph();
    }
  
    /*
     * Handlers/Interaction
     */
  
    // Called by 'drag' handler, etc..
    // to sync updates from D3 with the graph
    onUpdateNode = async (viewNode: INode) => {
        console.log('updating:', viewNode)
        const updatedItem = {
            id: viewNode.id,
            title: viewNode.title,
            description: viewNode.description,
            completed: viewNode.completed,
            priority: viewNode.priority,
            x: viewNode.x,
            y: viewNode.y
        }

        let data = axios.patch(`http://localhost:8000/api/todos/${updatedItem.id}/`, updatedItem).then((response) => {
            console.log(response.data);
            console.log('id:', updatedItem.id)
        })
    };
  
    onSelect = (selected: SelectionT) => {
        console.log('Selecting:', selected)
        if (selected.nodes !== null) {
            console.log('selected first node:', Array.from(selected?.nodes)[0][1])
            let node: INode = Array.from(selected?.nodes)[0][1];
            const item = {id: node.id, 
                title: node.title, 
                description: node.description, 
                completed: true,
                priority: node.priority,
                x: node.x,
                y: node.y
            };
            let viewModalShow = this.state.viewModalShow
            if (this.state.selected !== null && this.state.selected.nodes !== null) {
                console.log('state selected:', this.state.selected)
                let prevNode: INode = Array.from(this.state.selected?.nodes)[0][1];

                if (prevNode.id === node.id) {
                    viewModalShow = !viewModalShow
                } else {
                    viewModalShow = true
                }
            } else {
                viewModalShow = true
            }
            this.setState({
                selected, 
                activeItem: item, 
                viewModalShow
            });
        }
        if (selected.edges !== null) {
            this.setState({selected})
        }
    };

    getGraph = async () => {
        try {
            let res = await fetch('http://localhost:8000/api/todos/');
            const graph = await res.json();
            res = await fetch('http://localhost:8000/api/edges/');
            const edges = await res.json();

            this.setState(
                produce(draft => {
                    draft.graph.nodes = graph;
                    draft.graph.edges = edges;
                })
            );
        } catch (e) {
            console.log(e);
        }
    }

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    // Responsible for saving the task
    handleSubmit = (item: INode) => {
        this.toggle();
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);

        const newItem = {
            title: item.title,
            description: item.description,
            priority: item.priority,
            x,
            y,
        };
        axios.post("http://localhost:8000/api/todos/", newItem).then((response) => {
            this.getGraph();
        })
    };
    
    createItem = () => {
        const item = {id: 0, title: "", description: "", completed: false, priority: 1 };
        console.log(this.state.modal)
        this.setState({ activeItem: item, modal: !this.state.modal, viewModalShow: false });
        console.log(this.state.modal)
        this.getGraph();
    };

    editItem = async (updatedItem: INode) => {
        const newItem = {
            title: updatedItem.title,
            description: updatedItem.description,
            priority: updatedItem.priority,
            x: updatedItem.x,
            y: updatedItem.y,
        };
        let data = axios.patch(`http://localhost:8000/api/todos/${this.state.activeItem.id}/`, newItem).then((response) => {
            this.getGraph();
        })
        console.log('data:', data)
    }

    deleteItem = async () => {
        let nodeId = this.state.activeItem.id
        this.deleteEdgesForNode(nodeId);
        let data = axios.delete(`http://localhost:8000/api/todos/${nodeId}/`).then((response) => {
            this.getGraph();
        })
    }

    setModalShow = (showFlag: boolean) => {
        this.setState({viewModalShow: showFlag});
        console.log('viewModalShow:', this.state.viewModalShow)
    }
  
    // Whenever a node is deleted the consumer must delete any connected edges.
    // react-digraph won't call deleteEdge for multi-selected edges, only single edge selections.
    deleteEdgesForNode(nodeID: number) {
        const { graph } = this.state;
        const edgesToDelete = graph.edges.filter(
            (edge: IEdge) => edge.source === nodeID || edge.target === nodeID
        );
    
        const newEdges = graph.edges.filter(
            (edge: IEdge) => edge.source !== nodeID && edge.target !== nodeID
        );
    
        edgesToDelete.forEach((edge: IEdge) => {
            this.onDeleteEdge(edge);
        });
    }
  
    // Creates a new node between two edges
    onCreateEdge = (sourceViewNode: INode, targetViewNode: INode) => {
        const viewEdge = {
            source: sourceViewNode.id,
            target: targetViewNode.id,
        };
        // Only add the edge when the source node is not the same as the target
        if (viewEdge.source !== viewEdge.target) {
            axios.post("http://localhost:8000/api/edges/", viewEdge).then((response) => {
                this.getGraph();
            })

            this.setState({
                selected: {
                    nodes: null,
                    edges: new Map([[`${viewEdge.source}_${viewEdge.target}`, viewEdge]])
                }
            })
        }
    };
  
    // Called when an edge is reattached to a different target.
    onSwapEdge = (
        sourceViewNode: INode,
        targetViewNode: INode,
        viewEdge: IEdge
    ) => {
        const newEdge = {
            source: sourceViewNode.id,
            target: targetViewNode.id
        }
        let data = axios.patch(`http://localhost:8000/api/edges/${viewEdge.id}/`, newEdge).then((response) => {
            this.getGraph();
        })
    };
  
    // Called when an edge is deleted
    onDeleteEdge = (viewEdge: IEdge, edges: IEdge[] = []) => {
        if (edges.length === 0) {
            let data = axios.delete(`http://localhost:8000/api/edges/${viewEdge.id}/`).then((response) => {
                this.getGraph();
            })
        }
    };
  
    handleChangeLayoutEngineType = (event: any) => {
        const value: any = event.target.value;
        const layoutEngineType: LayoutEngineType = value;
    
        this.setState({
          layoutEngineType,
        });
    };
  
    onSelectPanNode = (event: any) => {
        if (this.GraphView) {
          this.GraphView.panToNode(event.target.value, true);
        }
    };
  
    /*
     * Render
     */
  
    render() {
        const { nodes, edges } = this.state.graph;
        const { selected, allowMultiselect, layoutEngineType } = this.state;
        const { NodeTypes, NodeSubtypes, EdgeTypes } = GraphConfig;

        return (
            <>            
                <Navbar bg="primary" variant="dark" >
                <div>
                    <Box mx="auto"  p={1}>
                    <span style={{fontWeight: 'bold'}} className="menu navigation-menu">Layout Engine: </span>
                    <select
                        name="layout-engine-type"
                        onChange={this.handleChangeLayoutEngineType}
                    >
                      <option value={undefined}>None</option>
                      <option value={'SnapToGrid'}>Snap to Grid</option>
                      <option value={'VerticalTree'}>Vertical Tree</option>
                    </select>
                    </Box>
                    </div>
                <div >
                <Box mx="auto"  p={1}>
                <span style={{fontWeight: 'bold'}}>Pan To Task: </span>
                <select onChange={this.onSelectPanNode}>
                  {nodes.map(node => (
                    <option key={node[NODE_KEY]} value={node[NODE_KEY]}>
                      {node.title}
                    </option>
                  ))}
                </select>
                </Box>
                </div>
                <div>
                <Box mx="auto"  p={1}>
                    <Button  onClick={this.createItem} variant='success' >New Task</Button>{' '}
                </Box>
                </div>
                </Navbar>

                <div id="graph" style={{ height: '100%', width: "100%" }}>
                  <GraphView
                    ref={el => (this.GraphView = el)}
                    allowMultiselect={allowMultiselect}
                    gridDotSize={0}
                    nodeSize={30}
                    nodeKey={NODE_KEY}
                    nodes={nodes}
                    edges={edges}
                    selected={selected}
                    nodeTypes={NodeTypes}
                    nodeSubtypes={NodeSubtypes}
                    edgeTypes={EdgeTypes}
                    onSelect={this.onSelect}
                    onUpdateNode={this.onUpdateNode}
                    onCreateEdge={this.onCreateEdge}
                    onDeleteEdge={this.onDeleteEdge}
                    onSwapEdge={this.onSwapEdge}
                    layoutEngineType={layoutEngineType}
                  />
                  <ViewModal
                      activeItem={this.state.activeItem}
                      show={this.state.viewModalShow}
                      onHide={() => this.setModalShow(false)}
                      onDelete={() => this.deleteItem()}
                      onEdit={this.editItem}
                  />
                  {this.state.modal ? (
                  <CustomModal
                      activeItem={this.state.activeItem}
                      show={this.state.viewModalShow}
                      toggle={this.toggle}
                      onSave={this.handleSubmit}
                  />
                  ): null}
                </div>
            </>
        );
      }
  }
  
  export default App;
  


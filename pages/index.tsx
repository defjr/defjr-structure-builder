import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
//import styles from '../styles/Home.module.css'
import React, { useState } from "react";
//import { StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseLine from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {
  Tree,
  DragLayerMonitorProps,
  getDescendants
} from "@minoru/react-dnd-treeview";
import { NodeModel, CustomData } from "../components/types";
import { CustomNode } from "../components/CustomNode";
import { CustomDragPreview } from "../components/CustomDragPreview";
import { AddDialog } from "../components/AddDialog";
import { Placeholder } from "../components/Placeholder";
import theme from "../components/theme";
import styles from "../components/App.module.css";
import SampleData from "./sample_data.json";

const getLastId = (treeData: NodeModel[]) => {
  const reversedArray = [...treeData].sort((a, b) => {
    if (a.id < b.id) {
      return 1;
    } else if (a.id > b.id) {
      return -1;
    }

    return 0;
  });

  if (reversedArray.length > 0) {
    return reversedArray[0].id;
  }

  return 0;
};

const Home: NextPage = () => {
    const [treeData, setTreeData] = useState<NodeModel<CustomData>[]>(SampleData);
    const handleDrop = (newTree: NodeModel<CustomData>[]) => setTreeData(newTree);
    const [selectedNode, setSelectedNode] = useState<NodeModel>(null);
    const handleSelect = (node: NodeModel) => setSelectedNode(node);
    const [open, setOpen] = useState<boolean>(false);
  
    const handleTextChange = (id: NodeModel["id"], value: string) => {
        const newTree = treeData.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              text: value
            };
          }
    
          return node;
        });
    
        setTreeData(newTree);
    };
    
    const handleDelete = (id: NodeModel["id"]) => {
    const deleteIds = [
        id,
        ...getDescendants(treeData, id).map((node) => node.id)
      ];
      const newTree = treeData.filter((node) => !deleteIds.includes(node.id));
  
      setTreeData(newTree);
    };
  
    const handleCopy = (id: NodeModel["id"]) => {
      const lastId = getLastId(treeData);
      const targetNode = treeData.find((n) => n.id === id);
      const descendants = getDescendants(treeData, id);
      const partialTree = descendants.map((node: NodeModel<CustomData>) => ({
        ...node,
        id: node.id + lastId,
        parent: node.parent + lastId
      }));
  
      setTreeData([
        ...treeData,
        {
          ...targetNode,
          id: targetNode.id + lastId
        },
        ...partialTree
      ]);
    };
  
    const handleOpenDialog = () => {
      setOpen(true);
    };
  
    const handleCloseDialog = () => {
      setOpen(false);
    };
  
    const handleSubmit = (newNode: Omit<NodeModel<CustomData>, "id">) => {
      const lastId = getLastId(treeData) + 1;
  
      setTreeData([
        ...treeData,
        {
          ...newNode,
          id: lastId
        }
      ]);
  
      setOpen(false);

      console.log (JSON.stringify(treeData));
    };
  
    return (
        <ThemeProvider theme={theme}>
          <CssBaseLine />
          <div className={styles.app}>
            <div>
              <Button onClick={handleOpenDialog} startIcon={<AddIcon />}>
                Add Page/Section
              </Button>
              {open && (
                <AddDialog
                  tree={treeData}
                  onClose={handleCloseDialog}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
            <Tree
              tree={treeData}
              rootId={0}
              render={(node: NodeModel<CustomData>, options) => (
                <CustomNode
                  node={node}
                  {...options}
                  isSelected={node.id === selectedNode?.id}
                  onDelete={handleDelete}
                  onCopy={handleCopy}
                  onSelect={handleSelect}
                  onTextChange={handleTextChange}
                  />
              )}
              dragPreviewRender={(
                monitorProps: DragLayerMonitorProps<CustomData>
              ) => <CustomDragPreview monitorProps={monitorProps} />}
              onDrop={handleDrop}
              classes={{
                root: styles.treeRoot,
                draggingSource: styles.draggingSource,
                placeholder: styles.placeholder,
                dropTarget: styles.dropTarget
              }}
              sort={false}
              insertDroppableFirst={false}
              canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
                if (dragSource?.parent === dropTargetId) {
                  return true;
                }
              }}
              dropTargetOffset={10}
              placeholderRender={(node, { depth }) => (
                <Placeholder node={node} depth={depth} />
              )}
              />
            <div className={styles.current}>
              <p>
                Current selection:{" "}
                <span className={styles.currentLabel}>
                  {selectedNode ? selectedNode.text : "none"}
                </span>
              </p>
              <p>
                Tree Data Stringified: <br />
                <span className={styles.currentLabel}>
                  {treeData ? JSON.stringify(treeData) : "no data"}
                </span>
              </p>
            </div>
          </div>
        </ThemeProvider>
    );
}

export default Home

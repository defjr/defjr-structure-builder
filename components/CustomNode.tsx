import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { ArrowRight, Delete, FileCopy } from "@mui/icons-material/";
import TextField from "@mui/material/TextField";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useDragOver } from "@minoru/react-dnd-treeview";
import { NodeModel, CustomData } from "./types";
import { TypeIcon } from "./TypeIcon";
import styles from "./CustomNode.module.css";

type Props = {
  node: NodeModel<CustomData>;
  depth: number;
  isOpen: boolean;
  isSelected: boolean;
  onToggle: (id: NodeModel["id"]) => void;
  onSelect: (node: NodeModel) => void;
  onDelete: (id: NodeModel["id"]) => void;
  onCopy: (id: NodeModel["id"]) => void;
  onTextChange: (id: NodeModel["id"], value: string) => void;
};

export const CustomNode: React.FC<Props> = (props) => {
  const [hover, setHover] = useState<boolean>(false);
  const { id, droppable, text, data } = props.node;
  const [visibleInput, setVisibleInput] = useState(false);
  const [labelText, setLabelText] = useState(text);
  const indent = props.depth * 10;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  const handleShowInput = () => {
    setVisibleInput(true);
  };

  const handleCancel = () => {
    setLabelText(text);
    setVisibleInput(false);
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelText(e.target.value);
  };

  const handleSubmit = () => {
    setVisibleInput(false);
    props.onTextChange(id, labelText);
  };


  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);
  const handleSelect = () => props.onSelect(props.node);

  return (
    <div
      className={`tree-node ${styles.root} ${props.isSelected ? styles.isSelected : ""}`}
      style={{ paddingInlineStart: indent }}
      onClick={handleSelect}
      {...dragOverProps}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={`${styles.expandIconWrapper} ${
          props.isOpen ? styles.isOpen : ""
        }`}
      >
        {props.node.droppable && (
          <div onClick={handleToggle}>
            <ArrowRight />
          </div>
        )}
      </div>
      <div>
        <TypeIcon droppable={droppable} fileType={data?.fileType} />
      </div>
      <div className={styles.labelGridItem}>
      {visibleInput ? (
        <div className={styles.inputWrapper}>
            <TextField
              className={`${styles.textField}
              ${styles.nodeInput}`}
              value={labelText}
              onChange={handleChangeText}
            />
            <IconButton
              className={styles.editButton}
              onClick={handleSubmit}
              disabled={labelText === ""}
            >
              <CheckIcon className={styles.editIcon} />
            </IconButton>
            <IconButton className={styles.editButton} onClick={handleCancel}>
              <CloseIcon className={styles.editIcon} />
            </IconButton>
          </div>
      ) : (
        <div className={styles.inputWrapper}>
          <Typography variant="body2" className={styles.nodeLabel}>
            {props.node.text}
          </Typography>
        </div>
      )}
      </div>
      {hover && (
        <>
          <div className={styles.actionButton}>
          <IconButton className={styles.editButton} onClick={handleShowInput}>
            <EditIcon className={styles.editIcon} />
          </IconButton>
            <IconButton size="small" onClick={() => props.onDelete(id)}>
              <Delete fontSize="small" />
            </IconButton>
          </div>
          <div className={styles.actionButton}>
            <IconButton size="small" onClick={() => props.onCopy(id)}>
              <FileCopy fontSize="small" />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
};

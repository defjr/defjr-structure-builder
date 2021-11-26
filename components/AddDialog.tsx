import React, { useState } from "react";
import {
  Button,
  Select,
  TextField,
  MenuItem,
  FormControl,
  FormControlLabel,
  InputLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material/";
import { NodeModel } from "./types";
import styles from "./AddDialog.module.css";

type Props = {
  tree: NodeModel[];
  onClose: () => void;
  onSubmit: (e: Omit<NodeModel, "id">) => void;
};

export const AddDialog: React.FC<Props> = (props) => {
  const [text, setText] = useState("");
  const [fileType, setFileType] = useState("text");
  const [parent, setParent] = useState(0);
  const [droppable, setDroppable] = useState(false);

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };


/*  const handleChangeParent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParent(Number(e.target.value));
  };

  const handleChangeParentOld = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParent(Number(e.target.value));
  };
*/
  const handleChangeDroppable = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDroppable(e.target.checked);
  };
/*
  const handleChangeFileType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFileType(e.target.value);
  };

  const handleChangeFileTypeOld = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFileType(e.target.value);
  };
*/
  return (
    <Dialog open={true} onClose={props.onClose}>
      <DialogTitle>Add New Page or Section</DialogTitle>
      <DialogContent className={styles.content}>
        <div>
          <TextField label="Text" onChange={handleChangeText} value={text} />
        </div>
        <div>
          <FormControl className={styles.select}>
            <InputLabel>Parent</InputLabel>
            <Select label="Parent" onChange={event => setParent(Number(event.target.value))} value={parent}>
              <MenuItem value={0}>(root)</MenuItem>
              {props.tree
                .filter((node) => node.droppable === true)
                .map((node) => (
                  <MenuItem key={node.id} value={node.id}>
                    {node.text}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                checked={droppable}
                onChange={handleChangeDroppable}
                color="primary"
              />
            }
            label="Section"
          />
        </div>
        {!droppable && (
          <div>
            <FormControl className={styles.select}>
              <InputLabel>File type</InputLabel>
              <Select
                label="FileType"
                onChange={event => setFileType(event.target.value)}
                value={fileType}
              >
                <MenuItem value="text">Reading</MenuItem>
                <MenuItem value="quiz">Knowledge Check</MenuItem>
                <MenuItem value="image">Image</MenuItem>
              </Select>
            </FormControl>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          disabled={text === ""}
          onClick={() =>
            props.onSubmit({
              text,
              parent,
              droppable,
              data: {
                fileType
              }
            })
          }
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

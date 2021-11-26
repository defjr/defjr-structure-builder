import React from "react";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";
import QuizIcon from '@mui/icons-material/Quiz';
import DescriptionIcon from "@mui/icons-material/Description";

type Props = {
  droppable: boolean | undefined;
  fileType?: string;
};

export const TypeIcon: React.FC<Props> = (props) => {
  if (props.droppable === true) {
    return <FolderIcon />;
  }

  switch (props.fileType) {
    case "image": return <ImageIcon />;
    case "quiz": return <QuizIcon />;
    case "text": return <DescriptionIcon />;
    default: return null;
  }
};
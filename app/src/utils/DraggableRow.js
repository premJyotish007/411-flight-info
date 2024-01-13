import React from 'react';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { TableRow, TableCell, IconButton, Tooltip } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const DraggableRow = ({ id, index, ranking, name, moveRow, onDeleteRow }) => {
  const handleMoveUp = () => {
    moveRow(index, index - 1);
  };

  const handleMoveDown = () => {
    moveRow(index, index + 1);
  };

  return (
    <TableRow>
      <TableCell>
        <IconButton aria-label="Move Up" disabled={index === 0} onClick={handleMoveUp}>
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton aria-label="Move Down" onClick={handleMoveDown}>
          <ArrowDownwardIcon />
        </IconButton>
      </TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>
        <Tooltip title="Remove from favorites" arrow>
          <IconButton aria-label="Delete" onClick={() => onDeleteRow(id)}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default DraggableRow;

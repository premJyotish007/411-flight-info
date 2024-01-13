// DraggableTable.js
import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { TableContainer, Table, TableBody, Paper } from '@mui/material';
import DraggableRow from './DraggableRow';
import Cookies from 'js-cookie';

const DraggableTable = ({ data, onDataUpdate }) => {
  const [rows, setRows] = useState(data);

  useEffect(() => {
    // Update the local state when the external data prop changes
    setRows(data);
  }, [data]);

  const moveRow = (fromIndex, toIndex) => {
    const updatedRows = [...rows];
    const [movedRow] = updatedRows.splice(fromIndex, 1);
    updatedRows.splice(toIndex, 0, movedRow);

    // Update rankings based on new positions
    const newRows = updatedRows.map((row, index) => ({
      ...row,
      ranking: index + 1,
    }));

    setRows(newRows);
    console.log('on shuffling', newRows);

    // Call the callback function to send the updated data to the parent component
    onDataUpdate(newRows);
  };

  const remove_from_favorites = async (email, iata_code) => {
    const payload = { email: email, iata_code: iata_code };
    const response = await fetch('http://localhost:3001/api/remove-favorite', {

        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
  };

  const handleDeleteRow = async (id) => {
    // Filter out the row with the specified id
    // obtain the data contained in the current row being deleted
    const deletedRow = rows.filter((row) => row.id === id)[0];
    console.log('deleted row', deletedRow);
    const email = Cookies.get('userEmail');

    const iata_code = deletedRow.name.split(' - ')[0];
    remove_from_favorites(email, iata_code);

    const updatedRows = rows.filter((row) => row.id !== id);


    // Update rankings based on new positions
    const newRows = updatedRows.map((row, index) => ({
      ...row,
      ranking: index + 1,
    }));

    setRows(newRows);
    console.log('on row deletion', newRows);

    // Call the callback function to send the updated data to the parent component
    onDataUpdate(newRows);
  };

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'ROW',
    drop: () => ({ name: 'DraggableTable' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody ref={drop}>
          {rows
            .sort((a, b) => a.ranking - b.ranking)
            .map((row, index) => (
              <DraggableRow
                key={row.id}
                id={row.id}
                index={index}
                ranking={row.ranking}
                name={row.name}
                moveRow={moveRow}
                onDeleteRow={handleDeleteRow} 
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DraggableTable;

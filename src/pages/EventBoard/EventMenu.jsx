import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVert from '@mui/icons-material/MoreVert';

export default ({ event, handleUpdate, handleDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => { setAnchorEl(event.currentTarget); };
  const handleClose = () => { setAnchorEl(null); };
  const onUpdate = () => {
    handleUpdate(event);
    setAnchorEl(null);
  }
  const onDelete = () => {
    handleDelete(event);
    setAnchorEl(null);
  }
  
  return (
    <>
      <IconButton onClick={handleClick}><MoreVert /></IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={onUpdate}>Update</MenuItem>
        <MenuItem onClick={onDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
};
import { Button, Container, Stack, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import styles from './index.module.css'
import { Toaster } from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import EventMenu from "./EventMenu";
import { createEvent, deleteEvent, listEvents, updateEvent } from "../../utils/apis";
import { signOut } from "../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import EventModal from "./EventModal";

export default () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [eventToUpdate, setEventToUpdate] = useState(null);

  const events = useSelector(state => state.event.events);
  const email = useSelector(state => state.user.email);

  const columns = useMemo(() => ([
    { field: 'name', headerName: 'Event Name', width: 100 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'datetime', headerName: 'Date Time', width: 200 },
    {
      field: 'invitees',
      headerName: 'Invitees',
      width: 200,
    },
    {
      field: '',
      headerName: '',
      width: 60,
      renderCell: (props) => {
        return <EventMenu 
          event={props.row} 
          handleDelete={handleDeleteEvent}
          handleUpdate={handleUpdateClick}
        />
      }
    }
  ]), []);

  useEffect(() => {
    dispatch(listEvents());
  }, []);

  const handleDeleteEvent = (event) => { dispatch(deleteEvent(event.id)); };
  const handleUpdateClick = (event) => {
    setEventToUpdate(event);
    setUpdateModalOpen(true);
  }

  const handleCreateEvent = ({ name, description, datetime, invitees }) => {
    dispatch(createEvent({ 
      name, 
      description, 
      datetime, 
      invitees 
    }, () => setCreateModalOpen(false)));
  };
  const handleUpdateEvent = (data) => {
    dispatch(updateEvent(
      eventToUpdate.id, 
      data, 
      () => setUpdateModalOpen(false)
    ));
  }

  const handleSignOut = () => {
    localStorage.removeItem('token');
    dispatch(signOut());
    navigate('/signup');
  }

  return (
    <Container>
      <Stack className={styles['schedule-container']} gap={1}>
        <Stack direction='row' justifyContent='space-between'>
          <Button variant="contained" onClick={() => setCreateModalOpen(true)}>Create Event</Button>
          <Stack direction='row' alignItems='center' gap={2}>
            <Typography>Welcome <i>{ email }</i></Typography>
            <Button variant="contained" color="error" onClick={handleSignOut}>Sign out</Button>
          </Stack>
        </Stack>
        <DataGrid
          rows={events}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </Stack>
      <EventModal
        open={createModalOpen}
        handleClose={() => setCreateModalOpen(false)}
        handleConfirm={handleCreateEvent}
      />
      <EventModal
        open={updateModalOpen}
        defaultValue={eventToUpdate}
        handleClose={() => setUpdateModalOpen(false)}
        handleConfirm={handleUpdateEvent}
      />
      <Toaster />
    </Container>
  );
}
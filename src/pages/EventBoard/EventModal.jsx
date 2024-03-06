import React, { useEffect, useState } from "react";
import { Button, Chip, ListItem, Modal, Paper, Stack, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import toast from "react-hot-toast";
import styles from './index.module.css'
import dayjs from "dayjs";

export default ({ defaultValue, open, handleClose, handleConfirm }) => {
  const [invitees, setInvitees] = useState([]);
  const [invitee, setInvitee] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState(null);

  useEffect(() => {
    if(!defaultValue) return;

    setInvitees(defaultValue.invitees);
    setName(defaultValue.name);
    setDescription(defaultValue.description);
    setDatetime(dayjs(defaultValue.datetime));
  }, [defaultValue]);

  const onInviteeKeydown = (e) => {
    if(e.keyCode === 13) {
      if(invitees.find(data => data === invitee)) {
        toast.error('Email duplicated!');
        return;
      }
      const re = /\S+@\S+\.\S+/;
      if(!re.test(invitee)) {
        toast.error("Email is invalid");
        return;
      }
      setInvitees([...invitees, invitee]);
    }
  }

  const onDeleteInvitee = (data) => {
    setInvitees(invitees.filter(invitee => invitee != data));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Stack className={styles['create-schedule-modal']} gap={2}>
        <TextField label="Event Name" sx={{ width: '90%' }} value={name} onChange={e => setName(e.target.value)} />
        <TextField label="Description" sx={{ width: '90%' }} value={description} onChange={e => setDescription(e.target.value)} />
        <DateTimePicker sx={{ width: '90%' }} value={datetime} onChange={v => setDatetime(v)} />
        <TextField sx={{ width: '90%' }}label="Add Invitees" value={invitee} onChange={e => setInvitee(e.target.value)} onKeyDown={onInviteeKeydown} />
        <Paper
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 0.5,
            m: 0
          }}
          component='ul'
        >
          { invitees.map((invitee, idx) => {
            return (
              <ListItem key={idx}>
                <Chip
                  label={invitee}
                  onDelete={() => onDeleteInvitee(invitee)}
                />
              </ListItem>
            );
          }) }
        </Paper>
        <Button variant="contained" onClick={() => handleConfirm({ description, name, invitees, datetime })}>{ defaultValue ? "Update" : "Create" }</Button>
      </Stack>
    </Modal>
  )
}
import toast from "react-hot-toast";
import { setEvents } from "../slices/eventSlice";
import api from "./api"

export const listEvents = () => dispatch => {
  api.get('http://localhost:3001/event')
    .then(res => {
      if(res.data.success === true)
        dispatch(setEvents(res.data.data.map(item => ({...item, id: item._id}))));
    })
    .catch(err => {
    });
}

export const createEvent = (data, callback = () => {}) => dispatch => {
  api.post('http://localhost:3001/event/create', data)
    .then(res => {
      console.log(res);
      if(res.data.success === true) {
        dispatch(listEvents());
        toast.success("Created successfully");
        callback();
      }
    })
    .catch(err => {
      toast.error(err.message);
    });
}

export const deleteEvent = (id, callback = () => {}) => dispatch => {
  api.delete(`http://localhost:3001/event/${id}`)
    .then(res => {
      console.log(res);
      if(res.data.success === true) {
        dispatch(listEvents());
        toast.success("Deleted successfully");
        callback();
      }
    })
    .catch(err => {
      toast.error(err.message);
    });
}

export const updateEvent = (id, data, callback = () => {}) => dispatch => {
  api.post(`http://localhost:3001/event/${id}`, data)
    .then(res => {
      console.log(res);
      if(res.data.success === true) {
        dispatch(listEvents());
        toast.success("Deleted successfully");
        callback();
      }
    })
    .catch(err => {
      toast.error(err.message);
    });
}
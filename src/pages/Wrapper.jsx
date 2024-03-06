import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { loadUser } from "../slices/userSlice";
import setAuthToken from "../utils/setAuthToken";

export default () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector(state => state.user.token);

  useEffect(() => {
    if(token) {
      navigate('/event-board');
    } else {
      if(localStorage.token) {
        dispatch(loadUser(localStorage.token));
        setAuthToken(localStorage.token);
        navigate('/event-board');
      } else {
        navigate('/signup');
      }
    }
  }, [token]);

  return (
    <Outlet />
  )
};
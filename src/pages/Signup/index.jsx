import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import toast, { Toaster } from "react-hot-toast";
import setAuthToken from "../../utils/setAuthToken";
import { useDispatch } from "react-redux";
import { setUserEmail } from "../../slices/userSlice";

const SIGNIN = 1,
  SIGNUP = 2;

export default () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formType, setFormType] = useState(SIGNIN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState({
    email: true,
    password: true,
  });

  const onChangeType = () => {
    setFormType(formType === SIGNIN ? SIGNUP : SIGNIN);
    setValidation({email: true, password: true});
    setEmail("");
    setPassword("");
  };

  const checkValidation = () => {
    const errors = { email: true, password: true };
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) errors.email = false;
    if (password.length < 6) errors.password = false;

    setValidation(errors);
    if (errors.email === false || errors.password === false) return false;
    return true;
  };

  const onClickSubmit = async () => {
    if(!checkValidation()) return;
    if (formType === SIGNUP) {
      try {
        const res = await fetch("http://127.0.0.1:3001/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (data.success) {
          toast.success("User registered successfully");
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await fetch("http://127.0.0.1:3001/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (data.success) {
          setAuthToken(data.token);
          dispatch(setUserEmail(email));
          toast.success("Login Successful");
          navigate("/event-board");
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    }
    //navigate('/schedule-board');
  };

  const onPasswordKeydown = (e) => {
    if(e.keyCode === 13) onClickSubmit();
  }

  return (
    <Container className={styles["signup-container"]}>
      <Stack gap={2}>
        <TextField
          label="Email"
          value={email}
          error={!validation.email}
          helperText={ validation.email ? "" : "Email is invalid" }
          onChange={(e) => {
            setEmail(e.target.value);
            setValidation({ ...validation, email: true })
          }}
        />
        <TextField
          label="Password"
          type="password"
          error={!validation.password}
          value={password}
          helperText={ validation.password ? "" : "Password must be more than 6 characters" }
          onChange={(e) => {
            setPassword(e.target.value);
            setValidation({ ...validation, password: true })
          }}
          onKeyDown={onPasswordKeydown}
        />
        <Typography className={styles['forgot-password']} onClick={onChangeType}>
          {formType === SIGNIN
            ? "Don't have an account?"
            : "Already have an account?"}
        </Typography>
        <Button onClick={onClickSubmit}>
          {formType === SIGNIN ? "Sign In" : "Sign Up"}
        </Button>
      </Stack>
      <Toaster />
    </Container>
  );
};

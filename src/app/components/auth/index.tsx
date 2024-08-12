import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Fab, Stack, TextField } from "@mui/material";
import styled from "styled-components";
import LoginIcon from "@mui/icons-material/Login";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/memberService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobal";

const useStyles = makeStyles((theme) => ({
   modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
   },
   paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 2, 2),
   },
}));

const ModalImg = styled.img`
   width: 62%;
   height: 100%;
   border-radius: 10px;
   background: #000;
   margin-top: 9px;
   margin-left: 10px;
`;

interface AuthenticationModalProps {
   signupOpen: boolean;
   loginOpen: boolean;
   handleSignupClose: () => void;
   handleLoginClose: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
   const { signupOpen, loginOpen, handleSignupClose, handleLoginClose } = props;
   const classes = useStyles();
   const [memberNick, setMemberNick] = useState<string>("");
   const [memberPhone, setMemberPhone] = useState<string>("");
   const [memberPassword, setMemberPassword] = useState<string>("");
   const { setAuthMember } = useGlobals();

   /** HANDLERS **/
   const handelUserName = (e: T) => {
      console.log(e.target.value);
      setMemberNick(e.target.value);
   };
   const handelPhone = (e: T) => {
      console.log(e.target.value);
      setMemberPhone(e.target.value);
   };
   const handelPassword = (e: T) => {
      console.log(e.target.value);
      setMemberPassword(e.target.value);
   };

   const handelPasswordKeyDown = (e: T) => {
      if (e.key === "Enter" && signupOpen) {
         handelSignupRequest().then();
      } else if (e.key === "Enter" && loginOpen) {
         handelLoginRequest().then();
      }
   };

   const handelSignupRequest = async () => {
      try {
         const isFulfill =
            memberNick !== "" && memberPhone !== "" && memberPassword !== "";
         if (!isFulfill) throw new Error(Messages.error3);
         const signupInput: MemberInput = {
            memberNick: memberNick,
            memberPhone: memberPhone,
            memberPassword: memberPassword,
         };

         const member = new MemberService();
         const result = await member.signup(signupInput);

         //Saving austhenticated user
         setAuthMember(result);

         handleSignupClose();
      } catch (err) {
         console.log(err);
         handleSignupClose();
         sweetErrorHandling(err).then();
      }
   };

   const handelLoginRequest = async () => {
      try {
         const isFulfill =
            memberNick !== "" && memberPassword !== "" && memberPassword !== "";
         if (!isFulfill) throw new Error(Messages.error3);

         const loginInput: LoginInput = {
            memberNick: memberNick,
            memberPassword: memberPassword,
         };

         const member = new MemberService();
         const result = await member.login(loginInput);

         //Saving austhenticated user
         setAuthMember(result);

         handleLoginClose();
      } catch (err) {
         console.log(err);
         handleLoginClose();
         sweetErrorHandling(err).then();
      }
   };

   return (
      <div>
         <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={signupOpen}
            onClose={handleSignupClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
               timeout: 500,
            }}
         >
            <Fade in={signupOpen}>
               <Stack
                  className={classes.paper}
                  direction={"row"}
                  sx={{ width: "800px" }}
               >
                  <ModalImg src={"/img/auth.webp"} alt="camera" />
                  <Stack sx={{ marginLeft: "69px", alignItems: "center" }}>
                     <h2>Signup Form</h2>
                     <TextField
                        sx={{ marginTop: "7px" }}
                        id="outlined-basic"
                        label="username"
                        variant="outlined"
                        onChange={handelUserName}
                     />
                     <TextField
                        sx={{ my: "17px" }}
                        id="outlined-basic"
                        label="phone number"
                        variant="outlined"
                        onChange={handelPhone}
                     />
                     <TextField
                        id="outlined-basic"
                        label="password"
                        variant="outlined"
                        onChange={handelPassword}
                        onKeyDown={handelPasswordKeyDown}
                     />
                     <Fab
                        sx={{ marginTop: "30px", width: "120px" }}
                        variant="extended"
                        color="primary"
                        onClick={handelSignupRequest}
                     >
                        <LoginIcon sx={{ mr: 1 }} />
                        Signup
                     </Fab>
                  </Stack>
               </Stack>
            </Fade>
         </Modal>

         <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={loginOpen}
            onClose={handleLoginClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
               timeout: 500,
            }}
         >
            <Fade in={loginOpen}>
               <Stack
                  className={classes.paper}
                  direction={"row"}
                  sx={{ width: "700px" }}
               >
                  <ModalImg src={"/img/auth.webp"} alt="camera" />
                  <Stack
                     sx={{
                        marginLeft: "65px",
                        marginTop: "25px",
                        alignItems: "center",
                     }}
                  >
                     <h2>Login Form</h2>
                     <TextField
                        id="outlined-basic"
                        label="username"
                        variant="outlined"
                        sx={{ my: "10px" }}
                        onChange={handelUserName}
                     />
                     <TextField
                        id={"outlined-basic"}
                        label={"password"}
                        variant={"outlined"}
                        type={"password"}
                        onChange={handelPassword}
                        onKeyDown={handelPasswordKeyDown}
                     />
                     <Fab
                        sx={{ marginTop: "27px", width: "120px" }}
                        variant={"extended"}
                        color={"primary"}
                        onClick={handelLoginRequest}
                     >
                        <LoginIcon sx={{ mr: 1 }} />
                        Login
                     </Fab>
                  </Stack>
               </Stack>
            </Fade>
         </Modal>
      </div>
   );
}

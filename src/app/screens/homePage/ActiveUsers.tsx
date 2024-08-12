import React from "react";
import Card from "@mui/joy/Card";
import { CssVarsProvider } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";
import { Box, Container, Stack } from "@mui/material";
import { AspectRatio, CardOverflow } from "@mui/joy";

import { serverApi } from "../../../lib/config";
import { Member } from "../../../lib/types/member";
import { createSelector } from "@reduxjs/toolkit";
import { retriveTopUsers } from "./selector";
import { useSelector } from "react-redux";

const topUsersRetriver = createSelector(retriveTopUsers, (topUsers) => ({
   topUsers,
}));

export default function ActiveUsers() {
   const { topUsers } = useSelector(topUsersRetriver);
   return (
      <div className={"active-users-frame"}>
         <Container>
            <Stack className="main">
               <Box className={"category-title"}>Active Users</Box>
               <Stack className={"cards-frame"}>
                  <CssVarsProvider>
                     {topUsers.length !== 0 ? (
                        topUsers.map((member: Member) => {
                           const imagePath = `${serverApi}/${member.memberImage}`;
                           return (
                              <Card
                                 key={member._id}
                                 variant="outlined"
                                 className="card"
                              >
                                 <CardOverflow>
                                    <AspectRatio ratio={1}>
                                       <img src={imagePath} />
                                    </AspectRatio>
                                 </CardOverflow>
                                 <CardOverflow
                                    variant="soft"
                                    className="member-nickname"
                                 >
                                    <Typography>{member.memberNick}</Typography>
                                 </CardOverflow>
                              </Card>
                           );
                        })
                     ) : (
                        <Box className="no-data">No Active Users!</Box>
                     )}
                  </CssVarsProvider>
               </Stack>
            </Stack>
         </Container>
      </div>
   );
}

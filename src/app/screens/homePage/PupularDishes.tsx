import React from "react";
import Card from "@mui/joy/Card";
import { CssVarsProvider } from "@mui/joy/styles";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Container, Stack } from "@mui/material";
import { CardOverflow } from "@mui/joy";
import { DescriptionOutlined } from "@mui/icons-material";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrivePopularDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";

const popularDishesRetriver = createSelector(
   retrivePopularDishes,
   (popularDishes) => ({ popularDishes })
);

export default function PopularDishes() {
   const { popularDishes } = useSelector(popularDishesRetriver);
   return (
      <div className="popular-dishes-frame">
         <Container>
            <Stack className={"popular-section"}>
               <Box className="category-title">Popular Dishes</Box>
               <Stack className="cards-frame">
                  <CssVarsProvider>
                     {popularDishes.length !== 0 ? (
                        popularDishes.map((ele: Product) => {
                           const imagePath = `${serverApi}/${ele.productImages[0]}`;
                           return (
                              <CssVarsProvider key={ele._id}>
                                 <Card className="card">
                                    <CardCover className={"card"}>
                                       <img src={imagePath} alt="" />
                                    </CardCover>
                                    <CardCover className={"card-cover"} />
                                    <CardContent
                                       sx={{ justifyContent: "flex-end" }}
                                    >
                                       <Stack
                                          flexDirection={"row"}
                                          justifyContent={"space-between"}
                                       >
                                          <Typography
                                             level="h2"
                                             fontSize="lg"
                                             textColor="#fff"
                                             mb={1}
                                          >
                                             {ele.productName}
                                          </Typography>
                                          <Typography
                                             sx={{
                                                fontWeight: "md",
                                                color: "neutral.300",
                                                alignItems: "center",
                                                display: "flex",
                                             }}
                                          >
                                             {ele.productViews}
                                             <VisibilityIcon
                                                sx={{
                                                   fontSize: 25,
                                                   marginLeft: "5px",
                                                }}
                                             />
                                          </Typography>
                                       </Stack>
                                    </CardContent>
                                    <CardOverflow
                                       sx={{
                                          display: "flex",
                                          gap: 1.5,
                                          py: 1.5,
                                          px: "var(--Card-padding)",
                                          borderTop: "1px solid",
                                          height: "60px",
                                       }}
                                    >
                                       <Typography
                                          sx={{ maxWidth: "266px" }}
                                          startDecorator={
                                             <DescriptionOutlined />
                                          }
                                          textColor="neutral.300"
                                       >
                                          {ele.productDesc}
                                       </Typography>
                                    </CardOverflow>
                                 </Card>
                              </CssVarsProvider>
                           );
                        })
                     ) : (
                        <Box className="no-data">
                           Popular products are not available!
                        </Box>
                     )}
                  </CssVarsProvider>
               </Stack>
            </Stack>
         </Container>
      </div>
   );
}

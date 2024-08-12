import { Box, Container, Stack, Tab, Tabs, Typography } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { TabContext } from "@mui/lab";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import Divider from "../../components/divider";
import { Dispatch } from "@reduxjs/toolkit";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { setFinishedOrders, setPausedOrders, setProcessOrders } from "./slice";
import { useDispatch } from "react-redux";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/orderService";
import { useGlobals } from "../../hooks/useGlobal";
import "../../../css/order.css";
import { useHistory } from "react-router-dom";
import { sweetFailureProvider } from "../../../lib/sweetAlert";
import { Messages, serverApi } from "../../../lib/config";

/**REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
   setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
   setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
   setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

export default function OrdersPage() {
   const { setPausedOrders, setProcessOrders, setFinishedOrders } =
      actionDispatch(useDispatch());
   const history = useHistory();
   const { orderBuilder, authMember } = useGlobals();
   const [value, setValue] = useState("1");
   const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
      page: 1,
      limit: 5,
      orderStatus: OrderStatus.PAUSE,
   });

   useEffect(() => {
      const order = new OrderService();

      order
         .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE })
         .then((data) => setPausedOrders(data))
         .catch((err) => console.log(err));

      order
         .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS })
         .then((data) => setProcessOrders(data))
         .catch((err) => console.log(err));

      order
         .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH })
         .then((data) => setFinishedOrders(data))
         .catch((err) => console.log(err));
   }, [orderInquiry, orderBuilder]);

   /**HANDLERS */
   const handleChange = (e: SyntheticEvent, newValue: string) => {
      setValue(newValue);
   };
   if (!authMember) history.push("/");
   return (
      <Container>
         <div className={"order-page"}>
            <Container className="order-container">
               <Stack className={"order-left"}>
                  <TabContext value={value}>
                     <Box className={"order-nav-frame"}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                           <Tabs
                              value={value}
                              onChange={handleChange}
                              aria-label="basic tabs example"
                              className={"table-list"}
                           >
                              <Tab label="PAUSED ORDERS" value={"1"} />
                              <Tab label="PROCESS ORDERS" value={"2"} />
                              <Tab label="FINISHED ORDERS" value={"3"} />
                           </Tabs>
                        </Box>
                     </Box>
                     <Stack className={"order-main-content"}>
                        <PausedOrders setValue={setValue} />
                        <ProcessOrders setValue={setValue} />
                        <FinishedOrders />
                     </Stack>
                  </TabContext>
               </Stack>
               <Stack sx={{ marginTop: "85px" }} className="order-right">
                  <Stack className="user">
                     <Stack className="user-info">
                        <img
                           style={{ width: "117px", height: "117px" }}
                           src={
                              authMember?.memberImage
                                 ? `${serverApi}/${authMember?.memberImage}`
                                 : "/icons/default-user.svg"
                           }
                           alt=""
                        />
                        <p
                           style={{
                              paddingTop: "7px",
                              color: "#08090D",
                              fontSize: "28px",
                              fontWeight: "500",
                           }}
                        >
                           {authMember?.memberNick}
                        </p>
                        <p
                           style={{
                              color: "#A1A1A1",
                              fontSize: "20px",
                              fontWeight: "500",
                           }}
                        >
                           {authMember?.memberType}
                        </p>
                     </Stack>
                     <Box className="user-location">
                        <Box
                           sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                           }}
                        >
                           <Divider bg="black" height="1" width="310" />
                        </Box>
                        <Typography
                           sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: "10px",
                              marginLeft: "31px",
                           }}
                        >
                           <FmdGoodIcon />
                           {authMember?.memberAddress
                              ? authMember.memberAddress
                              : "no address"}
                        </Typography>
                     </Box>
                  </Stack>
                  <Stack className="card">
                     <input
                        style={{ width: "332px", height: "40px" }}
                        type="text"
                        placeholder="Card number : 5243 4090 2002 7495"
                     />
                     <Box>
                        <input
                           style={{
                              width: "162px",
                              height: "40px",
                              marginRight: "8px",
                           }}
                           type="text"
                           placeholder="07 / 24"
                        />
                        <input
                           style={{ width: "162px", height: "40px" }}
                           type="text"
                           placeholder="CVV : 010"
                        />
                     </Box>
                     <input
                        style={{
                           width: "332px",
                           height: "40px",
                        }}
                        type="text"
                        placeholder="Justin Robertson"
                     />
                     <Stack className="paycard">
                        <img src="/icons/visa-card.svg" alt="" />
                        <img src="/icons/paypal-card.svg" alt="" />
                        <img src="/icons/master-card.svg" alt="" />
                        <img src="/icons/western-card.svg" alt="" />
                     </Stack>
                  </Stack>
               </Stack>
            </Container>
         </div>
      </Container>
   );
}

import React from "react";
import { TabPanel } from "@mui/lab";
import { Box, Button, Stack } from "@mui/material";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { useSelector } from "react-redux";
import { Order, OrderItem, OrderUpadateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { Messages, serverApi } from "../../../lib/config";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobal";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/orderService";

/**REDUX SLICE & SELECTOR */
const pausedOrdersRetriever = createSelector(
   retrievePausedOrders,
   (pausedOrders) => ({ pausedOrders })
);

interface PausedOrdersProps {
   setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
   const { setValue } = props;
   const { authMember, setOrderBuilder } = useGlobals();
   const { pausedOrders } = useSelector(pausedOrdersRetriever);

   /**HANDELERS */

   const deleteOrderHandler = async (e: T) => {
      try {
         if (!authMember) throw new Error(Messages.error2);
         const orderId = e.target.value;
         const input: OrderUpadateInput = {
            orderId: orderId,
            orderStatus: OrderStatus.DELETE,
         };
         const confirmation = window.confirm(
            "Do you want to delete the order?"
         );
         if (confirmation) {
            const order = new OrderService();
            await order.updateOrder(input);
            //ORDER REBUILD
            setOrderBuilder(new Date());
         }
      } catch (err) {
         console.log(err);
         sweetErrorHandling(err).then();
      }
   };

   const processOrderHandler = async (e: T) => {
      try {
         if (!authMember) throw new Error(Messages.error2);
         //PAYMENT PROCESS
         const orderId = e.target.value;
         const input: OrderUpadateInput = {
            orderId: orderId,
            orderStatus: OrderStatus.PROCESS,
         };
         const confirmation = window.confirm(
            "Do you want to proceed with payment?"
         );
         if (confirmation) {
            const order = new OrderService();
            await order.updateOrder(input);
            setValue("2");
            //PROCESS REBUILD
            setOrderBuilder(new Date());
         }
      } catch (err) {
         console.log(err);
         sweetErrorHandling(err).then();
      }
   };

   return (
      <TabPanel value={"1"}>
         <Stack>
            {pausedOrders.map((order: Order) => {
               return (
                  <Box key={order._id} className="order-main-box">
                     <Box className={"order-box-scroll"}>
                        {order.orderItems.map((item: OrderItem) => {
                           const product: Product = order.productData.filter(
                              (ele: Product) => item.productId === ele._id
                           )[0];
                           const imagePath = `${serverApi}/${product.productImages[0]}`;
                           return (
                              <Box key={item._id} className="orders-name-price">
                                 <Box className={"orders-img-name"}>
                                    <img
                                       src={imagePath}
                                       className={"order-dish-img"}
                                    />
                                    <p className={"title-dish"}>
                                       {product.productName}
                                    </p>
                                 </Box>
                                 <Box className={"price-box"}>
                                    <p>${item.itemPrice}</p>
                                    <img src={"/icons/close.svg"} alt="" />
                                    <p>{item.itemQuantity}</p>
                                    <img src={"/icons/pause.svg"} alt="" />
                                    <p style={{ marginLeft: "15px" }}>
                                       ${item.itemQuantity * item.itemPrice}
                                    </p>
                                 </Box>
                              </Box>
                           );
                        })}
                     </Box>

                     <Box className="total-price-box">
                        <Box className="box-total">
                           <p
                              style={{
                                 fontWeight: "600",
                                 paddingRight: "12px",
                              }}
                           >
                              Product price
                           </p>
                           <p>${order.orderTotal - order.orderDelivery}</p>
                           <img
                              src={"/icons/plus.svg"}
                              style={{ marginLeft: "20px" }}
                              alt=""
                           />
                           <p
                              style={{
                                 fontWeight: "600",
                                 paddingRight: "12px",
                              }}
                           >
                              Delivery cost
                           </p>
                           <p>${order.orderDelivery}</p>
                           <img
                              src={"/icons/pause.svg"}
                              alt=""
                              style={{ marginLeft: "20px" }}
                           />
                           <p
                              style={{
                                 fontWeight: "600",
                                 paddingRight: "12px",
                              }}
                           >
                              Total
                           </p>
                           <p>${order.orderTotal}</p>
                        </Box>
                        <Button
                           value={order._id}
                           variant="contained"
                           color="secondary"
                           className={"cancel-button"}
                           onClick={deleteOrderHandler}
                        >
                           Cancel
                        </Button>
                        <Button
                           value={order._id}
                           variant="contained"
                           sx={{ backgroundColor: "#70B45B", color: "#fff" }}
                           className={"payment-button"}
                           onClick={processOrderHandler}
                        >
                           Payment
                        </Button>
                     </Box>
                  </Box>
               );
            })}
            {!pausedOrders ||
               (pausedOrders.length === 0 && (
                  <Box
                     display={"flex"}
                     flexDirection={"row"}
                     justifyContent={"center"}
                  >
                     <img
                        src={"/icons/noimage-list.svg"}
                        style={{ width: "300px", height: "300px" }}
                        alt=""
                     />
                  </Box>
               ))}
         </Stack>
      </TabPanel>
   );
}

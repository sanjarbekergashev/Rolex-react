import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selecOrdersPage = (state: AppRootState) => state.ordersPage;

export const retrievePausedOrders = createSelector(
   selecOrdersPage,
   (HomePage) => HomePage.pausedOrders
);
export const retrieveProcessOrders = createSelector(
   selecOrdersPage,
   (HomePage) => HomePage.processOrders
);
export const retrieveFinishedOrders = createSelector(
   selecOrdersPage,
   (HomePage) => HomePage.finishedOrders
);

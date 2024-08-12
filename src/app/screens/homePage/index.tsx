import React, { useEffect } from "react";
import Statistics from "./Statistics";
import PopularDishes from "./PupularDishes";
import Advertisement from "./Advertisement";
import ActiveUsers from "./ActiveUsers";
import Events from "./Events";
import NewDishes from "./NewDishes";
import "../../../css/home.css";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setNewDishes, setPopularDishes, setTopUsers } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import MemberService from "../../services/memberService";
import { Member } from "../../../lib/types/member";

/**REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
   setPopularDishes: (data: Product[]) => dispatch(setPopularDishes(data)),
   setNewDishes: (data: Product[]) => dispatch(setNewDishes(data)),
   setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

export default function HomePage() {
   const { setPopularDishes, setNewDishes, setTopUsers } = actionDispatch(
      useDispatch()
   );

   useEffect(() => {
      //Backend server data fetch => Data
      const product = new ProductService();
      const member = new MemberService();
      product
         .getProducts({
            page: 1,
            limit: 4,
            order: "productViews",
            productCollection: ProductCollection.DISH,
         })
         .then((data) => {
            setPopularDishes(data);
         })
         .catch((err) => {
            console.log(err);
         });

      product
         .getProducts({
            page: 1,
            limit: 4,
            order: "createdAt",
            productCollection: ProductCollection.DISH,
         })
         .then((data) => {
            setNewDishes(data);
         })
         .catch((err) => {
            console.log(err);
         });

      member
         .getTopUsers()
         .then((data) => {
            setTopUsers(data);
         })
         .catch((err) => {
            console.log(err);
         });
   }, []);

   return (
      <div className={"homepage"}>
         <Statistics />
         <PopularDishes />
         <NewDishes />
         <Advertisement />
         <ActiveUsers />
         <Events />
      </div>
   );
}

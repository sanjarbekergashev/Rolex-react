import React, { useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import HomePage from "./screens/homePage";
import ProductsPage from "./screens/productsPage";
import OrdersPage from "./screens/ordersPage";
import UserPage from "./screens/usersPage";
import HomeNavbar from "./components/header/HomeNavbar";
import OtherNavbar from "./components/header/OtherNavbar";
import Footer from "./components/footers";
import HelpPage from "./screens/helpPage";
import useBasket from "./hooks/useBasket";
import AuthenticationModal from "./components/auth";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../lib/sweetAlert";
import { Messages } from "../lib/config";
import MemberService from "./services/memberService";
import { useGlobals } from "./hooks/useGlobal";
import "../css/app.css";
import "../css/app.css";
import "../css/navbar.css";
import "../css/footer.css";

function App() {
   const location = useLocation();
   const { setAuthMember } = useGlobals();
   const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
   const [signUpOpen, setSignupOpen] = useState<boolean>(false);
   const [loginOpen, setLoginOpen] = useState<boolean>(false);
   const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

   /**HANDLERS */
   const handleSignupClose = () => setSignupOpen(false);
   const handleloginClose = () => setLoginOpen(false);
   const handelLogoutClick = (e: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(e.currentTarget);
   };
   const handelCloseLogout = () => setAnchorEl(null);
   const handelLogoutRequest = async () => {
      try {
         const member = new MemberService();
         await member.logout();

         await await sweetTopSuccessAlert("Success", 700);
         setAuthMember(null);
      } catch (err) {
         console.log(err);
         sweetErrorHandling(Messages.error1);
      }
   };

   return (
      <>
         {location.pathname === "/" ? (
            <HomeNavbar
               cartItems={cartItems}
               onAdd={onAdd}
               onRemove={onRemove}
               onDelete={onDelete}
               onDeleteAll={onDeleteAll}
               setSignupOpen={setSignupOpen}
               setLoginOpen={setLoginOpen}
               anchorEl={anchorEl}
               handelLogoutClick={handelLogoutClick}
               handelCloseLogout={handelCloseLogout}
               handelLogoutRequest={handelLogoutRequest}
            />
         ) : (
            <OtherNavbar
               cartItems={cartItems}
               onAdd={onAdd}
               onRemove={onRemove}
               onDelete={onDelete}
               onDeleteAll={onDeleteAll}
               setSignupOpen={setSignupOpen}
               setLoginOpen={setLoginOpen}
               anchorEl={anchorEl}
               handelLogoutClick={handelLogoutClick}
               handelCloseLogout={handelCloseLogout}
               handelLogoutRequest={handelLogoutRequest}
            />
         )}
         <Switch>
            <Route path="/products">
               <ProductsPage onAdd={onAdd} />
            </Route>
            <Route path="/orders">
               <OrdersPage />
            </Route>
            <Route path="/member-page">
               <UserPage />
            </Route>
            <Route path="/help">
               <HelpPage />
            </Route>
            <Route path="/">
               <HomePage />
            </Route>
         </Switch>
         <Footer />

         <AuthenticationModal
            signupOpen={signUpOpen}
            loginOpen={loginOpen}
            handleLoginClose={handleloginClose}
            handleSignupClose={handleSignupClose}
         />
      </>
   );
}

export default App;

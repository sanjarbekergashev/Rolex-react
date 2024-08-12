import {
   Badge,
   Box,
   Button,
   Container,
   Pagination,
   PaginationItem,
   Stack,
   Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setProducts } from "./slice";
import { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import { ChangeEvent, useEffect, useState } from "react";
import { serverApi } from "../../../lib/config";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";

const actionDispatch = (dispatch: Dispatch) => ({
   setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({
   products,
}));

interface ProductsProps {
   onAdd: (item: CartItem) => void;
}

export default function Products(props: ProductsProps) {
   const { onAdd } = props;
   const { setProducts } = actionDispatch(useDispatch());
   const { products } = useSelector(productsRetriever);
   const [productSearch, setproductSearch] = useState<ProductInquiry>({
      page: 1,
      limit: 8,
      order: "createdAt",
      productCollection: ProductCollection.DISH,
      search: "",
   });

   const [searchText, setSearchText] = useState<string>("");
   const history = useHistory();

   useEffect(() => {
      const products = new ProductService();
      products
         .getProducts(productSearch)
         .then((data) => {
            setProducts(data);
         })
         .catch((err) => {
            console.log("Error get Products", err);
         });
   }, [productSearch]);

   useEffect(() => {
      if (searchText === "") {
         productSearch.search = "";
         setproductSearch({ ...productSearch });
      }
   }, [searchText]);

   /**HANDLERS SECTION */
   const searchCollectionHandler = (collection: ProductCollection) => {
      productSearch.page = 1;
      productSearch.productCollection = collection;
      setproductSearch({ ...productSearch });
   };

   const searchOrderHandler = (order: string) => {
      productSearch.page = 1;
      productSearch.order = order;
      setproductSearch({ ...productSearch });
   };

   const searchProductHandler = () => {
      productSearch.search = searchText;
      setproductSearch({ ...productSearch });
   };

   const paginationHandler = (e: ChangeEvent<any>, value: number) => {
      productSearch.page = value;
      setproductSearch({ ...productSearch });
   };

   const chooseDishHandler = (id: string) => {
      history.push(`/products/${id}`);
   };

   return (
      <div className={"products"}>
         <Container>
            <Stack>
               <Stack className={"avatar-big-box"}>
                  <Box>
                     <Typography className="title">Burak Restaurant</Typography>
                  </Box>
               </Stack>
               <Stack flexDirection={"row"} justifyContent={"flex-end"}>
                  <Box className="search-field">
                     <input
                        className="input"
                        placeholder="Type here"
                        value={searchText}
                        onChange={(e) => {
                           setSearchText(e.target.value);
                        }}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") searchProductHandler();
                        }}
                     />
                     <Button
                        color={"primary"}
                        className="btn"
                        variant="contained"
                        onClick={searchProductHandler}
                     >
                        Search <SearchIcon className="search-icon" />
                     </Button>
                  </Box>
               </Stack>
               <Stack className={"dishes-filter-section"}>
                  <Button
                     variant="contained"
                     color={
                        productSearch.order === "createdAt"
                           ? "primary"
                           : "secondary"
                     }
                     onClick={() => searchOrderHandler("createdAt")}
                  >
                     New
                  </Button>
                  <Button
                     variant="contained"
                     color={
                        productSearch.order === "productPrice"
                           ? "primary"
                           : "secondary"
                     }
                     onClick={() => searchOrderHandler("productPrice")}
                  >
                     Price
                  </Button>
                  <Button
                     variant="contained"
                     color={
                        productSearch.order === "productViews"
                           ? "primary"
                           : "secondary"
                     }
                     onClick={() => searchOrderHandler("productViews")}
                  >
                     Views
                  </Button>
               </Stack>
               <Stack className={"list-category-section"}>
                  <Stack className="product-category">
                     <Button
                        color={
                           productSearch.productCollection ===
                           ProductCollection.DISH
                              ? "primary"
                              : "secondary"
                        }
                        variant="contained"
                        onClick={() =>
                           searchCollectionHandler(ProductCollection.DISH)
                        }
                     >
                        Dish
                     </Button>
                     <Button
                        color={
                           productSearch.productCollection ===
                           ProductCollection.SALAD
                              ? "primary"
                              : "secondary"
                        }
                        variant="contained"
                        onClick={() =>
                           searchCollectionHandler(ProductCollection.SALAD)
                        }
                     >
                        Salad
                     </Button>
                     <Button
                        color={
                           productSearch.productCollection ===
                           ProductCollection.DRINK
                              ? "primary"
                              : "secondary"
                        }
                        variant="contained"
                        onClick={() =>
                           searchCollectionHandler(ProductCollection.DRINK)
                        }
                     >
                        Drink
                     </Button>
                     <Button
                        color={
                           productSearch.productCollection ===
                           ProductCollection.DESSERT
                              ? "primary"
                              : "secondary"
                        }
                        variant="contained"
                        onClick={() =>
                           searchCollectionHandler(ProductCollection.DESSERT)
                        }
                     >
                        Desert
                     </Button>
                     <Button
                        color={
                           productSearch.productCollection ===
                           ProductCollection.OTHER
                              ? "primary"
                              : "secondary"
                        }
                        variant="contained"
                        onClick={() =>
                           searchCollectionHandler(ProductCollection.OTHER)
                        }
                     >
                        Others
                     </Button>
                  </Stack>
                  <Stack className="product-wrapper">
                     {products.length !== 0 ? (
                        products.map((product: Product) => {
                           const imagePath = `${serverApi}/${product.productImages[0]}`;
                           const sizeVolume =
                              product.productCollection ===
                              ProductCollection.DRINK
                                 ? product.productVolume + " litre"
                                 : product.productSize + " size";
                           return (
                              <Stack
                                 key={product._id}
                                 onClick={() => chooseDishHandler(product._id)}
                              >
                                 <Stack
                                    className="product-img"
                                    sx={{
                                       backgroundImage: `url(${imagePath})`,
                                    }}
                                 >
                                    <Box className="product-size">
                                       <Typography>{sizeVolume}</Typography>
                                    </Box>
                                    <Stack className="product-busket">
                                       <Button
                                          className={"busket"}
                                          onClick={(e) => {
                                             onAdd({
                                                _id: product._id,
                                                quantity: 1,
                                                name: product.productName,
                                                price: product.productPrice,
                                                image: product.productImages[0],
                                             });
                                             e.stopPropagation();
                                          }}
                                       >
                                          <img
                                             src="/icons/shopping-cart.svg"
                                             alt=""
                                          />
                                       </Button>
                                       <Button className="view">
                                          <Badge
                                             badgeContent={product.productViews}
                                             color={"secondary"}
                                             className="badge"
                                          >
                                             <RemoveRedEyeIcon
                                                sx={{
                                                   color:
                                                      product.productViews === 0
                                                         ? "gray"
                                                         : "white",
                                                }}
                                             />
                                          </Badge>
                                       </Button>
                                    </Stack>
                                 </Stack>
                                 <Stack className="product-info">
                                    <Box className="product-name">
                                       {product.productName}
                                    </Box>
                                    <Box className="product-price">
                                       <MonetizationOnIcon />
                                       {product.productPrice}
                                    </Box>
                                 </Stack>
                              </Stack>
                           );
                        })
                     ) : (
                        <Box className="no-data">
                           Products are not available
                        </Box>
                     )}
                  </Stack>
               </Stack>
               <Stack className={"pagination-section"}>
                  <Pagination
                     count={
                        products.length !== 0
                           ? productSearch.page + 1
                           : productSearch.page
                     }
                     page={productSearch.page}
                     renderItem={(item) => (
                        <PaginationItem
                           components={{
                              previous: ArrowBackIos,
                              next: ArrowForwardIos,
                           }}
                           {...item}
                           color={"secondary"}
                        />
                     )}
                     onChange={paginationHandler}
                  />
               </Stack>
            </Stack>
         </Container>

         <div className={"brand-logo"}>
            <Container>
               <Box className="title">
                  <Typography>Our Family Brands</Typography>
               </Box>
               <Stack className="brand-imgs">
                  <Box className="brand-img">
                     <img src={"/img/gurme.webp"} alt="" />
                  </Box>
                  <Box className="brand-img">
                     <img src={"/img/seafood.webp"} alt="" />
                  </Box>
                  <Box className="brand-img">
                     <img src={"/img/sweets.webp"} alt="" />
                  </Box>
                  <Box className="brand-img">
                     <img src={"/img/doner.webp"} alt="" />
                  </Box>
               </Stack>
            </Container>
         </div>

         <div className={"address"}>
            <Container>
               <Stack className="address-area">
                  <Box className="title">Our Address</Box>
                  <iframe
                     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13033.858997074049!2d128.8728189!3d35.24469205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568c76fc4f5381b%3A0xd777389c5050cbea!2sGimhae%20National%20Museum!5e0!3m2!1sen!2skr!4v1720893154596!5m2!1sen!2skr"
                     width="100%"
                     height="568px"
                     loading="lazy"
                  ></iframe>
               </Stack>
            </Container>
         </div>
      </div>
   );
}

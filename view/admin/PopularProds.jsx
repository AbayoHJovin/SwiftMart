/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  useTheme,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import useProducts from "../constants/products";
import { CgMathMinus } from "react-icons/cg";
import { apiUrl } from "../src/lib/apis";
import Loader from "../src/components/loader";

export default function PopularProds() {
  const { products } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleSearch = () => {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filteredData = products
        .filter((item) => item.popular === true)
        .filter(
          (product) =>
            product.prodName.toLowerCase().includes(lowercasedFilter) ||
            product.prodDescription.toLowerCase().includes(lowercasedFilter)
        );
      setFilteredProducts(filteredData);
    };
    handleSearch();
  }, [products, searchTerm]);
  const popProds = [];
  const fetchProducts = () => {
    setLoading(true);
    popProds.push(products.filter((item) => item.popular === true));
    setFilteredProducts(popProds);
    setLoading(false);
  };

  function handleAddToPopular(item, popularity) {
    fetch(`${apiUrl}/makeAPopularProduct?prodId=${item}`, {
      method: "PATCH",
      headers: { popularity: popularity },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        location.reload();
      })
      .catch((e) => console.error(e));
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          name="search"
          placeholder="Search a product"
          className="mb-0 xsm:mb-2 p-3 outline-none border-none"
          style={{ backgroundColor: "#e0facf" }}
        />
      </Box>
      <Box
        sx={{ overflowX: "auto", "&::-webkit-scrollbar": { height: "8px" } }}
      >
        <TableContainer component={Paper} sx={{ minWidth: "600px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Sold</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <Loader />
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.prodId}>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.prodName}
                        style={{ width: "50px", height: "50px" }}
                      />
                    </TableCell>
                    <TableCell>{product.prodName}</TableCell>
                    <TableCell>{product.prodDescription}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.sold}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.gender}</TableCell>
                    <TableCell>
                      <IconButton
                        title="remove from pupular products"
                        onClick={() =>
                          handleAddToPopular(product.prodId, false)
                        }
                      >
                        <CgMathMinus />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Loader />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

import { useState, useEffect } from "react";
import { Buffer } from "buffer";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import useProducts from "../constants/products";
import { CgMathMinus } from "react-icons/cg";

export default function PopularProds() {
  const { products } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

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
            product.name.toLowerCase().includes(lowercasedFilter) ||
            product.description.toLowerCase().includes(lowercasedFilter)
        );
      setFilteredProducts(filteredData);
    };
    handleSearch();
  }, [products, searchTerm]);
  const popProds = [];
  const fetchProducts = () => {
    popProds.push(products.filter((item) => item.popular === true));
    console.log(
      "HEre are the pop ones",
      products.filter((item) => item.popular !== true)
    );
    setFilteredProducts(popProds);
  };

  function handleAddToPopular(item, popularity) {
    fetch(`http://localhost:5000/makeAPopularProduct?prodId=${item}`, {
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
        <TextField
          variant="outlined"
          placeholder="Search products"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <FaSearch />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: { xs: 2, sm: 0 },
            width: { xs: "100%", sm: "auto" },
            backgroundColor: isDarkMode
              ? theme.palette.background.default
              : theme.palette.background.paper,
            color: isDarkMode
              ? theme.palette.text.primary
              : theme.palette.text.secondary,
            "& .MuiInputBase-input": {
              color: isDarkMode
                ? theme.palette.text.primary
                : theme.palette.text.secondary,
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: isDarkMode
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              },
              "&:hover fieldset": {
                borderColor: isDarkMode
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              },
              "&.Mui-focused fieldset": {
                borderColor: isDarkMode
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              },
            },
          }}
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <img
                        src={`data:${
                          product.image.contentType
                        };base64,${Buffer.from(product.image.data).toString(
                          "base64"
                        )}`}
                        alt={product.name}
                        style={{ width: "50px", height: "50px" }}
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.description}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.sold}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.gender}</TableCell>
                    <TableCell>
                      <IconButton
                        title="remove from pupular products"
                        onClick={() => handleAddToPopular(product._id, false)}
                      >
                        <CgMathMinus />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No products available
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

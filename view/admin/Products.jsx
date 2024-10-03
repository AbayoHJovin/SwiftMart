/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import {
  Box,
  Button,
  Modal,
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
  useMediaQuery,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import useProducts from "../constants/products";
import { CgAdd, CgMathMinus } from "react-icons/cg";
import { apiUrl } from "../src/lib/apis";
import Loader from "../src/components/loader";

export default function ProductTable() {
  const { products } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    name: "",
    description: "",
    price: "",
    gender: "",
    category: "",
    stock: "",
    sold: "",
    image: null,
    imageUrl: "",
  });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const categories = ["shoes", "shirts", "pants", "watches", "hats"];
  const genders = ["Male", "Female", "Both"];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [products, searchTerm]);

  const fetchProducts = () => {
    setLoading(true);
    setFilteredProducts(products);
    setLoading(false);
  };

  const handleSearch = () => {
    const lowercasedFilter = searchTerm.toLowerCase();
    setLoading(true);
    const filteredData = products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercasedFilter) ||
        product.description.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredProducts(filteredData);
    setLoading(false);
  };

  const handleEdit = (product) => {
    setSelectedProduct({
      ...product,
      imageUrl: `data:${product.image.contentType};base64,${Buffer.from(
        product.image.data
      ).toString("base64")}`,
    });
    setPreview(
      `data:${product.image.contentType};base64,${Buffer.from(
        product.image.data
      ).toString("base64")}`
    );
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/products?id=${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct({
      name: "",
      description: "",
      price: "",
      gender: "",
      category: "",
      stock: "",
      sold: "",
      image: null,
      imageUrl: "",
    });
    setPreview("");
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", selectedProduct.name);
    formData.append("description", selectedProduct.description);
    formData.append("price", selectedProduct.price);
    formData.append("gender", selectedProduct.gender);
    formData.append("category", selectedProduct.category);
    formData.append("stock", selectedProduct.stock);
    formData.append("sold", selectedProduct.sold);
    if (selectedProduct.image) {
      formData.append("image", selectedProduct.image);
    }

    try {
      if (selectedProduct._id) {
        await axios
          .put(`${apiUrl}/products/${selectedProduct._id}`, formData)
          .then(() => {
            location.reload();
          })
          .catch((e) => console.log(e));
      } else {
        await axios
          .post(`${apiUrl}/addProduct`, formData)
          .then(() => location.reload())
          .catch((e) => console.log(e));
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedProduct({ ...selectedProduct, image: file });
    setPreview(URL.createObjectURL(file));
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
    <div>
      <div className="flex flex-col sm:flex-row justify-between mb-2 sticky top-0 bg-gray-100 p-5">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          name="search"
          placeholder="Search a product"
          className="mb-0 xsm:mb-2 px-3 outline-none border-none"
          style={{ backgroundColor: "#e0facf" }}
        />

        <button
          onClick={() => setOpenModal(true)}
          className="bg-green-500 p-3 px-4 rounded-md text-white"
        >
          Add Product
        </button>
      </div>
      <Box sx={{ p: 3 }}>
        {/* <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          mb: 2,
          position: "sticky",
          top: 3,

        }}
      > */}
        {/* </Box> */}
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
                      <TableCell>RWF {product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.gender}</TableCell>
                      <TableCell sx={{ display: "flex" }}>
                        <IconButton onClick={() => handleEdit(product)}>
                          <FaEdit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(product._id)}>
                          <FaTrashAlt />
                        </IconButton>
                        {product.popular ? (
                          <IconButton
                            title="remove from pupular products"
                            onClick={() =>
                              handleAddToPopular(product._id, false)
                            }
                          >
                            <CgMathMinus />
                          </IconButton>
                        ) : (
                          <IconButton
                            title="Add to pupular products"
                            onClick={() =>
                              handleAddToPopular(product._id, true)
                            }
                          >
                            <CgAdd />
                          </IconButton>
                        )}
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

        {/* Product Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={{ ...modalStyle, width: { xs: "90%", sm: 400 } }}>
            <TextField
              label="Name"
              value={selectedProduct.name}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={selectedProduct.description}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  description: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              type="number"
              label="Stock"
              value={selectedProduct.stock}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  stock: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              type="number"
              label="Sold"
              value={selectedProduct.sold}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  sold: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              type="number"
              label="Price(RWF)"
              value={selectedProduct.price}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  price: e.target.value,
                })
              }
              fullWidth
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Gender</InputLabel>
              <Select
                value={selectedProduct.gender}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    gender: e.target.value,
                  })
                }
              >
                {genders.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedProduct.category}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    category: e.target.value,
                  })
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              component="label"
              fullWidth
              margin="normal"
              sx={{ mt: 2 }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {preview && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={preview}
                  alt="preview"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </Box>
            )}

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </div>
  );
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  overflowY: "scroll",
  height: "100vh",
};

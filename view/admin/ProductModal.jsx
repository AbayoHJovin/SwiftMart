/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../src/lib/apis";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

export default function ProductModal({
  isOpen,
  onClose,
  product,
  refreshProducts,
  categories,
  genders,
}) {
  const [formData, setFormData] = useState({
    prodName: "",
    prodDescription: "",
    price: "",
    gender: "",
    category: "",
    stock: 0,
    popular: false,
    image: null,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        prodName: product.prodName || "",
        prodDescription: product.prodDescription || "",
        price: product.price || "",
        gender: product.gender || "",
        category: product.category || "",
        stock: product.stock || 0,
        popular: product.popular || false,
        image: null,
      });
    }
  }, [product]);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  // const handleSubmit = async () => {
  //   const data = new FormData();
  //   Object.keys(formData).forEach((key) => {
  //     if (key !== "image") {
  //       data.append(key, formData[key]);
  //     }
  //   });
  // console.log(data)
  //   try {
  //     if (product) {
  //       await axios.put(`${apiUrl}/products/${product.prodId}`, data);
  //     } else {
  //       data.append("image", formData.image);
  //       await axios.post(`${apiUrl}/addProduct`, data);
  //     }
  //     refreshProducts();
  //     onClose();
  //   } catch (error) {
  //     console.error("Error saving product", error);
  //   }
  // };

  const handleSubmit = async () => {
    const data = new FormData();
  
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
  
    try {
      if (product) {
        if (formData.image) {
          data.append("image", formData.image);
        }
        await axios.put(`${apiUrl}/products/${product.prodId}`, data);
      } else {
        data.append("image", formData.image); 
        await axios.post(`${apiUrl}/addProduct`, data);
      }
      refreshProducts();
      onClose();
    } catch (error) {
      console.error("Error saving product", error);
    }
  };
  
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Product Name"
          value={formData.prodName}
          onChange={(e) => {
            setFormData({ ...formData, prodName: e.target.value }),
              console.log(e.target.value);
          }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={formData.prodDescription}
          onChange={(e) =>
            setFormData({ ...formData, prodDescription: e.target.value })
          }
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          label="Price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Gender"
          select
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          fullWidth
          margin="normal"
        >
          {genders.map((gender) => (
            <MenuItem key={gender} value={gender}>
              {gender}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Category"
          select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          fullWidth
          margin="normal"
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Stock"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.popular}
              onChange={(e) =>
                setFormData({ ...formData, popular: e.target.checked })
              }
            />
          }
          label="Popular"
        />
        {product ? (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <img
              src={product.image}
              alt={product.prodName}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        ) : (
          <Button
            variant="contained"
            component="label"
            fullWidth
            style={{ marginTop: "1rem" }}
          >
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}


/* eslint-disable react/prop-types */


// import { useState, useEffect } from "react";
// import axios from "axios";
// import { apiUrl } from "../src/lib/apis";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   MenuItem,
// } from "@mui/material";

// export default function ProductModal({
//   isOpen,
//   onClose,
//   product,
//   refreshProducts,
//   categories,
//   genders,
// }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     gender: "",
//     category: "",
//     stock: "",
//     sold: "",
//     image: null,
//   });

//   useEffect(() => {
//     if (product) {
//       setFormData({ ...product });
//     }
//   }, [product]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setFormData({ ...formData, image: file });
//   };

//   const handleSubmit = async () => {
//     const data = new FormData();
//     Object.keys(formData).forEach((key) => data.append(key, formData[key]));

//     try {
//       if (product) {
//         await axios.put(`${apiUrl}/products/${product.prodId}`, data);
//       } else {
//         await axios.post(`${apiUrl}/addProduct`, data);
//       }
//       refreshProducts();
//       onClose();
//     } catch (error) {
//       console.error("Error saving product", error);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
//       <DialogContent>
//         <TextField
//           label="Name"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="Description"
//           value={formData.description}
//           onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//           fullWidth
//           margin="normal"
//           multiline
//           rows={3}
//         />
//         <TextField
//           label="Price"
//           type="number"
//           value={formData.price}
//           onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="Gender"
//           select
//           value={formData.gender}
//           onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
//           fullWidth
//           margin="normal"
//         >
//           {genders.map((gender) => (
//             <MenuItem key={gender} value={gender}>
//               {gender}
//             </MenuItem>
//           ))}
//         </TextField>
//         <TextField
//           label="Category"
//           select
//           value={formData.category}
//           onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//           fullWidth
//           margin="normal"
//         >
//           {categories.map((category) => (
//             <MenuItem key={category} value={category}>
//               {category}
//             </MenuItem>
//           ))}
//         </TextField>
//         <TextField
//           label="Stock"
//           type="number"
//           value={formData.stock}
//           onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//           fullWidth
//           margin="normal"
//         />
//         <Button
//           variant="contained"
//           component="label"
//           fullWidth
//           style={{ marginTop: "1rem" }}
//         >
//           Upload Image
//           <input
//             type="file"
//             hidden
//             onChange={handleImageChange}
//           />
//         </Button>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="secondary">
//           Cancel
//         </Button>
//         <Button onClick={handleSubmit} color="primary" variant="contained">
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
















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
    name: "",
    description: "",
    price: "",
    gender: "",
    category: "",
    stock: 0,
    popular: false,
    image: null,
  });

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    }
  }, [product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      if (product) {
        await axios.put(`${apiUrl}/products/${product.prodId}`, data);
      } else {
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
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
            />
          }
          label="Popular"
        />
        <Button
          variant="contained"
          component="label"
          fullWidth
          style={{ marginTop: "1rem" }}
        >
          Upload Image
          <input
            type="file"
            hidden
            onChange={handleImageChange}
          />
        </Button>
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

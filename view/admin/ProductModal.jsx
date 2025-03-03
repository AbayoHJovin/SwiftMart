// /* eslint-disable react/prop-types */
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
//   Checkbox,
//   FormControlLabel,
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
//     prodName: "",
//     prodDescription: "",
//     price: "",
//     gender: "",
//     category: "",
//     stock: 0,
//     popular: false,
//     image: null,
//   });

//   useEffect(() => {
//     if (product) {
//       setFormData({
//         prodName: product.prodName || "",
//         prodDescription: product.prodDescription || "",
//         price: product.price || "",
//         gender: product.gender || "",
//         category: product.category || "",
//         stock: product.stock || 0,
//         popular: product.popular || false,
//         image: null,
//       });
//     }
//   }, [product]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setFormData({ ...formData, image: file });
//   };

//   const handleSubmit = async () => {
//     const data = new FormData();
//     data.append("name", formData.prodName);
//     data.append("description", formData.prodDescription);
//     data.append("price", formData.price);
//     data.append("gender", formData.gender);
//     data.append("category", formData.category);
//     data.append("stock", formData.stock);
//     data.append("popular", formData.popular);
//     if (formData.image) {
//       data.append("image", formData.image);
//     }

//     try {
//       if (product) {
//         await axios.patch(`${apiUrl}/products/${product.prodId}`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else {
//         await axios.post(`${apiUrl}/addProduct`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }
//       refreshProducts();
//       onClose();
//     } catch (error) {
//       console.error("Error saving product:", error);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
//       <DialogContent>
//         <TextField
//           label="Product Name"
//           value={formData.prodName}
//           onChange={(e) => {
//             setFormData({ ...formData, prodName: e.target.value }),
//               console.log(e.target.value);
//           }}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="Description"
//           value={formData.prodDescription}
//           onChange={(e) =>
//             setFormData({ ...formData, prodDescription: e.target.value })
//           }
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
//           onChange={(e) =>
//             setFormData({ ...formData, category: e.target.value })
//           }
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
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={formData.popular}
//               onChange={(e) =>
//                 setFormData({ ...formData, popular: e.target.checked })
//               }
//             />
//           }
//           label="Popular"
//         />
//         {product ? (
//           <div style={{ marginTop: "1rem", textAlign: "center" }}>
//             <img
//               src={product.image}
//               alt={product.prodName}
//               style={{
//                 width: "100px",
//                 height: "100px",
//                 objectFit: "cover",
//                 borderRadius: "8px",
//               }}
//             />
//           </div>
//         ) : (
//           <Button
//             variant="contained"
//             component="label"
//             fullWidth
//             style={{ marginTop: "1rem" }}
//           >
//             Upload Image
//             <input type="file" hidden onChange={handleImageChange} />
//           </Button>
//         )}
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
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material";

export default function ProductModal({
  isOpen,
  onClose,
  product,
  refreshProducts,
  categories,
  genders,
}) {
  const MAX_IMAGES = 5; // Maximum number of images allowed
  const [formData, setFormData] = useState({
    prodName: "",
    prodDescription: "",
    price: "",
    gender: "",
    category: "",
    stock: 0,
    popular: false,
    images: [], // Array of { file, preview, isMain } objects
  });

  useEffect(() => {
    if (product) {
      // For editing, pre-populate with existing data
      setFormData({
        prodName: product.prodName || "",
        prodDescription: product.prodDescription || "",
        price: product.price || "",
        gender: product.gender || "",
        category: product.category || "",
        stock: product.stock || 0,
        popular: product.popular || false,
        images: product.images.map((img) => ({
          file: null, // No file for existing images unless replaced
          preview: img.imageUrl,
          isMain: img.isMain,
        })),
      });
    } else {
      // Reset for new product
      setFormData({
        prodName: "",
        prodDescription: "",
        price: "",
        gender: "",
        category: "",
        stock: 0,
        popular: false,
        images: [],
      });
    }
  }, [product]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = MAX_IMAGES - formData.images.length;
    
    // Limit the number of new images to the remaining slots
    const newImages = files.slice(0, remainingSlots).map((file) => ({
      file,
      preview: URL.createObjectURL(file), // Create a preview URL for display
      isMain: formData.images.length === 0 && files.length === 1, // Default first image as main if no images exist
    }));

    if (newImages.length < files.length) {
      alert(`You can only upload a maximum of ${MAX_IMAGES} images. Only the first ${remainingSlots} selected images will be added.`);
    }

    setFormData({
      ...formData,
      images: [...formData.images, ...newImages],
    });
  };

  const handleSetMainImage = (index) => {
    const updatedImages = formData.images.map((img, i) => ({
      ...img,
      isMain: i === index, // Only the selected image is main
    }));
    setFormData({ ...formData, images: updatedImages });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    // If removing the main image, set the first remaining one as main (if any)
    if (formData.images[index].isMain && updatedImages.length > 0) {
      updatedImages[0].isMain = true;
    }
    setFormData({ ...formData, images: updatedImages });
  };

  // const handleSubmit = async () => {
  //   const data = new FormData();
  //   data.append("name", formData.prodName);
  //   data.append("description", formData.prodDescription);
  //   data.append("price", formData.price);
  //   data.append("gender", formData.gender);
  //   data.append("category", formData.category);
  //   data.append("stock", formData.stock);
  //   data.append("popular", formData.popular);

  //   // Append images and indicate which is main via mainImageIndex
  //   const mainImageIndex = formData.images.findIndex((img) => img.isMain);
  //   data.append("mainImageIndex", mainImageIndex >= 0 ? mainImageIndex : 0);

  //   formData.images.forEach((img) => {
  //     if (img.file) {
  //       data.append("images", img.file); // Only append new files
  //     }
  //   });

  //   try {
  //     if (product) {
  //       await axios.patch(`${apiUrl}/products/${product.prodId}`, data, {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       });
  //     } else {
  //       await axios.post(`${apiUrl}/addProduct`, data, {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       });
  //     }
  //     refreshProducts();
  //     onClose();
  //   } catch (error) {
  //     console.error("Error saving product:", error);
  //   }
  // };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append("name", formData.prodName);
    data.append("description", formData.prodDescription);
    data.append("price", formData.price);
    data.append("gender", formData.gender);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    data.append("popular", formData.popular);
    const mainImageIndex = formData.images.findIndex((img) => img.isMain);
    data.append("mainImageIndex", mainImageIndex >= 0 ? mainImageIndex : 0);
    formData.images.forEach((img) => {
      if (img.file) {
        data.append("images", img.file);
      }
    });
    try {
      if (product) {
        await axios.patch(`${apiUrl}/products/${product.prodId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${apiUrl}/addProduct`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      refreshProducts();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const isMaxImagesReached = formData.images.length >= MAX_IMAGES;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Product Name"
          value={formData.prodName}
          onChange={(e) => setFormData({ ...formData, prodName: e.target.value })}
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
              onChange={(e) =>
                setFormData({ ...formData, popular: e.target.checked })
              }
            />
          }
          label="Popular"
        />

        {/* Image Upload and Selection */}
        <div style={{ marginTop: "1rem" }}>
          <Button
            variant="contained"
            component="label"
            fullWidth
            disabled={isMaxImagesReached} // Disable when 10 images are selected
          >
            Upload Images ({formData.images.length}/{MAX_IMAGES})
            <input
              type="file"
              multiple
              hidden
              onChange={handleImageChange}
              accept="image/*"
            />
          </Button>

          {formData.images.length > 0 && (
            <FormControl component="fieldset" style={{ marginTop: "1rem" }}>
              <FormLabel component="legend">Select Main Image</FormLabel>
              <RadioGroup
                value={formData.images.findIndex((img) => img.isMain) || 0}
                onChange={(e) => handleSetMainImage(parseInt(e.target.value))}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {formData.images.map((img, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      <img
                        src={img.preview}
                        alt={`Preview ${index}`}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: img.isMain ? "2px solid blue" : "none",
                        }}
                      />
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleRemoveImage(index)}
                        style={{ position: "absolute", top: 0, right: 0 }}
                      >
                        X
                      </Button>
                      <FormControlLabel
                        value={index}
                        control={<Radio />}
                        label={`Image ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </FormControl>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={formData.images.length === 0} // Require at least one image
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
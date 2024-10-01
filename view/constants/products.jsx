// // hooks/useProducts.js
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { apiUrl } from "../src/lib/apis";

// const useProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [popularProds, setPopularProds] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(`${apiUrl}/products`);
//         const resp = response.data;
//         setProducts(resp);
//         setPopularProds(resp.popular);
//         console.log("resp is", resp);
//         setLoading(false);
//       } catch (error) {
//         setError("Error fetching products");
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return { products, loading, error, popularProds };
// };

// export default useProducts;

import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../src/lib/apis";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popularProds, setPopularProds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/products`);
        const resp = response.data;

        // Assuming that each product has a 'popular' boolean field
        setProducts(resp);
        const filteredPopularProds = resp.filter((product) => product.popular);
        setPopularProds(filteredPopularProds);  // Filter popular products
        setLoading(false);
      } catch (error) {
        setError("Error fetching products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error, popularProds };
};

export default useProducts;

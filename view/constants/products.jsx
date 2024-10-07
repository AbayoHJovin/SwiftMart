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

//         // Assuming that each product has a 'popular' boolean field
//         setProducts(resp);
//         const filteredPopularProds = resp.filter((product) => product.popular);
//         setPopularProds(filteredPopularProds);  // Filter popular products
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



import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiUrl } from '../src/lib/apis';

const fetchProducts = async () => {
  const response = await axios.get(`${apiUrl}/products`);
  return response.data;  // Return the response data directly
};

const useProducts = () => {
  // Use React Query's useQuery to fetch and cache product data
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'], // Unique key for this query
    queryFn: fetchProducts,  // The fetch function
    staleTime: 5 * 60 * 1000,  // Cache for 5 minutes before refetching
  });

  // Filter popular products based on the "popular" field
  const popularProds = products.filter((product) => product.popular);
console.log("The only popular prods are: ",popularProds)
  return { products, loading: isLoading, error, popularProds };
};

export default useProducts;

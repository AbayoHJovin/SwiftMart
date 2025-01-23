import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiUrl } from '../src/lib/apis';

const fetchProducts = async () => {
  const response = await axios.get(`${apiUrl}/products`);
  return response.data;  
};

const useProducts = () => {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,  
    staleTime: 5 * 60 * 1000,  
  });

  const availableProducts = products.filter((product) => product.stock > 0);
  const popularProds = availableProducts.filter((product) => product.popular);

  return { products: availableProducts, loading: isLoading, error, popularProds };
};

export default useProducts;

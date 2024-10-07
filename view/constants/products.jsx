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

  const popularProds = products.filter((product) => product.popular);
console.log("The only popular prods are: ",popularProds)
  return { products, loading: isLoading, error, popularProds };
};

export default useProducts;

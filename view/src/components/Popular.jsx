import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProducts from "../../constants/products";
import PopularProductCard from "./PopularProductCard";

const Popular = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    if (products && !loading) {
      // Filter popular products
      const popularProducts = products.filter(product => product.popular);
      
      // If we have more than 4 popular products, randomly select 4
      if (popularProducts.length > 4) {
        const randomProducts = [];
        const tempProducts = [...popularProducts];
        
        for (let i = 0; i < 4; i++) {
          const randomIndex = Math.floor(Math.random() * tempProducts.length);
          randomProducts.push(tempProducts[randomIndex]);
          tempProducts.splice(randomIndex, 1);
        }
        
        setDisplayedProducts(randomProducts);
      } else {
        // If 4 or fewer products, show all of them
        setDisplayedProducts(popularProducts);
      }
    }
  }, [products, loading]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Popular Products
          </h2>
          <button 
            onClick={() => navigate('/shop/Unisex/pants')}
            className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
          >
            View All
            <span className="text-xl">→</span>
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayedProducts.map((product) => (
            <PopularProductCard
              key={product.prodId}
              product={product}
              onClick={() => navigate(`/product/${product.prodId}`)}
            />
          ))}
        </div>

        {/* Empty State */}
        {displayedProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No new arrivals at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Popular;
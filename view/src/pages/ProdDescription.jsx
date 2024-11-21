import { useState, useEffect } from "react";
import useProducts from "../../constants/products";
import { useParams } from "react-router-dom";
import { Buffer } from "buffer";
import Navbar from "../components/Navbar";

const ProdDescription = () => {
  const { products } = useProducts();
  const params = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const productFilter = products.find(
      (product) => product.prodId === params.prodId
    );
    setSelectedProduct(productFilter);
  }, [params.prodId, products]);

  return (
    <div>
      <Navbar />
      {selectedProduct ? (
        <div>
          <h1>{selectedProduct.name}</h1>
          <img
            className="bg-black"
            src={`data:${
              selectedProduct.image.contentType
            };base64,${Buffer.from(selectedProduct.image.data).toString(
              "base64"
            )}`}
            alt={selectedProduct.name}
          />
        </div>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  );
};

export default ProdDescription;

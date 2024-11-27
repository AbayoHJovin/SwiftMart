/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { CgAdd, CgMathMinus } from "react-icons/cg";
import Loader from "../src/components/loader";
import ProductModal from "./ProductModal";
import EmptyState from "./EmptyState";
import { apiUrl } from "../src/lib/apis";

export default function ProductTable() {
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ["shoes", "shirts", "pants", "watches", "hats"];
  const genders = ["Male", "Female", "Unisex"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/products`);
      const popularProducts = response.data.filter(
        (item) => item.popular === true
      );
      setProducts(response.data); // Keep all products for search reference
      setFilteredProducts(popularProducts); // Show only popular products
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    const searchTermLower = e.target.value.toLowerCase();
    setSearchTerm(e.target.value);
    setFilteredProducts(
      products
        .filter((product) => product.popular) // Ensure only popular products
        .filter(
          (product) =>
            product.prodName.toLowerCase().includes(searchTermLower) ||
            product.prodDescription.toLowerCase().includes(searchTermLower)
        )
    );
  };

  const handleDelete = async (prodId) => {
    try {
      await axios.delete(`${apiUrl}/products/${prodId}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const togglePopularity = async (prodId, popularity) => {
    try {
      await axios.patch(
        `${apiUrl}/makeAPopularProduct?prodId=${prodId}`,
        null,
        {
          headers: { popularity: popularity ? "true" : "false" },
        }
      );
      fetchProducts();
    } catch (error) {
      console.error("Error toggling popularity:", error);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <input
          type="text"
          placeholder="Search a product"
          value={searchTerm}
          onChange={handleSearch}
          className="mb-2 sm:mb-0 p-2 border border-gray-300 rounded w-[100%] sm:w-1/2"
        />
        <button
          style={{ backgroundColor: "#0e8c2b" }}
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : filteredProducts.length === 0 ? (
        <EmptyState message="No popular products available" />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Sold</th>
                <th className="p-4">Price</th>
                <th className="p-4">Gender</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={index}
                  className={`border-b-2 border-black items-center content-center ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                  }`}
                >
                  <td className="p-4 flex justify-center">
                    <img
                      src={product.image}
                      alt={product.prodName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </td>
                  <td className="p-4">{product.prodName}</td>
                  <td className="p-4">{product.prodDescription}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">{product.sold}</td>
                  <td className="p-4">RWF {product.price}</td>
                  <td className="p-4">{product.gender}</td>
                  <td className="p-4">
                    <div className="flex space-x-5 items-center justify-center">
                      <button onClick={() => handleEdit(product)}>
                        <FaEdit className="text-blue-500 hover:text-blue-700" />
                      </button>
                      <button onClick={() => handleDelete(product.prodId)}>
                        <FaTrashAlt className="text-red-500 hover:text-red-700" />
                      </button>
                      <button
                        onClick={() =>
                          togglePopularity(product.prodId, !product.popular)
                        }
                      >
                        {product.popular ? (
                          <CgMathMinus
                            className="text-yellow-500 hover:text-yellow-700"
                            title="Remove from popular products"
                          />
                        ) : (
                          <CgAdd
                            className="text-green-500 hover:text-green-700"
                            title="Add to popular products"
                          />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <ProductModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          refreshProducts={fetchProducts}
          categories={categories}
          genders={genders}
        />
      )}
    </div>
  );
}

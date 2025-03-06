/* eslint-disable react/prop-types */
import { memo, useState, useEffect } from "react";
import { Modal, Input, Empty, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProductDisplay from "./ProductDisplay";
import { Search, Filter, X } from "lucide-react";

const SearchComponent = memo(({ 
  isModalVisible, 
  setIsModalVisible,
  searchResults = [],
  loading,
  handleSearch,
  handleAddToCart,
  handleDeleteItem,
  localCart = [],
  localFav = [],
  theme
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredResults, setFilteredResults] = useState(searchResults);
  const [showFilters, setShowFilters] = useState(false);

  // Categories derived from products
  const categories = ["all", ...new Set(searchResults.map(product => product.category))];

  useEffect(() => {
    let results = searchResults;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      results = results.filter(product => product.category === selectedCategory);
    }

    setFilteredResults(results);
  }, [searchTerm, selectedCategory, searchResults]);

  const handleInputChange = (value) => {
    setSearchTerm(value);
    handleSearch(value);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <Modal
      title={null}
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        setSearchTerm("");
        setSelectedCategory("all");
      }}
      width="90vw"
      className="search-modal"
      footer={null}
      centered
    >
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="p-4"
      >
        {/* Search Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Input
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              className="py-3 pl-12 pr-4 text-lg rounded-xl border-2 border-gray-200 focus:border-green-500 transition-all duration-300"
              suffix={
                searchTerm && (
                  <X 
                    className="cursor-pointer text-gray-400 hover:text-gray-600" 
                    onClick={() => handleInputChange("")}
                  />
                )
              }
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-300"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-600 hover:bg-green-50"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <div className="relative min-h-[300px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spin size="large" />
            </div>
          ) : filteredResults.length > 0 ? (
            <ProductDisplay
              products={filteredResults}
              loading={loading}
              handleAddToCart={handleAddToCart}
              handleDeleteItem={handleDeleteItem}
              localCart={localCart}
              localFav={localFav}
              theme={theme}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center">
                    <p className="text-lg text-gray-600 mb-2">No products found</p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search or filters to find what you're looking for
                    </p>
                  </div>
                }
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Custom Styles */}
      <style jsx global>{`
        .search-modal .ant-modal-content {
          border-radius: 1rem;
          overflow: hidden;
        }

        .search-modal .ant-modal-body {
          padding: 1.5rem;
        }

        .search-modal .ant-input-affix-wrapper {
          border-radius: 0.75rem;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .search-modal .ant-input-affix-wrapper:hover,
        .search-modal .ant-input-affix-wrapper-focused {
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
        }

        .search-modal .ant-spin-dot i {
          background-color: #10b981;
        }

        .search-modal .ant-empty {
          color: #6b7280;
        }

        @media (max-width: 640px) {
          .search-modal .ant-modal-content {
            margin: 0;
            border-radius: 0;
          }
        }
      `}</style>
    </Modal>
  );
});

SearchComponent.displayName = "SearchComponent";

export default SearchComponent;

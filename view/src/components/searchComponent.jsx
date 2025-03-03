/* eslint-disable react/prop-types */
import { memo } from "react";
import { Modal, Input } from "antd";
import { useNavigate } from "react-router-dom";
import ProductDisplay from "./ProductDisplay";

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

  return (
    <Modal
      title="Search our products"
      open={isModalVisible}
      onOk={() => setIsModalVisible(false)}
      onCancel={() => setIsModalVisible(false)}
      width={1000}
      footer={null}
    >
      <Input
        placeholder="Search products..."
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-4"
      />

      <ProductDisplay
        products={searchResults}
        loading={loading}
        handleAddToCart={handleAddToCart}
        handleDeleteItem={handleDeleteItem}
        localCart={localCart}
        localFav={localFav}
        theme={theme}
      />
    </Modal>
  );
});

SearchComponent.displayName = "SearchComponent";

export default SearchComponent;

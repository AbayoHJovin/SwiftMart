/* eslint-disable react/prop-types */
import { Modal, Input } from "antd";
import { useState } from "react";
import useProducts from "../../constants/products";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";

const Search = ({ isModalVisible, setIsModalVisible }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { products } = useProducts();
  const navigate = useNavigate();
  const handleSearch = (term) => {
    const results = products.filter((item) =>
      item.name.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(results);
  };
  function showProduct(itemId) {
    navigate(`/product/${itemId}`);
    setIsModalVisible(false);
  }

  return (
    <div>
      <Modal
        title="Search our products"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
        />

        <div style={{ marginTop: "16px" }}>
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div
                onClick={() => showProduct(result._id)}
                key={result._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
                className="hover:bg-gray-200 p-5 cursor-pointer"
              >
                <img
                  src={`data:${result.image.contentType};base64,${Buffer.from(
                    result.image.data
                  ).toString("base64")}`}
                  alt={result.name}
                  style={{ width: "50px", height: "50px", marginRight: "10px" }}
                />
                <div>
                  <p style={{ margin: 0 }}>{result.name}</p>
                  <p style={{ margin: 0, fontWeight: "bold" }}>
                    RWF {result.price}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Search;

import './App.css'
import { useState, useEffect } from 'react';
import ProductList from './ProductList';
import CategoryFilter from './CategoryFilter';
function App() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
useEffect(() => {
  const ngrokUrl = "https://ecom-product-api-er9n.onrender.com";
  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "any-value"  
  };

  // Fetch Products
  fetch(`${ngrokUrl}/api/products`, { headers })
    .then((response) => {
      if (!response.ok) throw new Error("Check your Ngrok status!");
      return response.json();
    })
    .then((data) => setProducts(data))
    .catch((error) => console.error("Error fetching products:", error));

  // Fetch Categories
  fetch(`${ngrokUrl}/api/categories`, { headers })
    .then((response) => response.json())
    .then((data) => setCategories(data))
    .catch((error) => console.error("Error fetching categories:", error));
}, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };


  const handleCategorySelect = (categoryId) => {
  if (categoryId === "") {
    setSelectedCategory(null);
  } else {
    setSelectedCategory(Number(categoryId));
  }
};

// const filteredProducts = products.filter((product) => {
//   if (!selectedCategory) return true;
  

//   return Number(product.category?.id) === Number(selectedCategory);
// });
    
const filteredProducts = products
  .filter((product) => {
    // Correctly accessing the nested category ID
    return !selectedCategory || Number(product.category?.id) === Number(selectedCategory);
  })
  .filter((product) => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase());
  })
  .sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });
  

    return (
      <div className='container'>
        <h1 className='my-4'>Product Catalog</h1>
        <div className='row align-item-center mb-4'>
          <div className='col-md-3 col-sm-12 mb-2'>
            <CategoryFilter categories={categories} onSelect={handleCategorySelect} />


          </div>

          <div className='col-md-5 com-sm-12 mb-2'>
            <input type="text" className='form-control' placeholder='search for products' onChange={handleSearchChange} />
          </div>
          <div className='col-md-4 col-sm-12 mb-2'>
            <select className='form-control' onChange={handleSortChange} >
              <option value="asc">Sort by Price: Low to High</option>
              <option value="desc">Sort by Price: High to Low</option>
            </select>


          </div>
        </div>
        <div>
          {filteredProducts.length ? (
            //Display products
            <ProductList products={filteredProducts} />
          ) : (
            <p>
              No Products Found
            </p>
          )
          }
        </div>


      </div>
    )
  }
  export default App



function SearchBar() {
  return (<div className="search-bar">
    <div className="search">
      <input type="text" placeholder="Search..." />
    </div>
    <div className="filter">
      <label>
        <input type="checkbox" />
        Only show products in stock
      </label>
    </div>
  </div>)
}


export default function Products({ onAddToCart }) {
  const products = [
    { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
    { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
    { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
    { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
    { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
    { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
  ]
  return (
    <div className="products">
      <SearchBar />
      {products.map((product) => (
        <div key={product.id} className="product">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>{product.price}</p>
          <button onClick={() => onAddToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
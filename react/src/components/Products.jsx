
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
function ProductRow({ ps, category }) {
  const temp = ps.filter(p => p.category === category);
  if (temp.length === 0) return null; // If no products in this category, skip rendering
  return (
    <>
      <tr key={category}>
        <td colSpan="2">{category}</td>
      </tr>
      {temp.map((p) => (
        <tr key={p.name}>
          <td>{p.name}</td>
          <td>{p.price}</td>
        </tr>
      ))}
    </>
  );
}

function ProductTable({ products }) {
  console.log(products);
  const categorys = [...new Set(products.map(product => product.category))];
  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {categorys.map((category) => (
          <ProductRow key={category} ps={products} category={category} />
        ))}
      </tbody>
    </table>
  );
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
      <ProductTable products={products} />
    </div>
  );
}
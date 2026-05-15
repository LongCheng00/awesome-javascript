import React, { useState } from 'react'

function SearchBar({ filterText, inStockOnly, onFilterTextChange, onInStockOnlyChange }) {
  return (<form>
    <input type="text" placeholder="Search..." value={filterText} onChange={(e) => onFilterTextChange(e.target.value)} />
    <label>
      <input type="checkbox" checked={inStockOnly} onChange={(e) => onInStockOnlyChange(e.target.checked)} />
      {' '}Only show products in stock
    </label>
  </form>)
}
function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}> {product.name}</span>
  return (
    <tr key={product.name}>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr >
  )
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = []
  let lastCategory = null
  products.forEach((p) => {
    if (p.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      return;
    }
    if (inStockOnly && !p.stocked) {
      return;
    }
    if (p.category !== lastCategory) {
      rows.push(<tr key={p.category}>
        <td colSpan="2">{p.category}</td>
      </tr>)
    }
    rows.push(<ProductRow key={p.name} product={p} />)
    lastCategory = p.category
  }
  )
  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {rows}
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
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  return (
    <div className="products">
      <SearchBar filterText={filterText} inStockOnly={inStockOnly} onFilterTextChange={setFilterText} onInStockOnlyChange={setInStockOnly} />
      <ProductTable products={products} filterText={filterText} inStockOnly={inStockOnly} />
    </div>
  );
}
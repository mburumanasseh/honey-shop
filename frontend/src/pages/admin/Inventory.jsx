import { useMemo, useState } from "react";
import "./Inventory.css";

const inventory = [
  {
    id: 1,
    name: "Pure Forest Honey",
    sku: "HNY-001",
    stock: 42,
    sold: 58,
    reorderLevel: 15,
    price: 850,
  },
  {
    id: 2,
    name: "Acacia Honey",
    sku: "HNY-002",
    stock: 18,
    sold: 37,
    reorderLevel: 20,
    price: 1200,
  },
  {
    id: 3,
    name: "Wildflower Honey",
    sku: "HNY-003",
    stock: 7,
    sold: 73,
    reorderLevel: 15,
    price: 950,
  },
  {
    id: 4,
    name: "Raw Organic Honey",
    sku: "HNY-004",
    stock: 0,
    sold: 45,
    reorderLevel: 10,
    price: 1500,
  },
  {
    id: 5,
    name: "Mountain Honey",
    sku: "HNY-005",
    stock: 31,
    sold: 29,
    reorderLevel: 10,
    price: 1100,
  },
  {
    id: 6,
    name: "Eucalyptus Honey",
    sku: "HNY-006",
    stock: 12,
    sold: 41,
    reorderLevel: 15,
    price: 900,
  },
];

function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInventory = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return inventory;
    }

    return inventory.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search)
    );
  }, [searchTerm]);

  const getStockStatus = (stock, reorderLevel) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        className: "out-of-stock",
      };
    }

    if (stock <= reorderLevel) {
      return {
        label: "Low Stock",
        className: "low-stock",
      };
    }

    return {
      label: "In Stock",
      className: "in-stock",
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalProducts = inventory.length;

  const lowStockProducts = inventory.filter(
    (product) =>
      product.stock > 0 && product.stock <= product.reorderLevel
  ).length;

  const outOfStockProducts = inventory.filter(
    (product) => product.stock === 0
  ).length;

  const totalUnits = inventory.reduce(
    (total, product) => total + product.stock,
    0
  );

  return (
    <div className="inventory-page">
      {/* Header */}
      <div className="inventory-header">
        <div>
          <h1>Inventory</h1>
          <p>Monitor your honey stock and inventory levels.</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="inventory-summary">
        <div className="inventory-summary-card">
          <span className="summary-label">Products</span>
          <strong>{totalProducts}</strong>
        </div>

        <div className="inventory-summary-card">
          <span className="summary-label">Total Units</span>
          <strong>{totalUnits}</strong>
        </div>

        <div className="inventory-summary-card warning">
          <span className="summary-label">Low Stock</span>
          <strong>{lowStockProducts}</strong>
        </div>

        <div className="inventory-summary-card danger">
          <span className="summary-label">Out of Stock</span>
          <strong>{outOfStockProducts}</strong>
        </div>
      </div>

      {/* Search */}
      <div className="inventory-toolbar">
        <div className="inventory-search">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search products or SKU..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      {/* Inventory table */}
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Units Sold</th>
              <th>Reorder Level</th>
              <th>Stock Value</th>
            </tr>
          </thead>

          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((product) => {
                const status = getStockStatus(
                  product.stock,
                  product.reorderLevel
                );

                return (
                  <tr key={product.id}>
                    <td>
                      <div className="inventory-product">
                        <div className="inventory-product-icon">🍯</div>

                        <span>{product.name}</span>
                      </div>
                    </td>

                    <td className="sku">{product.sku}</td>

                    <td>
                      <strong>{product.stock}</strong>
                    </td>

                    <td>
                      <span
                        className={`stock-status ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    <td>{product.sold}</td>

                    <td>{product.reorderLevel}</td>

                    <td className="stock-value">
                      {formatCurrency(product.stock * product.price)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="no-inventory">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
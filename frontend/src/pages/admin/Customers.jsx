import { useMemo, useState } from "react";
import "./Customers.css";

const customers = [
  {
    id: 1,
    name: "Amina Wanjiku",
    phone: "+254 712 345 678",
    email: "amina@example.com",
    orders: 8,
    totalSpent: 12500,
    registered: "12 Jan 2026",
  },
  {
    id: 2,
    name: "Brian Mwangi",
    phone: "+254 723 456 789",
    email: "brian@example.com",
    orders: 5,
    totalSpent: 7800,
    registered: "28 Jan 2026",
  },
  {
    id: 3,
    name: "Grace Njeri",
    phone: "+254 734 567 890",
    email: "grace@example.com",
    orders: 12,
    totalSpent: 18600,
    registered: "03 Feb 2026",
  },
  {
    id: 4,
    name: "Kevin Otieno",
    phone: "+254 745 678 901",
    email: "kevin@example.com",
    orders: 3,
    totalSpent: 4200,
    registered: "17 Feb 2026",
  },
  {
    id: 5,
    name: "Mary Atieno",
    phone: "+254 756 789 012",
    email: "mary@example.com",
    orders: 6,
    totalSpent: 9400,
    registered: "25 Feb 2026",
  },
];

function Customers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return customers;

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.phone.toLowerCase().includes(search)
    );
  }, [searchTerm]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="customers-page">
      <div className="customers-header">
        <div>
          <h1>Customers</h1>
          <p>Manage and view your registered customers.</p>
        </div>

        <div className="customer-count">
          <span>{customers.length}</span>
          <small>Total Customers</small>
        </div>
      </div>

      <div className="customers-toolbar">
        <div className="customer-search">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      <div className="customers-table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Registered</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-info">
                      <div className="customer-avatar">
                        {customer.name.charAt(0)}
                      </div>

                      <span>{customer.name}</span>
                    </div>
                  </td>

                  <td>{customer.phone}</td>

                  <td>{customer.email}</td>

                  <td>
                    <span className="orders-count">
                      {customer.orders}
                    </span>
                  </td>

                  <td className="total-spent">
                    {formatCurrency(customer.totalSpent)}
                  </td>

                  <td>{customer.registered}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-customers">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
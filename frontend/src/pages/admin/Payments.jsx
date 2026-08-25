import './Payments.css'

function Payments() {
  return (
    <div className="admin-payments">
      <div className="admin-payments__header">
        <div>
          <span className="admin-payments__eyebrow">
            Store Management
          </span>

          <h1>Payments</h1>

          <p>
            Monitor customer payments and transaction activity.
          </p>
        </div>
      </div>

      <div className="admin-payments__summary">
        <div className="admin-payments__card">
          <span>Total Payments</span>
          <strong>128</strong>
        </div>

        <div className="admin-payments__card">
          <span>Completed</span>
          <strong>114</strong>
        </div>

        <div className="admin-payments__card">
          <span>Pending</span>
          <strong>9</strong>
        </div>

        <div className="admin-payments__card">
          <span>Failed</span>
          <strong>5</strong>
        </div>
      </div>

      <div className="admin-payments__table-wrapper">
        <table className="admin-payments__table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>#PAY-1001</td>
              <td>Amina Wanjiku</td>
              <td>KSh 2,500</td>
              <td>M-Pesa</td>
              <td>
                <span className="payment-status payment-status--completed">
                  Completed
                </span>
              </td>
              <td>22 Aug 2026</td>
            </tr>

            <tr>
              <td>#PAY-1002</td>
              <td>Brian Mwangi</td>
              <td>KSh 1,800</td>
              <td>M-Pesa</td>
              <td>
                <span className="payment-status payment-status--completed">
                  Completed
                </span>
              </td>
              <td>21 Aug 2026</td>
            </tr>

            <tr>
              <td>#PAY-1003</td>
              <td>Grace Njeri</td>
              <td>KSh 3,200</td>
              <td>M-Pesa</td>
              <td>
                <span className="payment-status payment-status--pending">
                  Pending
                </span>
              </td>
              <td>21 Aug 2026</td>
            </tr>

            <tr>
              <td>#PAY-1004</td>
              <td>Kevin Otieno</td>
              <td>KSh 950</td>
              <td>M-Pesa</td>
              <td>
                <span className="payment-status payment-status--failed">
                  Failed
                </span>
              </td>
              <td>20 Aug 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Payments
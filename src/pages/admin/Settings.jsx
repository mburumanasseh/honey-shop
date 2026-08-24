import { useState } from 'react'
import './Settings.css'

function Settings() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Honey Shop',
    email: 'info@honeyshop.com',
    phone: '+254 700 000 000',
    currency: 'KES',
    notifications: true,
    lowStockAlerts: true,
  })

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setStoreSettings((currentSettings) => ({
      ...currentSettings,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    console.log('Store settings:', storeSettings)

    alert('Settings saved successfully.')
  }

  return (
    <div className="admin-settings">
      <div className="admin-settings__header">
        <div>
          <span className="admin-settings__eyebrow">
            Store Management
          </span>

          <h1>Settings</h1>

          <p>
            Manage your store information and preferences.
          </p>
        </div>
      </div>

      <form
        className="admin-settings__form"
        onSubmit={handleSubmit}
      >
        <section className="admin-settings__card">
          <div className="admin-settings__card-header">
            <span>Store Information</span>

            <h2>General Settings</h2>

            <p>
              Update the basic information used throughout
              your store.
            </p>
          </div>

          <div className="admin-settings__fields">
            <div className="admin-settings__field">
              <label htmlFor="storeName">
                Store Name
              </label>

              <input
                id="storeName"
                name="storeName"
                type="text"
                value={storeSettings.storeName}
                onChange={handleChange}
              />
            </div>

            <div className="admin-settings__field">
              <label htmlFor="email">
                Store Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={storeSettings.email}
                onChange={handleChange}
              />
            </div>

            <div className="admin-settings__field">
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={storeSettings.phone}
                onChange={handleChange}
              />
            </div>

            <div className="admin-settings__field">
              <label htmlFor="currency">
                Currency
              </label>

              <select
                id="currency"
                name="currency"
                value={storeSettings.currency}
                onChange={handleChange}
              >
                <option value="KES">
                  KES - Kenyan Shilling
                </option>

                <option value="USD">
                  USD - US Dollar
                </option>
              </select>
            </div>
          </div>
        </section>

        <section className="admin-settings__card">
          <div className="admin-settings__card-header">
            <span>Notifications</span>

            <h2>Store Alerts</h2>

            <p>
              Choose which alerts you want to receive.
            </p>
          </div>

          <div className="admin-settings__options">
            <label className="admin-settings__toggle">
              <input
                type="checkbox"
                name="notifications"
                checked={storeSettings.notifications}
                onChange={handleChange}
              />

              <span>
                <strong>Order Notifications</strong>

                <small>
                  Receive notifications when a new order
                  is placed.
                </small>
              </span>
            </label>

            <label className="admin-settings__toggle">
              <input
                type="checkbox"
                name="lowStockAlerts"
                checked={storeSettings.lowStockAlerts}
                onChange={handleChange}
              />

              <span>
                <strong>Low Stock Alerts</strong>

                <small>
                  Receive notifications when products are
                  running low.
                </small>
              </span>
            </label>
          </div>
        </section>

        <div className="admin-settings__actions">
          <button
            type="submit"
            className="admin-settings__save"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}

export default Settings
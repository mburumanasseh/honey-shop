import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/useCart'
import calculateDeliveryFee from '../../services/deliveryService'
import MpesaPayment from '../../components/checkout/MpesaPayment'
import './Checkout.css'

function Checkout() {
  const { cartItems, cartSubtotal } = useCart()

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    county: '',
    town: '',
    address: '',
  })

  const [mpesaPhone, setMpesaPhone] = useState('')
  const [errors, setErrors] = useState({})

  const deliveryFee = calculateDeliveryFee(formData.town)
  const total = cartSubtotal + deliveryFee

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number.'
    }

    if (!formData.county.trim()) {
      newErrors.county = 'Please enter your county.'
    }

    if (!formData.town.trim()) {
      newErrors.town = 'Please enter your town or area.'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Please enter your delivery address.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    console.log('Checkout information:', {
      ...formData,
      mpesaPhone,
      cartItems,
      subtotal: cartSubtotal,
      deliveryFee,
      total,
    })
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout">
        <div className="container checkout__empty">
          <h1>Your Cart Is Empty</h1>

          <p>
            Add some honey to your cart before proceeding
            to checkout.
          </p>

          <Link
            to="/shop"
            className="checkout__shop-button"
          >
            Browse Honey
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="checkout">
      <div className="container">
        <div className="checkout__header">
          <span>Almost There</span>

          <h1>Checkout</h1>

          <p>
            Tell us where you'd like your honey delivered.
          </p>
        </div>

        <form
          className="checkout__content"
          onSubmit={handleSubmit}
        >
          <section className="checkout__form">
            <div className="checkout__card">
              <h2>Delivery Information</h2>

              <div className="checkout__fields">
                <div className="checkout__field">
                  <label htmlFor="fullName">
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. John Kamau"
                  />

                  {errors.fullName && (
                    <small>{errors.fullName}</small>
                  )}
                </div>

                <div className="checkout__field">
                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 0712345678"
                  />

                  {errors.phone && (
                    <small>{errors.phone}</small>
                  )}
                </div>

                <div className="checkout__field">
                  <label htmlFor="county">
                    County
                  </label>

                  <input
                    id="county"
                    name="county"
                    type="text"
                    value={formData.county}
                    onChange={handleChange}
                    placeholder="e.g. Nairobi"
                  />

                  {errors.county && (
                    <small>{errors.county}</small>
                  )}
                </div>

                <div className="checkout__field">
                  <label htmlFor="town">
                    Town / Area
                  </label>

                  <input
                    id="town"
                    name="town"
                    type="text"
                    value={formData.town}
                    onChange={handleChange}
                    placeholder="e.g. Westlands"
                  />

                  {errors.town && (
                    <small>{errors.town}</small>
                  )}
                </div>

                <div className="checkout__field checkout__field--full">
                  <label htmlFor="address">
                    Delivery Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your delivery address"
                    rows="4"
                  />

                  {errors.address && (
                    <small>{errors.address}</small>
                  )}
                </div>
              </div>
            </div>
          </section>

          <aside className="checkout__summary">
            <div className="checkout__card">
              <h2>Order Summary</h2>

              <div className="checkout__items">
                {cartItems.map((item) => (
                  <div
                    className="checkout__item"
                    key={item.id}
                  >
                    <div>
                      <strong>{item.name}</strong>

                      <span>
                        {item.quantity} × KSh{' '}
                        {item.price.toLocaleString()}
                      </span>
                    </div>

                    <strong>
                      KSh{' '}
                      {(
                        item.price * item.quantity
                      ).toLocaleString()}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="checkout__summary-row">
                <span>Subtotal</span>

                <strong>
                  KSh {cartSubtotal.toLocaleString()}
                </strong>
              </div>

              <div className="checkout__summary-row">
                <span>Delivery</span>

                <strong>
                  {deliveryFee === 0
                    ? 'Enter location'
                    : `KSh ${deliveryFee.toLocaleString()}`}
                </strong>
              </div>

              <div className="checkout__summary-total">
                <span>Total</span>

                <strong>
                  KSh {total.toLocaleString()}
                </strong>
              </div>

              <MpesaPayment
                amount={total}
                phone={mpesaPhone}
                onPhoneChange={setMpesaPhone}
              />

              <Link
                to="/cart"
                className="checkout__back"
              >
                ← Back to Cart
              </Link>
            </div>
          </aside>
        </form>
      </div>
    </main>
  )
}

export default Checkout
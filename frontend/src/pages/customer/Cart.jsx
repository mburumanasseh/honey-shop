import { Link } from 'react-router-dom'
import { useCart } from '../../context/useCart'
import './Cart.css'

function Cart() {
  const {
    cartItems,
    cartSubtotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart()

  if (cartItems.length === 0) {
    return (
      <main className="cart">
        <div className="container cart__empty">
          <h1>Your Cart</h1>

          <p>
            Your cart is currently empty. Discover something
            sweet from our collection.
          </p>

          <Link to="/shop" className="cart__shop-button">
            Continue Shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="cart">
      <div className="container">
        <div className="cart__header">
          <span>Your Selection</span>

          <div className="cart__header-row">
            <h1>Your Cart</h1>

            <button
              type="button"
              className="cart__clear-button"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>

          <p>
            Review your honey selection before proceeding to
            checkout.
          </p>
        </div>

        <div className="cart__content">
          <div className="cart__items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item__image">
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                <div className="cart-item__details">
                  <span>{item.size}</span>

                  <h2>{item.name}</h2>

                  <p>
                    KSh {item.price.toLocaleString()}
                  </p>

                  <div className="cart-item__quantity">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1,
                        )
                      }
                      disabled={item.quantity === 1}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1,
                        )
                      }
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item__total">
                  <strong>
                    KSh{' '}
                    {(
                      item.price * item.quantity
                    ).toLocaleString()}
                  </strong>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart__summary">
            <h2>Order Summary</h2>

            <div className="cart__summary-row">
              <span>Subtotal</span>

              <strong>
                KSh {cartSubtotal.toLocaleString()}
              </strong>
            </div>

            <div className="cart__summary-row">
              <span>Delivery</span>

              <span>Calculated at checkout</span>
            </div>

            <div className="cart__summary-total">
              <span>Total</span>

              <strong>
                KSh {cartSubtotal.toLocaleString()}
              </strong>
            </div>

            <Link
              to="/checkout"
              className="cart__checkout-button"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/shop"
              className="cart__continue"
            >
              ← Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Cart
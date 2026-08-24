import { useState } from 'react'
import './MpesaPayment.css'

function MpesaPayment({ amount, phone, onPhoneChange }) {
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const validatePhone = () => {
    const cleanedPhone = phone.replace(/\s+/g, '')

    if (!cleanedPhone) {
      setError('Please enter your M-Pesa phone number.')
      return false
    }

    const isValid =
      /^(07\d{8}|01\d{8}|\+2547\d{8}|\+2541\d{8}|2547\d{8}|2541\d{8})$/.test(
        cleanedPhone,
      )

    if (!isValid) {
      setError(
        'Please enter a valid Kenyan phone number.',
      )
      return false
    }

    setError('')
    return true
  }

  const handlePayment = () => {
    if (!validatePhone()) {
      return
    }

    setIsProcessing(true)

    console.log('M-Pesa payment request:', {
      amount,
      phone,
    })

    /*
      The real M-Pesa STK Push request
      will be connected to the Flask backend here.

      We deliberately do not fake a successful payment.
    */
  }

  return (
    <section className="mpesa-payment">
      <div className="mpesa-payment__header">
        <div className="mpesa-payment__icon">
          M
        </div>

        <div>
          <h2>Pay with M-Pesa</h2>

          <p>
            You will receive an M-Pesa prompt on your phone.
          </p>
        </div>
      </div>

      <div className="mpesa-payment__amount">
        <span>Amount to Pay</span>

        <strong>
          KSh {amount.toLocaleString()}
        </strong>
      </div>

      <div className="mpesa-payment__field">
        <label htmlFor="mpesa-phone">
          M-Pesa Phone Number
        </label>

        <input
          id="mpesa-phone"
          type="tel"
          value={phone}
          onChange={(event) => {
            onPhoneChange(event.target.value)
            setError('')
          }}
          onBlur={validatePhone}
          placeholder="e.g. 0712345678"
          disabled={isProcessing}
        />

        {error && (
          <small>{error}</small>
        )}
      </div>

      <button
        type="button"
        className="mpesa-payment__button"
        onClick={handlePayment}
        disabled={isProcessing}
      >
        {isProcessing
          ? 'Waiting for Payment...'
          : 'Pay with M-Pesa'}
      </button>

      <p className="mpesa-payment__notice">
        Make sure your phone is nearby. You will be asked
        to enter your M-Pesa PIN on your phone.
      </p>
    </section>
  )
}

export default MpesaPayment
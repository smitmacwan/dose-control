import React from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';

const Donations = () => {
  const stripe = useStripe();

  const handleDonation = async (amount) => {
    if (!stripe) return;

    try {
      // Call the backend to create a checkout session
      const response = await axios.post('http://localhost:4000/api/checkout', { amount });
      const { id } = response.data; // Get session ID from the response

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: id,
      });

      if (error) {
        console.error('Error redirecting to Stripe checkout:', error.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Support Our Cause</h2>
      <p className="text-center">Your donation helps us continue our mission. Choose an amount:</p>

      <div className="d-flex justify-content-center">
        <button className="btn btn-primary mx-2" onClick={() => handleDonation(100)}>
          $1
        </button>
        <button className="btn btn-primary mx-2" onClick={() => handleDonation(200)}>
          $2
        </button>
        <button className="btn btn-primary mx-2" onClick={() => handleDonation(300)}>
          $3
        </button>
      </div>
    </div>
  );
};

export default Donations;

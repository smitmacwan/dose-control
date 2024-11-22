import React, { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Donations = () => {
  const stripe = useStripe();
  const navigate = useNavigate(); // Initialize navigate hook
  const [customAmount, setCustomAmount] = useState('');
  const [userName, setUserName] = useState(() => sessionStorage.getItem('userName') || null);
  const [showModal, setShowModal] = useState(false);

  const handleDonation = async (amount) => {
    if (!userName) {
      // If user is not logged in, show the modal
      setShowModal(true);
      return;
    }

    if (!stripe) return;

    try {
      localStorage.setItem('donationAmount', amount / 100); // Store amount for receipt
      localStorage.setItem('donorName', userName);
      const response = await axios.post('http://localhost:4000/api/checkout', { amount });
      const { id } = response.data;

      const { error } = await stripe.redirectToCheckout({ sessionId: id });
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
      <p className="text-center">Your donation helps us continue our mission. Choose or enter an amount:</p>

      <div className="text-center">
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Enter amount"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          style={{ maxWidth: '200px', margin: '0 auto' }}
        />
        <button
          className="btn btn-primary"
          onClick={() => handleDonation(parseInt(customAmount * 100))}
          disabled={!customAmount || isNaN(customAmount) || customAmount <= 0}
        >
          Donate Amount
        </button>
      </div>

      {/* Modal for Login Alert */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Required</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>You need to log in before making a donation. Please log in to continue.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowModal(false);
                    navigate('/login'); // Navigate to login page
                  }}
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donations;

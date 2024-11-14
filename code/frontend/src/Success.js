// Success.js
import React, { useEffect } from 'react';
import jsPDF from 'jspdf';

const Success = () => {
  useEffect(() => {
    const generatePDFReceipt = () => {
      const doc = new jsPDF();
      doc.text("Thank you for your donation!", 10, 10);
      doc.text("Donation Receipt", 10, 20);
      doc.text(`Amount: $${localStorage.getItem('donationAmount')}`, 10, 30);
      doc.text("Date: " + new Date().toLocaleDateString(), 10, 40);
      doc.save("Donation_Receipt.pdf");
    };
    generatePDFReceipt();
  }, []);

  return (
    <div className="container text-center my-5">
      <h2>Thank you for your donation!</h2>
      <p>A PDF receipt has been generated and downloaded.</p>
      <p>We've also sent a copy to your registered email address.</p>
    </div>
  );
};

export default Success;

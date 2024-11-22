// Success.js
import React, { useEffect } from 'react';
import jsPDF from 'jspdf';

const Success = () => {
  useEffect(() => {
    const generatePDFReceipt = () => {
      const doc = new jsPDF();

      // Logo settings
      const logoUrl = "/DoseControl_Logo_Transparent.png";
      const logoWidth = 40; // Adjust logo width
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoX = (pageWidth - logoWidth) / 2; // Center the logo

      const donorName = localStorage.getItem('donorName');
      const donationAmount = localStorage.getItem('donationAmount');
      const currentDate = new Date().toLocaleDateString();

      // Add Logo
      doc.addImage(logoUrl, 'PNG', logoX, 10, logoWidth, logoWidth); // Centered at top

      // Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Donation Receipt", pageWidth / 2, 60, { align: "center" });

      // Donation details
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Dear ${donorName},`, 10, 80);
      doc.text(
        `Thank you for your generous donation of $${donationAmount}. Your contribution is greatly appreciated and will help us continue our work.`,
        10,
        90,
        { maxWidth: 190 } // Wrap text within the page margins
      );

      // Additional info
      doc.text("Receipt Details:", 10, 120);
      doc.text(`Amount Donated: $${donationAmount}`, 10, 130);
      doc.text(`Date of Donation: ${currentDate}`, 10, 140);

      // Contact Details
      doc.setFont("helvetica", "italic");
      doc.text(
        "For any queries, please contact us at: support@charity.org",
        10,
        160
      );
      doc.text("Phone: +1 234 567 890", 10, 170);
      doc.text("Website: www.charity.org", 10, 180);

      // Footer
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Thank you once again for your support. Together, we can make a difference!",
        10,
        200,
        { maxWidth: 190 }
      );

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

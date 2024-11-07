import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Login';
import About from './About';
import './App.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Donations from './Donations.js';
import Success from './Success';
import Cancel from './Cancel';

const stripePromise = loadStripe('pk_test_51QIewlLcL7MzCv4NK4x6jPCbfCzTijpjGxJTrFdVxrQrCYPEGKf9CV8gxXCY14llvV2cGbEjfL9FdSBPCBO00tHT003Ncvyd4m');

const App = () => {
  const [drugName, setDrugName] = useState('');
  const [symptom, setSymptom] = useState('');
  const [drugInfo, setDrugInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [userName, setUserName] = useState(() => sessionStorage.getItem('userName') || null);

  const drugs = [
    "Acetaminophen", "Adalimumab", "Albuterol", "Alprazolam", "Amoxicillin", "Atorvastatin",
    "Azithromycin", "Budesonide", "Carvedilol", "Cetirizine", "Clopidogrel", "Diazepam",
    "Diclofenac", "Digoxin", "Doxycycline", "Duloxetine", "Enoxaparin", "Escitalopram",
    "Esomeprazole", "Fluoxetine", "Furosemide", "Gabapentin", "Hydrochlorothiazide",
    "Ibuprofen", "Insulin Glargine", "Lansoprazole", "Lisinopril", "Losartan", "Metformin",
    "Metoprolol", "Montelukast", "Naproxen", "Omeprazole", "Oxycodone", "Pantoprazole",
    "Paracetamol", "Prednisone", "Propranolol", "Rosuvastatin", "Sertraline", "Simvastatin",
    "Spironolactone", "Tamsulosin", "Tramadol", "Valacyclovir", "Venlafaxine", "Warfarin",
    "Zolpidem", "Zoledronic Acid"
  ];

  const symptoms = [
    "Pain", "Fever", "Cough", "Allergy", "Headache", "Diabetes", "Asthma", "Inflammation",
    "Depression", "Hypertension", "Anxiety", "Nausea", "Arthritis", "Insomnia", "Infection",
    "Skin Rash", "Heartburn", "Migraine", "Flu", "Chronic Pain"
  ];

  const fetchDrugData = async (query, isSymptom) => {
    if (!query.trim()) {
      setErrorMessage('Please select a valid option.');
      setDrugInfo(null);
      return;
    }

    setErrorMessage('');
    setDrugInfo(null);

    const searchQuery = isSymptom
      ? `https://api.fda.gov/drug/label.json?search=indications_and_usage:"${query}"&limit=1`
      : `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${query}"&limit=1`;

    try {
      const response = await fetch(searchQuery);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        setDrugInfo({
          "Indications and Usage": result.indications_and_usage,
          "Warnings": result.warnings,
          "Dosage and Administration": result.dosage_and_administration,
          "Purpose": result.purpose,
          "Active Ingredients": result.active_ingredient,
        });
      } else {
        setErrorMessage('No data found.');
      }
    } catch (error) {
      setErrorMessage('Error fetching data. Please try again.');
      console.error(error);
    }
  };

  useEffect(() => {
    if (drugName) fetchDrugData(drugName, false);
  }, [drugName]);

  useEffect(() => {
    if (symptom) fetchDrugData(symptom, true);
  }, [symptom]);

  const handleLoginSuccess = (name) => {
    setUserName(name);
    sessionStorage.setItem('userName', name);
  };

  const handleLogout = () => {
    setUserName(null);
    sessionStorage.removeItem('userName');
  };

  return (
    <Elements stripe={stripePromise}>
    <div className="container-fluid p-0">
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container">
          <a className="navbar-brand" href="#">
            <img src="/DoseControl_Logo_Transparent.png" alt="Logo" style={{ height: '60px' }} />
          </a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item"><a className="nav-link px-4" href="/">Home</a></li>
              {!userName ? (
                <li className="nav-item"><a className="nav-link px-4" href="/login">Login</a></li>
              ) : (
                <li className="nav-item">
                  <a className="nav-link px-4" href="#" onClick={handleLogout}>Logout</a>
                </li>
              )}
              <li className="nav-item"><a className="nav-link px-4" href="/about">About</a></li>
              <li className="nav-item"><a className="nav-link px-4" href="/donations">Donations</a></li>
            </ul>
            <span className="navbar-text ml-auto px-4">
              {userName ? `Welcome, ${userName}!` : 'Welcome, Guest!'}
            </span>
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <div className="hero-section text-center text-white d-flex align-items-center justify-content-center">
                <div className="overlay">
                  <h1 className="display-4">Search for Drug Information</h1>

                  <div className="input-group my-3 w-50 mx-auto">
                    <span className="input-group-text">Select Drug</span>
                    <select
                      className="form-select"
                      value={drugName}
                      onChange={(e) => setDrugName(e.target.value)}
                    >
                      <option value="" disabled>Select a drug</option>
                      {drugs.map((drug) => (
                        <option key={drug} value={drug}>{drug}</option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group mb-3 w-50 mx-auto">
                    <span className="input-group-text">Select Symptom</span>
                    <select
                      className="form-select"
                      value={symptom}
                      onChange={(e) => setSymptom(e.target.value)}
                    >
                      <option value="" disabled>Select a symptom</option>
                      {symptoms.map((symp) => (
                        <option key={symp} value={symp}>{symp}</option>
                      ))}
                    </select>
                  </div>

                  {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                </div>
              </div>

              {drugInfo && (
                <div className="container my-5">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>Label</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(drugInfo).map(([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{Array.isArray(value) ? value.join(', ') : value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          }
        />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/about" element={<About />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/success" component={Success} />
        <Route path="/cancel" component={Cancel} />
      </Routes>

      <footer className="bg-light text-black py-4 text-center">
        <div className="container">
          <p>© 2024 Drug Info. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
    </Elements>
  );
};

export default App;

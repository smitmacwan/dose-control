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
  const [symptom, setSymptom] = useState('');
  const [drugInfo, setDrugInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedDrug, setSelectedDrug] = useState(''); 

  const [userName, setUserName] = useState(() => sessionStorage.getItem('userName') || null);

  const symptomToDrugs = {
    "Pain": ["Ibuprofen", "Acetaminophen", "Naproxen"],
    "Fever": ["Acetaminophen", "Ibuprofen", "Aspirin"], 
    "Cough": ["Dextromethorphan", "Guaifenesin", "Codeine"],
    "Allergy": ["Cetirizine", "Loratadine", "Diphenhydramine"],
    "Headache": ["Aspirin", "Acetaminophen", "Ibuprofen"],
    "Diabetes": ["Metformin", "Insulin Glargine", "Glipizide"],
    "Asthma": ["Albuterol", "Montelukast", "Fluticasone"],
    "Inflammation": ["Prednisone", "Ibuprofen", "Naproxen"],
    "Depression": ["Citalopram", "Sertraline", "Duloxetine"],
    "Hypertension": ["Lisinopril", "Amlodipine", "Losartan"],
    "Anxiety": ["Alprazolam", "Lorazepam", "Diazepam"],
    "Nausea": ["Ondansetron", "Metoclopramide", "Promethazine"],
    "Arthritis": ["Methotrexate", "Naproxen", "Prednisone"],
    "Insomnia": ["Zolpidem", "Eszopiclone", "Temazepam"],
    "Infection": ["Amoxicillin", "Clindamycin", "Azithromycin"],
    "Skin Rash": ["Hydrocortisone", "Diphenhydramine", "Clobetasol"],
    "Heartburn": ["Omeprazole", "Esomeprazole", "Ranitidine"],
    "Migraine": ["Sumatriptan", "Rizatriptan", "Amitriptyline"],
    "Flu": ["Oseltamivir", "Zanamivir", "Baloxavir"],
    "Chronic Pain": ["Tramadol", "Gabapentin", "Amitriptyline"]
  };

  const fetchDrugData = async (drug) => {
    if (!drug) return;

    setErrorMessage('');
    setDrugInfo(null);

    const searchQuery = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${drug}"&limit=1`;

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

  const handleSymptomSelect = (symptom) => {
    setSymptom(symptom);
    setDrugInfo(null);
    setErrorMessage('');
  };


  const handleDrugSelect = (drug) => {
    setSelectedDrug(drug); // Set the selected drug name
    fetchDrugData(drug);
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
                    <a className="nav-link px-4" href="#" onClick={() => { sessionStorage.removeItem('userName'); setUserName(null); }}>Logout</a>
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

                    <div className="input-group my-3 w-100 mx-auto">
                      <select
                        className="form-select"
                        value={symptom}
                        onChange={(e) => handleSymptomSelect(e.target.value)}
                      >
                        <option value="" disabled>Select a symptom</option>
                        {Object.keys(symptomToDrugs).map((symp) => (
                          <option key={symp} value={symp}>{symp}</option>
                        ))}
                      </select>
                    </div>

                      {/* Common Symptoms Section */}
                      <h5 className="mt-4">Common Symptoms:</h5>
                      <div className="d-flex flex-wrap justify-content-center mb-3">
                        {["Pain", "Fever", "Cough", "Allergy", "Headache", "Anxiety", "Nausea", "Insomnia"].map((commonSymptom) => (
                          <button
                            key={commonSymptom}
                            className="btn btn-primary m-1"
                            style={{
                              padding: '5px 15px',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              backgroundColor: '#007bff',
                              color: '#fff'
                            }}
                            onClick={() => handleSymptomSelect(commonSymptom)}
                          >
                            {commonSymptom}
                          </button>
                        ))}
                      </div>



                    {symptom && (
                      <>
                        <h2 className="mt-4 mb-3">For {symptom}, these are the recommended drugs:</h2>
                        <div className="d-flex justify-content-center flex-wrap">
                          {symptomToDrugs[symptom].map((drug) => (
                            <button
                              key={drug}
                              className="btn btn-primary m-2"
                              style={{
                                padding: '10px 20px',
                                borderRadius: '5px',
                                backgroundColor: '#007bff',
                                color: '#fff'
                              }}
                              onClick={() => handleDrugSelect(drug)}
                            >
                              {drug}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                  </div>
                </div>

                {drugInfo && (
                  <div className="container my-5">
                    <h3 className="mt-5 mb-3 text-center">Drug details: {selectedDrug}</h3>
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
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
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

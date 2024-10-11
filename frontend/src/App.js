import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Login';

const App = () => {
  const [drugName, setDrugName] = useState('');
  const [drugInfo, setDrugInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [userName, setUserName] = useState(() => {
    // Check for user name in sessionStorage
    return sessionStorage.getItem('userName') || null;
  });

  const drugs = [
    "Acetaminophen", "Adalimumab", "Albuterol", "Alprazolam", "Amoxicillin", "Atorvastatin", "Azithromycin",
    "Budesonide", "Carvedilol", "Cetirizine", "Clopidogrel", "Diazepam", "Diclofenac", "Digoxin", "Doxycycline",
    "Duloxetine", "Enoxaparin", "Escitalopram", "Esomeprazole", "Fluoxetine", "Furosemide", "Gabapentin",
    "Hydrochlorothiazide", "Ibuprofen", "Insulin Glargine", "Lansoprazole", "Lisinopril", "Losartan", "Metformin",
    "Metoprolol", "Montelukast", "Naproxen", "Omeprazole", "Oxycodone", "Pantoprazole", "Paracetamol", "Prednisone",
    "Propranolol", "Rosuvastatin", "Sertraline", "Simvastatin", "Spironolactone", "Tamsulosin", "Tramadol",
    "Valacyclovir", "Venlafaxine", "Warfarin", "Zolpidem", "Zoledronic Acid"
  ];

  const fetchDrugData = async () => {
    if (!drugName.trim()) {
      setErrorMessage('Please enter a drug name.');
      setDrugInfo(null);
      return;
    }

    setErrorMessage('');
    setDrugInfo(null);

    try {
      const response = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${drugName}"&limit=1`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setDrugInfo(data.results[0]);
      } else {
        setErrorMessage('No data found for this drug.');
      }
    } catch (error) {
      setErrorMessage('Error fetching data. Please try again.');
      console.error(error);
    }
  };

  useEffect(() => {
    if (drugName) {
      fetchDrugData();
    }
  }, [drugName]);

  const handleQuickSearch = (name) => {
    setDrugName(name);
  };

  const handleLoginSuccess = (name) => {
    setUserName(name);
    sessionStorage.setItem('userName', name); // Store user name in sessionStorage
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Drug Info</a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/login">Login</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="text-center mt-2">
        <span className="navbar-text">
          {userName ? `Hello ${userName}` : 'Hello there'}
        </span>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1 className="text-center m-4">Drug Information Search</h1>

              <div className="drug-list text-center">
                <span>Select Drug: </span>
                <select
                  className="form-select"
                  value={drugName}
                  onChange={(e) => handleQuickSearch(e.target.value)}
                  style={{ width: '50%', display: 'inline-block' }}
                >
                  <option value="" disabled>Select a drug</option>
                  {drugs.map((drug) => (
                    <option key={drug} value={drug}>
                      {drug}
                    </option>
                  ))}
                </select>
              </div>

              {errorMessage && <div id="noData" className="text-danger text-center mt-3">{errorMessage}</div>}

              {drugInfo && (
                <div id="tableContainer" className="mt-4">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Label</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(drugInfo).map((key) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>
                            {Array.isArray(drugInfo[key])
                              ? drugInfo[key].join(', ')
                              : typeof drugInfo[key] === 'object' && drugInfo[key] !== null
                              ? JSON.stringify(drugInfo[key], null, 2)
                              : drugInfo[key]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          }
        />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      </Routes>
    </div>
  );
};

export default App;

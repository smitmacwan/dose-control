import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Login';

const App = () => {
  const [drugName, setDrugName] = useState('');
  const [drugInfo, setDrugInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [userName, setUserName] = useState(() => sessionStorage.getItem('userName') || null);

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
    sessionStorage.setItem('userName', name);
  };

  return (
    <div className="container-fluid p-0">
  <nav className="navbar navbar-expand-lg bg-light">
    <div className="container">
      <a className="navbar-brand" href="#">
        <img
          src="/DoseControl_Logo_Transparent.png"
          alt="Logo"
          style={{ height: '60px' }}
        />
      </a>
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
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link px-4" href="/">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link px-4" href="/login">Login</a>
          </li>
        </ul>
        <span className="navbar-text ml-auto px-4">
          {userName ? `Welcome, ${userName}!` : 'Welcome, Guest!'}
        </span>
      </div>
    </div>
  </nav>

  <div className="container my-5">
    <Routes>
      <Route
        path="/"
        element={
          <div className="text-center">
            <h1 className="display-4 mb-5">Search for Drug Information</h1>

            <div className="input-group mb-3 w-50 mx-auto">
                  <span className="input-group-text">Select Drug</span>
                  <select
                    className="form-select"
                    value={drugName}
                    onChange={(e) => handleQuickSearch(e.target.value)}
                  >
                    <option value="" disabled>Select a drug</option>
                    {drugs.map((drug) => (
                      <option key={drug} value={drug}>
                        {drug}
                      </option>
                    ))}
                  </select>
                </div>

            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}

            {drugInfo && (
              <div className="table-responsive mt-4">
                <table className="table table-striped table-bordered">
                  <thead className="table-b">
                    <tr>
                      <th scope="col">Label</th>
                      <th scope="col">Value</th>
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
      <Route
        path="/login"
        element={<Login onLoginSuccess={handleLoginSuccess} />}
      />
    </Routes>
  </div>

  <footer className="bg-light text-black py-4 text-center">
    <div className="container">
      <p>© 2024 Drug Info. All Rights Reserved.</p>
    </div>
  </footer>
</div>

  );
};

export default App;

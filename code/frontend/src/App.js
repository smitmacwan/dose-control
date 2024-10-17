import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Login';

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
        setDrugInfo(data.results[0]);
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

  return (
    <div className="container-fluid p-0">
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container">
          <a className="navbar-brand" href="#">
            <img src="/DoseControl_Logo_Transparent.png" alt="Logo" style={{ height: '60px' }} />
          </a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item"><a className="nav-link px-4" href="/">Home</a></li>
              <li className="nav-item"><a className="nav-link px-4" href="/login">Login</a></li>
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

                {/* Drug Dropdown */}
                <div className="input-group mb-3 w-50 mx-auto">
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

                {/* Symptom Dropdown */}
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

                {/* Error Message */}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                {/* Drug Info Table */}
                {drugInfo && (
                  <div className="table-responsive mt-4">
                    <table className="table table-striped table-bordered">
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
                                : typeof drugInfo[key] === 'object'
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

      <footer className="bg-light text-black py-4 text-center">
        <div className="container">
          <p>© 2024 Drug Info. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import axios from 'axios';  // 1. Import axios
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [links, setLinks] = useState(['']);
  const [guestCount, setGuestCount] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [result, setResult] = useState('');  // 1. State to store the result from the scraper


  const addLinkInput = () => {
    setLinks([...links, '']);
  }

  const removeLinkInput = (index) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  }

  const updateLink = (index, value) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  }

  const incrementGuests = () => {
    setGuestCount(guestCount + 1);
  }

  const decrementGuests = () => {
    if (guestCount > 1) {
      setGuestCount(guestCount - 1);
    }}

  const handleRun = async () => {
    try {
        const payload = {
            links: links,
            startDate: startDate.toISOString(),  // Convert date to string format
            endDate: endDate.toISOString(),
            guestCount: guestCount
        };
        const response = await axios.post('http://127.0.0.1:5000/run-scraper', payload);
        setResult(response.data.result);
    } catch (error) {
        console.error("Error running scraper:", error);
      }
  }
  

  const cuteStyle = {
    padding: "10px 20px",
    margin: "5px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)"
  };

  return (
    <div className="App" 
         style={{ 
           fontFamily: 'Arial', 
           backgroundColor: '#f4f6f8', 
           height: '100vh',
           display: 'flex',
           flexDirection: 'column',
           justifyContent: 'center',
           alignItems: 'center'
         }}
    >
      <h2 style={{ color: '#333', marginBottom: '20px' }}> Airbnb Link Collector</h2>

      {links.map((link, index) => (
        <div key={index} style={{ ...cuteStyle, display: 'flex', alignItems: 'center' }}>
          <input 
            type="text" 
            value={link} 
            onChange={e => updateLink(index, e.target.value)} 
            placeholder="Insert Airbnb link..."
            style={{ width: '80%', padding: '8px', border: 'none', outline: 'none' }}
          />
          <button onClick={() => removeLinkInput(index)} style={{ ...cuteStyle, backgroundColor: '#FFC0CB', cursor: 'pointer', marginLeft: '10px' }}>-</button>
        </div>
      ))}

      <button onClick={addLinkInput} style={{ ...cuteStyle, backgroundColor: '#FFC0CB', cursor: 'pointer' }}>+</button>

      <div style={cuteStyle}>
        Guests:
        <button onClick={decrementGuests} style={{ ...cuteStyle, backgroundColor: '#FFC0CB', cursor: 'pointer' }}>-</button>
        {guestCount}
        <button onClick={incrementGuests} style={{ ...cuteStyle, backgroundColor: '#FFC0CB', cursor: 'pointer' }}>+</button>
      </div>

      <div style={{ ...cuteStyle, display: 'flex', alignItems: 'center' }}>
        Start Date: 
        <DatePicker
          selected={startDate}
          onChange={(date, _event) => {
            const selectedDate = Array.isArray(date) ? date[0] : date;
            if (selectedDate && selectedDate > endDate) {
              setEndDate(selectedDate);
            }
            setStartDate(selectedDate);
          }}
          startDate={startDate}
          endDate={endDate}
          style={{ marginLeft: '10px' }}
        />
      </div>

      <div style={{ ...cuteStyle, display: 'flex', alignItems: 'center' }}>
        End Date:
        <DatePicker
          selected={endDate}
          onChange={(date, _event) => {
            const selectedDate = Array.isArray(date) ? date[0] : date;
            setEndDate(selectedDate);
          }}
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          style={{ marginLeft: '10px' }}
        />
      </div>
      
      <button onClick={handleRun} style={{ ...cuteStyle, backgroundColor: '#FFC0CB', cursor: 'pointer' }}>Run</button>
      
      
      {result && <div style={{ ...cuteStyle, marginTop: '20px' }}>Result: {result}</div>}

    </div>
  );
}
export default App;

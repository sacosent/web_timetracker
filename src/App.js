import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './App.css';

function App() {
  const [category, setCategory] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timeLog, setTimeLog] = useState([]);
  const [chartData, setChartData] = useState({});

  const categories = ["Focused", "Break", "Free time", "Reading", "Investigating"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchTimeLog(); // Assuming fetchTimeLog is an async function
        // Process result
      } catch (error) {
        // Handle error
      }
    };
  
    fetchData();
  }, [fetchTimeLog]); // Include fetchTimeLog in the dependency array
  

  const fetchTimeLog = async () => {
    try {
      const response = await axios.get('http://localhost:8000/time-log');
      setTimeLog(response.data);
      updateChart(response.data);
    } catch (error) {
      console.error('Error fetching time log:', error);
    }
  };
  
  const startTimer = (category) => {
    setCategory(category);
    setStartTime(new Date());
  };

  const stopTimer = async () => {
    if (!startTime) return;
    const endTime = new Date();
    const elapsedTime = (endTime - startTime) / 1000; // in seconds

    await axios.post('http://localhost:8000/log-time', {
      category,
      elapsedTime
    });

    setStartTime(null);
    setCategory('');
    fetchTimeLog();
  };

  const updateChart = (timeLog) => {
    const categoryTimes = categories.reduce((acc, cat) => {
      acc[cat] = 0;
      return acc;
    }, {});

    timeLog.forEach(entry => {
      categoryTimes[entry.category] += entry.elapsedTime;
    });

    setChartData({
      labels: categories,
      datasets: [{
        label: 'Time Spent (seconds)',
        data: Object.values(categoryTimes),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TIME TRACKER</h1>
        <img src="https://via.placeholder.com/150" alt="Cool Logo" className="App-logo" />
        <div className="buttons">
          {categories.map((cat, index) => (
            <button key={index} onClick={() => startTimer(cat)} disabled={category === cat}>
              {cat}
            </button>
          ))}
          <button onClick={stopTimer} style={{ backgroundColor: 'red', color: 'white' }}>stop</button>
        </div>
        <div className="log">
          <h2>Log</h2>
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {timeLog && timeLog.map((log, index) => (
                <tr key={index}>
                  <td>{log.category}</td>
                  <td>{log.elapsedTime} seconds</td>
                </tr>
                ))}
              </tbody>

          </table>
        </div>
        <div className="chart">
          <h2>Time Spent</h2>
          <Bar data={chartData} />
        </div>
      </header>
    </div>
  );
}

export default App;

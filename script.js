let myChart = null; // Global chart reference for Chart.js

async function predict() {
  const name = document.getElementById("nameInput").value;

  // nationalize API call 
  const res = await fetch(`https://api.nationalize.io/?name=${name}`);
  const data = await res.json();

  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "";

  // Filter out Israel (country_id "IL")
  const countries = data.country.filter(c => c.country_id !== "IL");

  const labels = [];
  const probabilities = [];

  for (let c of countries) {
    const code = c.country_id;
    const prob = (c.probability * 100).toFixed(2);

    const countryData = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    const countryJson = await countryData.json();

    const countryName = countryJson[0]?.name?.common || code;
    const flagUrl = countryJson[0]?.flags?.png;

    labels.push(countryName);
    probabilities.push(parseFloat(prob));

    outputDiv.innerHTML += `
      <div class="result">
        <img src="${flagUrl}" alt="${code}" width="40">
        <strong>${countryName}</strong> : Probability: ${prob}%
      </div>
    `;
  }

  const ctx = document.getElementById('chart').getContext('2d');

  // Destroy the previous chart before creating a new one
  if (myChart) {
    myChart.destroy();
  }

  // Create a new chart with updated data
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Nationality Prediction (%)',
        data: probabilities,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',  
        borderColor: 'rgb(75, 192, 192)', 
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

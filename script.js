const workingHoursPerDay = 8;
const lunchDuration = 1; // in hours
let cumulativeBalance = 0;

document.addEventListener("DOMContentLoaded", () => {
    loadRecords();
    updateCumulativeBalance();
});

function calculateHours() {
    const date = document.getElementById('date').value;
    const start = document.getElementById('start').value;
    const lunchStart = document.getElementById('lunchStart').value;
    const lunchEnd = document.getElementById('lunchEnd').value;
    const end = document.getElementById('end').value;

    if (!date || !start || !lunchStart || !lunchEnd || !end) {
        alert("Please fill in all fields");
        return;
    }

    const startTime = new Date(`1970-01-01T${start}:00`);
    const lunchStartTime = new Date(`1970-01-01T${lunchStart}:00`);
    const lunchEndTime = new Date(`1970-01-01T${lunchEnd}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);

    const morningWorkHours = (lunchStartTime - startTime) / (1000 * 60 * 60);
    const afternoonWorkHours = (endTime - lunchEndTime) / (1000 * 60 * 60);

    const totalWorkHours = morningWorkHours + afternoonWorkHours;
    const dailyBalance = totalWorkHours - workingHoursPerDay;
    cumulativeBalance += dailyBalance;

    document.getElementById('result').innerText = `Total work hours for ${date}: ${totalWorkHours.toFixed(2)} hours (${dailyBalance >= 0 ? 'Positive' : 'Negative'} balance of ${dailyBalance.toFixed(2)} hours)`;
    updateCumulativeBalance();
    saveRecord(date, start, lunchStart, lunchEnd, end, dailyBalance);
}

function saveRecord(date, start, lunchStart, lunchEnd, end, dailyBalance) {
    const record = {
        date,
        start,
        lunchStart,
        lunchEnd,
        end,
        dailyBalance
    };

    let records = JSON.parse(localStorage.getItem('workRecords')) || [];
    const existingRecordIndex = records.findIndex(r => r.date === date);

    if (existingRecordIndex !== -1) {
        cumulativeBalance -= records[existingRecordIndex].dailyBalance;
        records[existingRecordIndex] = record;
    } else {
        records.push(record);
    }

    localStorage.setItem('workRecords', JSON.stringify(records));
    displayRecords();
}

function loadRecords() {
    let records = JSON.parse(localStorage.getItem('workRecords')) || [];
    records.forEach(record => {
        cumulativeBalance += record.dailyBalance;
    });
    displayRecords();
}

function displayRecords() {
    const recordsContainer = document.getElementById('records');
    recordsContainer.innerHTML = '';

    let records = JSON.parse(localStorage.getItem('workRecords')) || [];
    records.forEach((record, index) => {
        const recordElement = document.createElement('div');
        recordElement.innerHTML = `
            Date: ${record.date}, Start: ${record.start}, Lunch Start: ${record.lunchStart}, Lunch End: ${record.lunchEnd}, End: ${record.end}, Balance: ${record.dailyBalance.toFixed(2)} hours
            <button onclick="editRecord(${index})">Edit</button>
        `;
        recordsContainer.appendChild(recordElement);
    });
}

function editRecord(index) {
    let records = JSON.parse(localStorage.getItem('workRecords')) || [];
    const record = records[index];

    document.getElementById('date').value = record.date;
    document.getElementById('start').value = record.start;
    document.getElementById('lunchStart').value = record.lunchStart;
    document.getElementById('lunchEnd').value = record.lunchEnd;
    document.getElementById('end').value = record.end;

    cumulativeBalance -= record.dailyBalance;
    records.splice(index, 1);
    localStorage.setItem('workRecords', JSON.stringify(records));
    displayRecords();
    updateCumulativeBalance();
}

function updateCumulativeBalance() {
    document.getElementById('cumulativeBalance').innerText = `${cumulativeBalance.toFixed(2)} hours`;
}
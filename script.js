const expenseForm = document.getElementById("expenseForm");
const addPeopleBtn = document.getElementById("addPeople");
const peopleInputContainer = document.getElementById("peopleInput");
const resultsDiv = document.getElementById("results");
const resultsList = document.getElementById("resultsList");
const downloadSummaryBtn = document.getElementById("downloadSummary");

addPeopleBtn.addEventListener("click", () => {
  const numPeople = document.getElementById("numPeople").value;
  peopleInputContainer.innerHTML = ""; // Clear previous inputs

  for (let i = 1; i <= numPeople; i++) {
    const personDiv = document.createElement("div");
    personDiv.innerHTML = `
      <label for="person${i}">Person ${i} Name:</label>
      <input type="text" id="person${i}Name" placeholder="Enter name" required>
      <label for="person${i}Contribution">Person ${i} Contribution:</label>
      <input type="number" id="person${i}Contribution" placeholder="Enter contribution" required>
    `;
    peopleInputContainer.appendChild(personDiv);
  }
});

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const totalExpense = parseFloat(document.getElementById("totalExpense").value);
  const numPeople = parseInt(document.getElementById("numPeople").value);

  let totalContribution = 0;
  const people = [];

  for (let i = 1; i <= numPeople; i++) {
    const name = document.getElementById(`person${i}Name`).value;
    const contribution = parseFloat(document.getElementById(`person${i}Contribution`).value);
    totalContribution += contribution;

    people.push({ name, contribution });
  }

  const equalShare = totalExpense / numPeople;
  resultsList.innerHTML = "";

  people.forEach(person => {
    const balance = person.contribution - equalShare;
    const resultItem = document.createElement("li");
    resultItem.textContent = `${person.name}: Paid ${person.contribution.toFixed(2)} | Balance: ${balance >= 0 ? `Overpaid ${balance.toFixed(2)}` : `Owes ${(Math.abs(balance)).toFixed(2)}`}`;
    resultsList.appendChild(resultItem);
  });

  resultsDiv.classList.remove("hidden");
});

downloadSummaryBtn.addEventListener("click", () => {
  let summary = "Expense Split Summary:\n";
  resultsList.querySelectorAll("li").forEach(item => {
    summary += `${item.textContent}\n`;
  });

  const blob = new Blob([summary], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ExpenseSummary.txt";
  link.click();
});
const expenseForm = document.getElementById("expenseForm")
const addPeopleBtn = document.getElementById("addPeople")
const peopleInputContainer = document.getElementById("peopleInput")
const resultsDiv = document.getElementById("results")
const resultsList = document.getElementById("resultsList")
const downloadSummaryBtn = document.getElementById("downloadSummary")

addPeopleBtn.addEventListener("click", () => {
  const numPeople = document.getElementById("numPeople").value
  peopleInputContainer.innerHTML = "" // Clear previous inputs

  for (let i = 1; i <= numPeople; i++) {
    const personDiv = document.createElement("div")
    personDiv.classList.add("person-input")
    personDiv.innerHTML = `
      <label for="person${i}">Person ${i} Name:</label>
      <input type="text" id="person${i}Name" class="personDetails" placeholder="Enter name" required>
    `
    peopleInputContainer.appendChild(personDiv)
  }
})

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const totalExpense = Number.parseFloat(document.getElementById("totalExpense").value)
  const numPeople = Number.parseInt(document.getElementById("numPeople").value)

  if (isNaN(totalExpense) || isNaN(numPeople) || numPeople <= 0) {
    alert("Please enter valid numbers for total expense and number of people.")
    return
  }

  const equalShare = totalExpense / numPeople
  const people = []

  for (let i = 1; i <= numPeople; i++) {
    const name = document.getElementById(`person${i}Name`).value || `Person ${i}`
    people.push({ name, share: equalShare })
  }

  resultsList.innerHTML = ""

  people.forEach((person) => {
    const resultItem = document.createElement("li")
    resultItem.textContent = `${person.name}: Owes ${person.share.toFixed(2)}`
    resultsList.appendChild(resultItem)
  })

  resultsDiv.classList.remove("hidden")
})

downloadSummaryBtn.addEventListener("click", () => {
  let summary = "Expense Split Summary:\n"
  resultsList.querySelectorAll("li").forEach((item) => {
    summary += `${item.textContent}\n`
  })

  const blob = new Blob([summary], { type: "text/plain" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "ExpenseSummary.txt"
  link.click()
})

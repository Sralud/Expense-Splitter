const expenseForm = document.getElementById("expenseForm")
const addPeopleBtn = document.getElementById("addPeople")
const peopleInputContainer = document.getElementById("peopleInput")
const resultsDiv = document.getElementById("results")
const resultsList = document.getElementById("resultsList")
const downloadSummaryBtn = document.getElementById("downloadSummary")
const splitTypeSelect = document.getElementById("splitType")

addPeopleBtn.addEventListener("click", () => {
  const numPeople = document.getElementById("numPeople").value
  peopleInputContainer.innerHTML = "" // Clear previous inputs

  for (let i = 1; i <= numPeople; i++) {
    const personDiv = document.createElement("div")
    personDiv.classList.add("person-input")
    personDiv.innerHTML = `
      <label for="person${i}">Person ${i} Name:</label>
      <input type="text" id="person${i}Name" class="personDetails" placeholder="Enter name" required>
      <label for="person${i}Contribution">Person ${i} Contribution:</label>
      <input type="number" id="person${i}Contribution" class="personDetails" placeholder="Enter contribution" required>
    `
    peopleInputContainer.appendChild(personDiv)
  }
})

splitTypeSelect.addEventListener("change", () => {
  const isCustom = splitTypeSelect.value === "custom"
  document.querySelectorAll("[id^=person][id$=Contribution]").forEach((input) => {
    input.disabled = !isCustom
    if (!isCustom) {
      input.value = ""
    }
  })
})

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const totalExpense = Number.parseFloat(document.getElementById("totalExpense").value)
  const numPeople = Number.parseInt(document.getElementById("numPeople").value)
  const splitType = splitTypeSelect.value

  let totalContribution = 0
  const people = []

  for (let i = 1; i <= numPeople; i++) {
    const name = document.getElementById(`person${i}Name`).value
    let contribution

    if (splitType === "equal") {
      contribution = totalExpense / numPeople
    } else {
      contribution = Number.parseFloat(document.getElementById(`person${i}Contribution`).value) || 0
    }

    totalContribution += contribution
    people.push({ name, contribution })
  }

  if (splitType === "custom" && Math.abs(totalContribution - totalExpense) > 0.01) {
    alert("The sum of individual contributions must equal the total expense.")
    return
  }

  resultsList.innerHTML = ""

  people.forEach((person) => {
    const balance = person.contribution - totalExpense / numPeople
    const resultItem = document.createElement("li")
    resultItem.textContent = `${person.name}: Paid ${person.contribution.toFixed(2)} | Balance: ${balance >= 0 ? `Overpaid ${balance.toFixed(2)}` : `Owes ${(Math.abs(balance)).toFixed(2)}`}`
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

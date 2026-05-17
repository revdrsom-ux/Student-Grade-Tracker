// Student Grade Tracker - Score-tracker.js
let students = [];

// Load from localStorage
function loadFromLocalStorage() {
  const saved = localStorage.getItem("students");
  if (saved) {
    students = JSON.parse(saved);
  }
  renderTable();
  updateAverage();
}

// Save to localStorage
function saveToLocalStorage() {
  localStorage.setItem(`students`, JSON.stringify(students));
}

function generateId() {
  return Date.now();
}

function calculateAverage() {
  if (students.length === 0) return 0;
  const sum = students.reduce((acc, student) => acc + student.grade, 0);
  return parseFloat((sum / students.length).toFixed(1));
}

function updateAverage() {
  const avg = calculateAverage();
  document.getElementById("averageDisplay").textContent = avg;
  document.getElementById("studentCount").textContent = students.length;
}

function renderTable() {
  const tbody = document.getElementById("studentTable");
  const emptyState = document.getElementById("emptyState");
  tbody.innerHTML = "";

  if (students.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  // Sort students by grade descending
  const sortedStudents = [...students].sort((a, b) => b.grade - a.grade);
  const average = calculateAverage();

  sortedStudents.forEach((student) => {
    const row = document.createElement("tr");
    const isAboveAvg = student.grade > average;

    if (isAboveAvg) {
      row.classList.add("highlight");
    }

    row.innerHTML = `
        <td class="px-6 py-4 text-gray-500">${student.id}</td>
        <td class="px-6 py-4 font-medium">${student.name}</td>
        <td class="px-6 py-4 font-semibold">${student.grade}%</td>
        <td class="px-6 py-4 text-center">
          <button onclick="deleteStudent(${student.id})"
                  class="bg-red-500 hover:bg-red-600 text-white text-sm px-5 py-1.5 rounded-lg transition">
            Delete
          </button>
        </td>
      `;
    tbody.appendChild(row);
  });
}

function addStudent() {
  const nameInput = document.getElementById("nameInput");
  const gradeInput = document.getElementById("gradeInput");
  const errorMsg = document.getElementById("errorMsg");

  const name = nameInput.value.trim();
  const grade = parseFloat(gradeInput.value);

  // Validation
  if (name === "") {
    errorMsg.textContent = "❌ Please enter a student name";
    errorMsg.classList.remove("hidden");
    return;
  }

  if (isNaN(grade) || grade < 0 || grade > 100) {
    errorMsg.textContent = "❌ Grade must be between 0 and 100";
    errorMsg.classList.remove("hidden");
    return;
  }

  // Clear error and add student
  errorMsg.classList.add("hidden");

  students.push({
    id: generateId(),
    name: name,
    grade: grade,
  });

  // Reset form
  nameInput.value = "";
  gradeInput.value = "";

  // Update UI
  renderTable();
  updateAverage();
  saveToLocalStorage();
}

function deleteStudent(id) {
  if (confirm("Delete this student?")) {
    students = students.filter((student) => student.id !== id);
    renderTable();
    updateAverage();
    saveToLocalStorage();
  }
}

// Event Listeners
document.getElementById("addBtn").addEventListener("click", addStudent);

// Allow Enter key on both inputs
document.getElementById("nameInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") addStudent();
});
document.getElementById("gradeInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") addStudent();
});

// Hide error when user starts typing
document.getElementById("nameInput").addEventListener("input", () => {
  document.getElementById("errorMsg").classList.add("hidden");
});
document.getElementById("gradeInput").addEventListener("input", () => {
  document.getElementById("errorMsg").classList.add("hidden");
});

// Initialize
loadFromLocalStorage();

# 🧩 Quiz App

An interactive, responsive quiz application featuring category filtering, audio effects, and visual feedback.

---

## 📁 Project Structure

Quiz-App/
├── icons/
│ ├── main-logo.svg
│ └── trophy.png
├── sounds/
│ ├── right.mp3
│ └── wrong.mp3
├── database.js # Question database / Quiz objects
├── index.html # Main HTML structure with Bootstrap layout
├── script.js # Refactored quiz logic
├── style.css # Custom styles
└── README.md

---

## 🎯 About the Project

This project marks two important milestones in my development journey:

1. **First Experience with Bootstrap:** For the first time, I used the Bootstrap framework to build a modern, responsive layout featuring cards, buttons, and progress bars.
2. **Practical Refactoring Practice:** A major focus was breaking down accumulated code into clean, small building blocks based on the _Single Responsibility Principle_. Every function handles exactly one task, making the codebase clear, maintainable, and easy to extend.

---

## ✨ Features

- **Category Filtering:** Filter questions dynamically by topic.
- **Audiovisual Feedback:** Correct and incorrect choices are highlighted in color (`bg-success` / `bg-danger`) and accompanied by sound effects.
- **Interaction Lock:** Once an answer is selected, further clicks on answers are disabled to prevent duplicate submissions.
- **Progress Tracker:** A dynamic progress bar updates as you advance through the quiz.
- **End Screen:** View your final score summary after completing all questions.

---

## 🛠️ Technologies Used

- **HTML5**
- **CSS3 / Bootstrap**
- **JavaScript (Vanilla JS)**

---

## 🚀 Installation & Setup

1. Clone or download this repository as a ZIP file.
2. Open `index.html` directly in any modern browser.

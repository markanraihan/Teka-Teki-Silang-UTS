const clues = {
    across: [
        { number: 3, question: "Orang yang berkuasa dalam suatu kerajaan", answer: "RAJA", row: 2, col: 7 },
        { number: 7, question: "Hewan mirip kucing tapi besar dan disebut kucing hutan", answer: "HARIMAU", row: 4, col: 1 },
        { number: 8, question: "Tempat menampung ikan untuk di koleksi", answer: "AKUARIUM", row: 5, col: 7 },
        { number: 10, question: "Batu permata yang sangat berharga dan terkenal karena keindahannya", answer: "INTAN", row: 13, col: 7 },
        { number: 11, question: "Kegiatan menghanguskan sesuatu dengan api", answer: "MEMBAKAR", row: 9, col: 1 }
    ],
    down: [
        { number: 1, question: "Tumbuhan ketika musim panen maka akan", answer: "BERBUAH", row: 0, col: 7 },
        { number: 2, question: "Salah satu penyakit paru-paru paling terkenal", answer: "ASMA", row: 3, col: 14 },
        { number: 4, question: "Ruangan dalam rumah untuk istirahat dan tidur", answer: "KAMAR", row: 0, col: 3 },
        { number: 5, question: "Kegiatan membuat makanan yang diolah agar dapat dimakan", answer: "MEMASAK", row: 4, col: 5 },
        { number: 6, question: "Alat optik yang untuk melihat benda yang jauh agar tampak dekat", answer: "TEROPONG", row: 7, col: 8 },
        { number: 9, question: "Siapa nama pembuat tts ini?", answer: "ARKAN", row: 4, col: 11 }
    ]
};

let score = 0;

document.addEventListener("DOMContentLoaded", () => {
    createGrid();
    populateQuestions();
});

function createGrid() {
    const crosswordContainer = document.querySelector(".crossword");
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = i;
            cell.dataset.col = j;

            const cellNumber = getCellNumber(i, j);
            if (cellNumber) {
                const numberSpan = document.createElement("span");
                numberSpan.className = "cell-number";
                numberSpan.textContent = cellNumber;
                cell.appendChild(numberSpan);
            }

            if (isActiveCell(i, j)) {
                const input = document.createElement("input");
                input.maxLength = 1;
                cell.appendChild(input);
            } else {
                cell.classList.add("block");
            }
            crosswordContainer.appendChild(cell);
        }
    }
}

function getCellNumber(row, col) {
    const allClues = [...clues.across, ...clues.down];
    const clue = allClues.find(c => c.row === row && c.col === col);
    return clue ? clue.number : null;
}

function isActiveCell(row, col) {
    for (const clue of clues.across) {
        if (row === clue.row && col >= clue.col && col < clue.col + clue.answer.length) {
            return true;
        }
    }
    for (const clue of clues.down) {
        if (col === clue.col && row >= clue.row && row < clue.row + clue.answer.length) {
            return true;
        }
    }
    return false;
}

function populateQuestions() {
    const acrossQuestions = document.getElementById("across-questions");
    const downQuestions = document.getElementById("down-questions");

    clues.across.forEach(clue => {
        const li = document.createElement("li");
        li.textContent = `${clue.number}. ${clue.question}`;
        acrossQuestions.appendChild(li);
    });

    clues.down.forEach(clue => {
        const li = document.createElement("li");
        li.textContent = `${clue.number}. ${clue.question}`;
        downQuestions.appendChild(li);
    });
}

function checkAnswers() {
    score = 0;
    const maxScore = clues.across.reduce((sum, clue) => sum + clue.answer.length, 0) +
        clues.down.reduce((sum, clue) => sum + clue.answer.length, 0);

    let allCorrect = true;
    let feedbackMessage = '';

    clues.across.forEach(clue => {
        if (!checkClue(clue, "across")) {
            allCorrect = false;
            feedbackMessage += `Clue ${clue.number} salah.\n`;
        }
    });
    
    clues.down.forEach(clue => {
        if (!checkClue(clue, "down")) {
            allCorrect = false;
            feedbackMessage += `Clue ${clue.number} salah.\n`;
        }
    });

    const percentage = Math.round((score / maxScore) * 100);
    document.getElementById("score").textContent = `Skor: ${score} (${percentage}%)`;

    if (!allCorrect) {
        alert(feedbackMessage.trim());
    }

    if (allCorrect) {
        displayAnswerCard();
    }
}


function checkClue(clue, direction) {
    const { answer, row, col } = clue;
    let correct = true;

    for (let i = 0; i < answer.length; i++) {
        const cellRow = direction === "across" ? row : row + i;
        const cellCol = direction === "across" ? col + i : col;
        const cellInput = document.querySelector(`.cell[data-row="${cellRow}"][data-col="${cellCol}"] input`);

        if (cellInput) {
            if (cellInput.value.toUpperCase() === answer[i]) {
                cellInput.classList.add("correct");
                cellInput.classList.remove("incorrect");
                score++;
            } else {
                cellInput.classList.add("incorrect");
                cellInput.classList.remove("correct");
                correct = false;
            }
        }
    }
    return correct;
}

function displayAnswerCard() {
    const answerCard = document.getElementById("answer-card");
    const answersContainer = document.getElementById("answers");
    answersContainer.innerHTML = "";

    clues.across.forEach(clue => {
        const answerItem = document.createElement("div");
        answerItem.className = "answer-item";
        answerItem.innerHTML = `<h4>${clue.number}. ${clue.question}</h4><p>Jawaban: ${clue.answer}</p>`;
        answersContainer.appendChild(answerItem);
    });

    clues.down.forEach(clue => {
        const answerItem = document.createElement("div");
        answerItem.className = "answer-item";
        answerItem.innerHTML = `<h4>${clue.number}. ${clue.question}</h4><p>Jawaban: ${clue.answer}</p>`;
        answersContainer.appendChild(answerItem);
    });

    answerCard.classList.remove("hidden");
}
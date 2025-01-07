let currentQuestionIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

function startExam() {
    const selectElement = document.getElementById('question-file-select');
    const selectedFile = selectElement.value;

    // Load the selected questions file dynamically
    loadScript(selectedFile, () => {
        // Shuffle the questions array
        window.questions = shuffleArray(window.questions);
        
        // Reset variables
        currentQuestionIndex = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;

        // Hide home container and display exam container
        document.getElementById("home-container").style.display = "none";
        document.getElementById("exam-container").style.display = "block";

        // Display the first question
        displayQuestion();
    });
}

function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
}

// Function to shuffle array elements (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];

        // Shuffle answer choices for each question
        const choices = array[i].choices;
        for (let k = choices.length - 1; k > 0; k--) {
            const l = Math.floor(Math.random() * (k + 1));
            [choices[k], choices[l]] = [choices[l], choices[k]];
        }
    }
    return array;
}

function displayQuestion() {
    const currentQuestion = window.questions[currentQuestionIndex];
    document.getElementById("question").innerText = currentQuestion.question;

    const choicesContainer = document.getElementById("choices");
    choicesContainer.innerHTML = "";

    currentQuestion.choices.forEach((choice, index) => {
        const radioBtn = document.createElement("input");
        radioBtn.type = "radio";
        radioBtn.name = "choice";
        radioBtn.value = choice;
        radioBtn.id = "choice" + index;

        const label = document.createElement("label");
        label.setAttribute("for", "choice" + index);
        label.innerText = choice;
        setTimeout(() => {
            label.style.opacity = "1";
        }, index * 100);

        choicesContainer.appendChild(radioBtn);
        choicesContainer.appendChild(label);
    });

    document.getElementById("feedback").innerText = "";
    document.getElementById("buttons").innerHTML = '<button class="button" onclick="checkAnswer()">Check Answer</button>';
}

function checkAnswer() {
    const selectedAnswer = document.querySelector('input[name="choice"]:checked');
    if (!selectedAnswer) {
        alert("Please select an answer.");
        return;
    }

    const selectedValue = selectedAnswer.value;
    const currentQuestion = window.questions[currentQuestionIndex];

    if (selectedValue === currentQuestion.correctAnswer) {
        document.getElementById("feedback").innerText = "Correct! " + currentQuestion.explanation;
        document.getElementById("feedback").className = "feedback correct";
        correctAnswers++;
    } else {
        document.getElementById("feedback").innerText = "Incorrect! " + currentQuestion.explanation;
        document.getElementById("feedback").className = "feedback incorrect";
        incorrectAnswers++;
    }

    document.getElementById("buttons").innerHTML = '<button class="button" onclick="nextQuestion()">Next</button>';
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < window.questions.length) {
        displayQuestion(); // Display next question
    } else {
        showSummary();
    }
}

function showSummary() {
    document.getElementById("question").innerText = "Test completed!";
    document.getElementById("choices").innerHTML = "";
    document.getElementById("feedback").innerText = "Correct answers: " + correctAnswers + ", Incorrect answers: " + incorrectAnswers;
    document.getElementById("buttons").innerHTML = '<button class="button" onclick="location.reload()">Home</button>';
}

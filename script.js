const navigation = document.getElementById("navigation");
const menuToggle = document.getElementById("menuToggle");

function closeMenu() {
    navigation.classList.remove("show");
    menuToggle.textContent = "Menu";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}

function showPage(pageId, updateHistory = true) {
    const selectedPage = document.getElementById(pageId);

    if (!selectedPage || !selectedPage.classList.contains("page")) {
        return;
    }

    document.querySelectorAll(".page").forEach(function (page) {
        page.classList.remove("active");
    });

    selectedPage.classList.add("active");

    if (updateHistory && window.location.hash !== "#" + pageId) {
        history.pushState({ page: pageId }, "", "#" + pageId);
    }

    document.querySelectorAll("[data-page]").forEach(function (link) {
        link.classList.toggle("nav-active", link.getAttribute("data-page") === pageId);
    });

    closeMenu();
    window.scrollTo({ top: 0 });
}

document.querySelectorAll("[data-page]").forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();
        showPage(this.getAttribute("data-page"));
    });
});

menuToggle.addEventListener("click", function () {
    const isOpen = navigation.classList.toggle("show");
    menuToggle.textContent = isOpen ? "Close" : "Menu";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu",
    );
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeMenu();
    }
});

window.addEventListener("popstate", function () {
    const pageId = window.location.hash.substring(1);
    const selectedPage = document.getElementById(pageId);

    showPage(selectedPage && selectedPage.classList.contains("page") ? pageId : "home", false);
});

const quizQuestions = [
    {
        question: "Which statement best describes mental health?",
        options: [
            "It is only the absence of a mental illness.",
            "It includes emotional, psychological, and social well-being.",
            "It never changes throughout life.",
        ],
        answer: 1,
        explanation:
            "Mental health is part of overall well-being and can change with life experiences and circumstances.",
    },
    {
        question: "Which is a helpful response when someone shares that they are struggling?",
        options: [
            "Listen without judgment and ask what support they need.",
            "Tell them other people have it worse.",
            "Assume they should handle it alone.",
        ],
        answer: 0,
        explanation:
            "Listening respectfully and asking what would help can make it easier for someone to seek support.",
    },
    {
        question: "What is true about anxiety?",
        options: [
            "Feeling anxious always means someone has a disorder.",
            "Anxiety is never a normal response.",
            "Anxiety can be a normal response, but persistent or disruptive anxiety may need support.",
        ],
        answer: 2,
        explanation:
            "Anxiety can be a normal response. When it becomes intense, persistent, or disruptive, professional guidance may help.",
    },
    {
        question: "Which statement about depression is accurate?",
        options: [
            "It is simply laziness.",
            "It is more than a temporary low mood and can affect daily functioning.",
            "People can always overcome it by trying harder.",
        ],
        answer: 1,
        explanation:
            "Depression is a health condition, not a character flaw. Effective support and treatment are available.",
    },
    {
        question: "Which is a realistic self-care practice?",
        options: [
            "Ignore every difficult feeling.",
            "Try to change every habit at once.",
            "Choose one manageable action, such as taking a break or contacting someone supportive.",
        ],
        answer: 2,
        explanation:
            "Small, realistic steps are often easier to maintain than trying to change everything at once.",
    },
    {
        question: "When should someone consider seeking professional support?",
        options: [
            "Only when every coping strategy has failed.",
            "When concerns persist, worsen, or interfere with daily life.",
            "Never; asking for help is a weakness.",
        ],
        answer: 1,
        explanation:
            "A qualified professional can help assess concerns and discuss suitable support. Asking for help is a strength.",
    },
];
let quizIndex = 0;
let quizScore = 0;
let quizSelected = null;
let quizAnswered = false;

function renderQuiz() {
    const area = document.getElementById("quizArea");
    if (!area) return;
    const nextButton = document.getElementById("quizNext");
    const restartButton = document.getElementById("quizRestart");
    const progress = document.getElementById("quizProgress");
    const progressText = document.getElementById("quizProgressText");
    const scoreText = document.getElementById("quizScoreText");
    if (quizIndex >= quizQuestions.length) {
        progress.style.width = "100%";
        progressText.textContent = "Quiz complete";
        scoreText.textContent = quizScore + " / " + quizQuestions.length + " correct";
        area.innerHTML =
            '<h2 class="quiz-question">You completed the awareness quiz.</h2><p class="quiz-feedback">You answered ' +
            quizScore +
            " out of " +
            quizQuestions.length +
            " questions correctly. Use the explanations as a starting point for learning. This score is not a measure of your mental health.</p>";
        nextButton.textContent = "Try again";
        nextButton.disabled = false;
        nextButton.onclick = resetQuiz;
        return;
    }
    const item = quizQuestions[quizIndex];
    progress.style.width = ((quizIndex + 1) / quizQuestions.length) * 100 + "%";
    progressText.textContent = "Question " + (quizIndex + 1) + " of " + quizQuestions.length;
    scoreText.textContent = "Knowledge check";
    let html = '<h2 class="quiz-question">' + item.question + '</h2><div class="quiz-options">';
    item.options.forEach(function (option, index) {
        html +=
            '<button type="button" class="quiz-option' +
            (quizSelected === index ? " selected" : "") +
            '" data-answer="' +
            index +
            '" ' +
            (quizAnswered ? "disabled" : "") +
            ">" +
            String.fromCharCode(65 + index) +
            ". " +
            option +
            "</button>";
    });
    html += "</div>";
    if (quizAnswered) {
        html +=
            '<div class="quiz-feedback">' +
            (quizSelected === item.answer
                ? "<strong>Correct.</strong> "
                : "<strong>Not quite.</strong> ") +
            item.explanation +
            "</div>";
    }
    area.innerHTML = html;
    area.querySelectorAll("[data-answer]").forEach(function (button) {
        button.addEventListener("click", function () {
            if (quizAnswered) return;
            quizSelected = Number(this.getAttribute("data-answer"));
            quizAnswered = true;
            if (quizSelected === item.answer) quizScore++;
            renderQuiz();
        });
    });
    nextButton.textContent =
        quizIndex === quizQuestions.length - 1 ? "See results" : "Next question";
    nextButton.disabled = !quizAnswered;
    nextButton.onclick = function () {
        if (!quizAnswered) return;
        quizIndex++;
        quizSelected = null;
        quizAnswered = false;
        renderQuiz();
    };
    restartButton.onclick = resetQuiz;
}

function resetQuiz() {
    quizIndex = 0;
    quizScore = 0;
    quizSelected = null;
    quizAnswered = false;
    renderQuiz();
}

const affirmations = [
    "Every day is a new opportunity to become better.",
    "Don't be afraid to start over. It's another chance to get things right.",
    "Small progress is still progress.",
    "Your effort matters, even when nobody notices.",
    "Stay patient. Good things take time.",
    "Choose kindness, even when it's difficult.",
    "Don't let one mistake define you.",
    "Learn to appreciate the little things.",
    "Protect your peace.",
    "Celebrate your small victories.",
    "It's okay not to be okay.",
    "This feeling won't last forever.",
    "You don't have to figure everything out today.",
    "Give yourself time to heal and grow.",
    "You've survived difficult days before.",
];
let lastAffirmation = -1;
function showAffirmation() {
    const display = document.getElementById("affirmationText");
    if (!display) return;
    let index = Math.floor(Math.random() * affirmations.length);
    if (affirmations.length > 1 && index === lastAffirmation)
        index = (index + 1) % affirmations.length;
    lastAffirmation = index;
    display.textContent = affirmations[index];
    display.setAttribute("aria-live", "polite");
}

const quizNextButton = document.getElementById("quizNext");
if (quizNextButton) renderQuiz();
const affirmationButton = document.getElementById("newAffirmation");
if (affirmationButton) affirmationButton.addEventListener("click", showAffirmation);

window.addEventListener("hashchange", function () {
    const pageId = window.location.hash.substring(1);
    const selectedPage = document.getElementById(pageId);
    if (selectedPage && selectedPage.classList.contains("page")) showPage(pageId, false);
});

const initialPageId = window.location.hash.substring(1);
const initialPage = document.getElementById(initialPageId);
showPage(initialPage && initialPage.classList.contains("page") ? initialPageId : "home", false);

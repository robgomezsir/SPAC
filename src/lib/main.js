import { getQuestionsAndOptions, checkCandidateExists, submitAssessment } from './api.js';
import { 
    renderAssessment,
    updateProgress,
    navigateToPage,
    toggleScreen,
    showLoading,
    hideLoading,
    showStartError,
    hideStartError,
    showLimitError,
    hideLimitError,
    getFormValues
} from './ui_controller.js';
import { state, setCandidate, setQuestions, setCurrentPage, addAnswer, removeAnswer, getAnswersForQuestion } from './state_manager.js';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    init();
});

function init() {
    const startForm = document.getElementById('start-form');
    const backButton = document.getElementById('back-button');
    const nextButton = document.getElementById('next-button');

    startForm.addEventListener('submit', handleStartFormSubmit);
    backButton.addEventListener('click', handleBackButtonClick);
    nextButton.addEventListener('click', handleNextButtonClick);
}

async function handleStartFormSubmit(event) {
    event.preventDefault();
    hideStartError();
    showLoading();

    const { fullName, email } = getFormValues();

    try {
        const exists = await checkCandidateExists(fullName, email);
        if (exists) {
            showStartError('Um candidato com este nome e e-mail já realizou a avaliação.');
            hideLoading();
            return;
        }

        setCandidate(fullName, email);
        
        const { questions, options } = await getQuestionsAndOptions();
        const groupedQuestions = groupQuestionsByPage(questions, options);
        setQuestions(groupedQuestions);
        
        renderAssessment(groupedQuestions);
        addCheckboxListeners();
        
        toggleScreen('assessment-screen');
    } catch (error) {
        console.error('Error starting assessment:', error);
        showStartError('Não foi possível iniciar a avaliação. Tente novamente mais tarde.');
    } finally {
        hideLoading();
    }
}

function handleBackButtonClick() {
    if (state.currentPage > 1) {
        const newPage = state.currentPage - 1;
        setCurrentPage(newPage);
        navigateToPage(newPage);
        updateProgress(newPage, state.totalPages);
    }
}

function handleNextButtonClick(event) {
    const isFinalPage = state.currentPage === state.totalPages;
    

    const currentQuestions = state.questions.find(p => p.page === state.currentPage).questions;
    for (const question of currentQuestions) {
        const answers = getAnswersForQuestion(question.id);
        if (answers.length > 5) {
            showLimitError();
            return;
        }
    }
    hideLimitError();


    if (isFinalPage) {
        if (event.target.textContent.trim() === 'Finalizar') {
            handleFinalSubmit();
        }
    } else {
        const newPage = state.currentPage + 1;
        setCurrentPage(newPage);
        navigateToPage(newPage);
        updateProgress(newPage, state.totalPages);
    }
}

async function handleFinalSubmit() {
    showLoading();
    try {
        await submitAssessment(state.candidate, state.answers);
        toggleScreen('thank-you-screen');
    } catch (error) {
        console.error('Error submitting assessment:', error);
        alert('Ocorreu um erro ao finalizar sua avaliação. Por favor, tente novamente.');
    } finally {
        hideLoading();
    }
}

function groupQuestionsByPage(questions, options) {
    const pages = {};
    for (const q of questions) {
        if (!pages[q.pagina]) {
            pages[q.pagina] = { page: q.pagina, questions: [] };
        }
        q.options = options.filter(o => o.pergunta_id === q.id).sort((a,b) => a.id - b.id);
        pages[q.pagina].questions.push(q);
    }
    return Object.values(pages).sort((a, b) => a.page - b.page);
}


function handleCheckboxChange(event) {
    const checkbox = event.target;
    const questionId = parseInt(checkbox.dataset.questionId, 10);
    const optionId = parseInt(checkbox.value, 10);

    const questionAnswers = getAnswersForQuestion(questionId);

    if (checkbox.checked) {
        if (questionAnswers.length >= 5) {
            checkbox.checked = false;
            showLimitError();
            return;
        }
        addAnswer(questionId, optionId);
        hideLimitError();
    } else {
        removeAnswer(questionId, optionId);
        hideLimitError();
    }
}

function addCheckboxListeners() {
    const checkboxes = document.querySelectorAll('#questions-container input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
}

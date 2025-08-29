import { state } from './state_manager.js';

const screens = ['welcome-screen', 'assessment-screen', 'thank-you-screen'];

export function toggleScreen(screenId) {
    screens.forEach(id => {
        const element = document.getElementById(id);
        if (id === screenId) {
            element.classList.remove('hidden');
            element.style.opacity = '1';
        } else {
            element.classList.add('hidden');
            element.style.opacity = '0';
        }
    });
}

export function showLoading() {
    document.getElementById('loading-overlay').classList.remove('hidden');
}

export function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

export function getFormValues() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    return { fullName, email };
}

export function showStartError(message) {
    const errorEl = document.getElementById('start-error');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
}

export function hideStartError() {
    document.getElementById('start-error').classList.add('hidden');
}

export function showLimitError() {
    document.getElementById('limit-error').classList.remove('hidden');
}

export function hideLimitError() {
    document.getElementById('limit-error').classList.add('hidden');
}

export function renderAssessment(pages) {
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = ''; 

    pages.forEach(pageData => {
        const pageDiv = document.createElement('div');
        pageDiv.id = `page-${pageData.page}`;
        pageDiv.className = 'question-page space-y-8';
        if (pageData.page !== 1) {
            pageDiv.classList.add('hidden');
        }

        pageData.questions.forEach(question => {
            const questionDiv = document.createElement('div');
            questionDiv.innerHTML = `
                <h3 class="text-lg font-semibold text-slate-800 mb-4">${question.texto_pergunta}</h3>
                <div class="space-y-3" data-question-id="${question.id}">
                    ${question.options.map(option => `
                        <div>
                            <input type="checkbox" id="option-${option.id}" value="${option.id}" data-question-id="${question.id}">
                            <label for="option-${option.id}" class="option-label">
                                <span class="option-label-text">${option.texto_opcao}</span>
                            </label>
                        </div>
                    `).join('')}
                </div>
            `;
            pageDiv.appendChild(questionDiv);
        });
        questionsContainer.appendChild(pageDiv);
    });

    document.getElementById('total-pages-display').textContent = state.totalPages;
    updateProgress(1, state.totalPages);
    navigateToPage(1);
}

export function updateProgress(currentPage, totalPages) {
    const progress = (currentPage / totalPages) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('current-page-display').textContent = currentPage;
}

export function navigateToPage(pageNumber) {
    const questionPages = document.querySelectorAll('.question-page');
    questionPages.forEach(page => {
        if (page.id === `page-${pageNumber}`) {
            page.classList.remove('hidden');
        } else {
            page.classList.add('hidden');
        }
    });

    const backButton = document.getElementById('back-button');
    const nextButton = document.getElementById('next-button');
    const nextButtonText = nextButton.querySelector('span');
    const nextButtonIcon = nextButton.querySelector('i');

    backButton.disabled = pageNumber === 1;

    if (pageNumber === state.totalPages) {
        nextButtonText.textContent = 'Finalizar';
        nextButtonIcon.setAttribute('data-lucide', 'check-circle');
    } else {
        nextButtonText.textContent = 'Próxima';
        nextButtonIcon.setAttribute('data-lucide', 'arrow-right');
    }
    lucide.createIcons(); // Re-render icons after changing them
    

    document.getElementById('questions-container').scrollTo(0, 0);
}

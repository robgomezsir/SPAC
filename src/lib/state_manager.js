export const state = {
    candidate: {
        name: '',
        email: ''
    },
    currentPage: 1,
    totalPages: 0,
    questions: [],
    answers: {}, // { questionId: [optionId1, optionId2] }
};

export function setCandidate(name, email) {
    state.candidate.name = name;
    state.candidate.email = email;
}

export function setQuestions(questionPages) {
    state.questions = questionPages;
    state.totalPages = questionPages.length;
}

export function setCurrentPage(page) {
    state.currentPage = page;
}

export function addAnswer(questionId, optionId) {
    if (!state.answers[questionId]) {
        state.answers[questionId] = [];
    }
    if (!state.answers[questionId].includes(optionId)) {
        state.answers[questionId].push(optionId);
    }
}

export function removeAnswer(questionId, optionId) {
    if (state.answers[questionId]) {
        state.answers[questionId] = state.answers[questionId].filter(id => id !== optionId);
        if (state.answers[questionId].length === 0) {
            delete state.answers[questionId];
        }
    }
}

export function getAnswersForQuestion(questionId) {
    return state.answers[questionId] || [];
}

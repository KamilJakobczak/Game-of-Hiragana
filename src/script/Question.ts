import { QuestionData } from './Game';
import { shuffleArray } from './utils/shuffleArray';

class Question {
	$question: string;
	$correctAnswer: string;
	$incorrectAnswers: string[];
	$container: HTMLElement;
	$questionContainer: HTMLElement;
	$setCurrentQuestion: () => void;
	$setScore: () => void;
	$rerender: () => void;
	$unmountGameContainer: () => void;
	constructor(
		container: HTMLElement,
		questionData: QuestionData,
		setCurrentQuestion: () => void,
		setScore: () => void,
		rerender: () => void,
		unmountGameContainer: () => void
	) {
		this.$container = container;
		this.$question = questionData.question;
		this.$correctAnswer = questionData.correctAnswer;
		this.$incorrectAnswers = questionData.incorrectAnswers;
		this.$questionContainer = null;
		this.$setCurrentQuestion = setCurrentQuestion;
		this.$setScore = setScore;
		this.$rerender = rerender;
		this.$unmountGameContainer = unmountGameContainer;
	}
	render() {
		if (!this.$questionContainer) {
			this.createQuestionContainer();
		}
		this.createQuestion();
		this.createAnswers();
		this.createSubmitButton();
	}
	createQuestionContainer() {
		const questionForm = document.createElement('form');
		questionForm.classList.add('game__question');
		this.$container.appendChild(questionForm);
		const questionFieldset = document.createElement('fieldset');
		questionFieldset.classList.add('game__question-fieldset');
		questionFieldset.name = 'answer';
		questionForm.appendChild(questionFieldset);

		this.$questionContainer = questionFieldset;
		questionForm.addEventListener('submit', this.handleSubmit.bind(this));
	}
	createQuestion() {
		const question = document.createElement('h2');
		question.innerHTML = `What is the translation for: <span>${this.$question}</span>?`;

		this.$questionContainer.appendChild(question);
	}
	createAnswers() {
		const answers = [this.$correctAnswer, ...this.$incorrectAnswers];
		const shuffledAnswers = shuffleArray(answers);
		shuffledAnswers.map(answer => {
			const answerWrapper = document.createElement('div');
			answerWrapper.classList.add('game__answer');
			const radioInput = document.createElement('input');
			radioInput.type = 'radio';
			radioInput.name = 'answer';
			radioInput.value = answer;
			const label = document.createElement('label');
			label.textContent = answer;
			label.innerHTML = radioInput.outerHTML + label.textContent;

			answerWrapper.appendChild(label);
			this.$questionContainer.appendChild(answerWrapper);
		});
	}
	createSubmitButton() {
		const submitButton = document.createElement('button');
		submitButton.type = 'submit';
		submitButton.textContent = 'Submit';
		this.$questionContainer.appendChild(submitButton);
	}
	handleSubmit(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const answer = formData.get('answer') as string;
		this.checkAnswer(answer);
	}
	checkAnswer(answer: string) {
		if (answer === this.$correctAnswer) {
			console.log('GOOD ANSWER');
			this.$setScore();
		} else {
			console.log('WRONG ANSWER');
		}
		this.$setCurrentQuestion();
		this.$container.innerHTML = '';
		this.$unmountGameContainer();
		this.$rerender();
	}
}

export default Question;

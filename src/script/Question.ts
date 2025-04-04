import { QuestionData } from './Questions';
import QuestionRenderer from './QuestionRenderer';
import { shuffleArray } from './utils/shuffleArray';

class Question {
	$container: HTMLElement;
	$correctAnswer: string;
	$distractors: string[];
	$question: string;
	$onQuestionAnswered: (result: boolean, answer: string) => void;
	constructor(
		container: HTMLElement,
		questionData: QuestionData,
		onQuestionAnswered: (result: boolean) => void
	) {
		this.$container = container;
		this.$question = questionData.question;
		this.$correctAnswer = questionData.correctAnswer;
		this.$distractors = questionData.distractors;
		this.$onQuestionAnswered = onQuestionAnswered;
	}
	render() {
		const renderer = new QuestionRenderer(
			this.$question,
			this.generateShuffledAnswers(),
			this.validateAnswer.bind(this),
			this.$container
		);
		renderer.render();
	}
	generateShuffledAnswers() {
		return shuffleArray([this.$correctAnswer, ...this.$distractors]);
	}

	validateAnswer(answer: string) {
		if (answer === this.$correctAnswer) {
			console.log('GOOD ANSWER');
			this.$onQuestionAnswered(true, answer);
		} else {
			console.log('WRONG ANSWER');
			this.$onQuestionAnswered(false, answer);
		}
	}
}

export default Question;

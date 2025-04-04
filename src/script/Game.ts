import { Sets } from '../data/db';
import { DIFFICULTY, SYLLABARY, GAMESTATE } from './enums/enums';
import GameRenderer from './GameRenderer';
import Player from './Player';
import Questions, { QuestionData } from './Questions';

const INITIAL_SCORE = 0;
const INITIAL_QUESTION = 0;

export interface GameTime {
	minutes: number;
	seconds: number;
	milliseconds: number;
}

class Game {
	$gameRenderer: GameRenderer;
	$gameId: string;
	$player: Player;
	$difficulty: string;
	$chapters: string[];
	$syllabary: SYLLABARY;
	$score: number;
	$appContainer: HTMLElement;
	$sets: Sets;
	$questionsData: QuestionData[];
	$currentQuestion: number;
	$length: { start: number; end: number };
	$answeredCorrectly: string[];
	$answeredWrong: string[];
	constructor(
		player: Player,
		difficulty: DIFFICULTY,
		syllabary: SYLLABARY,
		chapters: string[],
		container: HTMLElement,
		sets: Sets,
		onPlayAgain: () => void
	) {
		this.$player = player;
		this.$difficulty = difficulty;
		this.$syllabary = syllabary;
		this.$chapters = chapters;
		this.$gameId = this.createGameId();
		this.$appContainer = container;
		this.$sets = sets;
		this.$questionsData = new Questions(
			difficulty,
			syllabary,
			chapters,
			sets
		).createQuestions();
		this.$length = { start: 0, end: 0 };
		this.$score = INITIAL_SCORE;
		this.$currentQuestion = INITIAL_QUESTION;
		this.$gameRenderer = new GameRenderer(
			this.$appContainer,
			this.$questionsData,
			this.getCurrentQuestion.bind(this),
			this.getScore.bind(this),
			this.onQuestionAnswered.bind(this),
			this.getGameTime.bind(this),
			onPlayAgain
		);
		this.$answeredCorrectly = [];
		this.$answeredWrong = [];
	}

	render() {
		this.$gameRenderer.render();
		this.setGameTime(GAMESTATE.START);
	}
	getScore(): number {
		return this.$answeredCorrectly.length;
	}
	getGameId(): string {
		return this.$gameId;
	}
	getCurrentQuestion(): number {
		return this.$currentQuestion;
	}
	setGameTime(gameState: GAMESTATE): void {
		switch (gameState) {
			case GAMESTATE.START:
				this.$length.start = Date.now();
				break;
			case GAMESTATE.END:
				this.$length.end = Date.now();
				break;
		}
	}

	incrementCurrentQuestion(): void {
		this.$currentQuestion++;
	}
	incrementScore(): void {
		this.$score++;
	}

	createGameId(): string {
		if (!this.$player) {
			throw new Error('Player not found');
		}
		return `${this.$player.getName()}-${this.$difficulty}-${this.$chapters.at(
			0
		)}-${this.$chapters.length}-${Date.now()}`;
	}
	getGameTime(): GameTime {
		if (this.$length.start === 0 || this.$length.end === 0) {
			throw new Error('Game time not set');
		}
		const time = this.$length.end - this.$length.start;

		const minutes = Math.floor(time / 1000 / 60);
		const seconds = Math.floor((time / 1000) % 60);
		const milliseconds = Math.floor((time % 1000) / 10);

		return { minutes, seconds, milliseconds };
	}

	isGameFinished(): boolean {
		return this.$currentQuestion >= this.$questionsData.length;
	}

	onQuestionAnswered(result: boolean, answer: string) {
		if (result) {
			// this.incrementScore();
			// this.$player.setAnswers(true);
			this.$answeredCorrectly.push(answer);
		} else {
			// this.$player.setAnswers(false);
			this.$answeredWrong.push(answer);
		}
		this.incrementCurrentQuestion();

		if (this.isGameFinished()) {
			this.setGameTime(GAMESTATE.END);

			const gameResults = {
				id: this.$gameId,
				time: this.getGameTime(),
				questionsCount: this.$questionsData.length,
				correctAnswers: this.$answeredCorrectly,
				wrongAnswers: this.$answeredWrong,
			};
			this.$player.addGameStatistics(gameResults);
			this.$gameRenderer.displayResults();
		} else {
			this.$gameRenderer.renderNextQuestion();
		}
	}
}
export default Game;

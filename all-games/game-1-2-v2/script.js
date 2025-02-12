// 상수 정의
const GAME_CONSTANTS = {
    GRID_SIZE: 5,
    MIN_WORD_LENGTH: 1,
    MAX_WORD_LENGTH: 4,
    ANIMATION_DELAY: 300,
    TTS_DELAY: 500,
    DEFAULT_CHARS: "닭달탈칼날쌀삶밤잠",
    DEFAULT_WORDS: ["닭", "달", "탈", "칼", "칼", "깔", "날", "난", "란", 
                   "쌀", "쌀", "살", "산", "삶", "담", "댐", "땀", "남", 
                   "낸", "밤", "밥", "팜", "참", "짬", "잠"]
};

class WordGame {
    constructor() {
        this.gridSize = 5;
        this.correctWord = [];
        this.correctGuesses = new Set();
        this.chars = GAME_CONSTANTS.DEFAULT_CHARS;
        this.generatedWords = [...GAME_CONSTANTS.DEFAULT_WORDS];
        
        this.elements = {
            grid: document.getElementById("grid"),
            resetButton: document.getElementById("resetButton"),
            congratsMessage: document.getElementById("congratsMessage"),
            inputContainer: document.getElementById("inputContainer"),
            userWord: document.getElementById("userWord"),
            startButton: document.getElementById("startButton"),
            gameInstructions: document.getElementById("gameInstructions")
        };
        
        this.initializeEventListeners();
        this.initializeTTS();
    }

    initializeEventListeners() {
        this.elements.startButton.addEventListener('click', () => this.startGame());
        this.elements.resetButton.addEventListener('click', () => this.resetGame());
        
        this.elements.userWord.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^ㄱ-ㅎ가-힣]/g, '');
        });
        
        this.elements.userWord.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startGame();
            }
        });

        // 그리드에 이벤트 위임 적용
        this.elements.grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                this.checkAnswer(e.target);
            }
        });
    }

    initializeTTS() {
        if ('speechSynthesis' in window) {
            const messages = {
                start: "게임을 시작하려면 파란색 버튼 눌러주세요",
                instruction: "정답 단어가 가로, 세로, 또는 대각선으로 숨어있어요! 글자를 클릭해서 정답을 찾아보세요.",
                correct: "정답입니다!",
                congratulation: "모든 글자를 찾았어요!"
            };

            const speak = (message) => {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.lang = 'ko-KR';
                utterance.rate = 0.9;
                utterance.pitch = 1;
                
                const voices = speechSynthesis.getVoices();
                const koreanVoice = voices.find(voice => voice.lang.includes('ko'));
                if (koreanVoice) utterance.voice = koreanVoice;
                
                window.speechSynthesis.speak(utterance);
            };

            let hasSpoken = false;
            
            // 초기 메시지 재생 (처음 한 번만)
            const playInitialMessage = () => {
                if (!hasSpoken) {
                    speak(messages.start);
                    hasSpoken = true;
                }
            };

            // 0.5초 후 첫 시도
            setTimeout(playInitialMessage, GAME_CONSTANTS.TTS_DELAY);
            
            // 음성 목록이 로드되면 시도 (아직 재생되지 않았다면)
            speechSynthesis.onvoiceschanged = playInitialMessage;

            // TTS 메시지 저장
            this.ttsMessages = messages;
            this.speak = speak;
        }
    }

    validateInput(input) {
        if (!input) {
            throw new Error('단어를 입력해주세요.');
        }
        
        if (!/^[가-힣]+$/.test(input)) {
            throw new Error('한글만 입력 가능합니다.');
        }
        
        if (input.length < GAME_CONSTANTS.MIN_WORD_LENGTH || 
            input.length > GAME_CONSTANTS.MAX_WORD_LENGTH) {
            throw new Error(
                `단어 길이는 ${GAME_CONSTANTS.MIN_WORD_LENGTH}~${GAME_CONSTANTS.MAX_WORD_LENGTH}자여야 합니다.`
            );
        }

        return true;
    }

    getRandomLinePositions(wordLength) {
        const patterns = [
            // 가로줄 패턴들
            [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24],
            // 세로줄 패턴들
            [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24],
            // 대각선 패턴들
            [0,6,12,18,24], [4,8,12,16,20]
        ];
        
        const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
        const maxStart = this.gridSize - wordLength;
        const start = Math.floor(Math.random() * (maxStart + 1));
        
        return randomPattern.slice(start, start + wordLength);
    }

    updateGeneratedWords() {
        this.generatedWords = this.generatedWords.filter(word => 
            !this.correctWord.includes(word)
        );
        
        while (this.generatedWords.length < 25 - this.correctWord.length) {
            const newWord = this.chars[Math.floor(Math.random() * this.chars.length)];
            if (!this.correctWord.includes(newWord)) {
                this.generatedWords.push(newWord);
            }
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    startGame() {
        try {
            const userInput = this.elements.userWord.value.trim();
            this.validateInput(userInput);

            this.correctWord = userInput.split("");
            this.correctGuesses.clear();
            
            this.elements.congratsMessage.classList.add('hidden');
            this.elements.inputContainer.classList.add('hidden');
            this.elements.grid.classList.remove('hidden');
            this.elements.resetButton.classList.remove('hidden');
            this.elements.gameInstructions.classList.remove('hidden');
            
            if (this.speak) {
                this.speak(this.ttsMessages.instruction);
            }
            
            this.updateGeneratedWords();
            this.createGrid();
        } catch (error) {
            alert(error.message);
        }
    }

    createGrid() {
        this.elements.grid.innerHTML = "";
        const cells = [];
        this.shuffleArray(this.generatedWords);
        
        // 그리드의 모든 셀 생성
        for (let i = 0; i < this.gridSize * this.gridSize; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = this.generatedWords[i % this.generatedWords.length];
            cell.setAttribute('role', 'button');
            cell.setAttribute('tabindex', '0');
            cells.push(cell);
            this.elements.grid.appendChild(cell);
        }
        
        // 정답 단어 배치
        const linePositions = this.getRandomLinePositions(this.correctWord.length);
        linePositions.forEach((pos, i) => {
            cells[pos].textContent = this.correctWord[i];
            cells[pos].dataset.correct = this.correctWord[i];
        });
    }

    checkAnswer(cell) {
        if (cell.dataset.correct && !cell.classList.contains('correct')) {
            cell.classList.add("correct");
            this.correctGuesses.add(cell.dataset.correct);
            
            if (this.correctGuesses.size === this.correctWord.length) {
                setTimeout(() => {
                    this.elements.congratsMessage.classList.remove('hidden');
                    if (this.speak) {
                        this.speak(this.ttsMessages.correct);
                        // 약간의 딜레이 후 축하 메시지 재생
                        setTimeout(() => {
                            this.speak(this.ttsMessages.congratulation);
                        }, 1500);
                    }
                }, GAME_CONSTANTS.ANIMATION_DELAY);
            }
        } else if (!cell.classList.contains('wrong')) {
            cell.classList.add("wrong");
        }
    }

    resetGame() {
        if (this.speak) {
            this.speak(this.ttsMessages.start);
        }
        
        this.elements.userWord.value = "";
        this.elements.grid.innerHTML = "";
        this.correctWord = [];
        this.correctGuesses.clear();
        
        this.elements.resetButton.classList.add('hidden');
        this.elements.grid.classList.add('hidden');
        this.elements.congratsMessage.classList.add('hidden');
        this.elements.gameInstructions.classList.add('hidden');
        this.elements.inputContainer.classList.remove('hidden');
        this.elements.userWord.focus();
    }
}

// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    new WordGame();
});
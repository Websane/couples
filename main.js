(() => {
    //функция перемешивания с помощью алгоритма Фишера-Йетса
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
            // поменять элементы местами
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    //функция получения рандомного числа в заданном диапазоне
    function getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //функция получения массива рандомных неповторяющихся чисел
    function getArray(array, num) {
        for (let i = 1; num / 2 >= i; i++) {
            let randomNumber = getRandom(1, num / 2);
            if (!array.includes(randomNumber)) {
                array.push(randomNumber);
            } else {
                i--
            }
        }
    }

    document.addEventListener('DOMContentLoaded', () => {

        const container = document.querySelector('.container');
        const button = document.querySelector('.button');
        const input = document.getElementById('input');
        const root = document.getElementById('root');

        const newGameButton = document.createElement('button');
        const timerNumber = document.createElement('div');
        newGameButton.classList.add('newGame');
        newGameButton.textContent = 'Начать новую игру';

        let mainArray;
        let arrTouchCell = [];
        let count = 0;
        let targetValue = [];
        let arrDone = [];
        let timer;

        function checkElement() {
            if (arrTouchCell[0] === arrTouchCell[1]) {
                document.querySelectorAll('.cell-isActive').forEach((el) => {
                    el.classList.add('done');
                })
            } else {
                document.querySelectorAll('.cell-isActive').forEach((el) => {
                    if (!(el.classList.contains('done'))) {
                        el.classList.remove('cell-isActive');
                    }
                });
            }
            count = 0;
            arrTouchCell = [];
            checkDone();
            checkWin();
        }

        function checkDone() {
            document.querySelectorAll('.done').forEach((el) => {
                if (!(arrDone.includes(el))) {
                    arrDone.push(el);
                }
            })
        }

        function checkWin() {
            if (arrDone.length === mainArray.length) {
                alert('Поздравляю, вы выиграли!');
                clearInterval(timer);
                container.append(newGameButton);
            }
        }

        const gameStart = (ev) => {
            ev.preventDefault();

            resetGame();

            clearInterval(timer);
            let initialTime = 60;
            container.append(timerNumber);
            timerNumber.textContent = initialTime;
            timerNumber.classList.add('timer');
            timer = setInterval(() => {
                timerNumber.textContent = --initialTime;
                if (initialTime === 0) {
                    alert('Прискорбно, но вы слишком медленны');
                    resetGame();
                }
            }, 1000);

            root.innerHTML = '';
            let cellNumber = input.value;
            input.value = '';

            if (!(cellNumber % 2 === 0) || cellNumber === '' || cellNumber < 2 || cellNumber > 10) {
                cellNumber = 4;
            }

            root.style.gridTemplateColumns = `repeat(${cellNumber}, 1fr)`;

            const CELL_AMOUNT = Math.pow(cellNumber, 2);
            const initialArray = [];
            getArray(initialArray, CELL_AMOUNT);

            mainArray = initialArray.concat(initialArray);

            shuffleArray(mainArray);

            for (let i in mainArray) {
                const cell = document.createElement('li');
                cell.classList.add('cell');
                cell.textContent = mainArray[i];
                cell.value = i;
                root.append(cell);
            }
        }

        const gameLogical = (ev) => {
            // debugger
            if (ev.target.tagName === 'LI') {
                count++;
                targetValue.push(ev.target.value);
                if (count === 2 && (targetValue[0] === targetValue[1] || ev.target.classList.contains('done'))) {
                    count = 1;
                    targetValue.pop();
                } else if (ev.target.classList.contains('done')) {
                    count = 0;
                    targetValue = [];
                }

                if (!(ev.target.classList.contains('cell-isActive'))) {
                    ev.target.classList.add('cell-isActive');
                    arrTouchCell.push(ev.target.textContent);
                }

                if (count === 2 && targetValue[0] !== targetValue[1]) {
                    setTimeout(checkElement, 300);
                    targetValue = [];
                }
            }
        }

        const resetGame = () => {
            clearInterval(timer);
            root.innerHTML = '';
            arrDone = [];
            arrTouchCell = [];
            count = 0;
            targetValue = [];
            newGameButton.remove();
            timerNumber.remove();
        }

        button.addEventListener('click', gameStart);

        root.addEventListener('click', gameLogical);

        newGameButton.addEventListener('click', resetGame);

    });
})();

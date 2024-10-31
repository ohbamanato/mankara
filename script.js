// script.js
document.addEventListener('DOMContentLoaded', () => {
    const pits = document.querySelectorAll('.pit');
    const stores = {
        1: document.getElementById('player1-store'),
        2: document.getElementById('player2-store')
    };
    let currentPlayer = 1;
    const turnDisplay = document.getElementById('turn-display');
    const directionButtons = document.getElementById('direction-buttons');
    let selectedPit = null; // 選択したピット

    function updateTurnDisplay() {
        turnDisplay.innerText = `現在のターン: プレイヤー${currentPlayer}`;
    }

    updateTurnDisplay();

    pits.forEach(pit => {
        pit.addEventListener('click', () => {
            if (parseInt(pit.dataset.player) !== currentPlayer || pit.innerText === '0') return;

            selectedPit = pit; // 選択したピットを保持
            directionButtons.style.display = 'block'; // 方向選択ボタンを表示
        });
    });

    // 方向選択ボタンの処理
    document.getElementById('left-button').addEventListener('click', () => {
        if (selectedPit) moveStones(selectedPit, 'left'); // 左回りに移動
    });

    document.getElementById('right-button').addEventListener('click', () => {
        if (selectedPit) moveStones(selectedPit, 'right'); // 右回りに移動
    });

    function moveStones(pit, direction) {
        let stones = parseInt(pit.innerText);
        pit.innerText = 0;
        let currentPit = pit;

        while (stones > 0) {
            currentPit = getNextPit(currentPit, direction);
            currentPit.innerText = parseInt(currentPit.innerText) + 1;
            stones--;
        }

        if ((currentPlayer === 1 && currentPit === stores[1]) || (currentPlayer === 2 && currentPit === stores[2])) {
            updateTurnDisplay();
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateTurnDisplay();
        }

        directionButtons.style.display = 'none'; // 方向選択ボタンを隠す
        selectedPit = null; // 選択状態をリセット
    }

    function getNextPit(pit, direction) {
        const allPits = Array.from(document.querySelectorAll('.pit, .store'));
        let currentIndex = allPits.indexOf(pit);

        if (direction === 'left') {
            currentIndex = (currentIndex + 1) % allPits.length;
        } else if (direction === 'right') {
            currentIndex = (currentIndex - 1 + allPits.length) % allPits.length;
        }

        return allPits[currentIndex];
    }
});
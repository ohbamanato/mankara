// script.js
document.addEventListener('DOMContentLoaded', () => {
    const pits = document.querySelectorAll('.pit');
    const stores = {
        1: document.getElementById('player1-store'),
        2: document.getElementById('player2-store')
    };
    let currentPlayer = 1; // 現在のプレイヤー
    const turnDisplay = document.getElementById('turn-display');
    const directionButtons = document.getElementById('direction-buttons');
    let selectedPit = null; // 選択したピット

    // ターン表示を更新
    function updateTurnDisplay() {
        if (currentPlayer === 1) {
        turnDisplay.innerText = `現在のターン: プレイヤー1`;
        turnDisplay.style.color = 'blue'; // プレイヤー1の色を青に
    } else if (currentPlayer === 2) {
        turnDisplay.innerText = `現在のターン: プレイヤー2`;
        turnDisplay.style.color = 'red'; // プレイヤー2の色を赤に
    }
    }

    updateTurnDisplay();

    // 各ピットにクリックイベントを追加
    pits.forEach(pit => {
        pit.addEventListener('click', () => {
            if (parseInt(pit.dataset.player) !== currentPlayer || pit.innerText === '0') return;

            selectedPit = pit; // 選択したピットを保持
            directionButtons.style.display = 'block'; // 方向選択ボタンを表示
        });
    });

    // 左ボタンのイベントリスナー
    document.getElementById('left-button').addEventListener('click', () => {
        if (selectedPit) {
            if (currentPlayer === 1) {
                // プレイヤー1の処理（左ボタン）
                moveStones(selectedPit, 'right', currentPlayer);
            } else if (currentPlayer === 2) {
                // プレイヤー2の処理（左ボタン）
                moveStones(selectedPit, 'left', currentPlayer); // 例えばプレイヤー2は逆向きに回る場合
            }
        }
    });

    // 右ボタンのイベントリスナー
    document.getElementById('right-button').addEventListener('click', () => {
        if (selectedPit) {
            if (currentPlayer === 1) {
                // プレイヤー1の処理（右ボタン）
                moveStones(selectedPit, 'left', currentPlayer);
            } else if (currentPlayer === 2) {
                // プレイヤー2の処理（右ボタン）
                moveStones(selectedPit, 'right', currentPlayer); // 例えばプレイヤー2は逆向きに回る場合
            }
        }
    });

    // 石を選択した方向に動かす
    function moveStones(pit, direction) {
        let stones = parseInt(pit.innerText);
        pit.innerText = 0; // 選択したピットを空にする
        let currentPit = pit;

        while (stones > 0) {
            currentPit = getNextPit(currentPit, direction);

            currentPit.innerText = parseInt(currentPit.innerText) + 1;
            stones--;
        }

        // 最後の石がプレイヤーのストアに入った場合
        if (currentPit === stores[1] || currentPit === stores[2]) {
            updateTurnDisplay(); // 同じプレイヤーがもう一度
        } else {
            // ターンを交代
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateTurnDisplay();
        }

        directionButtons.style.display = 'none'; // 方向選択ボタンを非表示
        selectedPit = null; // 選択状態をリセット
    }

    // 次のピットを取得
    function getNextPit(pit, direction) {
        const allPits = [
            document.getElementById('player1-pit-0'),
            document.getElementById('player1-pit-1'),
            document.getElementById('player1-pit-2'),
            document.getElementById('player1-pit-3'),
            document.getElementById('player1-pit-4'),
            document.getElementById('player1-pit-5'),
            document.getElementById('player1-store'),
            document.getElementById('player2-pit-5'),
            document.getElementById('player2-pit-4'),
            document.getElementById('player2-pit-3'),
            document.getElementById('player2-pit-2'),
            document.getElementById('player2-pit-1'),
            document.getElementById('player2-pit-0'),
            document.getElementById('player2-store')
        ];
        let currentIndex = allPits.indexOf(pit);

        if (direction === 'left') {
            currentIndex = (currentIndex + 1) % allPits.length;
        } else if (direction === 'right') {
            currentIndex = (currentIndex - 1 + allPits.length) % allPits.length;
        }

        return allPits[currentIndex];
    }
});
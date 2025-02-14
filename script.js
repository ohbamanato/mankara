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
    let tmppit = null;
    let selectedPit = null; // 選択したピット
    const undoButton = document.createElement('button'); // 戻るボタン
    undoButton.innerText = '戻る';
    undoButton.style.display = 'none'; // 初期は非表示
    undoButton.style.position = 'absolute';
    undoButton.style.top = '50%';
    undoButton.style.right = '10px'; // ボードの左側に配置
    undoButton.style.transform = 'rotate(90deg)'; // 90度回転して横向き
    undoButton.style.transformOrigin = 'center';
    undoButton.style.padding = '10px';
    undoButton.style.fontSize = '16px';
    document.body.appendChild(undoButton);
    let gameHistory = []; // 盤面の履歴

    // ターン表示を更新
    function updateTurnDisplay() {
        const container = document.body; // 親要素を取得
        const board = document.querySelector('.board'); // 盤面
    
        if (currentPlayer === 1) {
            turnDisplay.innerText = `現在のターン: プレイヤー1`;
            turnDisplay.style.color = 'blue'; // プレイヤー1の色を青に
            turnDisplay.style.transform = 'rotate(0deg)'; // 通常表示
    
            // プレイヤー1の順番: turn-display → board → direction-buttons
            container.appendChild(turnDisplay);
            container.appendChild(board);
            container.appendChild(directionButtons);
    
        } else if (currentPlayer === 2) {
            turnDisplay.innerText = `現在のターン: プレイヤー2`;
            turnDisplay.style.color = 'red'; // プレイヤー2の色を赤に
            turnDisplay.style.transform = 'rotate(180deg)'; // 文字を上下反転
    
            // プレイヤー2の順番: direction-buttons → board → turn-display
            container.appendChild(directionButtons);
            container.appendChild(board);
            container.appendChild(turnDisplay);
        }
    }

    updateTurnDisplay();

    // 各ピットにクリックイベントを追加
    pits.forEach(pit => {
        pit.addEventListener('click', () => {
            if (parseInt(pit.dataset.player) !== currentPlayer || pit.innerText === '0') return;
            tmppit = selectedPit;
            selectedPit = pit; // 選択したピットを保持
            selectedPit.style.color = "white";
            directionButtons.style.display = 'block'; // 方向選択ボタンを表示
            tmppit.style.color = "black";
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

    function checkGameEnd() {
        const player1Pits = document.querySelectorAll('#player1-row .pit');
        const player2Pits = document.querySelectorAll('#player2-row .pit');
    
        // プレイヤー1またはプレイヤー2のピットの合計が0ならゲーム終了
        const player1Empty = [...player1Pits].every(pit => parseInt(pit.innerText) === 0);
        const player2Empty = [...player2Pits].every(pit => parseInt(pit.innerText) === 0);
    
        if (player1Empty) {
            winnerText = "プレイヤー青の勝ち！";
            turnDisplay.innerText = `ゲーム終了！\n${winnerText}`;
            endGame(winnerText);
            return true;
        }else if(player2Empty){
            winnerText = "プレイヤー赤の勝ち！";
            turnDisplay.innerText = `ゲーム終了！\n${winnerText}`;
            endGame(winnerText);
            return true;
        }
        return false;
    }
    
    function endGame() {
    
        // ゲーム終了メッセージ
        turnDisplay.style.fontSize = '24px';
        turnDisplay.style.textAlign = 'center';
        board.style.display = none;
    
        // 方向選択ボタンを非表示
        directionButtons.style.display = 'none';
    
        // すべてのピットをクリック不可にする
        pits.forEach(pit => pit.style.pointerEvents = 'none');
        undoButton.style.display = 'none'; // ゲーム終了時に「戻る」ボタンを消す
    }
    function saveGameState() {
        const state = {
            board: [...pits].map(pit => parseInt(pit.innerText)),
            stores: { 1: parseInt(stores[1].innerText), 2: parseInt(stores[2].innerText) },
            currentPlayer: currentPlayer
        };
        gameHistory.push(state);
        undoButton.style.display = 'block'; // 戻るボタンを表示
    }

    function undoMove() {
        if (gameHistory.length > 0) {
            const lastState = gameHistory.pop();
            [...pits].forEach((pit, index) => {
                pit.innerText = lastState.board[index];
            });
            stores[1].innerText = lastState.stores[1];
            stores[2].innerText = lastState.stores[2];
            currentPlayer = lastState.currentPlayer;
            updateTurnDisplay();
        }
        if (gameHistory.length === 0) {
            undoButton.style.display = 'none'; // 履歴がなければ非表示
        }
    }

    undoButton.addEventListener('click', undoMove);

    // 既存の moveStones 関数の最後にゲーム終了判定を追加
    function moveStones(pit, direction) {
        saveGameState(); // 盤面の状態を保存
        let stones = parseInt(pit.innerText);
        pit.innerText = 0; // 選択したピットを空にする
        let currentPit = pit;
    
        while (stones > 0) {
            currentPit = getNextPit(currentPit, direction);
            currentPit.innerText = parseInt(currentPit.innerText) + 1;
            stones--;
        }
        

        // ゲーム終了判定
        if (checkGameEnd()) return;

        // 最後の石がプレイヤーのストアに入った場合
        if (currentPit === stores[1] || currentPit === stores[2]) {
            updateTurnDisplay(); // 同じプレイヤーがもう一度
        } else {
            // ターンを交代
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateTurnDisplay();
        }
    
        selectedPit.style.color = "black";
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
            document.getElementById('player2-pit-0'),
            document.getElementById('player2-pit-1'),
            document.getElementById('player2-pit-2'),
            document.getElementById('player2-pit-3'),
            document.getElementById('player2-pit-4'),
            document.getElementById('player2-pit-5'),
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
// script.js
document.addEventListener('DOMContentLoaded', () => {
    const pits = document.querySelectorAll('.pit');
    const stores = {
        1: document.getElementById('player1-store'),
        2: document.getElementById('player2-store')
    };

    pits.forEach(pit => {
        pit.addEventListener('click', () => {
            const player = pit.dataset.player;
            let stones = parseInt(pit.innerText);
            pit.innerText = 0;

            let currentPit = pit;

            while (stones > 0) {
                currentPit = getNextPit(currentPit);
                currentPit.innerText = parseInt(currentPit.innerText) + 1;
                stones--;
            }
        });
    });

    function getNextPit(pit) {
        const allPits = Array.from(document.querySelectorAll('.pit, .store'));
        let nextIndex = (allPits.indexOf(pit) + 1) % allPits.length;
        return allPits[nextIndex];
    }
});
import { Game } from "./game.js";
import { GameJsonDeserializer } from "./game-json-deserializer.js";
import {GameJsonSerializer } from "./game-json-serializer.js";

let game = undefined;
const json = window.localStorage.getItem('connect-four');
if (json) {
    const deserializer = new GameJsonDeserializer(json);
    game = deserializer.deserialize();
    updateUi();
}

function updateUi() {
    const boardHolder = document.getElementById("board-holder");
    const gameName = document.getElementById("game-name");
    if (game === undefined) {
        boardHolder.classList.add("is-invisible");
    } else {
        boardHolder.classList.remove("is-invisible");
        gameName.innerHTML = game.getName();

        for (let columnIndex = 0; columnIndex <= 6; columnIndex += 1) {
            const isColumnFull = game.isColumnFull(columnIndex);
            const columnId = `column-${columnIndex}`;
            const column = document.getElementById(columnId);
            
            isColumnFull ? column.classList.add('full') : column.classList.remove('full');
        }

        for (let rowIndex = 0; rowIndex <= 5; rowIndex += 1) {
            for (let columnIndex = 0; columnIndex <= 6; columnIndex += 1) {
                const square = document.querySelector(`#square-${rowIndex}-${columnIndex}`);
                square.innerHTML = "";

                const playerNumber = game.getTokenAt(rowIndex, columnIndex);
                const token = document.createElement("div");
                if (playerNumber === 1) {
                    token.classList.add("token");
                    token.classList.add("black");
                    square.appendChild(token);
                } else if (playerNumber === 2) {
                    token.classList.add("token");
                    token.classList.add("red");
                    square.appendChild(token);
                }
            }
        }

        const currentPlayer = game.currentPlayer;
        const clickTargets = document.getElementById('click-targets');
        if (currentPlayer === 1) {
            clickTargets.classList.add("black");
            clickTargets.classList.remove("red");
        } else {
            clickTargets.classList.add("red");
            clickTargets.classList.remove("black");
        }
        
    }
}
window.addEventListener("DOMContentLoaded", () => {
    const nameOneInput = document.getElementById("player-1-name");
    const nameTwoInput = document.getElementById("player-2-name");
    const newGameButton = document.getElementById("new-game");

    function enableAndDisableNewGameButton() {
        let playerOneContent = nameOneInput.value;
        let playerTwoContent = nameTwoInput.value;

        newGameButton.disabled =
            playerOneContent.length === 0 || playerTwoContent.length === 0;
    }

    nameOneInput.addEventListener("keyup", () => {
        enableAndDisableNewGameButton();
    });

    nameTwoInput.addEventListener("keyup", () => {
        enableAndDisableNewGameButton();
    });

    newGameButton.addEventListener("click", () => {
        game = new Game(nameOneInput.value, nameTwoInput.value);
        nameOneInput.value = "";
        nameTwoInput.value = "";

        enableAndDisableNewGameButton();
        updateUi();
    });

    document
        .getElementById('click-targets')
        .addEventListener("click", (event) => {
            const targetId = event.target.id;
            if (!targetId.startsWith("column-")) return;

            const columnIndex = Number.parseInt(targetId[targetId.length - 1]);
            game.playInColumn(columnIndex);

            const serializer = new GameJsonSerializer(game);
            const json = serializer.serialize();
            window.localStorage.setItem('connect-four', json);
            updateUi();
           
        });
});

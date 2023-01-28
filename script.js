const cellDivs = document.querySelectorAll(".cell");

const Player = (name, type, image) => {
    let victories = 0;
    const GetType = () => type;
    const GetName = () => name;
    const GetImage = () => image;
    const AddVictory = () => victories ++;
    const GetVictories = () => victories;

    return {GetType, GetName, GetImage, AddVictory, GetVictories};
}

const Machine = (name, type, image) => {
    const prototype = Player(name, type, image);

    const RandomPlay = (array) =>{
        let validArray = [];
        for(let i =0; i < array.length; i++){
            if(array[i] != 'p' && array[i] != 'm'){
                validArray.push(array[i]);
            }
        }
        let randomIndex = Math.round(Math.random() * (validArray.length -1) );
        return validArray[randomIndex];
    }

    return Object.assign({}, prototype, {RandomPlay});
}

const GameManager = (player, machine, randomStart) =>{

    const GetTurn = () => currentTurn;
    const NextTurn = () => currentTurn = currentTurn == player ? machine : player;
    const GetRandomStartPlayer = () =>{
        return  Math.random() >= .5 ? player : machine;
    }
    
    let currentTurn = randomStart ? GetRandomStartPlayer() : player;
    let cellsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let winner = null;
    
    uiManager.UpdateTurn(currentTurn);

    const PlayAgain = () =>{
        cellsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        currentTurn = randomStart ? GetRandomStartPlayer() : player;
        winner = null;
        uiManager.UpdateTurn(currentTurn);
    }
    const GetWinner = () => {
        //Columns
        if(cellsArray[0] == cellsArray[3] && cellsArray[3] == cellsArray[6]){
            return cellsArray[0] == 'p' ? player : machine;
        }else if(cellsArray[1] == cellsArray[4] && cellsArray[4] == cellsArray[7]){
            return cellsArray[1] == 'p' ? player : machine;
        }else if(cellsArray[2] == cellsArray[5] && cellsArray[5] == cellsArray[8]){
            return cellsArray[2] == 'p' ? player : machine;
        }
        //Rows
        if(cellsArray[0] == cellsArray[1] && cellsArray[1] == cellsArray[2]){
            return cellsArray[0] == 'p' ? player : machine;
        }else if(cellsArray[3] == cellsArray[4] && cellsArray[4] == cellsArray[5]){
            return cellsArray[3] == 'p' ? player : machine;
        }else if(cellsArray[6] == cellsArray[7] && cellsArray[7] == cellsArray[8]){
            return cellsArray[6] == 'p' ? player : machine;
        }
        //Diagonal
        if(cellsArray[0] == cellsArray[4] && cellsArray[4] == cellsArray[8]){
            return cellsArray[0] == 'p' ? player : machine;
        }else if(cellsArray[2] == cellsArray[4] && cellsArray[4] == cellsArray[6]){
            return cellsArray[2] == 'p' ? player : machine;
        }

        /* for(let col = 0; col < 3; col ++){
            for(let i = currentColum; i < currentColum + 3; i ++){
                let currentCell = cellsArray[columns[i]]
                if(last == null || last == currentCell){
                    last = currentCell;
                    if(i == currentColum + 2){
                        return last == 'p' ? player : machine;
                    }
                }
                else{
                    last = null;
                    break;
                }
            }
            currentColum += 3;
        } */
        return null;
    }
    const GameOver = () =>{
        currentTurn.AddVictory();
        uiManager.GameOver(currentTurn);
    };
    const Play = (cell) =>{

        console.log(currentTurn.GetName());
        if(currentTurn == machine && event != null){
            console.log("returned");
            return;
        }

        let selectedCellIndex = cellsArray.indexOf(cell);

        if(selectedCellIndex < 0 || cellsArray[selectedCellIndex] == 'p' || cellsArray[selectedCellIndex] == 'm'){
            console.log("invalid cell number");
            return;
        }

        
        cellsArray[selectedCellIndex] = GetTurn() == player ? 'p' : 'm';

        uiManager.FillCell(selectedCellIndex, currentTurn);

        winner = GetWinner();
        if(winner != null){
            GameOver();
            return;
        }
        NextTurn();
        uiManager.UpdateTurn(currentTurn);
        if(currentTurn == machine){
            setTimeout(() => {  Play(machine.RandomPlay(cellsArray)); }, 500);
        }
    }
    if(currentTurn == machine){
        Play(machine.RandomPlay(cellsArray));
    }

    return {Play, PlayAgain, GetTurn, Restart};
}

const playSlide = document.querySelector('.play').querySelector('.slide');

const turnP = document.querySelector(".score-container .turn p");
const playerScoreDiv = document.querySelector(".container .play .player-score");
const machineScoreDiv = document.querySelector(".container .play .machine-score");

const gameOverDiv = document.querySelector(".gameover-container");
const gameOverTitle = gameOverDiv.querySelector(".container .winner p");
const gameOverpPayerScoreDiv = gameOverDiv.querySelector(".container .score .player-score");
const gameoverMachineScoreDiv = gameOverDiv.querySelector(".container .score .machine-score");

const UiManager = () => {
    const UpdateTurn = (turn) => {
        turnP.textContent = turn == player ? "Your turn" : "Machine Turn";
        if(turn.GetType() == 0){
            turnP.classList.add("cross");
        }else{
            turnP.classList.remove("cross");
        }
    }
    const FillCell = (index, turn) => {
        let img = cellDivs[index].querySelector("img");
        img.src = turn.GetImage();
        img.classList.add("tiled");
    }
    const GameOver = (winner) => {
        gameOverDiv.classList.add("active");
        let text = "GAMEOVER";

        let winnerDiv;
        let loserDiv;

        gameOverpPayerScoreDiv.querySelector('p').textContent = player.GetVictories();
        gameoverMachineScoreDiv.querySelector('p').textContent = machine.GetVictories();

        if(winner == player){
            console.log("lose");
            gameOverTitle.textContent = "You Win";
            winnerDiv = gameOverpPayerScoreDiv;
            loserDiv = gameoverMachineScoreDiv;
        }
        else{
            gameOverTitle.textContent = "You Lose";
            winnerDiv = gameoverMachineScoreDiv
            loserDiv = gameOverpPayerScoreDiv;
        }

        if(winner.GetType() == 0){
            gameOverTitle.classList.add("cross");
            turnP.classList.add("cross");
            winnerDiv.classList.add("cross");
            loserDiv.classList.remove("cross");

        }else{
            gameOverTitle.classList.remove("cross");
            turnP.classList.remove("cross");
            loserDiv.classList.add("cross");
            winnerDiv.classList.remove("cross");
        }

        if(winner){
            text += winner == player ? " - YOU WINN" : " - YOU LOSE";
        }
        turnP.textContent = "";

        gameOverDiv.classList.add("active");
        
    }
    const sleep = (milliseconds) => {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }
    const ResetBoard = () =>{
        let i =0;

        for(let i = 0; i < cellDivs.length; i++){
            RemoveTile(i);
        }
    }
    const RemoveTile = (index) => {
        let img = cellDivs[index].querySelector("img");
        img.classList.remove("tiled");;
    }
    const Reset = () =>{
        gameOverDiv.classList.remove("active");
        ResetBoard();

        console.log(playerScoreDiv);
        playerScoreDiv.querySelector("p").textContent = player.GetVictories();
        machineScoreDiv.querySelector("p").textContent = machine.GetVictories();
    }
    const Restart = () =>{
        Reset();
        Show();

        playSlide.classList.add('disabled');
        playSlide.classList.remove('clicked');
    }
    const Start = () => {
        playSlide.classList.add('clicked');
    }
    

    return {UpdateTurn, GameOver, ResetBoard, FillCell, Reset, Restart, Start}
}

const chooseTilesDiv = document.querySelector(".tile-slide");
const choosedTileImg = document.querySelector("#choosed-tile");

const playerScore = document.querySelector(".player-score");
const machineScore = document.querySelector(".machine-score");

function Play(cell){
    gameManager.Play(cell);
}
function PlayAgain(){
    uiManager.Reset();
    gameManager.PlayAgain();
}
function Restart(){
    uiManager.Restart();
}

let player = null;
let machine = null;
let gameManager = null;
const uiManager = UiManager(); 

function chooseTile(type){
    Hide();
    let playerImage = type == 0 ? "./images/cross.png" : "./images/circle.png";
    let machineImage = type == 1 ? "./images/cross.png" : "./images/circle.png";
    choosedTileImg.src = playerImage;

    player = Player("player", type, playerImage);
    machine = Machine("machine", type == 0 ? 1 : 0, machineImage);
    if(type == 0){
        playerScore.classList.add("cross");
        machineScore.classList.remove("cross");
    }
    else{
        machineScore.classList.add("cross");
        playerScore.classList.remove("cross");
    }

    playSlide.classList.remove("disabled");
}


function Hide(){
    chooseTilesDiv.classList.add("choosed");
}
function Show(){
    chooseTilesDiv.classList.remove("choosed");
}


function startGame(){

    uiManager.Start();
    gameManager = GameManager(player, machine, false);
}
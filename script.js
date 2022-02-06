const game_btn = document.querySelectorAll('[data-game-btn]');
const undo = document.getElementById('undo');
const turn = document.getElementById('turn');

const you = document.getElementById('you');
const tie = document.getElementById('tie');
const cpu = document.getElementById('cpu');

game_btn.forEach(btn => {
    btn.addEventListener('click', Clicked);
});

let firstTime = true;
let yourTurn = true

let win = false;

const possiblePlaysRef = [0,1,2,3,4,5,6,7,8];
let possiblePlays = possiblePlaysRef;

let Circle_Moves = [];
let X_moves = [];

const winning_combinations = [
    [0, 1, 2], // 0
    [3, 4, 5], // 1
    [6, 7, 8], // 2
    [0, 3, 6], // 3
    [1, 4, 7], // 4
    [2, 5, 8], // 5
    [0, 4, 8], // 6
    [2, 4, 6]  // 7
  ]

Start();

function turnCheck(){
    if(yourTurn){
        turn.classList.remove('circle');
        turn.classList.add('x');
    }
    else{
        turn.classList.remove('x');
        turn.classList.add('circle');
    }
}

function Start(){
    turnCheck();
    win = false;
    game_btn.forEach(btn => {
        btn.classList.remove('x');
        btn.classList.remove('circle');
    });

    Circle_Moves.length = 0;
    X_moves.length = 0;

    possiblePlays = possiblePlaysRef;

    if(firstTime){
        undo.addEventListener('click', () => { 
            Start(); 
            if(!yourTurn){
                setTimeout(AI, 700);
            }
        });
        firstTime = !firstTime;
    }
}

function Clicked(e){
    let btn = e.target;
    let btn_int = parseInt(btn.id);

    if(possiblePlays.includes(btn_int) === false){
        return;
    }
    if(win){
        return;
    }
    if(yourTurn){
        btn.classList.add('x');

        X_moves.push(btn_int);
        X_moves.sort((a, b) => {return a - b});

        possiblePlays = possiblePlays.filter(val => {
            return val != btn.id;
        })
        CheckWin('x');
    }
    else{
        return;
    }
    yourTurn = !yourTurn;
    turnCheck();
    setTimeout(AI, 700);
}

function AI(){
    let gamePlan = [];
    let array = [];
    let nextMove;
    // checkBoard Vars
    let cond = false;
    let points = 0;
    let move;

    if(possiblePlays.length == 0){
        return;
    }

    if(Circle_Moves.length == 0){
        let index = Math.floor(Math.random() * possiblePlays.length);
        nextMove = possiblePlays[index];
    }
    

    for (let i = 0; i < winning_combinations.length; i++) {
        const actualIndex = winning_combinations[i];
        points = 0;
        for (let j = 0; j < actualIndex.length; j++) {
            const actualResult = actualIndex[j];
            let condition1 = actualIndex.some(e => { return X_moves.includes(e) })
            let condition2 = actualIndex.every(e => {
                return game_btn[e].classList.contains('circle');
            })
            if(condition1 && condition2){
                break;
            }
            else{
                if(Circle_Moves.includes(actualResult)){
                    points++;
                }
            }
        }
        if(points == 2){
            let condition1 = actualIndex.some(e => { return X_moves.includes(e) })
            if(condition1){
                continue;
            }
            else{
                actualIndex.some(e => {
                    if(!Circle_Moves.includes(e)){
                        move = e;
                        cond = true;
                    }
                })
            }
        }
    }
    if (!cond) {
        for (let i = 0; i < winning_combinations.length; i++) {
            const actualIndex = winning_combinations[i];
            points = 0;
            for (let j = 0; j < actualIndex.length; j++) {
                const actualResult = actualIndex[j];
                let condition1 = actualIndex.some(e => { return Circle_Moves.includes(e) })
                let condition2 = actualIndex.every(e => {
                    return game_btn[e].classList.contains('x');
                })
                if(condition1 && condition2){
                    break;
                }
                else{
                    if(X_moves.includes(actualResult)){
                        points++;
                    }
                }
            }
            if(points == 2){
                let condition1 = actualIndex.some(e => { return Circle_Moves.includes(e) })
                if(condition1){
                    continue;
                }
                else{
                    actualIndex.some(e => {
                        if(!X_moves.includes(e)){
                            move = e;
                            cond = true;
                        }
                    })
                }
            }
        }

    }

    console.log(move);

    if(cond == true){
        nextMove = move;
    }
    else{
        try{
            if(Circle_Moves.length != 0){
                for(let i = 0; i < winning_combinations.length; i++){
                    let actualIndex = winning_combinations[i];
                    let condition1 = actualIndex.some(e => { return game_btn[e].classList.contains('x') })
                    let condition2 = actualIndex.some(e => { return game_btn[e].classList.contains('circle') })
                    if(!condition1 && condition2){
                        gamePlan.push(actualIndex);
                    }
                }
                for(let i = 0; i < gamePlan.length; i++){
                    let actualIndex = gamePlan[i];
                    let condition = actualIndex.some(e => {
                        if(Circle_Moves.includes(e) && !array.includes(e)){
                            array.push(e);
                        }
                    });
                }
                let index = Math.floor(Math.random() * gamePlan.length);
                let index2;
                let indexCondition = gamePlan[index].some(e => {
                    if(possiblePlays.includes(e)){
                        index2 = e;
                    }
                })
                nextMove = parseInt(game_btn[index2].id);
                console.log(index, index2, nextMove);
            }
        }
        catch{
            console.log('randomizing...')
            let index = Math.floor(Math.random() * possiblePlays.length);
            nextMove = possiblePlays[index];
        }
    }
    
    // add to circle_move
    Circle_Moves.push(nextMove);
    possiblePlays = possiblePlays.filter(val => {
        return val != nextMove;
    })
    
    game_btn[nextMove].classList.add('circle');
    CheckWin('circle');
    yourTurn = !yourTurn;
    turnCheck();
    cond = false;
}

function CheckWin(mark){
    let youscore = parseInt(you.textContent);
    let tiescore = parseInt(tie.textContent);
    let cpuscore = parseInt(cpu.textContent);

    let y = winning_combinations.some(a => {
        return a.every(x => {
            return game_btn[x].classList.contains(mark)
        })
    })
    if (y) {
        if(mark == 'x'){
            you.textContent = `${youscore + 1}`;
            win = true;
        }
        else{
            cpu.textContent = `${cpuscore + 1}`;
            win = true;
        }
    }

    if(possiblePlays.length == 0){
        console.log('tie');
        win = true;
        tie.textContent = `${tiescore + 1}`;
        return;
    }
}
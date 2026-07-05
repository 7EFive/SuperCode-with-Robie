//Template Variablen
const colorDisplays = document.querySelectorAll('.color-display');
const colorLists = document.querySelectorAll('.color-list');
const colorOptions = document.querySelectorAll('.color-option');

//Buttons zeigen und verstecken
const submit = document.querySelector("#submit-guess");
const submitOwn = document.querySelector("#submit-own-guess");
const reset = document.querySelector("#reset");

//Robie's sprites
const robie1 = document.querySelector("#robie_defult");
const robie2 = document.querySelector("#robie_dis");
const robie2a = document.querySelector("#robie_dis_last");
const robie3 = document.querySelector("#robie_hap");
const robie3a = document.querySelector("#robie_hap_last");
const robie3b = document.querySelector("#robie_lucky");
const robieNoNull = document.querySelector("#robie_noNull");

//Robie's dialogue
const dialogue = document.getElementById("chat-content");

//Lösungs text
const result = document.querySelector('.result');


reset.classList.add("hide");
moodSwitch(1);

//inGame Variablen
let colorRow =4;
let trys=8;
let colors =['red','blue','green','yellow','brown'];
let check_colors =['white','lavender','black'];

let black_count;
let code=[]
let currentTry= 0;
let gameEnd=false;
let win=false;
let firstTryCase="Me";
createCode();

//Zufällige Kombination
function createCode(){
    for (let i=0; i<colorRow; i++){
        let random_color = colors[Math.floor(Math.random() * colors.length)];
        code.push(random_color)
    }
    //console.log(code);
}
reset.addEventListener('click', function() {
    location.reload();
});

//Standart funktion
colorDisplays.forEach((display, index) => {
    display.addEventListener('click', () => {
        colorLists.forEach(list => list.classList.remove('show'));
        colorLists[index].classList.toggle('show');
    });
});

colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        const color = option.dataset.color;
        const display = option.parentNode.previousElementSibling; 
        if (color) {
            display.style.backgroundColor = color;
            display.dataset.color=color;
            option.parentNode.classList.toggle('show');
        } else {
            option.parentNode.classList.toggle('show');
        }
    });
});

//Erstellung eigener Kombination
submit.addEventListener('click', submitGuess);

document.querySelectorAll('.color-select').forEach(select => {
  select.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', function() {
      select.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
});


submitOwn.addEventListener('click', submitOwnGuess);

function submitOwnGuess() {

    let ownCode = Array.from(document.querySelectorAll('.color-select')).map(select => {
    const selected = select.querySelector('.color-option.selected');
    return selected ? selected.dataset.color : null;
    });
    const hasNull = ownCode.some(element => element === null);
    if(hasNull){
        moodSwitch(0);
    }else{
        code=ownCode;
        firstTryCase ="your oponent"
        moodSwitch(1);
        document.querySelectorAll('.color-display').forEach(display => {
        display.removeAttribute('data-color');
        display.style.backgroundColor = "transparent"; 
        });
        document.getElementById("submit-guess").textContent = "Submit Guess";
        submitOwn.classList.add("hide");
        dialogue.textContent = "Oi, now i can lay back and enjoy the show! Let's see if you will be able to crack a human-made Supe Code from the other Player.";
    }
  
    
}

//HauptSubmit Knopf
function submitGuess() {

    if(!gameEnd){
        
        black_count=0;
        let displays = document.querySelectorAll('.color-select .color-display');
        let input_colors_arr = [];
    
        for (let display of displays) {
            input_colors_arr.push(display.dataset.color || null);
        }
        console.log('Selected colors:', input_colors_arr);
        const hasNull = input_colors_arr.some(element => element === null);
        if(hasNull){
            moodSwitch(0);
        }else{
            moodSwitch(1);
            firstTryCase;
            currentTry++;
            show('.guess-item',input_colors_arr,false);
            //console.log("still "+ currentTry);
            let hint= showAnswer(code, input_colors_arr,);
            show('.guess-result .guess-result-item',hint,true);
            dialogue.innerHTML = `
                Small tip here:
                <span style="color:black; text-decoration-line: underline;">black circles</span> represent the 
                <span style="text-decoration: underline; color:black;">correct colors</span> in
                <span style="text-decoration: underline; color:black;">correct positions</span> and 
                <span style="color:darkgray; text-decoration-line: underline;">light grey circles</span> are also 
                <span style="text-decoration: underline; color:darkgray;">right colors</span>, but in a 
                <span style="text-decoration: underline; color:darkgray;">wrong sequence</span>.`;
        }
        
    }
    gameCondition();
    if(currentTry>0){
        submitOwn.classList.add("hide");
        document.getElementById("submit-guess").textContent = "Submit Guess";
    }
}
//Position-Vorhersage-Darstellung Funktion
function showAnswer(code, guess) {

    let codeCopy = [...code];
    let guessCopy = [...guess];
    let checked_code = [];

    for (let i = 0; i < codeCopy.length; i++) {

        if (codeCopy[i] === guessCopy[i]) {
            checked_code.push('black');
            codeCopy[i] = null;
            guessCopy[i] = null;
            black_count++;
        }
    }

    for (let i = 0; i < codeCopy.length; i++) {
        if (codeCopy[i] !== null) {
            let index = guessCopy.indexOf(codeCopy[i]);
            if (index !== -1) {
                checked_code.push('lavender');
                guessCopy[index] = null;
                codeCopy[i] = null;
            }
        }
    }
    if(black_count===4){
        win=true;
    }
    console.log(checked_code);
    return checked_code;
}

//Zeigt die eigene ausgewählten Farben  
function show(lable,colors,hints){
    const guessRow = document.getElementById('try-'+currentTry)
    const guessItems = guessRow.querySelectorAll(lable);
    if(hints){
        colors.forEach((check_colors, i) => {
            if (guessItems[i]) {
                guessItems[i].style.backgroundColor = check_colors ;
                guessItems[i].dataset.check_colors = check_colors;
            }
        });
    }else{
        colors.forEach((color, i) => {
            if (guessItems[i].style.backgroundColor != null) {
                guessItems[i].style.backgroundColor = color || 'white';
                guessItems[i].dataset.color = color || '';
            }
        });
    }
}
//Funktion zur Überprüfung des Spielstandes
function gameCondition(){
    
    var specEmotions;
    if(black_count>=colorRow){
        gameEnd=true;
        if(currentTry==1){
            dialogue.textContent = "FIRST TRY?! UNBELIVALBE! Is it realy luck or do you just know "+ firstTryCase+" THAT well?";
            moodSwitch(6);
            reverseButtons();
        }else { 
            dialogue.textContent ="";
            if(currentTry==8){
                dialogue.textContent = "That was REALY close! ";
                moodSwitch(5);
            }else{
                moodSwitch(4);
            }
            dialogue.textContent += "You cracked the code! Job well done! Take another try, if you want!";
            
            reverseButtons();
        }
    }
    else if(currentTry>=trys){
        colorOptionOff();
        
        dialogue.textContent ="";
        if(black_count==3){
            dialogue.textContent = "You were that close... . ";
            moodSwitch(3);
        }else{
            moodSwitch(2);
        }
        dialogue.textContent += "Welp..., You tried your best! Maybe it will work next time!";
        gameEnd=true;
        reverseButtons();
    }
}
//Zeigt den Reset Button
function reverseButtons(){
    submit.classList.add("hide");
    reset.classList.remove("hide");
}
//Lösung Darstellung bei Niederlage
function colorOptionOff(){
    document.querySelector('.color-options').classList.add('hide');
    let translated=[];
    for (let i = 0; i < code.length; i++) {
            switch(code[i]) {
                case 'red':
                    translated.push('<span style="color:red;">red</span>');
                    console.log("red");
                    break;
                case 'blue':
                    translated.push('<span style="color:blue;">blue</span>');
                    console.log("blue");
                break;
                case 'green':
                    translated.push('<span style="color:green;">green</span>');
                    console.log("green");
                break;
                case 'yellow':
                    translated.push('<span style="color:#FFBF00;">yellow</span>');
                    console.log("yellow");
                break;
                case 'brown':
                    translated.push('<span style="color:brown;">brown</span>');
                    console.log("brown");
                default:
            console.log("Error");
        }
    }
    document.getElementById("lower-content-text").innerHTML = `
                The actual Result: <p>`+translated+`</p>`;
}

//Emotionen von Robie
function moodSwitch(i){
    hideAll();
    switch(i) {
        case 0:
            robieNoNull.classList.remove("hide");
            dialogue.textContent = "Nope! Empty spots don't count as a valid imput and can't be part of a secret code. So try to fill every spot next time, ok?";
        break;
        case 1:
            robie1.classList.remove("hide");
        break;
        case 2:
            robie2.classList.remove("hide");
            console.log("You you lost");
        break;
        case 3:
            robie2a.classList.remove("hide");
            console.log("You nearly won!");
        break;
        case 4:
            robie3.classList.remove("hide");
            console.log("You won");
        break;
        case 5:
            robie3a.classList.remove("hide");
            console.log("You won on last try!");
        break;
        case 6:
            robie3b.classList.remove("hide");
            console.log("You won on first guess!");
        break;
        default:
            console.log("Error");
    } 
}
//Reset der Emotionen von Robie
function hideAll(){
    robie1.classList.add("hide");
    robie2.classList.add("hide");
    robie2a.classList.add("hide");
    robie3.classList.add("hide");
    robie3a.classList.add("hide");
    robie3b.classList.add("hide");
    robieNoNull.classList.add("hide");
}




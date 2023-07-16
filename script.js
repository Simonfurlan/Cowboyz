function setStyleSheet(url){
        var stylesheet = document.getElementById("stylesheet");
        stylesheet.setAttribute('href', url);
}


width = window.innerWidth;
if (width < 701) {
        setStyleSheet('mobile.css');
} else if (width < 1300) {
        setStyleSheet('tablet.css');
} else { 
        setStyleSheet('styles.css');
}


class Queue {
        constructor() {
          this.elements = {};
          this.head = 0;
          this.tail = 0;
        }
        enqueue(element) {
          this.elements[this.tail] = element;
          this.tail++;
        }
        dequeue() {
          const item = this.elements[this.head];
          delete this.elements[this.head];
          this.head++;
          return item;
        }
        peek() {
          return this.elements[this.tail - 1];
        }
        get length() {
          return this.tail - this.head;
        }
        get isEmpty() {
          return this.length === 0;
        }
}


const cardContainer = document.querySelector('.card-container');
const cardContainerCpu = document.querySelector('.card-container-cpu');
const pileContainer = document.querySelector('.pile');
const messageBox = document.querySelector('.console'); 
const multiplierBox = document.querySelector('.multiplier');
const playerButton = document.getElementById('playerBtn');
playerButton.addEventListener('click', playerButtonPressed);

const startAmount = 5;

let playerTurn = 1;
PlayerWon = 0;
CpuWon = 0;

PlayerShownTrigger = 1;

threasholdCpu = randomBetween(0, 4);


let draw1 = 0;
let draw2 = 0;
let show = 0;
let pick1 = 0;
let pick2 = 0;
let pick3 = 0;

let Deck = [
        "draw1Morning", "draw1Day", "draw1Evening", "draw1Night",
        "draw2Morning", "draw2Day", "draw2Evening", "draw2Night",
        "showMorning", "showDay", "showEvening", "showNight",
        "yeanoMorning", "yeanoDay", "yeanoEvening", "yeanoNight",
        "pick1Morning", "pick1Day", "pick1Evening", "pick1Night",
        "pick2Morning", "pick2Day", "pick2Evening", "pick2Night",
        "pick3Morning", "pick3Day", "pick3Evening", "pick3Night",
        "skipMorning", "skipDay", "skipEvening", "skipNight",
        "cowboyCow"
        ]

let Pile = new Queue();
let CpuCards = [];


//Cpu Won Function

function CpuWonShow(){
        //ToDo
}

//Player Won Function

function PlayerWonShow(){
        if (!PlayerShownTrigger){
                return false;
        }
        if(PlayerWon && !CpuWon){
                cardsLeft = cardContainerCpu.children.length;
                for (let i = 0; i < cardsLeft; i++) {
                        cardContainerCpu.removeChild(cardContainerCpu.lastChild);
                }
                for (let i = 0; i < cardsLeft; i++) {
                        pickCardCpuShow(CpuCards[i]);
                }
                PlayerShownTrigger = 0;
        }
        else{
                alert("Error PlayerWonShow function");
        }
}

// Pick and Throw and Draw

function drawFromCpu(amount){
        for (let i = 0; i < amount; i++) {
                if(cardContainerCpu.children.length > 0){
                        if (CpuCards.length == cardContainerCpu.children.length) {
                                tmpCard = CpuCards.pop();
                                pickCard(tmpCard);
                                cardContainerCpu.removeChild(cardContainerCpu.lastChild);
                        }
                        else{
                                alert("Error Cpu List to Card missmatch CpuCards.length: " + CpuCards.length + " != cardContainerCpu.children.length: " + cardContainerCpu.children.length);
                        }
                }
                else{
                        messageBox.innerHTML = "Cpu won!";
                        CpuWon = 1;
                        CpuWonShow();
                }
        }
        if (CpuCards.length == 0){
                messageBox.innerHTML = "Cpu won!";
                CpuWon = 1;
                CpuWonShow();
        }
}

function playerButtonPressed(){

        if (CpuWon || PlayerWon){
                return false;
        }

        if (playerTurn){
                if ((draw1 + draw2 + show + pick1 + pick2 + pick3) == 0){
                        //Case: No playable card, pick 1
                        pickCard(Pile.dequeue());
                        playerTurn = 0;
                        messageBox.innerHTML = "Cpu checking...";
                        setTimeout(() => {decideCpu()}, 2000);        
                }
                else{
                        //Take attack
                        switch(true) {
                                case draw1 > 0:
                                        drawFromCpu(draw1);
                                        draw1 = 0;
                                        break;
                                case draw2 > 0:
                                        drawFromCpu(draw2 * 2);
                                        draw2 = 0;
                                        break;
                                case show > 0:
                                        // ToDo
                                        show = 0;
                                        break;
                                case pick1 > 0:
                                        for (let i = 0; i < pick1; i++) {
                                                if(!Pile.isEmpty){
                                                        pickCard(Pile.dequeue());
                                                }
                                        }
                                        pick1 = 0;
                                        break;
                                case pick2 > 0:
                                        for (let i = 0; i < pick2*2; i++) {
                                                if(!Pile.isEmpty){
                                                        pickCard(Pile.dequeue());
                                                }
                                        }
                                        pick2 = 0;
                                        break;
                                case pick3 > 0:
                                        for (let i = 0; i < pick3*3; i++) {
                                                if(!Pile.isEmpty){
                                                        pickCard(Pile.dequeue());
                                                }
                                        }
                                        pick3 = 0;
                                        break;
                                default:
                                  alert("Error taking attack")
                        }
                        playerButton.innerHTML = "Pick 1";
                        printMultiplier();
                }
        }
        else {
                messageBox.innerHTML = "Not your turn";
        }
}

function pickCard(type) {

        if (PlayerWon){
                return false;
        }
        if (CpuWon){
                return false;
        }

        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('id', type);
        card.style.backgroundImage = `url(${type}.png)`;
        cardContainer.appendChild(card);
        card.addEventListener('click', function() {

                if (CpuWon){
                        return false;
                }

                if (validateTurn(type)){
                        if (cardContainer.children.length > 0) {
                                throwCard(type);
                                cardContainer.removeChild(document.getElementById(type));

                                if (cardContainer.children.length == 0 && ((draw1 + draw2 + pick1 + pick2 + pick3) == 0)){
                                        PlayerWon = 1;
                                        PlayerWonShow();
                                }
                        }
                }
        });
}

function pickCardCpu(type) {
        const card = document.createElement('div');
        card.classList.add('card-cpu');
        card.setAttribute('id', type);
        card.style.backgroundImage = `url(back.png)`;
        cardContainerCpu.appendChild(card);
        CpuCards.push(type);
}

function pickCardCpuShow(type) {
        const card = document.createElement('div');
        card.classList.add('card-cpu');
        card.setAttribute('id', type);
        card.style.backgroundImage = `url(${type}.png)`;
        cardContainerCpu.appendChild(card);
}

function pickCardCpuHide(type) {
        const card = document.createElement('div');
        card.classList.add('card-cpu');
        card.setAttribute('id', type);
        card.style.backgroundImage = `url(back.png)`;
        cardContainerCpu.appendChild(card);
}

function throwCard(type) {
        Pile.enqueue(type);
        updatePile();
        if (!playerTurn){
                messageBox.innerHTML = "Cpu checking...";
                setTimeout(() => {decideCpu()}, 2000);
        }
}

function shuffle(n) {
        let currentIndex = n.length,  randomIndex;
        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [n[currentIndex], n[randomIndex]] = [n[randomIndex], n[currentIndex]];
        }
        return n;
      }

function updatePile() {
        if (pileContainer.children.length > 0) {
                pileContainer.removeChild(pileContainer.firstChild);
        };
        const card = document.createElement('div');
        card.classList.add('pile');
        card.style.backgroundImage = `url(${Pile.peek()}.png)`;
        pileContainer.appendChild(card);
        printMultiplier();
}

// CPU

function deleteItemCpu(string) {
        const index = CpuCards.indexOf(string);
      
        if (index !== -1) { 
          const lastElement = CpuCards[CpuCards.length - 1]; 
          CpuCards[index] = lastElement; 
          CpuCards.pop();
          if (cardContainerCpu.children.length > 0) {
                cardContainerCpu.removeChild(cardContainerCpu.lastChild);
          }
        }
        else {
            return false;
        }
      
        return true; 
}

function throwCpu(type) {
        if(deleteItemCpu(type)){
                Pile.enqueue(type);
                updatePile();
                if (cardContainerCpu.children.length == 0 && ((draw1 + draw2 + pick1 + pick2 + pick3) == 0)){
                        CpuWon = 1;
                        messageBox.innerHTML = "Cpu won!";
                        CpuWonShow();
                }
                return true;
        }
        else
        {
                alert("Cpu thrown Card not found");
                return false
        }

}

function checkRespondCard(type) {
        tmpType = extractType(type);

        if (draw1 >= 1 && tmpType.includes("draw1") && Pile.peek().includes("draw1")) {
                return true;
        }
        else if (draw2 >= 1 && tmpType.includes("draw2") && Pile.peek().includes("draw2")) {
                return true;
        }
        else if (show >= 1 && tmpType.includes("show") && Pile.peek().includes("show")) {
                return true;
        }
        else if (pick1 >= 1 && tmpType.includes("pick1") && Pile.peek().includes("pick1")) {
                return true;
        }
        else if (pick2 >= 1 && tmpType.includes("pick2") && Pile.peek().includes("pick2")) {
                return true;
        }
        else if (pick3 >= 1 && tmpType.includes("pick3") && Pile.peek().includes("pick3")) {
                return true;
        } 
        else if (tmpType.includes("yeano") && checkTime(type) && (!(Pile.peek().includes("yeano")))) {
                return true;
        } 
        else if (tmpType.includes("cowboy")) {
                return true;
        } 
        else {
                return false;
        }
}

function validateCpu(type){
        if (!checkRespondCard(type)){
                return false;
        }

        messageBox.innerHTML = "Cpu counters with: " + type;
        return true;
}

function decideCpu() {
        if (CpuWon){
                return false;
        }

        if ((draw1 + draw2 + show + pick1 + pick2 + pick3) == 0) {
                if (cardContainer.children.length == 0){
                        PlayerWon = 1;
                        messageBox.innerHTML = "Player won!";
                        PlayerWonShow();
                        return false;
                }
                // Case: no attack
                let cardFound = 0;
                for (let i = 0; i < CpuCards.length; i++) {
                        if (checkAttack(CpuCards[i]) && checkTime(CpuCards[i]) && (!(CpuCards[i].includes("yeano"))) && (!(CpuCards[i].includes("cowboy")))) {
                                if(!initAttack(CpuCards[i])){
                                        //Case skip
                                        messageBox.innerHTML = "Cpu throws: " + CpuCards[i];
                                        throwCpu(CpuCards[i]);
                                        setTimeout(() => {decideCpu()}, 2000);
                                        return false;
                                }
                                cardFound = 1;
                                messageBox.innerHTML = "Cpu throws: " + CpuCards[i];
                                throwCpu(CpuCards[i]);
                                break;
                        }
                }

                if(!cardFound && isDefensive()){
                        if (cardContainer.children.length == 0){
                                PlayerWon = 1;
                                messageBox.innerHTML = "Player won!";
                                PlayerWonShow();
                                return false;
                        }

                        //alert("damage: " + damage + " threashold: " + threasholdCpu);
                        for (let i = 0; i < CpuCards.length; i++) {
                                if (validateCpu(CpuCards[i])) {
                                        respondAttack(CpuCards[i]);
                                        throwCpu(CpuCards[i]);
                                        cardFound = 1;
                                        break;
                                }
                        }
                }

                if(!cardFound) {
                        messageBox.innerHTML = "Cpu picks card";
                        // pick up one
                        pickCardCpu(Pile.dequeue());
                }
        }
        else {
                let damage = calculateDamage();
                // Case: respond attack
                let cardFound = 0;
                for (let i = 0; i < CpuCards.length; i++) {
                        if (validateCpu(CpuCards[i]) && (!(CpuCards[i].includes("yeano"))) && (!(CpuCards[i].includes("cowboy")))) {
                                respondAttack(CpuCards[i]);
                                throwCpu(CpuCards[i]);
                                cardFound = 1;
                                break;
                        }
                }

                if(!cardFound && (damage >= threasholdCpu)){

                        if (cardContainer.children.length == 0 && ((draw1 + draw2 + pick1 + pick2 + pick3) == 0)){
                                PlayerWon = 1;
                                messageBox.innerHTML = "Player won!";
                                PlayerWonShow();
                                return false;
                        }

                        //alert("damage: " + damage + " threashold: " + threasholdCpu);
                        for (let i = 0; i < CpuCards.length; i++) {
                                if (validateCpu(CpuCards[i])) {
                                        respondAttack(CpuCards[i]);
                                        throwCpu(CpuCards[i]);
                                        cardFound = 1;
                                        break;
                                }
                        }
                }
                
                if(!cardFound) {

                        if (cardContainer.children.length == 0 && ((draw1 + draw2 + pick1 + pick2 + pick3) == 0)){
                                PlayerWon = 1;
                                messageBox.innerHTML = "Player won!";
                                PlayerWonShow();
                                return false;
                        }

                        // take attack
                        messageBox.innerHTML = "Cpu taking attack";
                        if (show > 0){
                                takeAttackCpu();
                                setTimeout(() => {
                                        hideCardsCpu();
                                        decideCpu();
                                }, 4000); //After taking, cpus turn, and show activ
                        }
                        else{
                                takeAttackCpu();
                                setTimeout(() => {decideCpu()}, 2000); //After taking, cpus turn
                        }
                        return false;
                }
                
        }
        playerTurn = 1;

        console.log(CpuCards);
}

function isDefensive(){
        for (let i = 0; i < CpuCards.length; i++) {
                if(CpuCards[i].includes("yeano") || CpuCards[i].includes("cowboy")){
                        
                }
                else{
                        return false;
                }
        }
        return true;
}

function calculateDamage(){
        switch(true) {
                case draw1 > 0:
                        if(cardContainer.children.length <= (draw1*2)){
                                return 10;
                        }
                        return draw1 * 2;
                case draw2 > 0:
                        if(cardContainer.children.length <= (draw2*2)){
                                return 10;
                        }
                        return draw2 * 2;
                case show > 0:
                        return show;
                case pick1 > 0:
                        return pick1;
                case pick2 > 0:
                        return pick2 * 2;
                case pick3 > 0:
                        return pick3 * 3;
                default:
                        return 0;
        }
}

function randomBetween(min, max) { // min and max included 
        rnd = Math.random();
        //console.log(rnd);
        return Math.floor(rnd * (max - min + 1) + min)
}      

function drawFromPlayer(amount){
        for (let i = 0; i < amount; i++) {
                if (cardContainer.children.length > 0){
                        tmpCards = cardContainer.children;
                        rndCard = tmpCards[randomBetween(0, (tmpCards.length - 1))];
                        //Add Card to Cpu
                        pickCardCpu(rndCard.id);

                        //alert("removing: " + rndCard.id);
                        //Delete Player Card
                        rndCard.remove();
                }
                else
                {
                        messageBox.innerHTML = "Player won!"
                        PlayerWon = 1;
                        PlayerWonShow();
                }
        }
        //console.log(CpuCards);
}

function takeAttackCpu(){
        switch(true) {
                case draw1 > 0:
                        drawFromPlayer(draw1);
                        draw1 = 0;
                        break;
                case draw2 > 0:
                        drawFromPlayer(draw2 * 2);
                        draw2 = 0;
                        break;
                case show > 0:
                        messageBox.innerHTML = "Cpu presenting cards...";
                        showCardsCpu();
                        show = 0;
                        break;
                case pick1 > 0:
                        for (let i = 0; i < pick1; i++) {
                                if(!Pile.isEmpty){
                                        pickCardCpu(Pile.dequeue());
                                }
                        }
                        pick1 = 0;
                        break;
                case pick2 > 0:
                        for (let i = 0; i < pick2*2; i++) {
                                if(!Pile.isEmpty){
                                        pickCardCpu(Pile.dequeue());
                                }
                        }
                        pick2 = 0;
                        break;
                case pick3 > 0:
                        for (let i = 0; i < pick3*3; i++) {
                                if(!Pile.isEmpty){
                                        pickCardCpu(Pile.dequeue());
                                }
                        }
                        pick3 = 0;
                        break;
                default:
                  alert("Error taking attack (Cpu)");
        }
}

function showCardsCpu(){
        if((cardContainerCpu.children.length > 0) && (CpuCards.length > 0)){
                cardsLeft = cardContainerCpu.children.length;
                for (let i = 0; i < cardsLeft; i++) {
                        cardContainerCpu.removeChild(cardContainerCpu.lastChild);
                }
                for (let i = 0; i < cardsLeft; i++) {
                        pickCardCpuShow(CpuCards[i]);
                }
        }
        else{
                alert("Error showCardsCpu function");
        }
        
}

function hideCardsCpu(){
        if((cardContainerCpu.children.length > 0) && (CpuCards.length > 0)){
                cardsLeft = cardContainerCpu.children.length;
                for (let i = 0; i < cardsLeft; i++) {
                        cardContainerCpu.removeChild(cardContainerCpu.lastChild);
                }
                for (let i = 0; i < cardsLeft; i++) {
                        pickCardCpuHide(CpuCards[i]);
                }
        }
        else{
                alert("Error hideCardsCpu function");
        }
}
// LOGIC

function initialize(){
        let tmpPile = shuffle(Deck);

        for (let i = 0; i < 33; i++) {
                Pile.enqueue(tmpPile[i]);
        }

        updatePile();

        for (let i = 0; i < startAmount; i++) {
                pickCard(Pile.dequeue());
        }

        for (let i = 0; i < startAmount; i++) {
                pickCardCpu(Pile.dequeue());
        }

        switch(threasholdCpu) {
                case 0:
                        messageBox.innerHTML = "Cpu-status: Defensive";
                break;
                case 1:
                        messageBox.innerHTML = "Cpu-status: Calm";
                break;
                case 2:
                        messageBox.innerHTML = "Cpu-status: Normal";
                break;
                case 3:
                        messageBox.innerHTML = "Cpu-status: Upset";
                break;
                case 4:
                        messageBox.innerHTML = "Cpu-status: Angry";
                break;
                default:
                  alert("Error Cpu anger identification")
              }

        console.log(CpuCards);
        console.log("threasholdCpu: " + threasholdCpu);
}

function checkTime(type) {
        tmpType = "Day";

        if (type.includes("Morning")) {
                tmpType = "Morning";
        }
        else if (type.includes("Evening")){
                tmpType = "Evening";
        }
        else if (type.includes("Night")){
                tmpType = "Night";  
        }
        else if (type.includes("cowboy")){
                return true;
        }

        return !(Pile.peek().includes(tmpType));
}

function extractType(type) {

        tmpType = "draw1";

        if (type.includes("draw2")) {
                tmpType = "draw2";
        }
        else if (type.includes("show")){
                tmpType = "show";
        }
        else if (type.includes("yeano")){
                tmpType = "yeano";  
        }
        else if (type.includes("pick1")){
                tmpType = "pick1";  
        }
        else if (type.includes("pick2")){
                tmpType = "pick2";  
        }
        else if (type.includes("pick3")){
                tmpType = "pick3";  
        }
        else if (type.includes("skip")){
                tmpType = "skip";  
        }
        else if (type.includes("cowboy")){
                tmpType = "cowboy";  
        }
        return tmpType;
}

function checkAttack(type) {
        tmpType = extractType(type);

        if (tmpType.includes("cowboy")){
                return true;
        }

        if (tmpType.includes("yeano") && (!(Pile.peek().includes("yeano")))){
                return true;
        }

        if (draw1 >= 1 && tmpType.includes("draw1") && Pile.peek().includes("draw1")) {
                return true;
        }
        else if (draw2 >= 1 && tmpType.includes("draw2") && Pile.peek().includes("draw2")) {
                return true;
        }
        else if (show >= 1 && tmpType.includes("show") && Pile.peek().includes("show")) {
                return true;
        }
        else if (pick1 >= 1 && tmpType.includes("pick1") && Pile.peek().includes("pick1")) {
                return true;
        }
        else if (pick2 >= 1 && tmpType.includes("pick2") && Pile.peek().includes("pick2")) {
                return true;
        }
        else if (pick3 >= 1 && tmpType.includes("pick3") && Pile.peek().includes("pick3")) {
                return true;
        } 
        else {
                return !(Pile.peek().includes(tmpType));
        }
}

function validateTurn(type){
        if (!playerTurn){
                messageBox.innerHTML = "Not your turn!"
                return false;
        }

        if (!checkTime(type)) {
                messageBox.innerHTML = "Same DAYTIME is not allowed!"
                return false;
        }

        if (!checkAttack(type)) {
                messageBox.innerHTML = "Same TYPE is not allowed!"
                return false;
        }

        if ((draw1 + draw2 + show + pick1 + pick2 + pick3) == 0){
                // Case: Init attack
                if (!initAttack(type)) {
                        return true;
                }
        }
        else {
                // Case: Respond attack   
                if (!respondAttack(type)){
                        messageBox.innerHTML = "Respond to your opponents attack";
                        return false;
                }
        }
        playerTurn = 0;
        return true;
}

function initAttack(type) {
        switch(extractType(type)) {
                case "draw1":
                        draw1++;
                        if (!playerTurn){
                                playerButton.innerHTML = "Draw " + draw1; 
                        }
                break;
                case "draw2":
                        draw2++;
                        if (!playerTurn){
                                playerButton.innerHTML = "Draw " + draw2 * 2; 
                        }
                break;
                case "show":
                        show++;
                        if (!playerTurn){
                                playerButton.innerHTML = "Show "; 
                        }
                break;
                case "yeano":
                        //Nothing
                break;
                case "pick1":
                        pick1++;
                        if (!playerTurn){
                                playerButton.innerHTML = "Pick " + pick1; 
                        }
                break;
                case "pick2":
                        pick2++;
                        if (!playerTurn){
                                playerButton.innerHTML = "Pick " + pick2 * 2; 
                        }
                break;
                case "pick3":
                        pick3++;
                        if (!playerTurn){
                                playerButton.innerHTML = "Pick " + pick3 * 3; 
                        }
                break;
                case "skip":
                        return false;
                break;
                case "cowboy":
                        //Extra later
                break;
                default:
                alert("Error Card Type identification...")
        }
        return true;    
}

function respondAttack(type) {
        switch(extractType(type)) {
                case "draw1":
                        if (draw1 > 0){
                                draw1++;
                                if (!playerTurn){
                                        playerButton.innerHTML = "Draw " + draw1; 
                                }
                                return true;
                        }
                        else {
                                messageBox.innerHTML = "Cannot send back different attack";
                                return false;
                        }
                break;
                case "draw2":
                        if (draw2 > 0){
                                draw2++;
                                if (!playerTurn){
                                        playerButton.innerHTML = "Draw " + draw2 * 2; 
                                }
                                return true;
                        }
                        else {
                                messageBox.innerHTML = "Cannot send back different attack";
                                return false;
                        }
                break;
                case "show":
                        if (show > 0){
                                show++;
                                if (!playerTurn){
                                        playerButton.innerHTML = "Show "; 
                                }
                                return true;
                        }
                        else {
                                messageBox.innerHTML = "Cannot send back different attack";
                                return false;
                        }
                break;
                case "yeano":
                        draw1 = 0;
                        draw2 = 0;
                        show = 0;
                        pick1 = 0;
                        pick2 = 0;
                        pick3 = 0;
                        if (!playerTurn){
                                playerButton.innerHTML = "Pick 1"; 
                        }
                        return true;
                break;
                case "pick1":
                        if (pick1 > 0){
                                pick1++;
                                if (!playerTurn){
                                        playerButton.innerHTML = "Pick " + pick1; 
                                }
                                return true;
                        }
                        else {
                                messageBox.innerHTML = "Cannot send back different attack";
                                return false;
                        }
                break;
                case "pick2":
                        if (pick2 > 0){
                                pick2++;
                                if (!playerTurn){
                                        playerButton.innerHTML = "Pick " + pick2 * 2; 
                                }
                                return true;
                        }
                        else {
                                messageBox.innerHTML = "Cannot send back different attack";
                                return false;
                        }
                break;
                case "pick3":
                        if (pick3 > 0){
                                pick3++;
                                if (!playerTurn){
                                        playerButton.innerHTML = "Pick " + pick3 * 3; 
                                }
                                return true;
                        }
                        else {
                                messageBox.innerHTML = "Cannot send back different attack";
                                return false;
                        }
                break;
                case "skip":
                        messageBox.innerHTML = "Cannot send SKIP on attack";
                        return false;
                break;
                case "cowboy":
                        if (draw1 > 0){
                                draw1++;
                                if (!playerTurn){
                                        playerButton.innerHTML = "Draw " + draw1; 
                                }
                                return true;
                        }
                        else if (draw2 > 0){
                                draw2++;
                                if (!playerTurn){
                                        playerButton.innerHTML = "Draw " + draw2 * 2; 
                                }
                                return true;
                        }
                        else if (show > 0){
                                show++;
                                if (!playerTurn){
                                        playerButton.innerHTML = "Show"; 
                                }
                                return true;
                        }
                        else if (pick1 > 0){
                                pick1++;
                                if (!playerTurn){
                                        playerButton.innerHTML = "Pick " + pick1; 
                                }
                                return true;
                        }
                        else if (pick2 > 0){
                                pick2++;
                                if (!playerTurn){
                                        playerButton.innerHTML = "Pick " + pick2 * 2; 
                                }
                                return true;
                        }
                        else if (pick3 > 0){
                                pick3++;
                                if (!playerTurn){
                                        playerButton.innerHTML = "Pick " + pick3 * 3; 
                                }
                                return true;
                        }
                        else {
                                alert("Finished with CowboyCow... Embarassing.");
                        }
                break;
                default:
                        alert("Error Card Type identification...")
                        return false;
        }        
}

function printMultiplier() {
        let sum = (draw1 + draw2 + show + pick1 + pick2 + pick3);

        if (sum > 0) {
                multiplierBox.innerHTML = "x" + sum;
        }
        else {
                multiplierBox.innerHTML = "0";
        }
}



//Startscreen
var startScreen = document.getElementById('startScreen');
startScreen.style.visibility = 'visible';
initialize();

setTimeout(() => {startScreen.style.visibility = 'hidden';}, 1500); 






















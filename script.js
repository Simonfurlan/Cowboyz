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
const messageBox = document.querySelector('.console')

const startAmount = 5;

let playerTurn = 1;

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

// Pick and Throw and Draw

function pickCard(type) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('id', type);
        card.style.backgroundImage = `url(${type}.png)`;
        cardContainer.appendChild(card);
        card.addEventListener('click', function() {
                if (validateTurn(type)){
                        if (cardContainer.children.length > 0) {
                                throwCard(type);
                                cardContainer.removeChild(document.getElementById(type));
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
}

// CPU

function throwCpu(type) {

}

function checkRespondAttack(type) {
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
        else if (tmpType.includes("yeano") && checkTime(type)) {
                return true;
        } 
        else {
                return false;
        }
}

function validateCpu(type){
        if (!checkRespondAttack(type)){
                return false;
        }

        messageBox.innerHTML = "Cpu counters with: " + type;

        return true;
}

function decideCpu() {
        messageBox.innerHTML = "Cpu time!";


        if ((draw1 + draw2 + show + pick1 + pick2 + pick3) == 0) {
                // Case: no attack

        }
        else {
                let cardFound = 0;
                // Case: respond attack
                for (let i = 0; i < CpuCards.length; i++) {
                        if (validateCpu(CpuCards[i])) {
                                throwCpu(CpuCards[i]);
                                cardFound = 1;
                                break;
                        }
                }

                if(!cardFound) {
                        // take attack
                }
                
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
        console.log(CpuCards);
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

        if (!checkAttack(type) || ((draw1 + draw2 + show + pick1 + pick2 + pick3)>0)) {
                messageBox.innerHTML = "Same TYPE is not allowed!"
                return false;
        }

        if ((draw1 + draw2 + show + pick1 + pick2 + pick3) == 0){
                // Case: Init attack
                switch(extractType(type)) {
                        case "draw1":
                                draw1++;
                        break;
                        case "draw2":
                                draw2++;
                        break;
                        case "show":
                                show++;
                        break;
                        case "yeano":
                                //Nothing
                        break;
                        case "pick1":
                                pick1++;
                        break;
                        case "pick2":
                                pick2++;
                        break;
                        case "pick3":
                                pick3++;
                        break;
                        case "skip":
                                return true;
                        break;
                        case "cowboy":
                                //Extra later
                        break;
                        default:
                        alert("Error Card Type identification...")
                }        
        }
        else {
                // Case: Respond attack
                switch(extractType(type)) {
                        case "draw1":
                                if (draw1 > 0){
                                        draw1++;
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
                                return true;
                        break;
                        case "pick1":
                                if (pick1 > 0){
                                        pick1++;
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
                                messageBox.innerHTML = "not implemented yet..";
                                return false;
                        break;
                        default:
                        alert("Error Card Type identification...")
                }        

                messageBox.innerHTML = "Respond to your opponents attack";
                return false;
        }
        playerTurn = 0;
        return true;
}

initialize();


























// css class for different card image
const CARD_TECHS = [
  'html5',
  'css3',
  'js',
  'sass',
  'nodejs',
  'react',
  'linkedin',
  'heroku',
  'github',
  'aws'
];

// only list out some of the properties,
// add more when needed
const game = {
  score: 0,
  level: 1,
  timer: 60,
  timerDisplay: null,
  scoreDisplay: null,
  levelDisplay: null,
  timerInterval: null,
  startButton: null,
  cardCount:0,
  cardCountTotal:0,
  // and much more
};

const cardTwo = [];

setGame();

/*******************************************
/     game process
/******************************************/
function setGame() {
  // register any element in your game object
  bindStartButton();
}

function deleteCurrentChild(removeItem) {
  var instructionEle = document.getElementsByClassName(removeItem);
  let i = 0,
    length = instructionEle.length;
  while(i<length){
    instructionEle[0].parentElement.removeChild(instructionEle[0]);
    i++;
  }
}

function appendCardRandom(card){
  var game_board = document.getElementsByClassName('game-board')[0];
  var childsNum = game_board.childElementCount-1;

  let randomNum = Math.random()*100;
    randomIndex = Math.floor(Math.random()*childsNum)
  if(randomNum >=80){
    game_board.insertBefore(card,game_board.childNodes[randomIndex])
    return
  }
  game_board.appendChild(card);
}

function createCard(name) {
  var ele1 = document.createElement('div');
  ele1.className = `card ${name}`;
  ele1.setAttribute("data-tech",name)

  var card_front = document.createElement('div');
  card_front.className = 'card__face card__face--front';

  var card_back = document.createElement('div');
  card_back.className = 'card__face card__face--back';

  ele1.appendChild(card_front);
  ele1.appendChild(card_back);

  document.getElementsByClassName('game-board')[0].appendChild(ele1); 
  appendCardRandom(ele1);
}

function getRandomCardIndex(num){
  let cardList = [];

  for(let i =0; i<num; i++){
    let temp = Math.floor(Math.random() *10);
    cardList.push(temp);
  }

  return cardList;
}

function createCards(num) {
  let cardList = getRandomCardIndex(num*num/2);

  for(let i = 0; i<cardList.length; ++i){
    let temp = cardList[i];
    createCard(CARD_TECHS[temp]);
    createCard(CARD_TECHS[temp]);
  }

 $('.game-board').css("grid-template-columns",`repeat(${num}, 1fr)`) 
}

function startGame(num = 2) {
  if(game.cardCountTotal===0){
    deleteCurrentChild("game-instruction");
  }else{
    deleteCurrentChild("card"); 
  }
  game.timer = 60;
  createCards(num);
  game.cardCount = 0;
  game.cardCountTotal = num*num;
  startCount();
  handleCardFlip();

}

function handleCardFlip() {
  bindCardClick(); 
}

function nextLevel() {
  if(game.cardCountTotal === 4 ){
    game.level++;
    upadateLevel();
    startGame(4);
  }else{
    game.level++;
    upadateLevel();
    startGame(6);
  }
}

function handleGameOver() {
  stopCount();
  alert(`Congratulatin Your score is ${game.score}`);
  location.reload();
}

/*******************************************
/     UI update
/******************************************/
function updateScore() {
  var game_score= document.getElementsByClassName("game-stats__score--value")[0];
  game_score.innerHTML = game.score;
}
function upadateLevel() {
  var game_level= document.getElementsByClassName("game-stats__level--value")[0];
  game_level.innerHTML = game.level;
}
function updateTimerDisplay() {
    if(game.timer >0){
      let barWidth = (game.timer/60)*100;
      let progressBar = document.getElementsByClassName('game-timer__bar')[0];
      progressBar.style.width = barWidth + '%';
      game.timer--;
      var game_time = document.getElementsByClassName("game-timer__bar")[0];
      game_time.innerHTML = `${game.timer}s`;
    }else{
      stopCount();
      alert(`Your score is ${game.score}`);
    }
}

var idTimer = null;

function startCount(){
  idTimer = setInterval(updateTimerDisplay,1000);
}

function stopCount(){
  clearInterval(idTimer);
}

/*******************************************
/     bindings
/******************************************/
function bindStartButton() {
  var startButton = document.getElementById('game-start_button');
  $(startButton).on('click',function(){
   startGame();
   startButton.innerHTML = "End Game";
   unBindStartButton();
  })
}

function unBindStartButton() {
  var start_button = document.getElementById('game-start_button');
  $(start_button).on('click',function(){
    alert(`You score is ${game.score}`);
    $(start_button).off('click');
    stopCount();
    location.reload();
  })
}

function unBindCardClick(card) {
  card.classList.remove('card--flipped');
}

function cardDisposal(card){
  if(card[0] === cardTwo[0]){
    cardTwo[0].classList.remove('card--flipped');
    cardTwo.pop();
    return 
  }
  cardTwo.push(card[0]);
  if(cardTwo.length ==2){
    $('.card').off('click');
    let attr1 = cardTwo[0].getAttribute("data-tech"),
        attr2 = cardTwo[1].getAttribute("data-tech");
    if(attr1 != attr2){
      setTimeout(function(){
        cardTwo[0].classList.remove('card--flipped');
        cardTwo[1].classList.remove('card--flipped');
        cardTwo.pop();
        cardTwo.pop();
        bindCardClick();
      },1500)

    }else{
      bindCardClick();
      $(cardTwo[0]).off('click');
      $(cardTwo[1]).off('click');
      cardTwo.pop();
      cardTwo.pop();
      game.score += game.timer * game.level;
      updateScore();
      game.cardCount+=2;
      if(game.cardCount === game.cardCountTotal){
        if(game.level === 3){
          handleGameOver();
          return;
        }
        stopCount();
        nextLevel();
      }
    }
  }
}

function bindCardClick() {
  $('.card').on('click',function(){
    $(this).addClass('card--flipped');
  
    $(this).attr('round',1);
    // $(this).off('click');
    cardDisposal($(this));
  })
}

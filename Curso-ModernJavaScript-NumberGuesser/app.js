let min = 1,
    max = 10,
    winningNum = getWinningNum(),
    guessesLeft = 3;

const game = document.getElementById('game'),
      minNum = document.querySelector('.min-num'),
      maxNum = document.querySelector('.max-num'),
      guessBtn = document.querySelector('#guess-btn'),
      guessInput = document.querySelector('#guess-input'),
      message = document.querySelector('.message');
     
minNum.textContent = min;
maxNum.textContent = max;

game.addEventListener("mousedown", function (e) { 
    if(e.target.className === 'play-again'){
        window.location.reload();
    }
})

guessBtn.addEventListener('click', function () { 
    let guess = parseInt(guessInput.value);

    if(isNaN(guess) || guess < min || guess > max){
        setMessage(`Please enter a number between ${min} and ${max}`, 'red');
        return;
    }

    guessesLeft--;

    if(guess === winningNum){
        gameOver(true, `${winningNum} is correct, YOU WIN`);
        return;
    } else if(guess > winningNum) {
        setMessage(`${guess} is greater than the number, ${guessesLeft} guesses left`, 'orange')
    } else if(guess < winningNum){
        setMessage(`${guess} is lesser than the number, ${guessesLeft} guesses left`, 'orange')
    }

    if(guessesLeft === 0){
        gameOver(false, `Game Over, you lost. The correct number was ${winningNum}`)
    } 
})

function gameOver(won, msg) {
    let color = won ? 'green' : 'red';

    guessInput.disabled = true;
            guessInput.style.borderColor = color;
            setMessage(msg, color);

    guessBtn.value = 'Play Again';
    guessBtn.className += 'play-again'
}

function setMessage(msg, color){
    message.style.color = color;
    message.textContent = msg;
}

function getWinningNum() {
    return Math.floor((Math.random()*(max-min+1))+min);
}
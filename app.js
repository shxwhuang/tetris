document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.querySelector('button')
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.querySelector('.score-display')
    const lineDisplay = document.querySelector('.lines-display')
    const displaySquares = document.querySelectorAll('.previous-grid div')
    let squares = Array.from(grid.querySelectorAll('div'))
    const width = 10
    const height = 20
    let currentPostion = 4
    let currentIndex = 0
    let timerId
    let score = 0
    let lines = 0

    // assign functions to keycodes
    function control(e) {
        if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)


    // The terominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width+ 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    // Randomly select Tetromino
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let currentRotation = 0
    let current = theTetrominoes[random][currentRotation]

    // draw the shap
    function draw() {
        current.forEach( index => (
            squares[currentPostion + index].classList.add('block')
        ))
    }

    function undraw() {
        current.forEach( index => (
            squares[currentPostion + index].classList.remove('block')
        ))
    }

    // move down shape
    function moveDown() {
        undraw()
        currentPostion = currentPostion += width
        draw()
        freeze()
    }

    // move left and prevent collisions with shapes moving left
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPostion + index) % width === width - 1)
        if (!isAtRightEdge) currentPostion +=1
        if (current.some(index => squares[currentPostion + index].classList.contains('block2'))) {
            currentPostion -=1
        }
        draw()
    }

    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index=>(currentPostion + index) % width === 0)
        if (!isAtLeftEdge) currentPostion -=1
        if (current.some(index => squares[currentPostion + index].classList.contains('block2'))) {
            currentPostion +=1
        }
        draw()
    }

    // rotate Tetromino
    function rotate() {
        undraw()
        currentRotation ++
        if (currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    // show previous tetromino is displaySquares
    const displayWidth = 4
    const displayIndex = 0
    let nextRandom = 0

    const smallTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],  /*lTetromino*/
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],  /*zTetromino*/
        [1, displayWidth, displayWidth + 1, displayWidth * 2],  /*tTetromino*/
        [0, 1, displayWidth, displayWidth + 1],  /*oTetromino*/
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],  /*iTetromino*/
    ]

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('block')
        })
        smallTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('block')
        })
    }

    // freeze the shape
    function freeze() {
        if (current.some(index => squares[currentPostion + index + width].classList.contains('block3')
        || squares[currentPostion + index + width].classList.contains('block2'))) {
            current.forEach(index => squares[index + currentPostion].classList.add('block2'))

            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPostion = 4
            draw()
            displayShape()
            gameOver()
            addScore()
        }
    }

    startBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })

    // game over
    function gameOver() {
        if(current.some(index => squares[currentPostion + index + width].classList.contains('block2'))) {
            console.log('game over');
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }

    // add score
    function addScore() {
        for (currentIndex = 0; currentIndex < 199; currentIndex += width) {
            const row = [currentIndex, currentIndex+1, currentIndex +2, currentIndex+3, currentIndex+4, currentIndex+5, currentIndex +6, currentIndex+7, currentIndex+8, currentIndex+9]

            if (row.every( index => squares[index].classList.contains('block2'))) {
                score += 10
                lines += 1
                scoreDisplay.innerHTML = score
                lineDisplay.innerHTML = lines
                row.forEach(index => {
                    squares[index].classList.remove('block2') || squares[index].classList.remove('blcok')
                })

                // splice Array
                const squaresRemoved = squares.splice(currentIndex, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }


})
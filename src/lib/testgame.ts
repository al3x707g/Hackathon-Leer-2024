let testWord: string = "TEST"
let playerScore: number = 0
const guessed: string[] = []
let word = ""

const testGame: GameState = {
    id: "0",
    players: [{
        id: "0",
        score: 0,
    }],
    word: "",
    guessed: [],
    log: [{player: "0", move: "0"}],
    type: "",
    self: "0",
}

const updateGame = () => {
    testGame.guessed = guessed
    testGame.players[0].score = playerScore
    testGame.word = word
}

const handleInput = (input: string) => {
    if (guessed.includes(input)) return

    guessed.push(input)

    if (!word) word = "_".repeat(testWord.length)

    const result: string[] = word.split('')

    if (testWord.includes(input)) {
        for (let i = 0; i < testWord.length; i++)
            if (testWord.charAt(i) === input)
                result[i] = input
    } else playerScore++

    word = result.join('')
}

const gameLoop = async (round: CallableFunction) => {
    if (testGame.word !== testWord && testGame.players[0].score < 25) {
        await new Promise<void>(resolve => {

            // A timeout is needed for visualisation, otherwise the game would be solved too fast.
            setTimeout(() => {
                round(testGame, handleInput)
                updateGame()

                console.log(playerScore)
                console.log(word)
                console.log(guessed)

                resolve()
            }, 1000)
        })

        await gameLoop(round)
    }
}

export const startGame = async (init: CallableFunction, round: CallableFunction, result: CallableFunction, word: string) => {
    console.log("Starting Test Game.")
    testWord = word
    init(testGame)

    await gameLoop(round)

    result(testGame)
}
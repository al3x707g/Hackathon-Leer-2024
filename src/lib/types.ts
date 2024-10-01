type Player = {
    id: string
    score: number
}

type LogEntry = {
    player: string
    move: string
}

type GameState = {
    id: string
    players: Player[]
    word: string;
    guessed: string[]
    log: LogEntry[]
    type: string
    self: string
}
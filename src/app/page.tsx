"use client";
import {useEffect, useMemo, useState} from "react";
import {getLocalData} from "@/lib/dictionary";
import {startGame} from "@/lib/testgame";
import socket from "@/app/socket";

export default function App() {

    const [connected, setConnected] = useState(false)
    const [word, setWord] = useState("")
    const [score, setScore] = useState(0)

    // This string contains all letters sorted by their frequency descending, as counted during the Hackathon.
    const letters: string = "ENRASTILUHOGCKMPDFBZWVYJXQ"

    const SECRET: string = process.env.BOT_SECRET ?? ""

    let localData: Set<string> = useMemo(() => getLocalData(), [])

    let queue: string[] = []


    // If a connection to a server is needed, uncomment the following code

    /* const connect = () => {
        socket.on('connect', () => {
            socket.emit('authenticate', SECRET, (success: boolean) => {
                console.log(`Connection ${success ? "successful" : "failed"}`)
                setConnected(success)
            })
        })
    }

    useEffect(() => {

        console.log("Connecting")

        connect()

        socket.on('data', (data: GameState, callback: CallableFunction) => {
            switch (data.type) {
                case 'INIT':
                    init(data);
                    return;
                case 'RESULT':
                    result(data);
                    return;
                case 'ROUND':
                    round(data, callback);
            }
        });

        socket.on("disconnect", () => {
            setConnected(false);
        })
    }, []) */


    const init = (data: GameState) => {
        setScore(data.players[0].score)
        queue = Array.from(letters).slice(0, 5)
    }

    const result = (data: GameState) => {
        const mistakes = data.players[0].score
        const correct = data.word

        if (mistakes < 25)
            setWord(correct)
        setScore(mistakes)
    }

    const round = (data: GameState, callback: CallableFunction) => {
        setWord(data.word)
        setScore(data.players[0].score)
        const letter = getNextLocalLetter(data.guessed, data.word)
        callback(letter)
    }

    const sortPossibilities = (frequencyList: number[]) => {
        const frequencies: Array<[string, number]> = []

        for (let i = 0; i < frequencyList.length; i++) {
            const letter: string = String.fromCharCode(i + "A".charCodeAt(0))
            frequencies.push([letter, frequencyList[i]])
        }

        return frequencies.sort((a, b) => b[1] - a[1])
    }

    const getFromQueue = () => {
        if (queue.length > 0) {
            const returnValue: string = queue.at(0) as string
            queue = queue.slice(1)
            return returnValue
        }
    }

    const getAllPossibilities = (guessed: string[], matches: Set<string>) => {
        const allLetters: number[] = new Array(26).fill(0)
        const guessedSet = new Set(guessed)

        matches.forEach(word => {
            for (const letter of word) {
                if (!guessedSet.has(letter)) {
                    const letterIndex = letter.charCodeAt(0) - 'A'.charCodeAt(0)
                    allLetters[letterIndex]++
                }
            }
        })

        return allLetters
    }

    const findLetterByFrequency = (guessed: string[], word: string) => {
        const possibleLetters: string[] = []

        for (let i = 0; i < word.length; i++) {
            const char = word.charAt(i)
            if (char === '_') {
                for (let j = 0; j < letters.length; j++) {
                    const letter = letters.charAt(j)
                    if (!guessed.includes(letter) && !possibleLetters.includes(letter)) {
                        possibleLetters.push(letter)
                    }
                }
            }
        }

        for (const letter of letters) {
            if (possibleLetters.includes(letter)) {
                return letter
            }
        }

        for (const letter of letters) {
            if (!guessed.includes(letter)) {
                return letter
            }
        }
    }

    const getFilterRegex = (word: string) => {
        const regexPattern = word.replaceAll("_", ".")
        return new RegExp(`.*${regexPattern}.*`)
    }

    const filterLocalDataByRegex = (data: Set<string>, word: string) => {
        const regex: RegExp = getFilterRegex(word)

        const filteredData: Set<string> = new Set<string>()

        data.forEach(dataWord => {
            if (regex.test(dataWord))
                filteredData.add(dataWord)
        })

        return filteredData
    }

    // If you like to save a word to the database, use the following code snippet

    /* const saveWordToDatabase = async (word: string) => {
        await fetch('http://localhost:3000/api/database', {
            method: 'POST',
            body: JSON.stringify({"word": word})
        }).then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
    } */

    const getNextLocalLetter = (guessed: string[], word: string) => {
        const queuedLetter = getFromQueue()

        if (queuedLetter) return queuedLetter

        const formattedMatches: Set<string> = filterLocalDataByRegex(localData, word)

        localData = formattedMatches

        const possibilities: number[] = getAllPossibilities(guessed, formattedMatches)
        const orderedPossibilities: Array<[string, number]> = sortPossibilities(possibilities)

        return orderedPossibilities?.[0][1] > 0 ? orderedPossibilities[0][0] : findLetterByFrequency(guessed, word)
    }

    const handleTest = () => {
        startGame(init, round, result, "DATENSCHUTZGRUNDVERORDNUNG")
            .then( /* Ignore Promise */ )
    }

    return (
        <div className="flex flex-col justify-center items-center w-full h-[100vh] p-10">
            <h1 className="font-black text-center">Hackathon Leer 2024</h1>
            <h2 className="font-black">Team Rhein Erft</h2>
            <p className="font-bold text-xl mb-10">Status:&nbsp;
                <span className="text-amber-500">
                    {connected ? "Connected" : "Disconnected"}
                </span>
            </p>
            <a className="text-4xl font-bold mb-2">
                {word ? word : "Waiting for word..."}
            </a>
            <a>Mistakes: {score}</a>
            <button className="border border-black py-2 px-4 rounded-xl mt-10"
            onClick={handleTest}>Test Game</button>
        </div>
    )
}
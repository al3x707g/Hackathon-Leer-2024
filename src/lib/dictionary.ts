import words from "./words.json";

const formatWord = (word: string) => {
    const formattedWord: string = word.toUpperCase().trim()
        .replaceAll("Ö", "OE")
        .replaceAll("Ä", "AE")
        .replaceAll("Ü", "UE")
        .replaceAll("ß", "SS")
        .replaceAll(" ", "")

    const resultingWord: string = Array.from(formattedWord)
        .filter(letter => letter >= 'A' && letter <= 'Z')
        .join('')

    return resultingWord || null
}

export const getLocalData = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const formattedWords: string[] = words.map(formatWord).filter(Boolean) as string[]

    return new Set(formattedWords)
}
This is a sample solution for the Hackathon 2024 in Leer.

## Hangman

This year's game was a variation of hangman.

The task was to guess a word with as little wrong guesses as possible.
However, the length of the word was kept secret and hidden letters to the left and right
of correctly guessed letters were truncated.

> [!WARNING]
> If you test the application with the given test game, all underscores will be visible.

Example:
````
           // no correctly guessed letters, word is completely hidden
       
T           // 'T' correctly guessed, hidden letters to the left and 
               right are truncated
           
K_T         // 'K' correctly guessed, hidden letters between correctly
               guessed letters are represented as underscores.
           
H__K_TH     // 'H' correctly guessed, multiple hidden letters between
               correctly guessed letters are represented by multiple
               underscores.
...

HACKATHON   // full word revealed, when all letters were correctly guessed
````

For further details, visit the [game page](https://games.uhno.de/game/XHM).


## Getting Started

After cloning this repository, navigate into the project folder and run
````npm install```` to install all dependencies.

Then, set up your _.env_ in the ````/src```` folder, with these values if necessary

`````dotenv
DATABASE_URL=''     Required if a database is preferred over the local dictionary.
SERVER_URL=''       Required to connect to a server via Socket.IO protocol
BOT_SECRET=''       Required to connect to the official server.
`````

Finally, run ````npm run dev```` to run the development server,
which can be accessed on [http://localhost:3000](http://localhost:3000) by default.

Connect to the official server, if available,
otherwise use the test game function to run the application.
You may build your own server to run this client. For documentation, see
[https://games.uhno.de/](https://games.uhno.de/)

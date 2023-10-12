# ChessHub
ChessHub is a web application for chess enthusiasts that allows players to compete against each other.

## Technologies used
1. <a href="https://react.dev/">ReactJS</a>
2. <a href="https://www.mongodb.com/">MongoDB</a>
3. <a href="https://nodejs.org/en">NodeJS</a>
4. <a href="https://expressjs.com/">ExpressJS</a>
5. <a href="https://mantine.dev/">Mantine</a>
6. <a href="https://socket.io/">Socket.IO</a>
7. <a href="https://mongoosejs.com/">Mongoose</a>

## Features
1. Play chess with your friends
2. Play with computer with customizable ELO
3. View your game history
4. Make friends
5. Analyze your games

## How to contribtute to this repository ?
You can contribute to this repository by checking out existing issues or creating your own in the issue section (if you experience any bugs in the application or you want to propose a new feature).
1. Star the repository
2. Fork the repo. (Click on the fork button in the top right corner).
3. Clone the forked repo to your local machine.
```
git clone https://github.com/moonpatel/ChessHub.git 
```
4. Change the present working directory.
```
cd ChessHub
```
5. Create a new branch.
```
git checkout -b new-branch
```
6. Create a .env file in both frontend and backend directory according to the .env.example files with the required environment variables.
7. Install the dependencies for frontend.
```
cd frontend
npm install
```
8. Install the dependencies in the backend.
```
cd backend
npm install
```
9. Start the frontend
```
cd frontend
npm run dev
```
10. The stockfish chess engine binary in the repo is for Linux systems only. If you are not using Linux then download the required stockfish chess engine binary from
    <a href="https://stockfishchess.org/download/">stockfish</a> website. Also add the path of the engine to the CHESS_ENGINE_PATH variable in .env file in backend.
12. Start the backend
```
cd backend
npm run dev
```
12. Visit http://localhost:5173 in your browser to view the application.

## Setting up project using docker
There is an alternative option to set up the project using docker. Make sure you have docker and docker-compose installed on your system.
1. Star the repository
2. Fork the repo. (Click on the fork button in the top right corner).
3. Clone the forked repo to your local machine.
```
git clone https://github.com/moonpatel/ChessHub.git 
```
4. Change the present working directory.
```
cd ChessHub
```
5. Build the docker images for frontend and backend.
```
docker-compose build
```
6. Run the docker containers.
```
docker-compose up
```
7. Visit the website from your browser -> http://localhost:5173

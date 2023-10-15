# ChessHub
ChessHub is a web application for chess enthusiasts that allows players to compete against each other.

![Capture](https://github.com/moonpatel/ChessHub/assets/95487062/d4bc47fe-9364-43e6-8a6e-081daee55d98)


## Technologies used
1. <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" /></a>
2. <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" /></a>
3. <a href="https://nodejs.org/en"><img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /></a>
4. <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" /></a>
5. <a href="https://socket.io/"><img src="https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white" /></a>

## Features
1. Play chess with your friends
2. Play with computer with customizable ELO
3. View your game history
4. Make friends
5. Analyze your games

## How to contribtute to this repository ?
You can contribute to this repository by checking out existing issues or creating your own in the issue section (if you experience any bugs in the application or you want to propose a new feature).

### Setting up the project locally
1. Make sure to star the repository before going ahead.
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
6. Create a .env file in both frontend and backend directory according to the .env.example files with the required environment variables. The stockfish chess engine binary in the repo is for Linux systems only. If you are not using Linux then download the required stockfish chess engine binary from <a href="https://stockfishchess.org/download/">stockfish</a> website and place it in backend/engine directory. Also add the path of the engine to the CHESS_ENGINE_PATH variable in .env file in backend directory.
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
10. Start the backend
```
cd backend
npm run dev
```
11. Visit http://localhost:5173 in your browser to view the application.

### Setting up project using docker (Recommended)
There is an alternative option to set up the project using docker. Make sure you have docker and docker-compose installed on your system.
1. Fork the repo. (Click on the fork button in the top right corner).
2. Clone the forked repo to your local machine.
```
git clone https://github.com/moonpatel/ChessHub.git 
```
3. Change the present working directory.
```
cd ChessHub
```
4. Add .env files to both your frontend and backend directories based on their respective .env.example templates (can be found inside the directories itself).
5. Build the docker images for frontend and backend.
```
docker-compose build
```
6. Run the docker containers.
```
docker-compose up
```
7. Visit the website from your browser -> http://localhost:5173

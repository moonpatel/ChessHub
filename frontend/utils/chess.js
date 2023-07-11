import { Chess } from "chess.js";

export class ChessModified extends Chess {
    constructor(obj) {
        if (obj) {
            super(obj);
        } else {
            super();
        }
        this.selected = null;
    }

    select(square) {
        let piece = this.get(square);
        if (piece) {
            this.selected = square;
        }
    }
    convertRowColToLAN(row, col) {
        const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
        const letter = letters[col];
        const number = 8 - row;
        return letter + number;
    }

    getBoard() {
        let board = this.board();
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === null) {
                    let square = this.convertRowColToLAN(i, j);
                    board[i][j] = { square };
                }
            }
        }
        return board;
    }

    getMoves(square) {
        let moves = this.moves({ square, verbose: true });
        let newMoves = [];
        for (let i = 0; i < moves.length; i++) {
            newMoves.push(moves[i].to);
        }
        return newMoves;
    }
}

export let chess = new ChessModified();

export function chessInit() {
    return new ChessModified();
}

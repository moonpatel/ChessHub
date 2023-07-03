import { Chess } from "chess.js";

export class ChessModified extends Chess {
    constructor(obj) {
        let prop = obj?.prop;
        if (prop) {
            super(prop);
        } else {
            super();
        }
        this.selected = null;
        this.myColor = obj?.color;
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

    getBoard(color) {
        let board = this.board();
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === null) {
                    let square = this.convertRowColToLAN(i, j);
                    board[i][j] = { square };
                }
            }
        }
        if (color === "b") {
            let newBoard = structuredClone(board);
            newBoard.reverse();
            for (let i = 0; i < newBoard.length; i++) {
                newBoard[i].reverse();
            }
            return newBoard;
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

export function chessInit(color) {
    return new ChessModified({ color });
}

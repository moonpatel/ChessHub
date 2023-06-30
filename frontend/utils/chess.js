// const pawn = "P",
//     rook = "R",
//     knight = "N",
//     bishop = "B",
//     queen = "Q",
//     king = "K";

// export const pieces = {
//     pawn,
//     rook,
//     knight,
//     bishop,
//     queen,
//     king,
// };

// export const whiteColor = "W",
//     blackColor = "B";

// export function chessBoardInit(myColor) {
//     let opColor = myColor === whiteColor ? blackColor : whiteColor;
//     const chessBoardMatrix = [
//         [
//             { color: opColor, type: rook },
//             { color: opColor, type: knight },
//             { color: opColor, type: bishop },
//             { color: opColor, type: myColor === whiteColor ? queen : king },
//             { color: opColor, type: myColor === whiteColor ? king : queen },
//             { color: opColor, type: bishop },
//             { color: opColor, type: knight },
//             { color: opColor, type: rook },
//         ],
//         Array(8).fill({ color: opColor, type: pawn }),
//         [null, null, null, null, null, null, null, null],
//         [null, null, null, null, null, null, null, null],
//         [null, null, null, null, null, null, null, null],
//         [null, null, null, null, null, null, null, null],
//         Array(8).fill({ color: myColor, type: pawn }),
//         [
//             { color: myColor, type: rook },
//             { color: myColor, type: knight },
//             { color: myColor, type: bishop },
//             { color: myColor, type: myColor === whiteColor ? queen : king },
//             { color: myColor, type: myColor === whiteColor ? king : queen },
//             { color: myColor, type: bishop },
//             { color: myColor, type: knight },
//             { color: myColor, type: rook },
//         ],
//     ];
//     return chessBoardMatrix;
// }

// function inBoard(i, j) {
//     if (i >= 0 && i < 8 && j >= 0 && j < 8) return true;
//     else return false;
// }

// function isBlocked(chessBoard, chessPiece, i, j) {
//     if (chessBoard[i][j] === null) return false;
//     else if (chessBoard[i][j].color === chessPiece.color) return true;
//     else return false;
// }

// function isAttacking(chessBoard, chessPiece, i, j) {
//     if (chessBoard[i][j] === null) return false;
//     else if (chessBoard[i][j].color !== chessPiece.color) return true;
//     else return false;
// }

// function getPawnHint(chessBoard, chessPiece, myColor) {
//     const { row, col } = chessPiece;
//     let movePos = [];
//     if (chessPiece.color === myColor) {
//         // for moving forward
//         if (inBoard(row - 1, col) && chessBoard[row - 1][col] === null && movePos.push({ row: row - 1, col })) {
//             chessPiece.row === 6 &&
//                 chessBoard[row - 2][col] === null &&
//                 inBoard(row - 2, col) &&
//                 !isBlocked(chessBoard, chessPiece, row - 1, col) &&
//                 movePos.push({ row: row - 2, col });
//         }
//         // for killing opponent piece
//         if (
//             inBoard(row - 1, col + 1) &&
//             chessBoard[row - 1][col + 1]?.type &&
//             chessBoard[row - 1][col + 1]?.color !== myColor
//         )
//             inBoard(row - 1, col + 1) && movePos.push({ row: row - 1, col: col + 1 });
//         if (
//             inBoard(row - 1, col - 1) &&
//             chessBoard[row - 1][col - 1]?.type &&
//             chessBoard[row - 1][col - 1]?.color !== myColor
//         )
//             inBoard(row - 1, col - 1) && movePos.push({ row: row - 1, col: col - 1 });
//     } else {
//         // for moving forward
//         if (inBoard(row + 1, col) && chessBoard[row + 1][col] === null && movePos.push({ row: row + 1, col })) {
//             chessPiece.row === 1 &&
//                 chessBoard[row + 2][col] === null &&
//                 inBoard(row + 2, col) &&
//                 movePos.push({ row: row + 2, col });
//         }
//         // for killing opponent piece
//         if (
//             inBoard(row + 1, col + 1) &&
//             chessBoard[row + 1][col + 1]?.type &&
//             chessBoard[row + 1][col + 1]?.color === myColor
//         )
//             inBoard(row + 1, col + 1) && movePos.push({ row: row + 1, col: col + 1 });
//         if (
//             inBoard(row + 1, col - 1) &&
//             chessBoard[row + 1][col - 1]?.type &&
//             chessBoard[row + 1][col - 1]?.color === myColor
//         )
//             inBoard(row + 1, col - 1) && movePos.push({ row: row + 1, col: col - 1 });
//     }

//     return { movePos };
// }

// function getRookHint(chessBoard, chessPiece, myColor) {
//     const { row, col, color } = chessPiece;
//     let movePos = [];
//     let i = row,
//         j = col;
//     while (inBoard(++i, j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }
//     i = row;
//     j = col;
//     while (inBoard(--i, j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }
//     i = row;
//     j = col;
//     while (inBoard(i, ++j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }
//     i = row;
//     j = col;
//     while (inBoard(i, --j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }
//     console.log(movePos);

//     return { movePos };
// }

// function getKnightHint(chessBoard, chessPiece, myColor) {
//     const { row, col, color } = chessPiece;
//     let movePos = [];

//     if (inBoard(row + 2, col + 1) && !isBlocked(chessBoard, chessPiece, row + 2, col + 1))
//         movePos.push({ row: row + 2, col: col + 1 });
//     if (inBoard(row + 2, col - 1) && !isBlocked(chessBoard, chessPiece, row + 2, col - 1))
//         movePos.push({ row: row + 2, col: col - 1 });
//     if (inBoard(row - 2, col + 1) && !isBlocked(chessBoard, chessPiece, row - 2, col + 1))
//         movePos.push({ row: row - 2, col: col + 1 });
//     if (inBoard(row - 2, col - 1) && !isBlocked(chessBoard, chessPiece, row - 2, col - 1))
//         movePos.push({ row: row - 2, col: col - 1 });
//     if (inBoard(row + 1, col + 2) && !isBlocked(chessBoard, chessPiece, row + 1, col + 2))
//         movePos.push({ row: row + 1, col: col + 2 });
//     if (inBoard(row - 1, col + 2) && !isBlocked(chessBoard, chessPiece, row - 1, col + 2))
//         movePos.push({ row: row - 1, col: col + 2 });
//     if (inBoard(row + 1, col - 2) && !isBlocked(chessBoard, chessPiece, row + 1, col - 2))
//         movePos.push({ row: row + 1, col: col - 2 });
//     if (inBoard(row - 1, col - 2) && !isBlocked(chessBoard, chessPiece, row - 1, col - 2))
//         movePos.push({ row: row - 1, col: col - 2 });

//     return { movePos };
// }

// function getBishopHint(chessBoard, chessPiece, myColor) {
//     const { row, col, color } = chessPiece;
//     let movePos = [];

//     let i = row,
//         j = col;
//     while (inBoard(++i, ++j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }
//     i = row;
//     j = col;
//     while (inBoard(++i, --j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }
//     i = row;
//     j = col;
//     while (inBoard(--i, ++j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }
//     i = row;
//     j = col;
//     while (inBoard(--i, --j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }

//     return { movePos };
// }

// function getQueenHint(chessBoard, chessPiece, myColor) {
//     const { row, col, color } = chessPiece;
//     let movePos = [];
//     let i = row,
//         j = col;
//     while (inBoard(++i, j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }
//     i = row;
//     j = col;
//     while (inBoard(--i, j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }
//     i = row;
//     j = col;
//     while (inBoard(i, ++j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }
//     i = row;
//     j = col;
//     while (inBoard(i, --j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }
//     i = row;
//     j = col;
//     while (inBoard(++i, ++j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }
//     i = row;
//     j = col;
//     while (inBoard(++i, --j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }
//     i = row;
//     j = col;
//     while (inBoard(--i, ++j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }
//     i = row;
//     j = col;
//     while (inBoard(--i, --j) && !isBlocked(chessBoard, chessPiece, i, j)) {
//         movePos.push({ row: i, col: j });
//         if (isAttacking(chessBoard, chessPiece, i, j)) break;
//     }

//     return { movePos };
// }

// function getKingHint(chessBoard, chessPiece, myColor) {
//     const { row, col } = chessPiece;
//     let movePos = [];

//     if (inBoard(row, col + 1) && !isBlocked(chessBoard, chessPiece, row, col + 1))
//         movePos.push({ row: row, col: col + 1 });
//     if (inBoard(row, col - 1) && !isBlocked(chessBoard, chessPiece, row, col - 1))
//         movePos.push({ row: row, col: col - 1 });
//     if (inBoard(row + 1, col + 1) && !isBlocked(chessBoard, chessPiece, row + 1, col + 1))
//         movePos.push({ row: row + 1, col: col + 1 });
//     if (inBoard(row + 1, col) && !isBlocked(chessBoard, chessPiece, row + 1, col))
//         movePos.push({ row: row + 1, col: col });
//     if (inBoard(row + 1, col - 1) && !isBlocked(chessBoard, chessPiece, row + 1, col - 1))
//         movePos.push({ row: row + 1, col: col - 1 });
//     if (inBoard(row - 1, col + 1) && !isBlocked(chessBoard, chessPiece, row - 1, col + 1))
//         movePos.push({ row: row - 1, col: col + 1 });
//     if (inBoard(row - 1, col) && !isBlocked(chessBoard, chessPiece, row - 1, col))
//         movePos.push({ row: row - 1, col: col });
//     if (inBoard(row - 1, col - 1) && !isBlocked(chessBoard, chessPiece, row - 1, col - 1))
//         movePos.push({ row: row - 1, col: col - 1 });

//     return { movePos };
// }

// export function getPieceHint(chessBoard, chessPiece, myColor) {
//     switch (chessPiece.type) {
//         case pawn:
//             return getPawnHint(chessBoard, chessPiece, myColor);
//         case rook:
//             return getRookHint(chessBoard, chessPiece, myColor);
//         case knight:
//             return getKnightHint(chessBoard, chessPiece, myColor);
//         case bishop:
//             return getBishopHint(chessBoard, chessPiece, myColor);
//         case queen:
//             return getQueenHint(chessBoard, chessPiece, myColor);
//         case king:
//             return getKingHint(chessBoard, chessPiece, myColor);
//     }

//     return [];
// }

import { Chess } from "chess.js";

export class ChessModified extends Chess {
    constructor(obj, col) {
        super(obj, col);
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

export const chess = new ChessModified();

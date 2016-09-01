
/**
 * Board class
 */
export default class Board {

    private grid =[];
    moves = 0;
    isActive = true;

    constructor() {
        this.resetBoard();
    }

    createArray(x, y) {
        return Array.apply(-1, Array(x)).map(e => Array(y));
    }

    resetBoard() {
        //this.grid = this.createArray(6, 7);
        for(var i = 0; i <= 5; i++) {
            this.grid[i] = [];
            for(var j = 0; j <= 6; j++) {
                this.grid[i][j] = -1;
            }
        }
        this.isActive = true;
    }
    
    makeMove(columnIndex: number) {
        let whichPlayer = this.getNextPlayer();
        let cellIndex   = -1;

        this.grid.forEach((row, i) => {
            if (row[columnIndex] === -1) {
                cellIndex = i;
            }
        });

        if (cellIndex >= 0) {
            this.grid[cellIndex][columnIndex] = whichPlayer;
            this.moves++;

            if (this.moves == 42 || this.checkVictory()) {
                this.isActive = false;
            }
        }
    }

    getNextPlayer() {
        return this.moves % 2;
    }

    checkVictory() {
        return this.checkRows() || this.checkColumns() || this.checkDiagonals();
    }

    private checkRows() {
        let foundWinner = false;
        this.grid.forEach((row) => {
            if (this.checkArray(row)) {
                foundWinner = true;
                return;
            }
        });
        return foundWinner;
    }

    private checkColumns() {
        let foundWinner = false;
        this.grid.forEach((row, index) => {
            if (this.checkArray(this.grid.map(function(value) { return value[index];}))) {
                foundWinner = true;
                return;
            }
        });
        return foundWinner;
    }

    private checkDiagonals() {
        return this.checkDiagonal(true) || this.checkDiagonal(false);
    }
    
    private checkDiagonal(left2Right) {
        let foundWinner = false;
        for (let i = this.grid.length - 1; i >= 0; i--) {
            for (let x = 0; x < this.grid[i].length; x++) {
                let array = [];
                let j = x;
                let k = i;
                if (left2Right) {
                    while (k >= 0 && j < this.grid[i].length) {
                        let cell = this.grid[k][j];
                        array.push(cell);
                        j++;
                        k--;
                    }
                } else {
                    while (k > 0 && j > 0) {
                        let cell = this.grid[k][j];
                        array.push(cell);
                        j--;
                        k--;
                    }
                }
                if (this.checkArray(array)) {
                    foundWinner = true;
                    break;
                }
            }
        }
        return foundWinner;
    }

    private checkArray(array) {
        //let winningArray = [];
        let found = 0;
        let foundMove = -1;
        for (let i = 0; i< array.length; i++) {
            let cell = array[i];
            if (cell == -1) {
                found = 0;
                //winningArray.pop();
            } else {
                if (foundMove == cell) {
                    found++;
                } else {
                    found = 1;
                    foundMove = cell;
                }
                //winningArray.push(i);
            }



            if (found == 4) {
                //only works for rows
                //for (let i = 0; i<winningArray.length; i++) {
                //    array[winningArray[i]] = 2;
                //}
                return true;
            }
        }
        return false;
    }

}
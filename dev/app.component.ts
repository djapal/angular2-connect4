import {Component, OnInit} from '@angular/core';
import Board from "./lib/board";

declare var io: any;

@Component({
    selector: 'my-app',
    template: `
        <div style="text-align:center">
            <h1>Angular 2 Connect 4</h1>
            <h2>{{status}}</h2>
            <table style="margin-left: auto; margin-right: auto">
                <tr *ngFor="let row of board.grid">
                    <td *ngFor="let cell of row, let x = index" [class.gameover]="!board.isActive">
                        <div class="empty"
                             [class.circle-red]="cell == 0"
                             [class.circle-yellow]="cell == 1"
                             [class.circle-win]="cell == 2"
                             (click)="makeMove(x)"></div>                        
                    </td>
                </tr>         
            </table>
        </div>
    `
})

export class AppComponent implements OnInit {

    private board: Board;
    private socket: any;
    private status: string = '';
    private player: number;

    constructor() {

    }

    ngOnInit():any {
        this.resetBoard();

        this.socket = io.connect('http://127.0.0.1:8080');

        this.socket.on('assignPlayerNumber', function (data) {
            this.player = data;
            this.resetBoard();
            if (data > 1) {
                this.status = '2 players already connected';
                this.board.isActive = false;
            } else {
                this.status = 'You are player ' + (++data);
            }
        }.bind(this));

        this.socket.on('gameOver', function() {
            this.status = 'Game over';
        }.bind(this));

        this.socket.on('resetBoard', function (data) {
            this.resetBoard();
            this.status = 'The other player has left the game.';
        }.bind(this));

        this.socket.on('updateBoard', function (data, player) {
            if (this.player != player) {
                this.makeMoveInternal(data);
            }
        }.bind(this));
    }

    resetBoard() {
        this.board = new Board();
    }

    makeMove(y: number) {
        if (!this.board.isActive) {
            return;
        }
        this.board.makeMove(y);
        this.socket.emit('makeMove', y, this.player);
        if (!this.board.isActive) {
            this.status = 'Game over';
            this.socket.emit('gameOver');
        } else {
            this.board.isActive = false;
            this.status = 'Waiting for other player\'s move';
        }
    }

    makeMoveInternal(y: number) {
        this.board.isActive = true;
        this.board.makeMove(y);
        this.status = 'Your turn';
    }
}

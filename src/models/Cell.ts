import {Colors} from "./Colors";
import {Figure} from "./figures/Figure";
import {Board} from "./Board";
import {King} from "./figures/King";
import {Pawn} from "./figures/Pawn";

export class Cell {
    readonly x: number;
    readonly y: number;
    readonly color: Colors;
    figure: Figure | null ;
    board: Board;
    available: boolean;
    id: number;

    constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
        this.board = board;
        this.x = x;
        this.y = y;
        this.available = false;
        this.id = Math.random();
        this.color = color;
        this.figure = figure;
    }

    isEmpty() {
        return this.figure === null;
    }

    isEnemy(target: Cell) {
        if(target.figure){
            return this.figure?.color !== target.figure.cell;
        }
        return false;
    }

    isEmptyVertical(target: Cell): boolean{
        if(this.x !== target.x){
            return false;
        }


        const min = Math.min(this.y, target.y);
        const max = Math.max(this.y, target.y);
        for (let y = min + 1; y < max; y++){
            if(!this.board.getCell(this.x, y).isEmpty()){
                return false;
            }
        }
        return true;
    }

    isEmptyVerticalKing(target: Cell){
        if(this.x !== target.x){
            return false;
        }
        if((target.y === this.y + 1) && (target.x === this.x + 1)){
            return true;
        }
        if((target.y === this.y - 1) && (target.y === this.y - 1)){
            return true
        }
        if((this.y === target.y + 1) && (this.x === target.x + 1)){
            return true;
        }
        if((this.y === target.y - 1) && (this.y === target.y - 1)){
            return true
        }
        return false;
    }

    isEmptyHorizontalKing(target: Cell): boolean{
        if(this.y !== target.y){
            return false;
        }

        const min = Math.min(this.x, target.x);
        const max = Math.max(this.x, target.x);
        for (let x = min + 1; x < max; x++){
            if(!this.board.getCell(x, this.y).isEmpty()){
                return false;
            }
            if(!this.board.getCell(x, this.y).isEnemy(target)){
                return false;
            }
            if(max > 1){
                if(!this.board.getCell(x, this.y).isEmpty()){
                    return false;
                }
            }
            if(target.x > (max - 7)){
                return false;
            }
        }
        return true;
    }

    isEmptyHorizontal(target: Cell): boolean{
        if(this.y !== target.y){
            return false;
        }

        const min = Math.min(this.x, target.x);
        const max = Math.max(this.x, target.x);
        for (let x = min + 1; x < max; x++){
            if(!this.board.getCell(x, this.y).isEmpty()){
                return false;
            }
        }
        return true;
    }

    isEmptyDiagonal(target: Cell): boolean{
        const absX = Math.abs(target.x - this.x);
        const absY = Math.abs(target.y - this.y);

        if(absY !== absX){
            return false;
        }
        const dy = this.y < target.y ? 1 : -1
        const dx = this.x < target.x ? 1 : -1

        for (let i = 1; i < absY; i++){
            if(!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty()){
                return false;
            }
        }
        return true;
    }

    addLostFigures(figure: Figure){
        figure.color === Colors.BLACK
            ? this.board.lostBlackFigures.push(figure)
            : this.board.lostWhiteFigures.push(figure)
    }


    setFigure(figure: Figure){
        this.figure = figure;
        this.figure.cell = this;
    }

    moveFigure(target: Cell) {
        if(this.figure && this.figure?.canMove(target)) {
            this.figure?.moveFigure(target);
            if(target.figure){
                this.addLostFigure(target.figure)
            }
            target.setFigure(this.figure);
            this.figure = null;
        }
    }
}
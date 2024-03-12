const prompt = require("prompt-sync")({ sigint: true });
const termkit = require("terminal-kit").terminal;

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
    constructor(hatAndHoles, field) {
        this.field = field;
        this.hatAndHoles = hatAndHoles;
        this.previousX = 0;
        this.previousY = 0;
    }

     print() {
        for (let row of this.hatAndHoles) {
            let printedRow = row.map((element) => {
                if (element === hat) {
                    termkit.brightYellow(hat);
                } else if (element === hole) {
                    termkit.red(hole);
                } else if (element === fieldCharacter) {
                    termkit.white(fieldCharacter);
                } else if (element === pathCharacter) {
                    termkit.green(pathCharacter);
                } else {
                    return element;
                }
            });
            termkit(...printedRow)
            console.log("")
        }
    }

    play() {
        let x = 0;
        let y = 0;
        this.print(this.field);

        const directionPrompt = "What direction you wish to move on? Please enter U for Up, D for Down, R for Right and L for Left";

        while (
            this.hatAndHoles[y][x] === pathCharacter ||
            this.hatAndHoles[y][x] === fieldCharacter
        ) {

            const direction = prompt(directionPrompt);

            if (direction.toUpperCase() === "U") {
                if (y === 0) {
                    console.log("You can not move up, you will be out of field");
                } else {
                    y -= 1;
                }
            } else if (direction.toUpperCase() === "D") {
                if (y >= this.field.length) {
                    console.log("If you will move down, you will be out of field. Choose another direction");
                } else {
                    y += 1;
                }
            } else if (direction.toUpperCase() === "L") {
                if (x === 0) {
                    console.log("You can not move left. Choose another direction");
                } else {
                    x -= 1;
                }
            } else if (direction.toUpperCase() === "R") {
                if (x >= this.field[y].length) {
                    console.log("You will be out of field. Choose another direction");
                } else {
                    x += 1;
                }
            } else {
                console.log('Invalid input, please choose "U", "D", "L" or "R"');
            }

            if (this.hatAndHoles[y][x] === hat) {
                termkit.brightCyan("Congratulations! You found your hat :)");
            } else if (this.hatAndHoles[y][x] === hole) {
                termkit.brightRed("Oops! You fall in hole. Game Over :(");
            } else {
                this.hatAndHoles[this.previousY][this.previousX] = fieldCharacter;
                this.hatAndHoles[y][x] = pathCharacter;
                this.previousX = x;
                this.previousY = y;
                this.print(this.field);
            }
        }
    }

    static generateField(height, width, holes) {
        let newField = [];
        for (let i = 0; i < height; i++) {
            newField.push([]);
            for (let j = 0; j < height; j++) {
                newField[i].push(fieldCharacter);
            }
        }

        newField[0][0] = pathCharacter;

        let hatX = Math.floor(Math.random() * width);
        let hatY = Math.floor(Math.random() * height);
        newField[hatY][hatX] = hat;

        for (let q = holes; q > 0; q--) {
            let holeX = hatX;
            let holeY = hatY;
            while (holeX === hatX) {
                holeX = Math.floor(Math.random() * width);
            }
            while (holeY === hatY) {
                holeY = Math.floor(Math.random() * height);
            }
            newField[holeY][holeX] = hole;
        }

        return newField;
    }

    static generateBlankField(height, width) {
        let newField = [];

        for (let i = 0; i < height; i++) {
            newField.push([]);
            for (let j = 0; j < height; j++) {
                newField[i].push(width);
            }
        }

        newField[0][0] = pathCharacter;
        return newField;
    }
}

let myField;

const blankField = Field.generateBlankField(20, 20);
const newField = Field.generateField(20, 20, 20);

myField = new Field(newField, blankField);

myField.play();

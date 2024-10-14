// the adventurer starts the game on the start cell
// at anytime he has a name and a position
class adventurer {
    // name: string;
    // position: position;
    constructor (name, position) {
        this.name = name;
        this.position = position;
    };

    choose (maze) {
        var surroundingValues= {
            "left": (this.position.x-1 >= 0) ? maze.cells[this.position.x-1][this.position.y].count : Infinity,
            "down": (this.position.y+1 < maze.height) ? maze.cells[this.position.x][this.position.y+1].count : Infinity,
            "up": (this.position.y-1 >= 0) ? maze.cells[this.position.x][this.position.y-1].count : Infinity,
            "right": (this.position.x+1 < maze.width ) ? maze.cells[this.position.x+1][this.position.y].count : Infinity,
        }
        var direction = Object.keys(surroundingValues,).find(
            key => surroundingValues[key] === Math.min(surroundingValues["left"], surroundingValues["right"], surroundingValues["up"], surroundingValues["down"])
        );
        return direction;
    };
    leaveATrace(maze) {
        maze.cells[this.position.x][this.position.y].count++;
    };
    amIAbleToMove(direction, maze) {
        switch (direction) {
            case "left":
                return (this.position.x-1 >= 0) ? maze.cells[this.position.x-1][this.position.y].stepAble : false;
                
            case "right":
                return (this.position.x+1 < maze.width) ? maze.cells[this.position.x+1][this.position.y].stepAble : false;
                
            case "up":
                return (this.position.y-1 >= 0) ? maze.cells[this.position.x][this.position.y-1].stepAble : false;
                
            case "down":
                return (this.position.y+1 < maze.height) ? maze.cells[this.position.x][this.position.y+1].stepAble : false;
                
        }
    };
    move(direction, maze) {
        switch (direction) {
            case "left":
                this.position.x--;
                break;
            case "right":
                this.position.x++;
                break;
            case "up":
                this.position.y--;
                break;
            case "down":
                this.position.y++;
                break;
        }
    };
    cantMove(direction, maze) {
        switch (direction) {
            case "left":
                if (this.position.x-1 >= 0) {
                    maze.cells[this.position.x-1][this.position.y].count = Infinity;
                }
                break;
            case "right":
                if (this.position.x+1 < maze.width) {
                    maze.cells[this.position.x+1][this.position.y].count =Infinity;
                }
                break;
            case "up":
                if (this.position.y-1 >=0 ) {
                    maze.cells[this.position.x][this.position.y-1].count=Infinity;
                }
                break;
            case "down":
                if (this.position.y+1 < maze.height) {
                    maze.cells[this.position.x][this.position.y+1].count=Infinity;
                }
                break;
        }
    }
}

class position {
    // x: number;
    // y: number;
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }
}

class cell {
    constructor (position) {
        this.position = position;
        this.count=0;
        this.stepAble = true;
    }
}

class wall extends cell {
    constructor (position) {
        super(position);
        this.stepAble = false;
    }
    tostring() {
        return " #";
    }
}

class path extends cell {
    tostring() {
        return " " + this.count + "";
    }
}


class goal extends cell {
    tostring() {
        return " G";
    }
}

class start extends cell {
    tostring() {
        return " S";
    }
}

class maze {
    constructor (difficulty, startPosition, goalPosition) {
        this.cells=[[]];
        this.goalPosition = goalPosition;
        if (difficulty === "default") {
            this.width = 7;
            this.height = 6;
            for (let i = 0; i < this.height; i++) {
                for (let j = 0; j < this.width; j++) {
                    this.cells[i].push(new path(new position(i, j)));
                }
                this.cells.push([]);
            }
            this.cells[0][1] = new wall(new position(1, 0));
            this.cells[1][1] = new wall(new position(1, 1));
            this.cells[2][1] = new wall(new position(1, 2));
            this.cells[4][1] = new wall(new position(1, 4));
            this.cells[5][1] = new wall(new position(1, 5));
            this.cells[1][3] = new wall(new position(3, 1));
            this.cells[2][3] = new wall(new position(3, 2));
            this.cells[4][3] = new wall(new position(3, 4));
            this.cells[1][4] = new wall(new position(4, 1));
            this.cells[3][4] = new wall(new position(4, 3));
            this.cells[3][5] = new wall(new position(5, 3));
            this.cells[5][5] = new wall(new position(5, 5));
            this.cells[1][6] = new wall(new position(6, 1));

        } else {
            this.wallPart = difficulty.wallPart;
            this.width = difficulty.width;
            this.height = difficulty.height;
            
            for (let i = 0; i < difficulty.width; i++) {
                for (let j = 0; j < difficulty.height; j++) {
                    var random = Math.random();
                    if (random < difficulty.wallPart) {
                        this.cells[i].push(new wall(new position(i, j)));
                    } else {
                        this.cells[i].push(new path(new position(i, j)));
                    }
                }
                this.cells.push([]);
            }
        }
        this.startCell(startPosition);
        this.goalCell(goalPosition);
    }
    startCell (position) {
        this.cells[position.x][position.y] = new start(position);
    }
    goalCell (position) {
        this.cells[position.x][position.y] = new goal(position);
    }
    tostring() {
        let result = "____________\n";
        for (let i = 0; i < this.height; i++) {
            result += "|";
            for (let j = 0; j < this.width; j++) {
                // console.log(i, j);
                result += this.cells[i][j].tostring() + " ";
            }
            result += " |\n";
        }
        result += "____________";
        return result;
    }
                
}
class difficulty {
    constructor (width, height, wallPart) {
        this.width = width;
        this.height = height;
        this.wallPart = wallPart;
    }
}
class game {
    constructor (difficulty, startPosition, goalPosition, adventurerName, display) {
        this.maze = new maze(difficulty, startPosition, goalPosition);
        this.adventurer = new adventurer(adventurerName, startPosition);
        this.roundCount = 0;
        this.win=false;
        this.display=display;
    }
    play(){
        this.display ? this.displayBoard() : null;
        while (!this.win ) {

            var direction=this.adventurer.choose(this.maze);
            this.display ? console.log("I choosed " + direction) : null;

            if (this.adventurer.amIAbleToMove(direction, this.maze)) {
                this.adventurer.leaveATrace(this.maze, this.maze);
                this.display ? console.log("I leave a stone there") : null ;

                this.adventurer.move(direction);
                this.display ?  console.log("I moved") : null ;
            } else {
                this.adventurer.leaveATrace(this.maze,this.maze);
                this.display ? console.log("I leave a stone there") : null ;

                this.adventurer.cantMove(direction, this.maze);
                this.display ? console.log("I can't move") : null ;
            }
            this.roundCount++;
            if (this.roundCount > (this.maze.width * this.maze.height * 6)) {
                break;
            }
            this.display ? this.displayBoard() : null;

            this.win = ((this.adventurer.position.x == this.maze.goalPosition.x) && (this.adventurer.position.y == this.maze.goalPosition.y));
        }
        if (this.win) {
            this.display ? console.log("You won! In only " + this.roundCount + " rounds") : null;
        } else {
            this.display ? console.log("This maze looks impossible to solve."): null;
        }
    }
    displayBoard() {
        console.log(this.maze.tostring());
    }
}

var results = [];

function playAGame(switchDif, width, height, wallPart) {
    if (switchDif == "default") {
        var gameSession= new game("default", new position(0, 0), new position(2, 4), "John", true);
        gameSession.play();
        if (gameSession.win) {
            results.push(gameSession.roundCount);
        } else {
            playAGame("default", width, height, wallPart);
        }
    } else {
        var center = [Math.floor(width/2), Math.floor(height/2)];
        var gameSession= new game(new difficulty(width, height, wallPart), new position(0, 0), new position(center[0], center[1]), "John", true);
        gameSession.play();
        
        if (gameSession.win) {
            results.push(gameSession.roundCount);
            if (gameSession.win < 10) {
                return;
            }
        } else {
            playAGame("", width, height, wallPart);
        }
    }
}
let i = 0
for (i = 0; i < 1000; i++) {
    var size = 10;
    var width = 7;
    var height = 6;

    var wallPart = 0.2;
    playAGame("", size, size, wallPart);
}

var min =Infinity;
var max =0;

for (let i = 0; i < results.length; i++) {
    if (results[i] < min) {
        min = results[i];
    }
    if (results[i] > max) {
        max = results[i];
    }
}

console.log(" Min: " + min + " Max: " + max + " Mean: " + (results.reduce((a, b) => a + b, 0)/results.length) + " Sum: " + results.reduce((a, b) => a + b, 0));
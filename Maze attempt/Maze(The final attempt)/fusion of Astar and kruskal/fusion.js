var g_sz=20;// size of the cells
var mazeGrid = [];
var maze;
var cols=40;
var rows=40;

var grid= new Array(cols);//an array of columns
var openSet=[];
var closedSet=[];
var start;
var end;
var w,h;
var path = [];
var nosolution = false;

function setup(){
  createCanvas(800,800);

  wid = width/g_sz; //rows
  hgt=height/g_sz; //columns
  maze = new mazeSolve(wid, hgt, g_sz);
  maze.initialize();
  frameRate(100)

  console.log('A*')

  for (var i=0; i < cols; i++){
    grid[i] = new Array(rows);// creates an array of rows
  }

    for (var i=0; i < cols; i++){
      for (var j=0; j < rows; j++){
      grid[i][j] = new Spot(i, j);
    }
}
    for (var i=0; i < cols; i++){
      for (var j=0; j < rows; j++){
      grid[i][j].addNeighbors(grid);
    }
  }



start=grid[0][0];//start point to solve from
end=grid[cols-1][rows-1];// end point to get to

openSet.push(start);

  console.log(grid);


}

function draw() {
	maze.constructOneStep();
	maze.display();

//A* algorithm
if (openSet.length>0){
  var lowestIndex = 0;
  for (var i = 0; i < openSet.length; i++){
      if (openSet[i].f < openSet[lowestIndex].f){
        lowestIndex = i;
      }
    }
    var current = openSet[lowestIndex];

    if (current === end){
      console.log("DONE!");
    }
    removal(openSet,current);
    closedSet.push(current);


    var neighbors = current.neighbors;
    for (var i = 0; i< neighbors.length; i++){
        var neighbor = neighbors[i];

        if(!closedSet.includes(neighbor)){
            var tempG = current.g + 1;

            if (openSet.includes(neighbor)){
              if (tempG < neighbor.g) {
                neighbor.g = tempG;
              }
            } else {
              neighbor.g = tempG;
              openSet.push(neighbor);
            }

            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;


          }

    }




//we keep going
} else {
  console.log('no solution');
  nosolution=true;
  noLoop();
    //no solution

  }

  for (var i=0; i<cols; i++){
    for (var j=0; j<rows; j++){
      grid[i][j].shows(color(0));
    }
  }

  for (var i=0; i < closedSet.length; i++){//blue
    closedSet[i].shows(color(0,0,255));
  }

  for (var i=0; i < openSet.length; i++){//green
    openSet[i].shows(color(0,255,0));
  }

  //find the path
  if(!nosolution){
  path = [];
  var temp = current;
  path.push(temp);
  while(temp.previous){
    path.push(temp.previous);
    temp=temp.previous;
  }
}
  for ( var i=0; i<path.length; i++){//blue
    path[i].shows(color(255,0,0));
  }


}

// Labyrinth solution
function mazeSolve(wid, hgt, g_sz){
	this.rows = wid;
	this.cols = hgt;
	this.size  =  g_sz ;    // grid size
	this.walls  =  [] ;    // array of walls
	this.uSet  =  new  unionSet ( ) ;   // check the set of squares
	this.wallIndex = 0;
	this.initialize = function(){
		// Wall in x and y direction
		for(var i = 0; i <= this.rows; i++){
			for(var j = 0; j < this.cols; j++){
				this.walls.push(new wall(i, j, i, j + 1, this.size));
			}
		}
		for(var j = 0; j <= this.cols; j++){
			for(var i = 0; i < this.rows; i++){
				this.walls.push(new wall(i, j, i + 1, j, this.size));
			}
		}
		// Random sort
		this.walls.sort(function randomSort(a, b){return Math.random() > 0.5 ? -1 : 1;});
		for(var i = 0; i < this.rows; i++){
			for(var j = 0; j < this.cols; j++){
				this.uSet.uset.push(new cell(i, j, this.rows, this.cols));
			}
		}
	}
	// draw
	this.display = function(){
		for(var i = 0; i < this.walls.length; i++){
			this.walls[i].isHighlight(false);
		}
		this.walls[this.wallIndex].isHighlight(true);
		for(var i = 0; i < this.walls.length; i++){
			this.walls[i].show();
		}
	}
	// build gradually
	this.constructOneStep = function(){
		var  wall  =  this . walls [ this . wallIndex ] ;           // select walls in order
		var isBorder = (wall.i1 == wall.i2 && (wall.i1 == 0 || wall.i1 == this.rows)) || (wall.j1 == wall.j2 && (wall.j1 == 0 || wall.j1 == this.cols));
		// not a boundary
		if(isBorder == false){
			var c1Index, c2Index;
			if(wall.i1 == wall.i2){
				c1Index = (wall.i1 - 1) * this.cols + wall.j1;
				c2Index = wall.i1 * this.cols + wall.j1;
			}else if(wall.j1 == wall.j2){
				c1Index = wall.i1 * this.cols + wall.j1 - 1;
				c2Index = wall.i1 * this.cols + wall.j1;
			}
			var  p1  =this.uSet.findParent ( c1Index ) ;           // find disjoint-set which the parent root node
			var p2 = this.uSet.findParent(c2Index);
			if (p1 != p2){
				this.walls[this.wallIndex].breaked = true;   // remove
				this . uSet . unionTwo ( c1Index ,  c2Index ) ;         // merge
			}
		}
		this.wallIndex++;
		if(this.wallIndex >= this.walls.length){
			this.wallIndex = this.walls.length - 1;
		}
	}
}

// and check set
function  unionSet ( ) {
	this.uset = [];
	this.findParent= function(ind){
		var pind = this.uset[ind].parent;
		if ( pind  ==  ind ) {
			return ind;
		}
		var res = this.findParent(pind);
		this.uset[ind].parent = res;
		return res;
	}
	this.unionTwo = function(ind1, ind2){
		var p1 = this.findParent(ind1);
		var p2 = this.findParent(ind2);
		this.uset[p1].parent = p2;
	}
}

// cell
function cell(i, j, rows, cols){
	this . i  =  i ;       // row coordinates
	this . j  =  j ;       // column coordinates
	this.rows = rows;
	this.cols = cols;
	this.parent = i * cols + j;
	this.index = i * cols + j;
}

// wall
function wall(i1, j1, i2, j2, s){
	this.i1 = i1;
	this.j1 = j1;
	this.i2 = i2;
	this.j2 = j2;
	this.s = s;
	this.breaked = false;
	this . ishigh  =  false ;                   // Whether to highlight, only the currently processed wall is highlighted
	this.isHighlight = function(ishigh){
		this.ishigh = ishigh;
	}
	this.show = function(){
		if(this.breaked == false){
			if(this.ishigh){
				stroke(0);
				strokeWeight(5);
			}else{
				stroke(225);
				strokeWeight(2);
			}
			line(this.j1 * this.s, this.i1 * this.s, this.j2 * this.s, this.i2 * s);
		}
	}
}

//removes an element from the arrat
function removal(arr, elt) {
  for (var i = arr.length-1; i >=0; i--) {
    if (arr[i]== elt) {
      arr.splice(i, 1);
    }
  }
}
//calculate distance between two points
function heuristic(a, b){
  var d = dist(a.i,a.j,b.i,b.j)
  //var d = abs(a.i-b.i) + abs(a.j-b.j)
  return d;
}

function Spot(i,j){
  this.i=i;
  this.j=j;
  this.f=0;
  this.g=0;
  this.h=0;
  this.neighbors=[];
  this.previous;

  this.shows=function(col){
    fill(col);
    noStroke();
    rect(this.i*w, this.j*h, w-1, h-1);
  }
  this.addNeighbors=function(grid){
    var i = this.i;
    var j = this.j;
    if(i<cols-1){
      this.neighbors.push(grid[i+1][j]);
  }
    if(i>0){
  this.neighbors.push(grid[i-1][j]);
}
    if(j<rows-1){
  this.neighbors.push(grid[i][j+1]);
}
    if(j>0){
  this.neighbors.push(grid[i][j-1]);
    }
  }




}

//removes an element from the arrat
function removal(arr, elt) {
  for (var i = arr.length-1; i >=0; i--) {
    if (arr[i]== elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b){
  //var d = dist(a.i,a.j,b.i,b.j)
  var d = abs(a.i-b.i) + abs(a.j-b.j)
  return d;
}

var cols=40;
var rows=40;
var grid= new Array(cols);//an array of columns

var openSet=[];
var closedSet=[];
var start;
var end;
var w,h;
var path = [];


function Spot(i,j){
  this.i=i;
  this.j=j;
  this.f=0;
  this.g=0;
  this.h=0;
  this.neighbors=[];
  this.previous = undefined;

  this.show=function(col){
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


function setup(){
  createCanvas(800,800);
  console.log('A*');

  w = width/cols;
  h = height/rows;

  //making a 2D array
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

function draw(){ // use the draw function to loop the algorithm

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

    //no solution

  }



  background(255);

for (var i=0; i<cols; i++){
  for (var j=0; j<rows; j++){
    grid[i][j].show(color(0));
  }
}

for (var i=0; i < closedSet.length; i++){//red
  closedSet[i].show(color(255,0,0));
}

for (var i=0; i < openSet.length; i++){//green
  openSet[i].show(color(0,255,0));
}

//find the path
path = [];
var temp = current;
path.push(temp);
while(temp.previous){
  path.push(temp.previous);
  temp=temp.previous;
}

for ( var i=0; i<path.length; i++){//blue
  path[i].show(color(0,0,255));
}
}

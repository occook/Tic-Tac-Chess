/*
    JavaScript File that determines the basic rules and movements of the game. Does not find moves for bot.
*/

//Initialize some lists of squares and the array for the different types of pieces that exist in Tic Tac Chess.
var holderList = $('.holder');
var squareList = $('th');
var pieceList = ['bB','bN','bP','bR','wB','wN','wP','wR'];

//Initialize and bind events to buttons below the playing board.
var restartButton = $('#restart').on('click', restart);
var deleteButton = $('#delete').on('click', deleteBoard);

//Function for the restart button. Restarts the game. Creates board in for loop, then allows for pieces to be moved with allowSelectPiece().
function beginBoard(){
  for (var i=0; i<holderList.length; i++){
    holderList[i].innerHTML = '<img id= '+pieceList[i]+' src=\"images/'+pieceList[i]+'.png\"/>';
  }
  selectPiece();
}

//This messy function basically causes the background of any board square to turn yellow when clicked. It will then "select" that square, and take note of the image that is in that square. Will pass the image into the moveSelectedPiece() function.

function selectPiece(){

  $('th:has(img)').on('click',function() {

    var el = $(this).find('img'); //Find the image that is being selected, store in el.
    var id = parseInt(this.id);

    // If another piece is already selected, make that piece unselected and select the new piece, get events from moveSelectedPiece().
    if ($('.selected').length == 1) {
      if(!($(this).hasClass('selected'))) {
        $('.board').off();
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
        moveSelectedPiece(el,id);
      }

      // If we just double clicked on the same piece, unselect and remove the events.
      else{
        $(this).removeClass('selected');
        $('th').off();
        selectPiece();
      }
    }

    // No piece has been selected yet, so select a piece and get events from moveSelectedPiece().
    else{
      $(this).addClass('selected');
      moveSelectedPiece(el,id);
    }
  });
}

// Currently, this function just takes the image passed to it, and moves it to the board. ****NEEDS TO BE MORE SELECTIVE. WE NEED TO START BY FINDING OUT WHICH PIECE IT IS, AND THEN BASED ON THAT PIECE, WE NEED TO FIGURE OUT THE POSSIBLE SQUARES THAT THAT PIECE CAN MOVE.
function moveSelectedPiece(el,id){
  possibleSquares(el,id);
  $('th.possible').not('.hasPiece').on('click', function(){
    $(this).addClass('hasPiece');
    $(this).prepend(el);
    $('th').off();
    $('.selected').removeClass('selected').removeClass('hasPiece');
    $('.possible').removeClass('possible');
    selectPiece();
  });
}



function possibleSquares(el,id){
  var imgID = el.attr('id');

  if (imgID.includes('P')){
      pawnMoves(id);
  }
  if (imgID.includes('R')){
      rookMoves(el, id);
  }
  if (imgID.includes('N')){
      knightMoves(id);
  }
  if (imgID.includes('B')){
      bishopMoves(id);
  }
}


/*
ROOK MOVES: ROOK CAN MOVE IN ROW AND COLUMN. THIS MEANS THAT ROOK CAN MOVE WITHIN A RANGE 1-4, 5-8, 9-12, 13-16.
ALSO THE ROOK CAN MOVE TO SQUARES WITH THE SAME X%4 (CAN BE 0,1,2,3)
*/

function rookMoves(el, id){
    var i;
    if (id>15) $('.board').addClass('possible');
    else {
      var temp1 = id%4;
      for (i=0; i<16; i++){
        var temp2 = i%4;
        if (temp1 == temp2 && i!=id) $('#'+i).addClass('possible');
      }


    }
}

function bishopMoves(id){
    $('th.board').addClass('possible');
}

function knightMoves(id){
    $('th.board').addClass('possible');
}

function pawnMoves(id){
    $('th.board').addClass('possible');
}

// Used for the Delete Button. Removes all images and events.
function deleteBoard(){
  $('.board').html('').removeClass('red').off('click');
  $('.holder').html('').removeClass('selected').off('click');;
}

// Used by the Restart button. Actually Deletes entire board than reloads it.
function restart(){
  deleteBoard();
  beginBoard();
}

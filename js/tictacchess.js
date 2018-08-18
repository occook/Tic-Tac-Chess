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
        $('.possible').removeClass('possible');
        $('.capture').removeClass('capture');
        $(this).addClass('selected');
        moveSelectedPiece(el,id);
      }

      // If we just double clicked on the same piece, unselect and remove the events.
      else{
        $(this).removeClass('selected');
        $('.possible').removeClass('possible');
        $('.capture').removeClass('capture');
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
  $('th.hasPiece').on('click', selectPiece());
  $('th.possible').not('.hasPiece').on('click', function(){

    //Pawn placement
    var imgID = el.attr('id');
    if (id>15 && imgID.includes('P')){
      if (imgID.includes('w') && this.id>3){
        el.addClass('up');
      }
      if (imgID.includes('b') && this.id>11){
        el.addClass('up');
      }
    }

    $(this).addClass('hasPiece');
    $(this).prepend(el);
    $('th').off();
    $('.selected').removeClass('selected').removeClass('hasPiece');
    $('.possible').removeClass('possible');
    $('.capture').removeClass('capture');
    selectPiece();
  });
}



function possibleSquares(el,id){
  var imgID = el.attr('id');

  if (imgID.includes('P')){
      pawnMoves(el, id);
  }
  if (imgID.includes('R')){
      rookMoves(el, id);
  }
  if (imgID.includes('N')){
      knightMoves(el, id);
  }
  if (imgID.includes('B')){
      bishopMoves(el, id);
  }
}


/*
ROOK MOVES: ROOK CAN MOVE IN ROW AND COLUMN. THIS MEANS THAT ROOK CAN MOVE WITHIN A RANGE 1-4, 5-8, 9-12, 13-16.
ALSO THE ROOK CAN MOVE TO SQUARES WITH THE SAME X%4 (CAN BE 0,1,2,3)
*/

function rookMoves(el, id){
    $('.possible').removeClass('possible');
    $('.capture').removeClass('capture');
    if (id>15) $('.board').not('.hasPiece').addClass('possible'); //Be able to place rook anywhere to start
    else {

      //Deal with possible squares in same column.
      //First we check up. If we run into square that has a piece, we stop because we can't go through that piece.
      var counter = id-4;
      while (counter>=0){
        if (($('#'+counter).hasClass('hasPiece'))){
          captureTest(el,id,counter);
          break;
        }
        else{
          $('#'+counter).addClass('possible');
          counter-=4;
        }
      }
      //Now we do the same but for down.
      counter = id+4;
      while (counter<16){
        if (($('#'+counter).hasClass('hasPiece'))){
          captureTest(el,id,counter);
          break;
        }
        else{
            $('#'+counter).addClass('possible');
            counter+=4;
        }
      }

      //Deal with possible squares in same row.
      //First we will check left. We will stop when counter%4=3
      counter = id-1;
      while((counter+4)%4!=3){
        if (($('#'+counter).hasClass('hasPiece'))){
          captureTest(el,id,counter);
          break;
        }
        else{
          $('#'+counter).addClass('possible');
          counter--;
        }
      }
      //Now we will check right.
      counter = id+1;
      while((counter+4)%4!=0){
        if (($('#'+counter).hasClass('hasPiece'))){
          captureTest(el,id,counter);
          break;
        }
        else{
          $('#'+counter).addClass('possible');
          counter+=1;
        }
      }
    }
}


//Creates possible squares for bishop moves.
function bishopMoves(el, id){ //Will be extremely similar to rookMoves
    $('.possible').removeClass('possible');
    $('.capture').removeClass('capture');
    if (id>15) $('.board').not('.hasPiece').addClass('possible');
    else{
      var rowCheckBase = Math.floor(id/4); //This will help us with wrap around errors
      var rowCheck = rowCheckBase;

      //Down right
      var counter = id+5;
      while (counter<16){
        if (($('#'+counter).hasClass('hasPiece'))){
          captureTest(el,id,counter);
          break;
        }
        else{
            if (Math.floor(counter/4)-1 != rowCheck) break;
            else{
              rowCheck++;
              $('#'+counter).addClass('possible');
            }
            counter+=5;
          }
      }

      //Up left
      rowCheck = rowCheckBase;
      counter = id-5;
      while(counter>-1){
        if (($('#'+counter).hasClass('hasPiece'))){
          captureTest(el,id,counter);
          break;
        }
        else{
          if (Math.floor(counter/4)+1 != rowCheck) break;
          else{
            rowCheck--;
            $('#'+counter).addClass('possible');
          }
          counter-=5;
        }
      }

      //Down left
      rowCheck = rowCheckBase;
      counter = id+3;
      while(counter<16){
        if (($('#'+counter).hasClass('hasPiece'))){
          captureTest(el,id,counter);
          break;
        }
        else{
          if (Math.floor(counter/4) == rowCheck) break;
          else{
            rowCheck++;
            $('#'+counter).addClass('possible');
          }
          counter+=3;
        }
      }

      //Up right
      rowCheck = rowCheckBase;
      counter = id-3;
      while(counter>-1){
        if (($('#'+counter).hasClass('hasPiece'))){
          captureTest(el,id,counter);
          break;
        }
        else{
          if (Math.floor(counter/4) == rowCheck) break;
          else{
            rowCheck--;
            $('#'+counter).addClass('possible');
          }
          counter-=3;
        }
      }
    }
}

//Creates possible squares for knight moves.
function knightMoves(el, id){
    $('.possible').removeClass('possible');
    $('.capture').removeClass('capture');
    if (id>15) $('.board').not('.hasPiece').addClass('possible');
    else{
      var counter;
      counter = id-9;
      if (id-9>-1 && Math.floor(id/4)-Math.floor((id-9)/4)==2){
        captureTest(el,id,counter);
      }
      counter = id-7;
      if (id-7>-1 && Math.floor(id/4)-Math.floor((id-7)/4)==2){
        captureTest(el,id,counter);
      }
      counter = id-6;
      if (id-6>-1 && Math.floor(id/4)-Math.floor((id-6)/4)==1){
        captureTest(el,id,counter);
      }
      counter = id-2;
      if (id-2>-1 && Math.floor(id/4)-Math.floor((id-2)/4)==1){
        captureTest(el,id,counter);
      }
      counter = id+9;
      if (id+9<16 && Math.floor(id/4)-Math.floor((id+9)/4)==-2){
        captureTest(el,id,counter);
      }
      counter = id+7;
      if (id+7<16 && Math.floor(id/4)-Math.floor((id+7)/4)==-2){
        captureTest(el,id,counter);
      }
      counter = id+6;
      if (id+6<16 && Math.floor(id/4)-Math.floor((id+6)/4)==-1){
        captureTest(el,id,counter);
      }
      counter = id+2;
      if (id+2<16 && Math.floor(id/4)-Math.floor((id+2)/4)==-1){
        captureTest(el,id,counter);
      }
    }
}

function pawnMoves(el, id){
    $('.possible').removeClass('possible');
    $('.capture').removeClass('capture');
    if (id>15) $('.board').not('.hasPiece').addClass('possible');
    else{
      var counter;
        if (el.hasClass('up')){
          counter = id-4;
          if (!($('#'+counter).hasClass('hasPiece')))
          $('#'+counter).addClass('possible');
          if (counter<4){
            el.removeClass('up');
          }
        }
        else{
          counter = id+4;
          if (!($('#'+counter).hasClass('hasPiece')))
          $('#'+counter).addClass('possible');
          if (counter>11){
            el.addClass('up');
          }
        }
        captureTest(el,id,counter);
    }
}

// Used for the Delete Button. Removes all images and events.
function deleteBoard(){
  $('.board').html('').removeClass('red').off('click');
  $('.holder').html('').removeClass('selected').off('click');;
}

// Used by the Restart button. Actually Deletes entire board than reloads it.
function restart(){
  $('.possible').removeClass('possible');
  $('.selected').removeClass('selected');
  $('.hasPiece').removeClass('hasPiece');
  $('.possible').removeClass('possible');
  deleteBoard();
  beginBoard();
}

function captureTest(el,id,counter){
  var imgID = el.attr('id');
  if (imgID.includes('P')){
    var newCount = counter-1;
    if (Math.floor(counter/4) == Math.floor(newCount/4)){
      if (($('#'+newCount).hasClass('hasPiece'))){
        if (el.attr('id').includes('w') && $('#'+newCount).find('img').attr('id').includes('b')){
          $('#'+newCount).addClass('capture');
        }
        if (el.attr('id').includes('b') && $('#'+newCount).find('img').attr('id').includes('w')){
          $('#'+newCount).addClass('capture');
        }
      }
    }
    newCount+=2;
    if (Math.floor(counter/4) == Math.floor(newCount/4)){
      if (($('#'+newCount).hasClass('hasPiece'))){
        if (el.attr('id').includes('w') && $('#'+newCount).find('img').attr('id').includes('b')){
          $('#'+newCount).addClass('capture');
        }
        if (el.attr('id').includes('b') && $('#'+newCount).find('img').attr('id').includes('w')){
          $('#'+newCount).addClass('capture');
        }
      }
    }
  }
  else{
    if (($('#'+counter).hasClass('hasPiece'))){
      if (el.attr('id').includes('w') && $('#'+counter).find('img').attr('id').includes('b')){
        $('#'+counter).addClass('capture');
      }
      if (el.attr('id').includes('b') && $('#'+counter).find('img').attr('id').includes('w')){
        $('#'+counter).addClass('capture');
      }
    }
    else{
      $('#'+counter).addClass('possible');
    }
  }
}

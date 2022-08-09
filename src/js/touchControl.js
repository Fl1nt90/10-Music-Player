const playerContainer = document.querySelector('.player-container');

//swipe gestures
let touchstartX, touchendX;
const swipeOffset = 50; 
//double tap functionality
let lastClick = 0;
const doubleClickDelay = 200; // 200ms


//DETECT IF I AM ON MOBILE DEVICE------------------------------------------------------------------
// How To Detect Touch Screen Device Using Javascript https://www.learn-codes.net/javascript/how-to-detect-touch-screen-device-using-javascript/
export const checkMobile = function() {
    if (window.matchMedia("(pointer: coarse)").matches) {
        return true; 
    } else return false;
};



//TOUCH GESTURES---------------------------------------------------------------------------------
export const handleGesture = function() {
    if (touchendX + swipeOffset < touchstartX ) prevSong();
    if (touchendX > touchstartX + swipeOffset) nextSong();
    // if (touchendY < touchstartY) {
    //     console.log('Swiped Up');
    // }

    // if (touchendY > touchstartY) {
    //     console.log('Swiped Down');
    // }

    // if (touchendY === touchstartY) {
    //     console.log('Tap');
    // }
};


export const doubleTapControl = function (e) { 
    e.preventDefault(); // to disable browser default zoom on double tap
    let date = new Date();
    let time = date.getTime();
    if (time - lastClick < doubleClickDelay) playPause();
    lastClick = time;
};


//event handler
playerContainer.addEventListener('touchstart', function (e) {
    touchstartX = e.changedTouches[0].screenX;
    // touchstartY = e.changedTouches[0].screenY;
}, false);

playerContainer.addEventListener('touchend', function (e) {
    touchendX = e.changedTouches[0].screenX;
    // touchendY = e.changedTouches[0].screenY;
    handleGesture();
}, false);
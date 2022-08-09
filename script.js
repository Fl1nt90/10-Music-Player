import { songs } from "./songsList.js";
// import TouchEvent from "./touch.js";

const playerContainer = document.querySelector('.player-container');
const coverimage = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');

const track = document.querySelector('audio');
const btnContainer = document.querySelector('.player-controls'); //to use event delegation
const playBtn = document.getElementById('play')
const domProgressContainer = document.getElementById('progress-container');
const domProgressBar = document.getElementById('progress-bar');
const domDuration = document.getElementById('total-duration');
const domCurrentTime = document.getElementById('current-time');

const domVolumeBarContainer = document.querySelector('.volume-bar-container');
const domVolumeOverlay = document.getElementById('volume-bar-overlay');
const domVolumeBar = document.getElementById('volume-bar');
const volumeIcon = document.querySelector('.fa-volume-up');




let duration;
let isPlaying = false;
let currentSong = 0;

let isMuted = false;
let volume = 0.7; //initial volume

//set the volume at runtime (only possible with JS)
track.volume = volume;
domVolumeBar.style.height = `${(1-volume) * 100}%`;

//DETECT IF I AM ON MOBILE DEVICE------------------------------------------------------------------
// How To Detect Touch Screen Device Using Javascript https://www.learn-codes.net/javascript/how-to-detect-touch-screen-device-using-javascript/
let isMobile;

window.checkMobile = function() {
    if (window.matchMedia("(pointer: coarse)").matches) {
        return true; 
    } else return false;

    console.log(isMobile);

//     window.addEventListener('touchstart', function mouseMoveDetector() {
//         isMobile = true;
//         console.log(isMobile);
//         window.removeEventListener('touchstart', mouseMoveDetector);
// });

//   try{ document.createEvent("TouchEvent"); 
//     return true; }
//   catch(e){ 
//     return false; 
// }};
};
console.log();

//TRACK CONTROLS-----------------------------------------------------------------------------------
//Function to replace and display song data
window.songChanger = function(song) { //why window? https://stackoverflow.com/questions/53268248/js-modules-referenceerror-function-is-not-defined
    coverimage.src = `img/${song.name}.jpg`
    track.src = `music/${song.name}.mp3`;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
//logic to continue with current playback
    isPlaying = !isPlaying; 
    playPause();
};

window.playPause = function() {
    if (!isPlaying) { //if NOT playing
        track.play();
        playBtn.classList.replace('fa-play', 'fa-pause');
        playBtn.setAttribute('title', 'Pause'); //set the button title
        isPlaying = true;
    } else { 
        track.pause();
        playBtn.classList.replace('fa-pause', 'fa-play');
        playBtn.setAttribute('title', 'Play'); //set the button title
        isPlaying = false;
    };
};

window.prevSong = function() {
    currentSong = (currentSong <= 0) ? songs.length - 1 : currentSong - 1;
    songChanger(songs[currentSong]);
};

window.nextSong = function() {
    currentSong = (currentSong >= songs.length - 1) ? 0 : currentSong + 1;
    songChanger(songs[currentSong]);
};

//call function at runtime to display the first song
songChanger(songs[currentSong]); 



//PROGRESS CONTAINERS--------------------------------------------------------------------------
window.displayDuration = function() {
    const min = Math.floor(duration/60);
    let sec = Math.floor(duration%60) //get seconds using the reminder operator
    sec = (sec > 10) ? sec : `0${sec}` //logic to add a 0 in case of first 10 seconds
    domDuration.textContent = `${min}:${sec}`; 
};
window.progressUpdate = function(e) {
    //get and compute the current playback time
    const {currentTime} = e.srcElement;
    const min = Math.floor(currentTime/60);
    let sec = Math.floor(currentTime%60) //get seconds using the reminder operator
    sec = (sec > 10) ? sec : `0${sec}` //logic to add a 0 in case of first 10 seconds
    //display current time and update the progress bar
    domCurrentTime.textContent = `${min}:${sec}`; //logic to add a 0 in case of first 10 seconds
    domProgressBar.style.width = `${currentTime/duration * 100}%`;
};
window.setProgressBar = function(e) {
    const progressBarwidth = domProgressContainer.clientWidth; //get the progress bar width/get element value/get element property
    const offsetX = e.offsetX; //the point of the progress bar where i clicked
    console.log(progressBarwidth, offsetX);
    const selectedTime = (offsetX/progressBarwidth) * duration; //compute
    track.currentTime = selectedTime; //set the time on the track using "currentTime" property
    if (!isPlaying) playPause(); //automatic play when user select a point on the progress bar
}


//VOLUME------------------------------------------------------------------------------------------
window.setVolumeBar = function(e) {
    if (isMuted) toggleVolume(); //unmute wehn clicking on the volume bar (if is muted)
    domVolumeBar.style.transition = 'height 0.1s linear'; //restore in case was removed

    const volumeBarHeight = e.srcElement.clientHeight; //get the volume bar height
    const offsetY = e.offsetY; //the point of the volume bar where i clicked
    volume = 1-1/(volumeBarHeight/offsetY); //compute
    if (volume > 0.97) { //TEMPORARY
        domVolumeBar.style.transition = 'none';
        volume = 1;
    };
    if (volume < 0.02) { //TEMPORARY
        domVolumeBar.style.transition = 'none';
        volume = 0;
        toggleVolume(); 
    };
    track.volume = volume; //set the volume on the track

    //visual response
    domVolumeBar.style.height = `${(1-volume) * 100}%`;
};

window.toggleVolume = function() {
    volumeIcon.classList.toggle('fa-volume-up'); //change the icon
    volumeIcon.classList.toggle('fa-volume-mute');
    isMuted = !isMuted;
    track.muted = isMuted;

    if (isMuted) {
        domVolumeBar.style.height = `100%`; //100% means clear the volume bar
        domVolumeBar.style.borderRadius = '5px';
    }
    if (!isMuted) {
        domVolumeBar.style.height = `${(1-volume) * 100}%`; //restore volume bar level
        domVolumeBar.style.borderRadius = null; //remove property/remove css property
    }
};





//EVENT LISTENERS -------------------------------------------------------------------
btnContainer.addEventListener('click', function(e){
    if (e.target.id === 'prev') prevSong();
    if (e.target.id === 'play') playPause();
    if (e.target.id === 'next') nextSong();
});

//keboard event listener/arrow keys event listener i have to use "keydown"
document.addEventListener('keydown', function(e){
    if (e.key === 'ArrowLeft') prevSong();
    if (e.key === ' ' || e.key === 'Enter' ) playPause();
    if (e.key === 'ArrowRight') nextSong();
});

//get the total track duration and display it; NOTE: used this logic to compute total duration just once
track.addEventListener('loadeddata', function(){
    duration = track.duration;
    displayDuration();
});
//skip to next song when playbask has ended
track.addEventListener('ended', nextSong);
//to get the current playback time
track.addEventListener('timeupdate', progressUpdate);
//click on the progress bar
domProgressContainer.addEventListener('click', function(e) {
    if (e.target.id === 'duration-wrapper') return; //allow click only on the progress bar
    setProgressBar(e);
});


//volume bar event handler
domVolumeOverlay.addEventListener('click', function(e) {
    setVolumeBar(e);
});
//mute/unmute clicking on the volume icon
volumeIcon.addEventListener('click', function() {
    // checkMobile(); //check if i am on a touch device;
    if(!checkMobile()) toggleVolume(); //only if we are not on mobile devices
    if(checkMobile()) { //ON MOBILE, i want a different click behaviour on volume icon 
        if(domVolumeBarContainer.style.visibility === 'visible') toggleVolume(); //mute only if the bar is already open
        domVolumeBarContainer.style.visibility = 'visible'; //else, if is the first click, open the volume bar
    };
});

// show/hide volume bar on mouse over
//only add this if we are not on mobile devices
volumeIcon.addEventListener('mouseover', function () {
    if (!checkMobile()) domVolumeBarContainer.style.visibility = 'visible';
});
domVolumeOverlay.addEventListener('mouseout', function() {
    if (!checkMobile()) domVolumeBarContainer.style.visibility = 'hidden';
})


window.addEventListener('click', function(e) { //to close volume bar clicking elsewhere
    if (e.target.classList.contains(`fa-volume`) || e.target.classList.contains(`volume-bar-overlay`)) return;
    domVolumeBarContainer.style.visibility = 'hidden'
;
});






let touchstartX, touchendX;
const swipeTol = 50;

playerContainer.addEventListener('touchstart', function (event) {
    touchstartX = event.changedTouches[0].screenX;
    // touchstartY = event.changedTouches[0].screenY;
}, false);

playerContainer.addEventListener('touchend', function (event) {
    touchendX = event.changedTouches[0].screenX;
    // touchendY = event.changedTouches[0].screenY;
    handleGesture();
}, false);


function handleGesture() {
    if (touchendX + swipeTol < touchstartX ) prevSong();
    if (touchendX > touchstartX + swipeTol) nextSong();

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
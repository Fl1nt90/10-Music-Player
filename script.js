import { songs } from "./songsList.js";

const track = document.querySelector('audio');
const btnContainer = document.querySelector('.player-controls'); //to use event delegation
const playBtn = document.getElementById('play')
const domProgressContainer = document.getElementById('progress-container');
const domProgressBar = document.getElementById('progress-bar');
const domDuration = document.getElementById('total-duration');
const domCurrentTime = document.getElementById('current-time');

const domVolumeBarContainer = document.getElementById('volume-bar-container');
const domVolumeOverlay = document.getElementById('volume-overlay');
const domVolumeBar = document.getElementById('volume-bar');
const volumeIcon = document.querySelector('.fa-volume-up');

const coverimage = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');


let duration;
let isPlaying = false;
let currentSong = 0;

let isMuted = false;
let volume = 0.7; //initial volume

//set the volume at runtime (only possible with JS)
track.volume = volume;
domVolumeBar.style.height = `${(1-volume) * 100}%`;

//MOBILEEEEEEEEEEEEEEEEEEEEE
let isMobile = (function() {
  try{ document.createEvent("TouchEvent"); return true; }
  catch(e){ return false; }
})();


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
    const volumeBarHeight = e.srcElement.clientHeight; //get the volume bar height
    const offsetY = e.offsetY; //the point of the volume bar where i clicked
    volume = 1-1/(volumeBarHeight/offsetY); //compute
    if (volume > 1) volume = 1;
    // if (volume === 0) toggleVolume();
    track.volume = volume; //set the volume on the track
    //visual response
    domVolumeBar.style.height = `${(1-volume) * 100}%`;
};

window.toggleVolume = function(e) {
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
    if (isMuted) toggleVolume(); //unmute wehn clicking on the volume bar (if is muted)
});
//mute/unmute clicking on the volume icon
volumeIcon.addEventListener('click', function() {
    if(!isMobile) toggleVolume();
    if(isMobile) {
        if(!domVolumeBarContainer.hidden) toggleVolume()
        domVolumeBarContainer.hidden = false;
    };
});

// show/hide volume bar on mouse over
if (!isMobile) { //only add this if we are not on mobile devices
volumeIcon.addEventListener('mouseover', function () {
    domVolumeBarContainer.hidden = false;
});
domVolumeOverlay.addEventListener('mouseout', function() {
    domVolumeBarContainer.hidden = true;
})
};

window.addEventListener('click', function(e) { //to close volume bar clicking elsewhere
    if (e.target.classList.contains(`fa-volume`) || e.target.classList.contains(`volume-overlay`)) return;
    domVolumeBarContainer.hidden = true;
})

import { songs } from "./songsList.js";

const track = document.querySelector('audio');
const btnContainer = document.querySelector('.player-controls'); //to use event delegation
const playBtn = document.getElementById('play')
const domProgressContainer = document.getElementById('progress-container');
const domProgressBar = document.getElementById('progress-bar');
const domDuration = document.getElementById('total-duration');
const domCurrentTime = document.getElementById('current-time');

const coverimage = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');

let duration;
let isPlaying = false;
let currentSong = 0;


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
    const progressBarwidth = e.srcElement.clientWidth; //get the progress bar width
    const offsetX = e.offsetX; //the point of the progress bar where i clicked
    const selectedTime = (offsetX/progressBarwidth) * duration; //compute
    track.currentTime = selectedTime; //set the time on the track using "currentTime" property
    if (!isPlaying) playPause(); //automatic play when user select a point on the progress bar
}



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
})



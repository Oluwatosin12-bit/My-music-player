         /* =========== BUTTONS ========== */
const play = document.querySelector(".play"),
 previous = document.querySelector(".previous"),
 next = document.querySelector(".next"),


         /* =========== SONG DETAILS ========== */
  trackImage = document.querySelector(".track-image"),   
  title = document.querySelector(".title"),  
  artiste = document.querySelector(".artiste"), 

         /* =========== SLIDER ========== */  
  trackCurrentTime = document.querySelector(".current-time "),
  trackDuration = document.querySelector(".duration-time"),           
  slider = document.querySelector(".duration-slider"), 
  
           /* =========== VOLUME ========== */
  showVolume = document.querySelector("#show-volume"), 
  volumeIcon = document.querySelector("#volume-icon"),          
  currentVolume = document.querySelector("#volume"),

          /* =========== PLAY ALL ========== */
  autoPlayBtn = document.querySelector(".play-all"),           
  
          /* =========== FA-ICONS ========== */
  hamBurger = document.querySelector(".fa-bars"), 
  closeIcon = document.querySelector(".fa-times"),
  
          /* =========== PLAYLIST WHOLE AND ITS ITEM ========== */  
  musicPlaylist  = document.querySelector(".music-playlist"),
  playlistDiv  = document.querySelector(".playlist-div"),
  playList = document.querySelector(".playlist");  


 let timer;
 let autoplay = 0; 
 let indexTrack = 0; //track playing per time- current Track playing
 let songIsPlaying = false; // checks if a song is playing
 let track = document.createElement('audio');


 //ALL EVENT LISTENERS
 play.addEventListener('click', justPlay); //justPlay has been defined so when you click, it does the opposite of its current state (play or pause)
 previous.addEventListener('click', prevSong);
 next.addEventListener('click', nextSong);
 autoPlayBtn.addEventListener('click', autoPlayToggle);
 volumeIcon.addEventListener('click', muteSound);
 currentVolume.addEventListener('click', changeVolume);
 slider.addEventListener('change', changeDuration);
 track.addEventListener('timeupdate', songTimeUpdate);
 hamBurger.addEventListener('click', showPlaylist);
 closeIcon.addEventListener('click', hidePlaylist);


 //Load songs (the words 'track' and 'songs' are interchangeable)
 function loadTrack(indexTrack) {
        clearInterval(timer); //clear any existing song duration when this starts
        resetSlider(); //to make a new song automatically start from zero

    track.src = trackList [indexTrack].path;  //trackList is an array from musiclibrary.js; indexTrack.path means - path of current track playing
    trackImage.src = trackList [indexTrack].img; 
    title.innerHTML = trackList [indexTrack].name; 
    artiste.innerHTML = trackList [indexTrack].artiste; 
    track.load(); //method to load track

    timer = setInterval(updateSlider, 1000); //update song duration timer every one second; updateSider is a function
 }
 loadTrack(indexTrack); //because we called this function, it starts to work by default when we load the page. Loads the first song

 //Play song
 function playSong() {
        track.play(); //play "method" not "function"
        songIsPlaying = true;
        play.innerHTML = '<i class="fas fa-pause"></i>';   //icon to change to pause sign when we start playing the song
 }

 //Pause song
 function pauseSong() {
        track.pause();
        songIsPlaying = false;
        play.innerHTML = '<i class="fas fa-play"></i>';   //icon to chnage to pause sign when we start playing the song
 }

 // function for whether to play or pause a song
 function justPlay() { //this function is called in the event listeners (play icon)
        if (songIsPlaying == false) {
           playSong(); //play song if song is not playing
        } else {
           pauseSong();
        }
 }

 //Next song 
 function nextSong() {
        if (indexTrack < trackList.length - 1) { //if index is less than the number of songs - 1(last index number) - aka if it's not the last song
                indexTrack++;
                loadTrack(indexTrack);
                playSong();
        } else { //if it is the last song, take it to index 0 - first song
                indexTrack = 0;
                loadTrack(indexTrack);
                playSong();
        } //all indexes from 0 to the end should be added by one when next button is clicked. When it's the las song on the tracklist, it should go back to the first song (index 0)
}       

//Prev song 
function prevSong() {
        if (indexTrack > 0) {
                indexTrack++;
                loadTrack(indexTrack);
                playSong();
        } else {
                indexTrack = trackList.length - 1; //last position of the album; if there are 6 songs, the last song will have index 5 (0, 1, 2, 3, 4, 5)
                loadTrack(indexTrack);
                playSong();
        } /*basically saying if a song is index 0 and you want to go to previous song then subtract 1 from the index to give it (-1) and play; 
        -1 is counting from the back of an index.
        If a song is not index position 0 then just go to the index before it and play
        loadTrack is basically just getting the details for the song you are "previousing*/
}


//Auto Play
function autoPlayToggle(){
        if (autoplay == 0){ //it is 0 by default, but when we click the button it becomes 1
                autoplay = 1;
                autoPlayBtn.style.background = "#FF1493"
        } else {
                autoplay = 0;
                autoPlayBtn.style.background = "#FFF"
        }
} 

//Mute Sound
function muteSound(){
        track.volume = 0;
        showVolume.innerHTML = 0;
        currentVolume.value = 0; 
}
 
//Change Volume
function changeVolume(){
        showVolume.value = currentVolume.value; //volume number
        track.volume = currentVolume.value / 100; //because 100 is the Max length we indicated in our HTML
} 

//Change Song Duration
function changeDuration(){
     let sliderPosition = track.duration * (slider.value/100);
     track.currentTime = sliderPosition //currentTime is a method available to audio object; remember that "track" is a created audio element
}

//Reset Slider
function resetSlider(){
        slider.value = 0;
}

//Update slider as song plays
function updateSlider(){
        let position = 0; //slider position

        if(!isNaN(track.duration)){
                position = track.currentTime * (100 / track.duration);
                slider.value = position; //slider position to move everytime
        }  //function being called every second

        if (track.ended) {
                play.innerHTML = '<i class="fas fa-play"></i>'; 
                if (autoplay == 1 && indexTrack < trackList.length - 1) { //if autoplay is clicked (like on), perform these functions
                        indexTrack++;
                        loadTrack(indexTrack);
                        playSong(); //if autoplay is on, and the track is not on the last track then move to the next track
                } else if (autoplay == 1 && indexTrack == trackList.length - 1){
                        indexTrack = 0; 
                        loadTrack(indexTrack);
                        playSong();
                } //if autoplay is on and we are on the last track of the playlist, take it back to the first track in the playlist
        } 
}

//Update Current song time
function songTimeUpdate()   {
        if (track.duration){
        let currentmins = Math.floor(track.currentTime / 60); //divided by 60 to get the seconds
        let currentsecs = Math.floor(track.currentTime - currentmins * 60);
        let durationmins = Math.floor(track.duration / 60); //song duration
        let durationsecs = Math.floor(track.duration - durationmins * 60);

        //for when the time is a single digit, we want to add a zero
        if(durationsecs < 10){
                durationsecs = "0" + durationsecs;
        }

        if(durationmins < 10){
                durationmins = "0" + durationmins;
        }

        if(currentsecs < 10){
                currentsecs = "0" + currentsecs;
        }

        if(currentmins < 10){
                currentmins = "0" + currentmins;
        }
        trackCurrentTime.innerHTML = currentmins + ":" + currentsecs;
        trackDuration.innerHTML = durationmins + ":" + durationsecs;
 
        } else {
                trackCurrentTime.innerHTML = "00" + ":" + "00";
                trackDuration.innerHTML = "00" + ":" + "00";        
        }
}

//Show Playlist
function showPlaylist(){
        musicPlaylist.style.transform = "translateX(0)";
}
//Hide Playlist
function hidePlaylist(){
        musicPlaylist.style.transform = "translateX(-100%)";
}

//Display tracks in playlist
let counter = 1;
function displayTracks(){
        for (let i = 0; i < trackList.length; i++){
                console.log(trackList[i].name) //[i] is index number  //we want to log the name of the track to the console
                let div = document.createElement("div");
                div.classList.add("playlist"); //adding a class to our new div
                div.innerHTML = `
                        <span class="song-index">${counter++}. </span>
                        <p class="single-song">${trackList[i].name}</p>
                `;
                playlistDiv.appendChild(div);    
        }
        playFromPlaylist();
}
displayTracks();

//Play song from the playlist
function playFromPlaylist(){
        playlistDiv.addEventListener("click", (e) => { //e means event
              if(e.target.classList.contains("single-song")) { //single-song is a classname that each song has
                // alert(e.target.innerHTML);// FOR TESTING THAT THE CLICK WORKS
                 const indexNum = trackList.findIndex((item, index) =>{  //also helps us get the index of songs in the playlist array //item is every detail about a track
                        if(item.name === e.target.innerHTML) {
                                return true;
                        }
                 });
                 loadTrack(indexNum); //loads the song being clicked
                 playSong();
                 hidePlaylist();
              }  
        });
}
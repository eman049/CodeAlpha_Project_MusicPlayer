document.addEventListener('DOMContentLoaded', () => {
    const playPauseBtn = document.querySelector('.play-pause');
    const playPauseIcon = document.querySelector('#play-pause');
    const nextBtn = document.querySelector('#next');
    const prevBtn = document.querySelector('#prev');
    const repeatBtn = document.querySelector('#repeat-plist');
    const moreMusicBtn = document.querySelector('#more-music');
    const closeMusicBtn = document.querySelector('#close-playlist');
    const musicList = document.querySelector('.music-list');
    const playlist = document.querySelectorAll('#playlist li');
    const speedControl = document.querySelector('#speed');
    const audio = new Audio();
    let currentSongIndex = 0;
    let isPlaying = false;
    let isLooping = false;

    function loadSong(index) {
        const song = playlist[index];
        audio.src = song.getAttribute('data-src');
        document.querySelector('.name').textContent = song.querySelector('span').textContent;
        document.querySelector('.artist').textContent = song.querySelector('p').textContent;
        document.querySelector('.img-area img').src = song.getAttribute('data-img');
        // Update background image alsong the song chnge
        document.querySelector('.background-image').style.backgroundImage = `url('${song.getAttribute('data-img')}')`;
    }
    //function for song controls 
    function playSong() {
        audio.play();
        playPauseIcon.innerHTML = 'pause';
        isPlaying = true;
    }

    function pauseSong() {
        audio.pause();
        playPauseIcon.innerHTML = 'play_arrow';
        isPlaying = false;
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        playSong();
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        playSong();
    }

    function toggleLoop() {
        isLooping = !isLooping;
        audio.loop = isLooping;
        repeatBtn.classList.toggle('active', isLooping);
    }

    function updateProgressBar() {
        const { currentTime, duration } = audio;
        const progress = (currentTime / duration) * 100;
        document.querySelector('.progress-bar').style.width = `${progress}%`;
        document.querySelector('.current').textContent = formatTime(currentTime);
        document.querySelector('.duration').textContent = formatTime(duration);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function seek(event) {
        const progressWidth = document.querySelector('.progress-area').clientWidth;
        const offsetX = event.offsetX;
        const duration = audio.duration;
        audio.currentTime = (offsetX / progressWidth) * duration;
    }

    function toggleMusicList() {
        musicList.classList.toggle('open');
    }

    function closeMusicList() {
        musicList.classList.remove('open');
    }

    function changeSpeed() {
        audio.playbackRate = speedControl.value;
    }

    // Event listeners controls 
    playPauseBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });

    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    repeatBtn.addEventListener('click', toggleLoop);
    moreMusicBtn.addEventListener('click', toggleMusicList);
    closeMusicBtn.addEventListener('click', closeMusicList);
    speedControl.addEventListener('change', changeSpeed);

    document.querySelector('.progress-area').addEventListener('click', seek);
    audio.addEventListener('timeupdate', updateProgressBar);
    
    audio.addEventListener('ended', nextSong); // Play next song when the current one ends
    //play list event handler
    playlist.forEach((song, index) => {
        song.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
            musicList.classList.remove('open');
        });
    });

    // Load the first song
    loadSong(currentSongIndex);
    //  for setting the initial playback speed
    audio.playbackRate = speedControl.value;
});

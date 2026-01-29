console.log("Let's write some JavaScript");
let currentSong = new Audio();
let songs;
let play = document.querySelector("#play");

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    try {
        let a = await fetch("http://localhost:8000/songs/");
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let songs = [];
        let as = div.getElementsByTagName("a");
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(decodeURIComponent(element.href));
            }
        }
        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}

const playMusic = (track) => {
    const encodedTrack = encodeURIComponent(track);
    currentSong.src = `/songs/${encodedTrack}`;
    
    
    /*if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"*/
    currentSong.load();
    currentSong.play()
        .then(() => {
            play.src = "pause.svg";
        })
        document.querySelector(".songinfo").innerHTML = decodeURIComponent(track);
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
        /*.catch((error) => {
            console.error("Error playing the song:", error);
            alert("Unable to play the song. Please check if the file exists and is in a supported format.");
        });*/
}

async function main() {
    songs = await getSongs();
    /*playMusic(songs[0], true)*/
    if (songs.length > 0) {
        const firstSong = songs[0].split('/').pop();
        playMusic(firstSong);
    }

    let songUL = document.querySelector(".songlist ul");
    if (songUL) {
        songUL.innerHTML = "";
        for (const song of songs) {
            let parts = song.split('/');
            let fileNameWithExtension = parts[parts.length - 1];
            let fileName = fileNameWithExtension.split('.')[0];
            let songTitle = fileName.split(' - ')[0].trim();

            songUL.innerHTML += `<li><img class="invert" src="music.svg" alt="">
                        <div class="info">
                          <div>${songTitle}</div>
                          <div>Artist</div>
                        </div> 
                        <div class="playnow">
                          <span>Play now</span>
                          <img class="invert" src="play.svg" alt="">
                        </div>
            </li>`;
        }
    }

    document.querySelectorAll(".songlist li").forEach(e => {
        e.addEventListener("click", () => {
            const songTitle = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playMusic(songTitle + ".mp3");
        });
    });

        play.addEventListener("click", () => {
            if (currentSong.paused) {
                currentSong.play()
                    .then(() => {
                        play.src = "pause.svg";
                    })
                    .catch((error) => {
                        console.error("Error playing the song:", error);
                    });
            } else {
                currentSong.pause();
                play.src = "play.svg";
            }
        });


    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
}

main();
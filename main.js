const container = document.querySelector(".container");
const mainVideo = container.querySelector("video");
const videoTimeline = container.querySelector(".video-timeline");

const playPauseBtn = container.querySelector(".play-pause i");
const skipBackward = container.querySelector(".skip-backward i");
const skipForward = container.querySelector(".skip-forward i");

const volumeBtn = container.querySelector(".volume i");
const volumeSlider = container.querySelector(".left input");
const currentVidTime = container.querySelector(".left .current-time");
const videoDuration = container.querySelector(".left .video-duration");

const speedBtn = container.querySelector(".playback-speed i");
const speedOptions = container.querySelector(".speed-options");

const picInPicBtn = container.querySelector(".pic-in-pic");
const fullscreenBtn = container.querySelector(".fullscreen i");

const progressBar = container.querySelector(".progress-bar");

// play and pause btn add events
playPauseBtn.addEventListener("click",()=>{
	// if video is paused, play ! is played, paused!
	mainVideo.paused ? mainVideo.play() : mainVideo.pause(); 
	
});

function formatTime(time){
	let sec = Math.floor(time%60);
	let minutes = Math.floor(time/60)%60;
	let hours = Math.floor(time/3600);
	
	sec = sec < 10 ? `0${sec}`:sec;
	minutes = minutes < 10 ? `0${minutes}`:minutes;
	hours = hours < 10 ? `0${hours}`:hours;
	if(hours==0){
		return `${minutes}:${sec}`;
	}
	return `${hours}:${minutes}:${sec}`;
}

mainVideo.addEventListener("timeupdate",(e)=>{
	let {currentTime,duration} = e.target; 			// 현재 플레이 시간, 총 경과 시간
	let percent = (currentTime/duration) * 100; // play percent 구하기
	progressBar.style.width = `${percent}%`			// progressbar 움직이게 만들기 
	currentVidTime.innerText = formatTime(currentTime);
})

mainVideo.addEventListener("loadeddata",e => {
	videoDuration.innerText = formatTime(e.target.duration);
});

videoTimeline.addEventListener("click",e=>{
	let timelineWidth = videoTimeline.clientWidth;
	mainVideo.currentTime = (e.offsetX/timelineWidth)*mainVideo.duration
});

// drag event 
function draggableProgressBar(e){
	let timelineWidth = videoTimeline.clientWidth;
	progressBar.style.width = `${e.offsetX}px`;
	mainVideo.currentTime = (e.offsetX/timelineWidth)*mainVideo.duration
	currentVidTime.innerText = formatTime(mainVideo.currentTime);
}

videoTimeline.addEventListener("mousedown",()=>{
	videoTimeline.addEventListener("mousemove",draggableProgressBar);
});

container.addEventListener("mouseup",()=>{
	videoTimeline.removeEventListener("mousemove",draggableProgressBar);
});

videoTimeline.addEventListener("mousemove",e=>{
	const progressTime = videoTimeline.querySelector("span");
	let mouseX = e.offsetX;
	progressTime.style.left = `${mouseX}px`;
	let timelineWidth = videoTimeline.clientWidth;
	let percent = (e.offsetX/timelineWidth) * mainVideo.duration;
	progressTime.innerText = formatTime(percent);
});

// change volume 
volumeBtn.addEventListener("click",()=>{
	if(!volumeBtn.classList.contains("fa-volume-high")){
		mainVideo.volume=0.5;
		volumeBtn.classList.replace("fa-volume-xmark","fa-volume-high");
	} else {
		mainVideo.volume=0.0;
		volumeBtn.classList.replace("fa-volume-high","fa-volume-xmark");
	}
})

volumeSlider.addEventListener("input", e =>{
	mainVideo.volume = e.target.value;
	if(e.target.value == 0){ // mute volume
		volumeBtn.classList.replace("fa-volume-high","fa-volume-xmark");
	} else {
		volumeBtn.classList.replace("fa-volume-xmark","fa-volume-high");
	}
	volumeSlider.value = mainVideo.volume;

});
// show speed options 1x 1.5x ...
speedBtn.addEventListener("click",()=>{
	speedOptions.classList.toggle("show");
});
speedOptions.querySelectorAll("li").forEach(option=>{	// speed option  선택!  
	option.addEventListener("click",()=>{
		mainVideo.playbackRate = option.dataset.speed;
		speedOptions.querySelector(".active").classList.remove("active"); // 전에 있던 active class 제거
		option.classList.add("active");
	});
});

document.addEventListener("click",e=>{ // hide speed options when document click
	if(e.target.tagName!=="I" || e.target.className!=="fa-solid fa-gear"){
		speedOptions.classList.remove("show");
	}
});

// change picture in picture mode 
picInPicBtn.addEventListener("click",()=>{
	mainVideo.requestPictureInPicture();
})

fullscreenBtn.addEventListener("click",()=>{
	container.classList.toggle("fullscreen");
	if(document.fullscreenElement){
		fullscreenBtn.classList.replace("fa-expand","fa-compress");
		return document.exitFullscreen();
	}
	fullscreenBtn.classList.replace("fa-compress","fa-expand");
	container.requestFullscreen();
})

// 뒤로가기 
skipBackward.addEventListener("click",()=>{
	mainVideo.currentTime -= 5;	// -5sec
});
// 앞으로 가기 
skipForward.addEventListener("click",()=>{
	mainVideo.currentTime += 5;	// + 5sec
});

// play and pause 
mainVideo.addEventListener("play",()=>{
	playPauseBtn.classList.replace("fa-play","fa-pause");
});

mainVideo.addEventListener("pause",()=>{
	playPauseBtn.classList.replace("fa-pause","fa-play");
});
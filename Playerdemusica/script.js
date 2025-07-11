const nomedamusica = document.getElementById ('nomedamusica');
const nomedabanda = document.getElementById ('nomedabanda')
const audio = document.getElementById ('audio');
const img = document.getElementById ('img')
const play = document.getElementById ('play');
const pular = document.getElementById ('pular');
const voltar = document.getElementById ('voltar');
const like = document.getElementById ('like');
const embaralhar = document.getElementById ('embaralhar');
const progresso = document.getElementById ('progresso');
const progresscontainer = document.getElementById ('progresscontainer');
const repetir = document.getElementById ('repetir');
const songtime = document.getElementById ('songtime')
const totaltime = document.getElementById ('totaltime')

const meianoite = {
    nomedamusica : 'Meia noite',
    artista : 'Fhop',
    arquivo : 'meianoite', 
    liked: false,
}

const cristo = {
    nomedamusica : 'Cristo',
    artista : 'Alessandro Vilas Boas',
    arquivo : 'cristo',
    liked: false,
}

const naohaoutro = {
    nomedamusica : 'Não Há Outro',
    artista : 'Erick e Evillin',
    arquivo : 'naohaoutro',
    liked: false,
}

let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalplaylist = JSON.parse(localStorage.getItem('playlist')) ?? [[meianoite, cristo, naohaoutro]];
let sortedplaylist = [...originalplaylist];
let index = 0;


function playsong(){
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    audio.play();
    isPlaying = true;
}

function pausesong(){
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    audio.pause();
    isPlaying = false;
}

function playPauseDecider(){
    if(isPlaying === true){
        pausesong();
    }
    else{
        playsong();
    }
}

function initializeSong(){
    img.src = `/Playerdemusica/img/${sortedplaylist[index].arquivo}.jpg`;
    audio.src = `/Playerdemusica/songs/${sortedplaylist[index].arquivo}.mp3`;
    nomedamusica.innerText = sortedplaylist[index].nomedamusica;
    nomedabanda.innerText = sortedplaylist[index].artista;
    botaodelike();
}

function voltarmusica(){
    if(index === 0){
    index = sortedplaylist.length - 1;
    }
    else {
        index -= 1;
    }
    initializeSong();
    playsong();
}

function pularmusica(){
    if(index === sortedplaylist.length - 1){
    index = 0;
    }
    else {
        index += 1;
    }
    initializeSong();
    playsong();
}

function embaralharArray(preembaralharArray){
    let size = sortedplaylist.length;
    let currentIndex = size - 1;
    while(currentIndex > 0 ){
       let randomIndex = Math.floor(Math.random()* size);
       let aux = preembaralharArray[currentIndex];
       preembaralharArray[currentIndex] = preembaralharArray[randomIndex];
       preembaralharArray[randomIndex] = aux;
       currentIndex -= 1;
    }
}

function botaoembaralhar(){
    if(isShuffled === false){
        isShuffled = true;
     embaralharArray(sortedplaylist);
     embaralhar.classList.add('botao-ativo');
     }
     else{
         isShuffled = false;
     sortedplaylist = [...originalplaylist];
     embaralhar.classList.remove('botao-ativo');
     }
}

function botaodelike(){
    if (sortedplaylist[index].liked === true){
        like.querySelector('.bi').classList.remove('bi-heart');
        like.querySelector('.bi').classList.add('bi-heart-fill');
        like.classList.add('botao-ativo');
    }
    else {
        like.querySelector('.bi').classList.add('bi-heart');
        like.querySelector('.bi').classList.remove('bi-heart-fill');
        like.classList.remove('botao-ativo');
    }
}

function updateProgress(){
    const barWidth = (audio.currentTime/audio.duration)*100;
    progresso.style.setProperty('--progress', `${barWidth}%`);
    songtime.innerText = toHHMMSS(audio.currentTime);
}

function jumpto(event){
    const width = progresscontainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width)* audio.duration;
    audio.currentTime = jumpToTime;
}

function repetirmusica(){
    repeatOn = !repeatOn;
    if (repeatOn) {
        repetir.classList.add('botao-ativo');
    } else {
        repetir.classList.remove('botao-ativo');
    }
}

function proximaourepetir(){
    if(repeatOn === false){
        pularmusica();
    
    }
    else{
        playsong();
    }
}

function toHHMMSS(originalnumber){
    let hours = Math.floor(originalnumber/3600);
    let min = Math.floor((originalnumber - hours * 3600)/60);
    let secs = Math.floor(originalnumber - hours * 3600 - min * 60);

    return `${hours.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}



function updatetotaltime(){
    totaltime.innerText = toHHMMSS(audio.duration);

}

function botaodelikeativo(){
 if (sortedplaylist[index].liked === false){
    sortedplaylist[index].liked = true;
 }else{
    sortedplaylist[index].liked = false;
 }
 botaodelike();
 localStorage.setItem('playlist', 
    JSON.stringify(originalplaylist)
 );

}

initializeSong();

play.addEventListener('click', playPauseDecider);
voltar.addEventListener('click', voltarmusica );
pular.addEventListener('click', pularmusica);
like.addEventListener('click', botaodelikeativo);
embaralhar.addEventListener ('click', botaoembaralhar);
audio.addEventListener('timeupdate',updateProgress);
audio.addEventListener('ended',proximaourepetir);
audio.addEventListener('loadedmetadata',updatetotaltime);
progresscontainer.addEventListener('click', jumpto);
repetir.addEventListener('click', repetirmusica);
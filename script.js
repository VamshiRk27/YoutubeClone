const apiKey="AIzaSyA8b8ISPVaqcYfSnnuOPgqLle8_a_ifBYA";
const baseUrl="https://www.googleapis.com/youtube/v3/";

const searchButton=document.getElementById("search-button");
const searchInput=document.getElementById("search-input");
const container=document.getElementById("container");

searchButton.addEventListener("click",()=>{
    const searchValue=searchInput.value;
    fetchVideos(searchValue);
})






function calculateTimeGap(publishTime){
    let publishDate=new Date(publishTime);
    let currentDate=new Date();

    let secondsGap=(currentDate.getTime()-publishDate.getTime())/1000;
    const secondsPerDay=24*60*60;
    const secondsPerWeek=7*secondsPerDay;
    const secondsPerMonth=30*secondsPerDay;
    const secondsPerYear=30*secondsPerDay;

    if(secondsGap<secondsPerDay){
        return `${Math.ceil(secondsGap/3600)}hrs ago`;
    }
    if(secondsGap<7*secondsPerDay){
        return `${Math.ceil(secondsGap/secondsPerWeek)}weeks ago`;
    }
    if(secondsGap<secondsPerMonth){
        return `${Math.ceil(secondsGap/secondsPerMonth)}months ago`;
    }
    return `${Math.ceil(secondsGap/secondsPerYear)}years ago`;
}

function renderUI(list){
    container.innerHTML="";
    list.forEach((item) => {
        const videoContainer=document.createElement("div");
        videoContainer.className="video";
        videoContainer.innerHTML=`
        <img class="thumbnail" src="${item.snippet.thumbnails.high.url}" alt="thumbnail">
            <div class="bottom-container">
                <div class="logo-container">
                    <img class="logo" src="${item.snippet.thumbnails.default.url}" alt="Channel Logo">
                </div>
                <div class="title-container">
                    <p class="title">${item.snippet.title}
                    <p class="gray-text">${item.snippet.channelTitle}</p>
                    <p class="gray-text">${item.statistics.viewCount} ${calculateTimeGap(item.snippet.publishTime)}</p>
                </div>
            </div>`;
            videoContainer.addEventListener("click",()=>{
                navigateToVideoDetails(item.id.videoId);
            });
            container.appendChild(videoContainer);
    });
}

async function getVideoStatistics(videoId){
    const endPoint=`${baseUrl}videos?key=${apiKey}&part=statistics&id=${videoId}`;
    try{
        const response=await fetch(endPoint);
        const result=await response.json();
        return result.items[0].statistics;
    }
    catch(error){
        alert("Failed to load data");
    }
}

async function fetchChannelLogo(channelId){
    const endPoint=`${baseUrl}channels?key=${apiKey}&id=${channelId}&part=snippet&maxResults=5`;
    try{
        const response=await fetch(endPoint);
        const result=await response.json();
        return result.items[0].snippet.thumbnails.high.url;
    }
    catch(error){
        alert(`Failed to load Channel`);
    }
}

async function fetchVideos(searchQuery) //async is used for network calls
{
    const url=`${baseUrl}search?key=${apiKey}&q=${searchQuery}&part=snippet&maxResults=5`;
    try{
        const response=await fetch(url);
        const result=await response.json();// receives all data in json format
        // console.log(result);

        for(let i=0;i<result.items.length;i++){
            let currentVideoId=result.items[i].id.videoId;
            let channelId=result.items[i].snippet.channelId;
            let videoStatistics=await getVideoStatistics(currentVideoId);
            let channelLogo=await fetchChannelLogo(channelId);
            result.items[i].statistics=videoStatistics;
            result.items[i].channelLogo=channelLogo;
        }

        renderUI(result.items);
    }
    catch(error){
        alert(error);
    }
    
}

async function loadComments(){
    let videoId="_OP1tS88kbg";
    const endPoint=`${baseUrl}commentThreads?key=${apiKey}&videoId=${videoId}&maxResults=3&part=snippet`;
    const response=await fetch(endPoint);
    const result=await response.json();
    result.items.forEach((item)=>{
        const repliesCount=item.snippet.totalReplyCount;
        const{
            authorDisplayName,
            textDisplay,
            likeCount,
            authorProfileImageUrl:profileUrl,
            publishedAt,
        }=item.snippet.topLevelComment.snippet;
        console.log(authorDisplayName);
    });
}
function navigateToVideoDetails(videoId){
    document.cookie=`${videoId}`;path=/youtube/
}
if(YT){
    new YT.Player("video-placeHolder",{
        height:"300",
        width:"500",
        videoId:"_OP1tS88kbg",
    });
}








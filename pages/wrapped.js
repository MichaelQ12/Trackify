


const APIControl= (function(){          //iife, functions made available via closure , pre es6 module pattern emulates classes via iifes and closures 
                                                            //classes in js dont acutally have encapsulation???? encapsulate via closures??

    const myclientID="55eb0d1bcb4a4b41b7cf5981b9cfe79b";
    const myclientSecret="40fab7fee78f46ddb797213a06f7531d";
    const redirect_uri="http://localhost:8000/pages/callback.html";

    
   
    async function getRefreshedToken(accessToken){
        
        alert ("get refreshtoken dab");
        alert(accessToken["refresh_token"]);
        
        const accessTokenResponse = await fetch ('https://accounts.spotify.com/api/token',{
            method: 'POST',
            headers: {
                'Content-Type':'application/x-www-form-urlencoded', //specifies type of content sent ex.application/x-www-form-urlencoded  is url ex. firstName=Nikhil&favColor=blue&password=easytoguess',
                //application/json is JSON data ex. JSON.stringify({ name: 'Hubot', login: 'hubot',})
                'Authorization': 'Basic '+btoa(myclientID +':'+myclientSecret)//btoa(string) base64 encodes string 
                
            },
            body: 'grant_type=refresh_token&refresh_token='+accessToken["refresh_token"]

                

        });

        console.log(accessTokenResponse);
        

        return  accessTokenResponse.json();
        
    }


    async function getRecentSongs(accessToken){


        alert("get songs");
        console.log(accessToken["access_token"]);
      
        const recentSongs= await fetch(	'https://api.spotify.com/v1/me/player/recently-played',{
        method:'GET',
        headers: {
            'Authorization': 'Bearer '  +accessToken["access_token"]
        }
        
        });
        console.log(recentSongs);
       

        return  recentSongs.json();
    }


    async function getUserTop(accessToken, type, range){


        alert("get top");
        console.log(accessToken["access_token"]);
      
        const getUserTop= await fetch(	'https://api.spotify.com/v1/me/top/'+type+'?'+'time_range='+range,{
        method:'GET',
        headers: {
            'Authorization': 'Bearer '  +accessToken["access_token"]
        }

        

        });
         
        console.log(getUserTop);
       

        return  getUserTop.json();
    }





return {
  
    getRefreshedToken,
    getRecentSongs,
    getUserTop
}

}
)();

const UIControl= ( function(){
    var firstCall=true;
    var firstCallTop=true;
    var firstCallTopArtists=true;


return {
    
    authorizationStatus(status){

        var authparagraph=document.createElement('p');
        authparagraph.id="authorization";
        if(status){
            authparagraph.innerHTML = 'Authorization Successful';
            authparagraph.style.cssText = "margin-top:50%; text-alignment: centered; font-size: 25px;";
        }
        else{
            authparagraph.innerHTML = "Authorization Failed";
            authparagraph.style.cssText = "margin-top:50%; text-alignment: centered; font-size: 25px; color:red;";
        }

        document.getElementById("content").insertBefore(authparagraph, document.getElementById("searchInput"));
        //authorization= document.getElementById("authorization");
        //document.getElementById("searchinput").insertAdjacentHTML('afterend', authorization); -doesnt work bc 2nd parameter ofinsertAdjacentHTML requires string representing html, not element object
        
    },
    createButtons(authorizeStatus){

        if(authorizeStatus){
            var topTracks=document.createElement('button');
            topTracks.id="topTracks";
            topTracks.innerHTML="Get Top Tracks";
            topTracks.setAttribute("class","btn");
            var topArtists=document.createElement('button');
            topArtists.id="topArtists";
            topArtists.innerHTML="Get Top Artists";
            topArtists.setAttribute("class","btn");
            var recentlyPlayed=document.createElement('button');
            recentlyPlayed.id="recentlyPlayed";
            recentlyPlayed.innerHTML="Get Recently Played";
            recentlyPlayed.setAttribute("class","btn");




            document.getElementById("searchInput").appendChild(topTracks);
            document.getElementById("searchInput").appendChild(topArtists);
            document.getElementById("searchInput").appendChild(recentlyPlayed);

           



        }
        else{
            var returnStart=document.createElement('button');
            returnStart.id="returnStart";
            returnStart.innerHTML="Return Home";
            returnStart.setAttribute("class","btn");
            document.getElementById("searchInput").appendChild(returnStart);
        }

    
       
    },

    displayrecentSongs(recentSongs){

       

    
        var displayrecentSongs='';
        for (var i=0; i<20; i++){

        displayrecentSongs+=recentSongs["items"][i]["track"]["name"]+"<br>";
        }

        if(firstCall==true){
            var p2 = document.createElement('p');
            p2.id=("recent songs");
            p2.style.cssText = "border:solid 1px black; padding:2px;";
            p2.innerHTML = " "+displayrecentSongs+" ";
            document.getElementById("content").appendChild(p2);
            }
        else{
            document.getElementById("recent songs").innerHTML = " "+displayrecentSongs+" ";

        }
       
        firstCall=false;
    },

    displayTopSongs(topSongs){

       

    
        var displayTopSongs='';
        for (var i=0; i<20; i++){

        displayTopSongs+=topSongs["items"][i]["name"]+"\t" +topSongs["items"][i]["artists"][0]["name"]+"<br>";
        }

        if(firstCallTop==true){
            var topSongs = document.createElement('p');
            topSongs.id=("top songs");
            topSongs.style.cssText = "border:solid 1px black; padding:2px;";
            topSongs.innerHTML = " "+displayTopSongs+" ";
            document.getElementById("content").appendChild(topSongs);
            }
        else{
            document.getElementById("top songs").innerHTML = " "+displayTopSongs+" ";

        }
       
        firstCallTop=false;
    },
    displayTopArtists(topArtists){

       

    
        var displayTopArtists='';
        for (var i=0; i<20; i++){

        displayTopArtists+=topArtists["items"][i]["name"]+"\t" +topArtists["items"][i]["genres"][0]+"<br>";
        }

        if(firstCallTop==true){
            var topArtists = document.createElement('p');
            topArtists.id=("top artists");
            topArtists.style.cssText = "border:solid 1px black; padding:2px;";
            topArtists.innerHTML = " "+displayTopArtists+" ";
            document.getElementById("content").appendChild(topArtists);
            }
        else{
            document.getElementById("top songs").innerHTML = " "+displayTopArtists+" ";

        }
       
        firstCallTopArtists=false;
    },

    createForm(){
        var dateform = document.createElement('form');
        dateform.id="input form";
        dateform.setAttribute("action", "/pages/wrapped.html");
        dateform.style.cssText = " margin-top:30%;";
       

        var startDate= document.createElement("input"); 
        startDate.id="StartDate";
        startDate.className="submitButtons";
        startDate.setAttribute("type", "date"); 
        startDate.setAttribute("name", "StartDate"); 
        startDate.setAttribute("placeholder", "Start Date"); 

        var startDateLabel= document.createElement("label"); 
        startDateLabel.className="submitLabels";
        startDateLabel.setAttribute("for", "StartDate"); 
        startDateLabel.innerHTML="From:"
        

        var endDate= document.createElement("input"); 
        endDate.id="EndDate";
        endDate.className="submitButtons";
        endDate.setAttribute("type", "date"); 
        endDate.setAttribute("name", "EndDate"); 
        endDate.setAttribute("placeholder", "End Date"); 
       

        var endDateLabel= document.createElement("label"); 
        endDateLabel.className="submitLabels";
        endDateLabel.setAttribute("for", "EndDate"); 
        endDateLabel.innerHTML="To:"
     

        var formSubmit = document.createElement("input"); 
        formSubmit.setAttribute("type", "submit"); 
        formSubmit.setAttribute("value", "GO"); 
        formSubmit.style.cssText = " margin-top:30%;";

        var linebreak = document.createElement("br");
        var linebreak1 = document.createElement("br");
        
        var leftinputSpan= document.createElement("span"); 
        leftinputSpan.id="leftinputSpan";
        leftinputSpan.style.cssText = "float:left;";

        var rightinputSpan= document.createElement("span"); 
        rightinputSpan.id="rightinputSpan";
        rightinputSpan.style.cssText = " float:right;";


        document.getElementById("content").appendChild(dateform);
        document.getElementById("input form").appendChild(leftinputSpan);
        document.getElementById("input form").appendChild(rightinputSpan);


        document.getElementById("leftinputSpan").appendChild(startDateLabel);
        document.getElementById("leftinputSpan").appendChild(linebreak); 
        document.getElementById("leftinputSpan").appendChild(startDate);

        document.getElementById("rightinputSpan").appendChild(endDateLabel);
        document.getElementById("rightinputSpan").appendChild(linebreak1); 
        document.getElementById("rightinputSpan").appendChild(endDate);

        document.getElementById("input form").appendChild(formSubmit);

        

    }


}

}
)();





const AppControl= ( function(){

    startSite();// startSite is hoisted , can be used even tho its declared below  function and var DECLARATIONS are hoisted in js

    async function startSite(){

   
    accessToken=  JSON.parse(sessionStorage.getItem("Access Token"));

    authorizeStatus=!accessToken.hasOwnProperty('error');//true means no error property, will dispplay input btns

    
    UIControl.authorizationStatus(authorizeStatus);
    UIControl.createButtons(authorizeStatus);
       
    
        if(authorizeStatus){
    document.getElementById("topTracks").addEventListener("click", displayTopSongs);
    document.getElementById("topArtists").addEventListener("click", displayTopArtists);
    document.getElementById("recentlyPlayed").addEventListener("click", displayRecentSongs);
        }
    
        else{
            document.getElementById("returnStart").addEventListener("click", goHome);
        }
  
  


}


async function displayRecentSongs(){
    alert ("display songs");
    console.log(accessToken);
    recentSongs= await APIControl.getRecentSongs(accessToken);
    UIControl.displayrecentSongs(recentSongs);

   
}

async function displayTopSongs(){
    alert ("dabSongs");
    window.location.replace("/pages/stats/tracks.html");
    
}

async function displayTopArtists(){
    alert ("dabArtists");
    window.location.replace("/pages/stats/artists.html");
    
    
}

function goHome(){
    alert ("go home bro");
    window.location.replace("/index.html");
    
    
}


}
)();

window.addEventListener("load", function(){         //function completes after authorize iife 


  
    console.log("load");
   
});

const TopTracksAPIControl = (function () {          //iife, functions made available via closure , pre es6 module pattern emulates classes via iifes and closures 
    //classes in js dont acutally have encapsulation???? encapsulate via closures??

    const myclientID = "55eb0d1bcb4a4b41b7cf5981b9cfe79b";
    const myclientSecret = "40fab7fee78f46ddb797213a06f7531d";


    async function getRefreshedToken(accessToken) {

        const accessTokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', //specifies type of content sent ex.application/x-www-form-urlencoded  is url ex. firstName=Nikhil&favColor=blue&password=easytoguess',
                //application/json is JSON data ex. JSON.stringify({ name: 'Hubot', login: 'hubot',})
                'Authorization': 'Basic ' + btoa(myclientID + ':' + myclientSecret)//btoa(string) base64 encodes string 

            },
            body: 'grant_type=refresh_token&refresh_token=' + accessToken["refresh_token"]



        });

        console.log(accessTokenResponse);


        return accessTokenResponse.json();

    }

    async function getUserTopTracks(accessToken, range) {



        console.log(accessToken["access_token"]);

        const getUserTop = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=' + range + '&limit=50', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken["access_token"]
            }



        });

        console.log(getUserTop);


        return getUserTop.json();
    }

    return {

        getRefreshedToken,
        getUserTopTracks

    }

}
)();

const TopTracksUIControl = (function () {

    function referenceIMG(url) {

        window.open(url);
    }

    const DOMElements = {

        //object to hold reference to html elements
        //only change reference once here when changing element id names 

        topTrackPageContent: document.getElementById("content"),

        topTracksTimeHeaders: [document.getElementById("top_TracksTimeRange"), document.getElementById("top_50TableInfo")],


        topTracksSeekRight: document.getElementById("rightNav"),
        topTracksSeekLeft: document.getElementById("leftNav"),
        topTracksAll:document.getElementById("top3Tracks"),
        topTrackSpans: [document.getElementById("topTrack1"), document.getElementById("topTrack2"), document.getElementById("topTrack3")],
        topTrackImages: [document.getElementById("top_TrackIMG1"), document.getElementById("top_TrackIMG2"), document.getElementById("top_TrackIMG3")],
        
        topTrackTextDivs: [document.getElementById("topTrack1TextDiv"), document.getElementById("topTrack2TextDiv"), document.getElementById("topTrack3TextDiv")],
        topTrackNames: [document.getElementById("top_TrackSong1"), document.getElementById("top_TrackSong2"), document.getElementById("top_TrackSong3")],
        topTrackArtists: [document.getElementById("top_TrackArtist1"), document.getElementById("top_TrackArtist2"), document.getElementById("top_TrackArtist3")],

        topTracksTable: document.getElementById("top_TracksTable"),

        topTracksTableImages: [],
        topTrackToolTipTables: [document.getElementById("top_3TracksTable1"), document.getElementById("top_3TracksTable2"), document.getElementById("top_3TracksTable3")]


    }

    const CSSClasses = {
        slideTrackText: "slideTrack",
        slideArtistText: "slideArtist",
        top3TracksIMG:"top3TracksIMG",
        topTracksTableImages:"tableImages",
        rightSlidePart1:"slideRightPart1",
        rightSlidePart2:"slideRightPart2",
        leftSlidePart1:"slideLeftPart1",
        leftSlidePart2:"slideLeftPart2"
    }

    return {


        DOMElements,
        CSSClasses,



        overflowSlideIn(pTrackElement, pArtistElement, pElementSpan, pElementParentSpan) {

            console.log(pTrackElement.scrollWidth > pElementSpan.clientWidth);


            if (pTrackElement.scrollWidth > pElementSpan.clientWidth) {//check for text overflow on track


                pElementParentSpan.classList.add(CSSClasses.slideTrackText);//add class that moves text on hover for overflown track text

            }
            if (pArtistElement.scrollWidth > pElementSpan.clientWidth) {//check for text overflow on artist 


                pElementParentSpan.classList.add(CSSClasses.slideArtistText);//add class that moves text on hover for overflown artist text

            }



        },

        addReference(elementRef, topSongs) {



            //for (var i=0; i<count; i++){   //this initial code will not work, sets all imgReferences to last index of i due to variable hoisting, callback grabs reference to i that gets changed       
            //document.getElementById(elementRef+(i+1)).addEventListener("click", function(){referenceIMG( topSongs["items"][i]["external_urls"]["spotify"])});      //WONT WORK 
            //}      
            //^^^
            //this shit was so frustrating to implement smh  
            //bc of variable scope/var hoisting , counter i used in referenceIMG parameter gets reset every increment of outer for loop
            //In js, variable hoisintg makes all vars in block statements (but not functions), ex.for loop undergo declaration right before the block {}
            //as such, these vars are "global" in scope to the functions defined within the for loop, like the eventListener callback function
            //without closure or let to define scope or .bind to create a new scope based off of a defined "this",
            // variable i inside referenceIMG call made by eventListener callback function gets set to last index when loop finishes, since callback function
            // references for loop var i that is hoisted 
            //-(for var, only declaratio is hoisted but for functions declaration and body are hoisted )

            //solutions:
            //.bind= creates a new function with  a "this" scope on each increment so that value of i is local in block everytime 

            //closures = make an iife inside the loop with new var j assigned to i; this will make var j "local" in scope to the iife
            //(var j would normally get hoisted like var i without putting it inside a function) this way, j retains a "local" i value and cant get accesseed outside the iife

            //let =create var j outside loop, assign let keyword to j when assinging it to i inside hte function; doing this, j has no assigned value outside
            //the for loop, but is assigned to i within the loop;using let, j is always a new variable and equal to the current value of i in the iteration.


            for (var i = 0; i < elementRef.length; i++) {



                //elementRef[i].addEventListener("click",                                                   //.bind solution, still not 100% sure how this works 
                //referenceIMG.bind(this, topSongs["items"][i]["external_urls"]["spotify"]));



                //(function(){                                                                                    //closure solution
                //  var j=i;      
                // elementRef[i].addEventListener("click", function (){              
                //     referenceIMG( topSongs["items"][j]["external_urls"]["spotify"])});   
                //    })(); 

            }

            var j;   //j has no value here                                                                                   //let solution        
            for (var i = 0; i < elementRef.length; i++) {
                let j = i;      //j has i value    
                elementRef[i].addEventListener("click", function () {
                    referenceIMG(topSongs["items"][j]["external_urls"]["spotify"])
                });
            }    //j has no value here    


        },


        displayTopSongs(topSongs) {

            var displayTopSongs = "<tr id=\"top_TracksTableHeaders\" class=\"tableHeaders\">"           //header row, is constant and  appears in inner html before other rows 
                                    +"<th></th>"
                                    +"<th></th>"
                                    +"<th>Track</th>"
                                    +"<th>Artist</th></tr>";
                             
            for (var i = 0; i < 50; i++) {

                displayTopSongs += "<tr><td>" + (i + 1) + "</td><td>"//start row, add number cell
                    + "<img src=" + topSongs["items"][i]["album"]["images"][2]["url"] + " id=\"topSongsAlbumIMG" + (i + 1) + "\" class=\""+CSSClasses.topTracksTableImages+"\"></td><td>"//add image cell
                    + topSongs["items"][i]["name"] + "</td><td>"//add track name cell
                    + this.arrangeArtists(topSongs, i) + "</td></tr>";//add artist name cell, end row 

                //DOMElements.topTracksTable.innerHTML +=   displayTopSongs;

                //DOMElements.topTracksTableImages[i]=document.getElementById("topSongsAlbumIMG"+(i+1)); adding to dom object immediatly with doc.getelemid produces buggeed eventlistner function
                //when cycling thru this array to add eventlisteners in Addref, the listeners dont appear in inspect elemnt
                //console logging here, IMG SRC is in Inspec ELem not "hyper linked" on immediate assignment
            }
            DOMElements.topTracksTable.innerHTML = displayTopSongs;

            for (var i = 0; i < 50; i++) {
                DOMElements.topTracksTableImages[i] = document.getElementById("topSongsAlbumIMG" + (i + 1)); //add new images in table to DOM object 
                //console logging here, IMG SRC is in Inspec ELem IS "hyper linked" on delayed assignment
            }
            //why need delay?? does js need time to load innerHTML?????? How fast is js event loop?

        },


        displayTop3(topSongs) {
            var artists;


            for (var i = 0; i < 3; i++) {
                var topTracksIMG = document.createElement('img');             //dynamically create top 3 imgs here and delete them in eventReset() so that
                //assoicated eventlisteners are removed at the same time upon switcing time lengths
                topTracksIMG.id = "top_TrackIMG" + (i + 1);
                topTracksIMG.setAttribute("class", CSSClasses.top3TracksIMG);
                topTracksIMG.setAttribute("src", "");

                DOMElements.topTrackSpans[i].insertBefore(topTracksIMG, DOMElements.topTrackTextDivs[i]);

                DOMElements.topTrackImages[i] = document.getElementById("top_TrackIMG" + (i + 1));

            }


            for (var i = 0; i < 3; i++) {

                artists = "";
                DOMElements.topTrackImages[i].src = topSongs["items"][i]["album"]["images"][0]["url"];
                DOMElements.topTrackImages[i].alt = "Album Cover for:" + topSongs["items"][i]["album"]["name"];
                DOMElements.topTrackNames[i].innerHTML = topSongs["items"][i]["name"];

               artists=this.arrangeArtists(topSongs, i);

                DOMElements.topTrackArtists[i].innerHTML = artists;


            }

        },
        
        arrangeArtists(topSongs, songNumber){
            var artists="";
            for (var j = 0; j < topSongs["items"][songNumber]["artists"].length; j++) {
                if (j > 0) {
                    artists += ", "

                }
                artists += topSongs["items"][songNumber]["artists"][j]["name"];
            }
            return artists;
        },

        msToMin(duration) {

            min = Math.floor(duration / 60000);
            seconds = Math.floor(duration % 60000 / 1000);

            if (seconds > 9) {
                return min + ":" + seconds;
            }
            return min + ":0" + seconds;

        },

        popularityCheck(popularity) {
            if (popularity < 40) {
                return "Low";
            }
            else if (popularity < 80) {
                return "Medium";
            }
            else {
                return "High";
            }


        },

        fillToolTipInfo(topSongs) {

            var displayTopSongs = "";
            for (var i = 0; i < 3; i++) {
                displayTopSongs = "<tr><td>Album:</td><td>" + topSongs["items"][i]["album"]["name"] + "</td></tr>"//album name row
                    + "<tr><td>Release:</td><td>" + topSongs["items"][i]["album"]["release_date"] + "</td></tr>"
                    + "<tr><td>Length:</td><td>" + this.msToMin(topSongs["items"][i]["duration_ms"]) + "</td></tr>"
                    + "<tr><td>Popularity:</td><td>" + this.popularityCheck(topSongs["items"][i]["popularity"]) + " (" + topSongs["items"][i]["popularity"] + ")" + "</td></tr>"

                DOMElements.topTrackToolTipTables[i].innerHTML = displayTopSongs;
            }

        },

        displayContent(time) {

            if (time == "short_term") {
                DOMElements.topTracksTimeHeaders[0].innerHTML = "Of Your Last 4 Weeks";
                DOMElements.topTracksTimeHeaders[1].innerHTML = "Of Your Last 4 Weeks";
            }
            else if (time == "medium_term") {
                DOMElements.topTracksTimeHeaders[0].innerHTML = "Of Your Last 6 Months";
                DOMElements.topTracksTimeHeaders[1].innerHTML = "Of Your Last 6 Months";
            }
            else if (time == "long_term") {
                DOMElements.topTracksTimeHeaders[0].innerHTML = "Of Your Entire Listening History";
                DOMElements.topTracksTimeHeaders[1].innerHTML = "Of Your Entire Listening History";
            }

            DOMElements.topTrackPageContent.style.display = "block";
        },

        eventReset() {
            for (var i = 0; i < 3; i++) {

                DOMElements.topTrackImages[i].remove();

                DOMElements.topTrackSpans[i].classList.remove(CSSClasses.slideTrackText); //remove slider class for track overflow
                DOMElements.topTrackSpans[i].classList.remove(CSSClasses.slideArtistText);//remove slider class for artist overflow
            }
        }
    }

}
)();

const AppControl = (function () {

    TopTracksUIControl.DOMElements.topTracksSeekRight.addEventListener("click", rightNav);
    TopTracksUIControl.DOMElements.topTracksSeekLeft.addEventListener("click", leftNav);

    var accessToken = JSON.parse(sessionStorage.getItem("Access Token")); //session storeage get item returns null if no item is set for key access token

    var navigate = 0;
    var time_range = ["short_term", "medium_term", "long_term"]

    authorizeStatus = !accessToken.hasOwnProperty('error');//true means no error key


    if (authorizeStatus) {
        appStarter(time_range[navigate]);

    }

    else {
        authError();
    }

    async function wait(ms) {
        return new Promise(resolve => {
          setTimeout(resolve, ms);
        });
      }
      
    async function rightNav() {

        
        TopTracksUIControl.DOMElements.topTracksSeekRight.disabled=true;
        TopTracksUIControl.DOMElements.topTracksTimeHeaders[0].classList.toggle(TopTracksUIControl.CSSClasses.rightSlidePart1);

       TopTracksUIControl.DOMElements.topTracksAll.classList.toggle(TopTracksUIControl.CSSClasses.rightSlidePart1);
       TopTracksUIControl.DOMElements.topTracksAll.addEventListener('animationend', animationEndCallbackRight1);
      
        await wait(500);
    
        TopTracksUIControl.eventReset();
        
        navigate++;
        if (navigate > 2) {
            navigate = 0;
        }
       
        await appStarter(time_range[navigate]);
        
        setTimeout("document.getElementById(\"rightNav\").disabled=false;",250);
        TopTracksUIControl.DOMElements.topTracksAll.style.opacity = "1";
        TopTracksUIControl.DOMElements.topTracksTimeHeaders[0].style.opacity = "1";

        TopTracksUIControl.DOMElements.topTracksAll.classList.toggle(TopTracksUIControl.CSSClasses.rightSlidePart2);
        TopTracksUIControl.DOMElements.topTracksTimeHeaders[0].classList.toggle(TopTracksUIControl.CSSClasses.rightSlidePart2);
        TopTracksUIControl.DOMElements.topTracksAll.addEventListener('animationend', animationEndCallbackRight2);
       
    }

    function animationEndCallbackRight1 () {
        
        TopTracksUIControl.DOMElements.topTracksAll.removeEventListener('animationend', animationEndCallbackRight1);
        TopTracksUIControl.DOMElements.topTracksAll.style.opacity = "0";
        TopTracksUIControl.DOMElements.topTracksTimeHeaders[0].style.opacity = "0";
        TopTracksUIControl.DOMElements.topTracksAll.classList.remove(TopTracksUIControl.CSSClasses.rightSlidePart1);
        TopTracksUIControl.DOMElements.topTracksTimeHeaders[0].classList.remove(TopTracksUIControl.CSSClasses.rightSlidePart1);
        
    }
    function animationEndCallbackRight2 () {
        TopTracksUIControl.DOMElements.topTracksAll.removeEventListener('animationend', animationEndCallbackRight2);
   
        TopTracksUIControl.DOMElements.topTracksAll.classList.remove(TopTracksUIControl.CSSClasses.rightSlidePart2);
        TopTracksUIControl.DOMElements.topTracksTimeHeaders[0].classList.remove(TopTracksUIControl.CSSClasses.rightSlidePart2);
    }
    function animationEndCallbackLeft1 () {

        TopTracksUIControl.DOMElements.topTracksAll.removeEventListener('animationend', animationEndCallbackLeft1);
        TopTracksUIControl.DOMElements.topTracksAll.style.opacity = "0";
        TopTracksUIControl.DOMElements.topTracksTimeHeaders[0].style.opacity = "0";
        TopTracksUIControl.DOMElements.topTracksAll.classList.remove(TopTracksUIControl.CSSClasses.leftSlidePart1);
        TopTracksUIControl.DOMElements.topTracksTimeHeaders[0].classList.remove(TopTracksUIControl.CSSClasses.leftSlidePart1);
    }
    function animationEndCallbackLeft2 () {
        TopTracksUIControl.DOMElements.topTracksAll.removeEventListener('animationend', animationEndCallbackLeft2);
      
        TopTracksUIControl.DOMElements.topTracksAll.classList.remove(TopTracksUIControl.CSSClasses.leftSlidePart2);
        TopTracksUIControl.DOMElements.topTracksTimeHeaders[0].classList.remove(TopTracksUIControl.CSSClasses.leftSlidePart2);
    }


    async function leftNav() {

        TopTracksUIControl.DOMElements.topTracksSeekLeft.disabled=true;
        TopTracksUIControl.DOMElements.topTracksAll.classList.toggle(TopTracksUIControl.CSSClasses.leftSlidePart1);
        TopTracksUIControl.DOMElements.topTracksTimeHeaders[0].classList.toggle(TopTracksUIControl.CSSClasses.leftSlidePart1);
        TopTracksUIControl.DOMElements.topTracksAll.addEventListener('animationend', animationEndCallbackLeft1);
         await wait(500);
        TopTracksUIControl.eventReset();

        navigate--;

        if (navigate < 0) {
            navigate = 2;
        }
        await appStarter(time_range[navigate]);

        setTimeout("document.getElementById(\"leftNav\").disabled=false;",250);
        TopTracksUIControl.DOMElements.topTracksAll.style.opacity = "1";
        TopTracksUIControl.DOMElements.topTracksTimeHeaders[0].style.opacity = "1";
        TopTracksUIControl.DOMElements.topTracksAll.classList.toggle(TopTracksUIControl.CSSClasses.leftSlidePart2);
        TopTracksUIControl.DOMElements.topTracksTimeHeaders[0].classList.toggle(TopTracksUIControl.CSSClasses.leftSlidePart2);
        TopTracksUIControl.DOMElements.topTracksAll.addEventListener('animationend', animationEndCallbackLeft2);

    }

    async function appStarter(time_range) {

        var tokenStatus = false;

        while (!tokenStatus) {

            topSongs = await TopTracksAPIControl.getUserTopTracks(accessToken, time_range);
            tokenStatus = !topSongs.hasOwnProperty('error');//true means no error property, access token doesnt need refresh, while loop wont run again 

            if (tokenStatus) {

                console.log(topSongs);
                await displayUITopSongs(topSongs, time_range);
               
            }

            else if (topSongs["error"]["message"] == "The access token expired") {

                accessToken = TopTracksAPIControl.getRefreshedToken(accessToken);
                sessionStorage.setItem("Access Token", JSON.stringify(accessToken));


            }
            else {

                alert("Error:" + topSongs["error"]["status"] + ", " + topSongs["error"]["message"]); //other error occurred
                tokenStatus = true;
                window.location.replace("/index.html");
            }
        }

    }

    async function displayUITopSongs(topSongs, time) {
        TopTracksUIControl.displayTop3(topSongs);
        TopTracksUIControl.displayTopSongs(topSongs);
        TopTracksUIControl.displayContent(time);

        for (var i = 0; i < 3; i++) {
            TopTracksUIControl.overflowSlideIn(TopTracksUIControl.DOMElements.topTrackNames[i], TopTracksUIControl.DOMElements.topTrackArtists[i], TopTracksUIControl.DOMElements.topTrackTextDivs[i], TopTracksUIControl.DOMElements.topTrackSpans[i]);
        }


        TopTracksUIControl.fillToolTipInfo(topSongs);

        TopTracksUIControl.addReference(TopTracksUIControl.DOMElements.topTrackImages, topSongs);
        TopTracksUIControl.addReference(TopTracksUIControl.DOMElements.topTracksTableImages, topSongs);

    }

    function authError(){

        alert("Authentication Error")
        window.location.replace("/index.html");
        
        
    }

}
)();

window.addEventListener("load", function () {         //function completes after authorize iife 
    console.log("load");

});
const TopArtistsAPIControl= (function(){          //iife, functions made available via closure , pre es6 module pattern emulates classes via iifes and closures 
    //classes in js dont acutally have encapsulation???? encapsulate via closures??

const myclientID="55eb0d1bcb4a4b41b7cf5981b9cfe79b";
const myclientSecret="40fab7fee78f46ddb797213a06f7531d";

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


    async function getUserTopArtists(accessToken,  range){


        
        console.log(accessToken["access_token"]);

        const getUserTop= await fetch(	'https://api.spotify.com/v1/me/top/artists?time_range='+range,{
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
getUserTopArtists

}
})();





const TopArtistsUIControl= ( function(){

    function referenceIMG(url) {

        window.open(url);
    }

    const DOMElements = {

        //object to hold reference to html elements
        //only change reference once here when changing element id names 

        topArtistsPageContent: document.getElementById("content"),

        topArtistsTimeHeader: document.getElementById("top_ArtistsTimeRange"),


        topArtistsSeekRight: document.getElementById("rightNav"),
        topArtistsSeekLeft: document.getElementById("leftNav"),

      
        topArtistsTable: document.getElementById("top_ArtistsTable"),

        topArtistsTableImages: []
       


    }

    const CSSClasses = {
        baseTableHeaders:"tableHeaders",
        tableRows:"top_ArtistTableRow",
        top3Styles:["first", "second", "third"],
        tableImages:"tableImages",
        topArtistsTableImages:"top_ArtistsTableIMGS"
    }

return {
    
    DOMElements,
    
    addReference(elementRef, topArtists) {



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
                referenceIMG(topArtists["items"][j]["external_urls"]["spotify"])
            });
        }    //j has no value here    




    },
    

    
    displayTopArtists(topArtists){

       

    
        var displayTopArtists = "";
     
            for (var i = 0; i < 3; i++) {// first 3 rows , top 3
                displayTopArtists += "<tr class=\""+CSSClasses.tableRows+" " +CSSClasses.top3Styles[i]+"\"><td>" + (i + 1) + "</td><td>"//start row, add number cell
                + "<img src=" + topArtists["items"][i]["images"][2]["url"] + " id=\"topArtistIMG" + (i + 1) + "\" class=\""+CSSClasses.topArtistsTableImages+"\"></td><td>"//add image cell
                + topArtists["items"][i]["name"] + "</td><td>"//add artist name cell
                + this.arrangeArtistGenres(topArtists, i) + "</td></tr>"//add genres cell
            }
         
            for (var i = 3; i < topArtists["items"].length; i++) {
            
                displayTopArtists += "<tr class=\""+CSSClasses.tableRows+"\"><td>" + (i + 1) + "</td><td>"//start row, add number cell
                    + "<img src=" + topArtists["items"][i]["images"][2]["url"] + " id=\"topArtistIMG" + (i + 1) + "\" class=\""+CSSClasses.topArtistsTableImages+"\"></td><td>"//add image cell
                    + topArtists["items"][i]["name"] + "</td><td>"//add artist name cell
                    + this.arrangeArtistGenres(topArtists, i) + "</td></tr>"//add genres cell
                



                //DOMElements.topTracksTable.innerHTML +=   displayTopSongs;

                //DOMElements.topTracksTableImages[i]=document.getElementById("topSongsAlbumIMG"+(i+1)); adding to dom object immediatly with doc.getelemid produces buggeed eventlistner function
                //when cycling thru this array to add eventlisteners in Addref, the listeners dont appear in inspect elemnt
                //console logging here, IMG SRC is in Inspec ELem not "hyper linked" on immediate assignment
            }

            
            DOMElements.topArtistsTable.innerHTML =  displayTopArtists;

            for (var i = 0; i <  topArtists["items"].length; i++) {
                DOMElements.topArtistsTableImages[i] = document.getElementById("topArtistIMG" + (i + 1)); //add new images in table to DOM object 
                //console logging here, IMG SRC is in Inspec ELem IS "hyper linked" on delayed assignment
            }
            //why need delay?? does js need time to load innerHTML?????? How fast is js event loop?

          

        
       
      
    },
    arrangeArtistGenres(topArtists, artistNumber){
        var genres="";
        for (var j = 0; j < topArtists["items"][artistNumber]["genres"].length; j++) {
            if (j > 0) {
                genres += ", "

            }
            genres += topArtists["items"][artistNumber]["genres"][j];
        }
        return genres;
    },

    displayContent(time) {

        if (time == "short_term") {
            DOMElements.topArtistsTimeHeader.innerHTML = "Of Your Last 4 Weeks";
           
        }
        else if (time == "medium_term") {
            DOMElements.topArtistsTimeHeader.innerHTML = "Of Your Last 6 Months";
          
        }
        else if (time == "long_term") {
            DOMElements.topArtistsTimeHeader.innerHTML = "Of Your Entire Listening History";
           
        }

      

        DOMElements.topArtistsPageContent.style.display = "block";
    },


    


}

}
)();
const AppControl= ( function(){

    

    var navigate = 0;
    var time_range = ["short_term", "medium_term", "long_term"]
   
    accessToken=  JSON.parse(sessionStorage.getItem("Access Token")); //session storeage get item returns null if no item is set for key access token

    authorizeStatus=!accessToken.hasOwnProperty('error');//true means no error property, will dispplay input btns


    
    if(authorizeStatus){
       appStarter(time_range[navigate]);
       
    }
    
    else{
        
      authError();
    
    }

    async function rightNav() {

       

        navigate++;
        if (navigate > 2) {
            navigate = 0;
        }

        appStarter(time_range[navigate]);

    }

    async function leftNav() {

     

        navigate--;

        if (navigate < 0) {
            navigate = 2;
        }
        appStarter(time_range[navigate]);

    }

    async function appStarter(time_range) {

        var tokenStatus = false;

        while (!tokenStatus) {

            topArtists= await TopArtistsAPIControl.getUserTopArtists(accessToken, time_range);
            tokenStatus = !topArtists.hasOwnProperty('error');//true means no error property, access token doesnt need refresh, while loop wont run again 

            if (tokenStatus) {

                console.log(topArtists);
                displayTopArtists(topArtists, time_range);
            }

            else if (topArtists["error"]["message"] == "The access token expired") {

                accessToken = TopArtistsAPIControl.getRefreshedToken(accessToken);
                sessionStorage.setItem("Access Token", JSON.stringify(accessToken));


            }
            else {

                alert("Error:" + topArtists["error"]["status"] + ", " + topArtists["error"]["message"]); //other error occurred
                tokenStatus = true;
                window.location.replace("/index.html");
            }
        }

    }
    
    async function displayTopArtists(topArtists, time){
        
  
        console.log( topArtists);
        
        TopArtistsUIControl.displayTopArtists(topArtists);
        
        TopArtistsUIControl.displayContent(time);
        
        TopArtistsUIControl.addReference(TopArtistsUIControl.DOMElements.topArtistsTableImages, topArtists);

        TopArtistsUIControl.DOMElements.topArtistsSeekRight.addEventListener("click", rightNav);
        TopArtistsUIControl.DOMElements.topArtistsSeekLeft.addEventListener("click", leftNav);
    
}

function authError(){

    alert("Authentication Error")
    window.location.replace("/index.html");
    
    
}



window.addEventListener("load", function(){         //function completes after authorize iife 


  
    console.log("load");
   
});

}
)();
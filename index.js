document.getElementById("dab").addEventListener("click", dab2);

const my_client_id="55eb0d1bcb4a4b41b7cf5981b9cfe79b";
const clientSecret="40fab7fee78f46ddb797213a06f7531d";
const redirect_uri="http://localhost:8000/pages/callback.html";

const authorize= (function(){
  alert (window.location);
  return window.location;
})();


var scopes = "user-read-private user-read-email user-read-recently-played user-top-read";
var classes=document.getElementsByClassName("btn");//returns an array-like object of elements with name btn 

for (var i=0; i<classes.length;i++){
    classes[i].addEventListener("click", dab);
}

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };


function dab(){
    alert ("Hellodgdgsdld!");
}

async function dab2(){
    alert ("Hsadas");
    var state = generateRandomString(16);

    window.location.replace('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + my_client_id +
    '&scope=' + encodeURIComponent(scopes)  +
    '&redirect_uri=' + encodeURIComponent(redirect_uri) +
    '&state='+state
    
    );


  //  result = await fetch('https://accounts.spotify.com/authorize' +
    // '?response_type=code' +
    // '&client_id=' + my_client_id +
    // '&scope=' + encodeURIComponent(scopes)  +
    // '&redirect_uri=' + encodeURIComponent(redirect_uri)
    // +'&state='+state, {method: 'GET'});
  
    // alert (result);
    // const jsonrresult=await result.json();
    // alert (jsonresult);


    
}



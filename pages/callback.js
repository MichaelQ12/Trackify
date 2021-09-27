



const authorizeInfo= (async function(){

    const myclientID="55eb0d1bcb4a4b41b7cf5981b9cfe79b";
    const myclientSecret="40fab7fee78f46ddb797213a06f7531d";
    const redirect_uri="http://localhost:8000/pages/callback.html";
        
    

    var urlJSON=urltoJSON(window.location.href);
    

        //function stops after error? ex. line after error line wont execute 


  
        
        const accessTokenResponse = await fetch ('https://accounts.spotify.com/api/token',{
            method: 'POST',
            headers: {
                'Content-Type':'application/x-www-form-urlencoded', //specifies type of content sent ex.application/x-www-form-urlencoded  is url ex. firstName=Nikhil&favColor=blue&password=easytoguess',
                //application/json is JSON data ex. JSON.stringify({ name: 'Hubot', login: 'hubot',})
                'Authorization': 'Basic '+btoa(myclientID +':'+myclientSecret)//btoa(string) base64 encoides string 
                
            },
            body: 'grant_type=authorization_code&code='+urlJSON["code"]+'&redirect_uri='+redirect_uri

                

        });

        accessToken=await accessTokenResponse.json();
       

        sessionStorage.setItem("Access Token", JSON.stringify(accessToken));
        
    
        window.location.replace("/pages/wrapped.html");
        return  true;
        
})();                                                 //JS iife fires before content load




function urltoJSON(url){
    var allparameters = url.slice(url.indexOf('?') + 1).split('&');//slices alll text from url before and including ? character
    //then "splits" string into array of substring, with each substring/index seperated by '&' charcter of og string
    //ex.  var parameteres="dab&woohoo".split('&') gives parameteres[0]=dab, parameteres[1]=woohoo

    var urlJSON = {};

    for (var i=0;i<allparameters.length;i++){
    singleparam= allparameters[i].split('='); //at this point, allparameters is an array of substring, each susbtring is in form parametername=somehtinbg
                                            //this line splits current allparameters element into another arrray of substring, this time split by '='  so parametername=somehtinbg
                                            //becomes parametername, something 

    urlJSON[singleparam[0]] =singleparam[1];//adds key singleparam[0], sets its value to singleparam[1]; use 0,1 since each singleparam element is only 2  strings seperated by '='


}
    return urlJSON;
}




   





require('dotenv').config();
var request = require('request');
var fs = require('fs');
var owner = process.argv[2];
var repo = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

//main function retrieve repository contributors
function getRepoContributors(owner, repo, cb) {
  //check for mandatory command line arguments owner and repository
  //if they are provided continue with retrieving the avatar
  if (!owner) {
    console.log("Please provide an owner!");
  } else if (!repo){
    console.log("Please provide a repository!");
  } else{
    if (process.env.GITHUB_TOKEN === undefined) {
      console.log("The .env file has not been created or filled with the correct informtion. ");
    } else {
      //http header
      var options = {
        url: "https://api.github.com/repos/" + owner + "/" + repo + "/contributors",
        headers: {
          'User-Agent': 'request',
          'Authorization': "token " + process.env.GITHUB_TOKEN
        }
      };

      //http request with callback function parsing the result
      request(options, function(err, res, body) {
        var obj = JSON.parse(body);

        if (obj.message === 'Bad credentials') {
          console.log("The GITHUB_TOKEN provided is not correct. ");
        } else {
          cb(err, obj);
        }
      });
    }
  }
};

//retrieve the contributors
getRepoContributors(owner, repo, function(err, result) {
  if (result.length === undefined) {
    console.log("The owner or repository does not exist. ");
  } else {
    //check if the folder avatars exists
    if (!fs.exists('avatars')){
      //if it does not exist create the folder
      fs.mkdir('avatars',function(err){
        console.log("Directory created successfully!");
      });
    };

    //download the image; adjust i < 10 if all shall be downloaded
    for (var i = 0; i < result.length && i < 10; i++) {
      console.log("in loop: ", result[i]);
      downloadImageByURL(result[i].avatar_url, result[i].login);
    }
  }
});

//download image function taking url and path as argument
function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       //write the image to the folder
       .pipe(fs.createWriteStream('./avatars/' + filePath));
}

//downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")
//https://avatars2.githubusercontent.com/u/2741?v=3&s=466
//kvirani
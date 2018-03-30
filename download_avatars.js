require('dotenv').config();
var request = require('request');
var fs = require('fs');
//var token = require('./secrets.js');
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
      cb(err, obj);
    });
  }
};

//retrieve the contributors
getRepoContributors(owner, repo, function(err, result) {
  console.log("Errors:", err);

  //check if the folder avatars exists
  if (!fs.exists('avatars')){
    //if it does not exist create the folder
    fs.mkdir('avatars',function(err){
      console.log("Directory created successfully!");
    });
  };

  //download the image; adjust to result.length if all shall be downloaded
  for (var i = 0; i < 10; i++) {
    downloadImageByURL(result[i].avatar_url, result[i].login);
  }
});

//download image function taking url and path as argument
function downloadImageByURL(url, filePath) {
  request.get(url)               // Note 1
       .on('error', function (err) {                                   // Note 2
         throw err;
       })
       //write the image to the folder
       .pipe(fs.createWriteStream('./avatars/' + filePath));
}

//downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")
//https://avatars2.githubusercontent.com/u/2741?v=3&s=466
//kvirani
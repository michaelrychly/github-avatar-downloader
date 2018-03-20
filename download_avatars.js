var request = require('request');
var fs = require('fs');
var token = require('./secrets.js');
var owner = process.argv[2];
var repo = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(owner, repo, cb) {
  if (!owner) {
    console.log("Please provide an owner!");
  } else if (!repo){
    console.log("Please provide a repository!");
  } else{
    var options = {
      url: "https://api.github.com/repos/" + owner + "/" + repo + "/contributors",
      headers: {
        'User-Agent': 'request',
        'Authorization': "token " + token.GITHUB_TOKEN
      }
    };

    request(options, function(err, res, body) {
      var obj = JSON.parse(body);
      cb(err, obj);
    });
  }
};

getRepoContributors(owner, repo, function(err, result) {
  console.log("Errors:", err);

  if (!fs.exists('avatars')){
    fs.mkdir('avatars',function(err){
      console.log("Directory created successfully!");
    });
  };

  downloadImageByURL(repo, owner);
});

function downloadImageByURL(url, filePath) {

  request.get(url + filePath)               // Note 1
       .on('error', function (err) {                                   // Note 2
         throw err;
       })
       .pipe(fs.createWriteStream('./avatars/' + filePath));
}

//downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")
//https://avatars2.githubusercontent.com/u/2741?v=3&s=466
//kvirani
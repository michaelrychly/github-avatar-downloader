var request = require('request');
var fs = require('fs');
var token = require('./secrets.js');
console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
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

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);

  if (!fs.exists('avatars')){
    fs.mkdir('avatars',function(err){
      console.log("Directory created successfully!");
    });
  };

  for(var contributor in result){
    downloadImageByURL(result[contributor].avatar_url, result[contributor].login);
  }
});

function downloadImageByURL(url, filePath) {

  request.get(url + filePath)               // Note 1
       .on('error', function (err) {                                   // Note 2
         throw err;
       })
       .pipe(fs.createWriteStream('./avatars/' + filePath));
}

//downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")
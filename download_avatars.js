var request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');
var token = require('./secrets.js');

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
  for(var contributor in result){
    console.log("Result:", result[contributor].avatar_url);
  }
});
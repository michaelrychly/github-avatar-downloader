var request = require('request');

//main function retrieve repository contributors
module.exports = {
getRepoContributors: function(owner, repo, cb) {
  //check for mandatory command line arguments owner and repository
  //if they are provided continue with retrieving the avatar
  if (owner === undefined) {
    console.log("Please provide an owner!");
  } else if (repo === undefined){
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
      request(options, (err, res, body) => {
        var obj = JSON.parse(body);

        if (obj.message === 'Bad credentials') {
          console.log("The GITHUB_TOKEN provided is not correct. ");
        } else {
          cb(err, obj);
        }
      });
    }
  }
},
getStarred: function(owner, cb) {
  //check for mandatory command line arguments owner and repository
  //if they are provided continue with retrieving the avatar
  if (owner === undefined) {
    console.log("Please provide an owner!");
  } else {
    if (process.env.GITHUB_TOKEN === undefined) {
      console.log("The .env file has not been created or filled with the correct informtion. ");
    } else {
      //http header
      var options = {
        url: "https://api.github.com/users/" + owner + "/starred",
        headers: {
          'User-Agent': 'request',
          'Authorization': "token " + process.env.GITHUB_TOKEN
        }
      };

      //http request with callback function parsing the result
      request(options, (err, res, body) => {
        var obj = JSON.parse(body);

        if (obj.message === 'Bad credentials') {
          console.log("The GITHUB_TOKEN provided is not correct. ");
        } else {
          cb(err, obj);
        }
      });
    }
  }
}
};
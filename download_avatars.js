require('dotenv').config();
var request = require('request');
var repository = require('./helperfunction.js');
var fs = require('fs');
var owner = process.argv[2];
var repo = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

//retrieve the contributors
repository.getRepoContributors(owner, repo, (err, result) => {
  if (result.length === undefined) {
    console.log("The owner or repository does not exist. ");
  } else {
    //check if the folder avatars exists
    fs.exists('./avatars', (exists) => {
      //if it does not exist create the folder
      if(!exists) {
        fs.mkdir('avatars', (err) => {
          console.log("Directory created successfully!");
        });
      }
    });

    //download the image; adjust i < 10 if all shall be downloaded
    for (var i = 0; i < result.length && i < 10; i++) {
      console.log("in loop: ", result[i]);
      downloadImageByURL(result[i].avatar_url, result[i].login);
    }
  }
});

//download image function taking url and path as argument
downloadImageByURL = (url, filePath) => {
  request.get(url)
       .on('error', (err) => {
         throw err;
       })
       //write the image to the folder
       .pipe(fs.createWriteStream('./avatars/' + filePath));
}

//downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")
//https://avatars2.githubusercontent.com/u/2741?v=3&s=466
//kvirani
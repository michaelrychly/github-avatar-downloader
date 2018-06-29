require('dotenv').config();
var request = require('request');
var repository = require('./helperfunction.js');
var owner = process.argv[2];
var repo = process.argv[3];

//retrieve the contributors
repository.getRepoContributors(owner, repo, (err, repoResult) => {
  if (repoResult.length === undefined) {
    console.log("The owner or repository does not exist. ");
  } else {
    let allStarred = [];
    //adjust i < 10 if all shall be requested i < repoResult.length &&
    for (let i = 0; i < repoResult.length && i < 10; i++) {
      //retrieve the starred repos
      repository.getStarred(repoResult[i].login, (err, starrResult) => {
        if (starrResult.length === undefined) {
          console.log("No starred repository. ");
        } else {
          //starrResult.length
          for (let j = 0; j < starrResult.length; j++) {
            //split the owner and repository name
            let ownerAndRepo = starrResult[j].full_name.split('/');
            //put them into an object
            let starred = {
              owner: ownerAndRepo[0],
              repo: ownerAndRepo[1],
              count: 0
            }
            //if repos has been added increase count
            let addedAlready = false;
            for (k = 0; k < allStarred.length; k++){
              if (allStarred[k].repo === ownerAndRepo[1]) {
                addedAlready = true;
                allStarred[k].count++;
                break;
              }
            }
            if (!addedAlready) {
              allStarred.push(starred);
            }
          }
          console.log("after all: ", allStarred);
        }
      })
    }
  }
});


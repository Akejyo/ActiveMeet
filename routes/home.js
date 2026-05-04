import express from 'express';
const router = express.Router();

import { getAllPosts } from '../data/posts.js';
import {findAuthor, checkSport, checkSearchText} from "../helpers.js"

//TODO: Filter on default get for user interests and following list

router.route('/').get(async (req, res) => {
  if (!req.session.user){
    res.redirect('/profile/login')
  } else {
    try{
      let us = {
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName,
        city: req.session.user.city,
        state: req.session.user.state,
        age: req.session.user.age,
        gender: req.session.user.gender,
        skill: req.session.user.skill,
        bio: req.session.user.bio,
        interests: req.session.user.sportsInterests,
        followers: req.session.user.followerNumber,
        following: req.session.user.followingNumber,
        badges: [] //Change later when we have badges implemented
      }
      let posts1 = await getAllPosts()
      let posts2 = []
      for (let a of posts1){
        let c = await findAuthor(a.authorId)
        let b = {
          id: a._id.toString(),
          sport: a.sport,
          title: a.title,
          author: c,
          location: a.location,
          date: a.eventDateTime.toLocaleDateString(),
          time: a.eventDateTime.toLocaleTimeString(),
          skill: a.skillLevelRestriction,
          ageRange: `${a.ageRestriction.min}-${a.ageRestriction.max}`,
          gender: a.genderRestriction,
          description: a.description,
          likes: a.likedBy.length,
          dislikes: a.dislikedBy.length,
          comments: a.comments.length
        }
        posts2.push(b)
      }
      //filter out posts based on user TODO (blocked users)
      //sort posts2 based on user interests TODO
      //sort posts2 based on following list TODO
      res.render('home', {
        title: 'Home',
        user: us,
        posts: posts2,
        logedIn: true
      })
    }catch(e){
      res.status(400).json({ error: e });
    }
  }
})
.post(async (req, res) => {
  if (!req.session.user){
    res.redirect('/profile/login')
  } else {
    // TODO: Add functionality for the filter button
    let { searchText, sport } = req.body;
    let message = []
    let error = false
    try{
      if (sport !== "All Sports") {
        sport = checkSport(sport);
      }
    }catch(e){
      error = true
      message.push(e)
    }
    try{
      searchText = checkSearchText(searchText); //remember xss
    }catch(e){
      error = true
      message.push(e)
    }
    let us = {
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName,
        city: req.session.user.city,
        state: req.session.user.state,
        age: req.session.user.age,
        gender: req.session.user.gender,
        skill: req.session.user.skill,
        bio: req.session.user.bio,
        interests: req.session.user.sportsInterests,
        followers: req.session.user.followerNumber,
        following: req.session.user.followingNumber,
        badges: [] //Change later when we have badges implemented
      }
    if (error) {
      return res.status(400).render('home', {
        title: 'Home',
        user: us,
        posts: [],
        logedIn: true,
        error: true,
        message: message,
        prev: searchText,
        isBasketball: (sport === "basketball"),
        isSoccer: (sport === "soccer"),
        isTennis: (sport === "tennis"),
        isBaseball: (sport === "baseball"),
        isVolleyball: (sport === "volleyball"),
        isFootball: (sport === "football"),
        isHockey: (sport === "hockey"),
        isGolf: (sport === "golf"),
        isSwimming: (sport === "swimming"),
        isRunning: (sport === "running"),
        isBadminton: (sport === "badminton"),
        isBowling: (sport === "bowling"),
        isArchery: (sport === "archery"),
        isCycling: (sport === "cycling"),
        isBoxing: (sport === "boxing"),
        isCricket: (sport === "cricket"),
        isDarts: (sport === "darts"),
        isGymnastics: (sport === "gymnastics"),
        isGym: (sport === "gym"),
        isHiking: (sport === "hiking")
      });
    }
    try{
      let posts1 = await getAllPosts()
      let posts2 = []
      for (let a of posts1){
        let c = await findAuthor(a.authorId)
        let b = {
          id: a._id.toString(),
          sport: a.sport,
          title: a.title,
          author: c,
          location: a.location,
          date: a.eventDateTime.toLocaleDateString(),
          time: a.eventDateTime.toLocaleTimeString(),
          skill: a.skillLevelRestriction,
          ageRange: `${a.ageRestriction.min}-${a.ageRestriction.max}`,
          gender: a.genderRestriction,
          description: a.description,
          likes: a.likedBy.length,
          dislikes: a.dislikedBy.length,
          comments: a.comments.length
        }
        if (searchText && !b.title.toLowerCase().includes(searchText.toLowerCase())) {
          continue;
        }
        if (sport !== "All Sports" && b.sport !== sport) {
          continue;
        }
        posts2.push(b)
      }
      res.render('home', {
        title: 'Home',
        user: us,
        posts: posts2,
        logedIn: true,
        prev: searchText,
        isBasketball: (sport === "basketball"),
        isSoccer: (sport === "soccer"),
        isTennis: (sport === "tennis"),
        isBaseball: (sport === "baseball"),
        isVolleyball: (sport === "volleyball"),
        isFootball: (sport === "football"),
        isHockey: (sport === "hockey"),
        isGolf: (sport === "golf"),
        isSwimming: (sport === "swimming"),
        isRunning: (sport === "running"),
        isBadminton: (sport === "badminton"),
        isBowling: (sport === "bowling"),
        isArchery: (sport === "archery"),
        isCycling: (sport === "cycling"),
        isBoxing: (sport === "boxing"),
        isCricket: (sport === "cricket"),
        isDarts: (sport === "darts"),
        isGymnastics: (sport === "gymnastics"),
        isGym: (sport === "gym"),
        isHiking: (sport === "hiking")
      })
    } catch(e){
      return res.status(400).render('home', {
        title: 'Home',
        user: us,
        posts: [],
        logedIn: true,
        error: true,
        message: e,
        prev: searchText,
        isBasketball: (sport === "basketball"),
        isSoccer: (sport === "soccer"),
        isTennis: (sport === "tennis"),
        isBaseball: (sport === "baseball"),
        isVolleyball: (sport === "volleyball"),
        isFootball: (sport === "football"),
        isHockey: (sport === "hockey"),
        isGolf: (sport === "golf"),
        isSwimming: (sport === "swimming"),
        isRunning: (sport === "running"),
        isBadminton: (sport === "badminton"),
        isBowling: (sport === "bowling"),
        isArchery: (sport === "archery"),
        isCycling: (sport === "cycling"),
        isBoxing: (sport === "boxing"),
        isCricket: (sport === "cricket"),
        isDarts: (sport === "darts"),
        isGymnastics: (sport === "gymnastics"),
        isGym: (sport === "gym"),
        isHiking: (sport === "hiking")
      });
    }
  }
});

export default router;
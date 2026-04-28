import express from 'express';
const router = express.Router();

import { sampleUser, samplePosts } from './sampleData.js';
import { findAuthor, getAllPosts } from '../data/posts.js';

router.get('/', async (req, res) => {
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
});

export default router;
import express from 'express';
const router = express.Router();

//* Temporary data
import { posts } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { sampleUser, samplePosts } from './sampleData.js';
import { checkEmailFieldsOnly, checkPassword } from '../helpers.js';
import { authenticateUser } from '../data/users.js';

router.route('/')
.get(async (req, res) => {
  if(!req.session.user) {
    res.redirect('/profile/login')
  }else{
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
    let pos = []
    let postIds = req.session.user.createdPostIds
    try{
      let posts1 = await posts()
      for(let i = 0; i < postIds.length; i++){
        let p = await posts1.findOne({_id: new ObjectId(postIds[i])})
        if(p){
          p.eventDateTime = p.eventDateTime.toString()
          pos.push(p)
        }
      }
      res.render('profile/profile', {
        title: 'Profile',
        user: us,
        posts: pos,
        logedIn: true
      });
    }catch(e){
      res.status(400).json({ error: e });
    }
  }
});

router.get('/edit', (req, res) => { //set logedIn to true if user is logged in, false otherwise
  //TODO
  res.render('profile/profileEdit', {
    title: 'Edit Profile',
    user: sampleUser,
    isBeginner: sampleUser.skill === 'Beginner',
    isIntermediate: sampleUser.skill === 'Intermediate',
    isAdvanced: sampleUser.skill === 'Advanced'
  });
});

// login and register
router.route('/login')
.get(async (req, res) => {
  if(req.session.user) {
    res.redirect('/profile')
  } else{
    res.render('login', { title: 'Login' });
  }
})
.post(async (req, res) => { //TODO xss protection and check session
  let { email, password } = req.body
  let message = []
  let error = false
  try{
    email = checkEmailFieldsOnly(email)
  }catch(e){
    message.push(e)
    error = true
  }
  try{
    password = checkPassword(password)
  } catch(e){
    message.push(e)
    error = true
  }
  let prev = {
    email: email,
    password: password
  }
  if(error){
    return res.status(400).render('login', { title: 'Login', error: true, message: message.join('\n'), prev: prev})
  } else{
    try{
      let res2 = await authenticateUser(email, password)
      if (!(typeof res2 == 'object')) throw 'Something went wrong with authentication, possible internal server error'
      req.session.user = {
        _id: res2._id.toString(),
        firstName: res2.firstName,
        lastName: res2.lastName,
        email: res2.email,
        city: res2.city,
        state: res2.state,
        age: res2.age,
        gender: res2.gender,
        bio: res2.bio,
        sportsInterests: res2.sportsInterests,
        followerNumber: res2.followerIds.length,
        followerIds: res2.followerIds,
        followingNumber: res2.followingIds.length,
        followingIds: res2.followingIds,
        createdPostIds: res2.createdPostIds,
        joinedPostIds: res2.joinedPostIds,
        blockedUserIds: res2.blockedUserIds,
        visibility: res2.visibility,
        skill: res2.skill
      }
      return res.redirect('/profile')
    }catch(e){
      return res.status(400).render('login', { title: 'Login', error: true, message: e, prev: prev})
    }
  }
});

router.route('/register')
.get(async (req, res) => {
  if (req.session.user) {
    res.redirect('/profile')
  } else {
    res.render('register', { title: 'Register' });
  }
})
.post(async (req, res) => { //xss for all and check session
  //TODO
  //redirect to set interests page
});

router.get('/interest-setup', (req, res) => {
  //TODO
  res.render('interestSetup', { title: 'Interest Setup' }); //change for remaining sports
});

router.get('/logout', (req, res) => {
  if(!req.session.user) {
    res.redirect('/profile/login')
  }else{
    delete req.session.user
    res.redirect('/profile/login')
  }
});

export default router;
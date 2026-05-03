import express from 'express';
const router = express.Router();

import { posts } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
//* Temporary data
import { sampleUser, samplePosts } from './sampleData.js';
import { checkEmailFieldsOnly, checkFirstName, checkLastName, checkCity, checkState, 
  checkAge, checkGender, checkEmail, checkSkillLevel, checkPassword, checkVisibility, checkBio } from '../helpers.js';
import { authenticateUser } from '../data/users.js';
import { createUser, editSportInterests, editProfile } from '../data/users.js';

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

router.route('/edit')
.get((req, res) => {
  if(!req.session.user) {
    res.redirect('/profile/login')
  }else{
    
    res.render('profile/profileEdit', {
      title: 'Edit Profile',
      user: req.session.user,
      isBeginner: (req.session.user.skill === 'beginner'),
      isIntermediate: (req.session.user.skill === 'intermediate'),
      isAdvanced: (req.session.user.skill === 'advanced'),
      isPublic: (req.session.user.visibility === 'public'),
      isPrivate: (req.session.user.visibility === 'private'),
      logedIn: true
    });
  }
})
.post(async (req, res) => {
  if(!req.session.user) {
    res.redirect('/profile/login')
  }else{
    let { firstName, lastName, city, state, bio, skill, visibility } = req.body;
    let message = [];
    let error = false;
    try{
      firstName = checkFirstName(firstName);
    }catch(e){
      message.push(e);
      error = true;
    }
    try{
      lastName = checkLastName(lastName);
    }catch(e){
      message.push(e);
      error = true;
    }
    try{
      city = checkCity(city);
    }catch(e){
      message.push(e);
      error = true;
    }
    try{
      state = checkState(state);
    }catch(e){
      message.push(e);
      error = true;
    }
    try{
      bio = checkBio(bio);
    }catch(e){
      message.push(e);
      error = true;
    }
    try{
      skill = checkSkillLevel(skill);
    }catch(e){
      message.push(e);
      error = true;
    }
    try{
      visibility = checkVisibility(visibility);
    }catch(e){
      message.push(e);
      error = true;
    }
    if(error){
      let prev = {
        firstName: firstName,
        lastName: lastName,
        city: city,
        state: state,
        bio: bio,
        skill: skill,
        visibility: visibility
      }
      return res.status(400).render('profile/profileEdit', { title: 'Edit Profile',
        user: prev, 
        isBeginner: (prev.skill === 'beginner'), //WRONG change later
        isIntermediate: (prev.skill === 'intermediate'),
        isAdvanced: (prev.skill === 'advanced'),
        isPublic: (prev.visibility === 'public'),
        isPrivate: (prev.visibility === 'private'),
        logedIn: true,
        error: true, message: message.join(' AND ')});
    }else{
      try{
        let res2 = await editProfile(req.session.user._id, firstName, lastName, city, state, bio, skill, visibility)
        if (!res2) throw 'Could not update profile'
        delete req.session.user
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
        return res.status(400).render('profile/profileEdit', { title: 'Edit Profile',
          user: req.session.user,
          isBeginner: (req.session.user.skill === 'beginner'),
          isIntermediate: (req.session.user.skill === 'intermediate'),
          isAdvanced: (req.session.user.skill === 'advanced'),
          isPublic: (req.session.user.visibility === 'public'),
          isPrivate: (req.session.user.visibility === 'private'),
          logedIn: true,
          error: true, message: e });
      }
    }
  }
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
  if (req.session.user) {
    res.redirect('/profile')
  } else {  //Missing: bio, visibility?
    let { firstName, lastName, email, password, age, city, state, gender, skill } = req.body
    let message = []
    let error = false
    try{
      firstName = checkFirstName(firstName)
    }catch(e){
      message.push(e)
      error = true
    }
    try{
      lastName = checkLastName(lastName)
    }catch(e){
      message.push(e)
      error = true
    }
    try{
      email = await checkEmail(email)
    }catch(e){
      message.push(e)
      error = true
    }
    try{
      password = checkPassword(password)
    }catch(e){
      message.push(e)
      error = true
    }
    try{
      age = checkAge(age)
    }catch(e){
      message.push(e)
      error = true
    }
    try{
      city = checkCity(city)
    }catch(e){
      message.push(e)
      error = true
    }
    try{
      state = checkState(state)
    }catch(e){
      message.push(e)
      error = true
    }
    try{
      gender = checkGender(gender)
    }catch(e){
      message.push(e)
      error = true
    }
    try{
      skill = checkSkillLevel(skill)
    }catch(e){
      message.push(e)
      error = true
    }
    let prev = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      age: age,
      city: city,
      state: state,
      m: (gender === 'male'),
      f: (gender === 'female'),
      o: (gender === 'other'),
      b: (skill === 'beginner'),
      i: (skill === 'intermediate'),
      a: (skill === 'advanced')
    }
    if(error){
      return res.status(400).render('register', { title: 'Register', error: true, message: message.join(' AND '), prev: prev})
    }else{
      try{
        let res2 = await createUser(firstName, lastName, email, city, state, age, gender, "Please add a bio and sport interests", [], password, "public", skill)
        if (!(typeof res2 == 'object')) throw 'Something went wrong with registration, possible internal server error'
        res.redirect('/profile/login')
      }catch(e){
        return res.status(400).render('register', { title: 'Register', error: true, message: e, prev: prev})
      }
    }
  }
});

router.route('/interest-setup')
.get((req, res) => {
  if (!req.session.user) {
    res.redirect('/profile/login')
  } else {
    let interests = {
      basketball: req.session.user.sportsInterests.includes('basketball'),
      soccer: req.session.user.sportsInterests.includes('soccer'),
      tennis: req.session.user.sportsInterests.includes('tennis'),
      baseball: req.session.user.sportsInterests.includes('baseball'),
      volleyball: req.session.user.sportsInterests.includes('volleyball'),
      football: req.session.user.sportsInterests.includes('football'),
      hockey: req.session.user.sportsInterests.includes('hockey'),
      golf: req.session.user.sportsInterests.includes('golf'),
      swimming: req.session.user.sportsInterests.includes('swimming'),
      running: req.session.user.sportsInterests.includes('running'),
      badminton: req.session.user.sportsInterests.includes('badminton'),
      bowling: req.session.user.sportsInterests.includes('bowling'),
      archery: req.session.user.sportsInterests.includes('archery'),
      cycling: req.session.user.sportsInterests.includes('cycling'),
      boxing: req.session.user.sportsInterests.includes('boxing'),
      cricket: req.session.user.sportsInterests.includes('cricket'),
      darts: req.session.user.sportsInterests.includes('darts'),
      gymnastics: req.session.user.sportsInterests.includes('gymnastics'),
      gym: req.session.user.sportsInterests.includes('gym'),
      hiking: req.session.user.sportsInterests.includes('hiking')
    }
    res.render('interestSetup', { title: 'Interest Setup', interests: interests, logedIn: true });
  }
})
.post(async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/profile/login')
  } else {
    let sportsInterests = []
    for (let key in req.body) {
      if (req.body[key]){
        sportsInterests.push(key)
      }
    }
    req.session.user.sportsInterests = sportsInterests
    let interests = {
      basketball: req.session.user.sportsInterests.includes('basketball'),
      soccer: req.session.user.sportsInterests.includes('soccer'),
      tennis: req.session.user.sportsInterests.includes('tennis'),
      baseball: req.session.user.sportsInterests.includes('baseball'),
      volleyball: req.session.user.sportsInterests.includes('volleyball'),
      football: req.session.user.sportsInterests.includes('football'),
      hockey: req.session.user.sportsInterests.includes('hockey'),
      golf: req.session.user.sportsInterests.includes('golf'),
      swimming: req.session.user.sportsInterests.includes('swimming'),
      running: req.session.user.sportsInterests.includes('running'),
      badminton: req.session.user.sportsInterests.includes('badminton'),
      bowling: req.session.user.sportsInterests.includes('bowling'),
      archery: req.session.user.sportsInterests.includes('archery'),
      cycling: req.session.user.sportsInterests.includes('cycling'),
      boxing: req.session.user.sportsInterests.includes('boxing'),
      cricket: req.session.user.sportsInterests.includes('cricket'),
      darts: req.session.user.sportsInterests.includes('darts'),
      gymnastics: req.session.user.sportsInterests.includes('gymnastics'),
      gym: req.session.user.sportsInterests.includes('gym'),
      hiking: req.session.user.sportsInterests.includes('hiking')
    }
    try{
      let res2 = await editSportInterests(req.session.user._id, sportsInterests)
      if (res2 !== true) throw 'Something went wrong with updating interests, possible internal server error'
      res.redirect('/profile')
    } catch (e) {
      res.status(400).render('interestSetup', { title: 'Interest Setup', error: true, message: e, interests: interests, logedIn: true })
    }
  }
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
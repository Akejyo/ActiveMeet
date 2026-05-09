import express from 'express'
const router = express.Router()

import { posts, users } from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb'
import {
  checkEmailFieldsOnly,
  checkFirstName,
  checkLastName,
  checkCity,
  checkState,
  checkAge,
  checkGender,
  checkEmail,
  checkSkillLevel,
  checkPassword,
  checkVisibility,
  checkBio,
  sanitize,
} from '../helpers.js'
import { authenticateUser } from '../data/users.js'
import { createUser, editSportInterests, editProfile } from '../data/users.js'

router.route('/').get(async (req, res) => {
  if (!req.session.user) {
    res.redirect('/profile/login')
  } else {
    let us = {
      firstName: sanitize(req.session.user.firstName),
      lastName: sanitize(req.session.user.lastName),
      city: sanitize(req.session.user.city),
      state: sanitize(req.session.user.state),
      age: sanitize(req.session.user.age),
      gender: sanitize(req.session.user.gender),
      skill: sanitize(req.session.user.skill),
      bio: sanitize(req.session.user.bio),
      interests: sanitize(req.session.user.sportsInterests),
      followers: sanitize(req.session.user.followerNumber),
      following: sanitize(req.session.user.followingNumber),
      badges: [], //Change later when we have badges implemented
    }
    let pos = []
    let postIds = req.session.user.createdPostIds
    try {
      let posts1 = await posts()
      for (let i = 0; i < postIds.length; i++) {
        let p = await posts1.findOne({ _id: new ObjectId(postIds[i]) })
        if (p) {
          // p.eventDateTime = p.eventDateTime.toString()
          p.eventDateTime = `${p.eventDateTime.toLocaleDateString()} ${p.eventDateTime.toLocaleTimeString()}`
          pos.push(p)
        }
      }
      let joinedPosts = []
      let joinedPostIds = req.session.user.joinedPostIds
      for (let i = 0; i < joinedPostIds.length; i++) {
        let p = await posts1.findOne({ _id: new ObjectId(joinedPostIds[i]) })
        if (p) {
          // p.eventDateTime = p.eventDateTime.toString()
          p.eventDateTime = `${p.eventDateTime.toLocaleDateString()} ${p.eventDateTime.toLocaleTimeString()}`
          joinedPosts.push(p)
        }
      }
      res.render('profile/profile', {
        title: 'Profile',
        user: us,
        posts: pos,
        joinedPosts: joinedPosts,
        logedIn: true,
      })
    } catch (e) {
      res.status(400).json({ error: e })
    }
  }
})

router
  .route('/edit')
  .get((req, res) => {
    if (!req.session.user) {
      res.redirect('/profile/login')
    } else {
      res.render('profile/profileEdit', {
        title: 'Edit Profile',
        user: req.session.user,
        isBeginner: sanitize(req.session.user.skill) === 'beginner',
        isIntermediate: sanitize(req.session.user.skill) === 'intermediate',
        isAdvanced: sanitize(req.session.user.skill) === 'advanced',
        isPublic: sanitize(req.session.user.visibility) === 'public',
        isPrivate: sanitize(req.session.user.visibility) === 'private',
        logedIn: true,
      })
    }
  })
  .post(async (req, res) => {
    if (!req.session.user) {
      res.redirect('/profile/login')
    } else {
      let { firstName, lastName, city, state, bio, skill, visibility } =
        req.body
      firstName = sanitize(firstName)
      lastName = sanitize(lastName)
      city = sanitize(city)
      state = sanitize(state)
      bio = sanitize(bio)
      skill = sanitize(skill)
      visibility = sanitize(visibility)

      let message = []
      let error = false
      try {
        firstName = checkFirstName(firstName)
      } catch (e) {
        message.push(e)
        error = true
      }
      try {
        lastName = checkLastName(lastName)
      } catch (e) {
        message.push(e)
        error = true
      }
      try {
        city = checkCity(city)
      } catch (e) {
        message.push(e)
        error = true
      }
      try {
        state = checkState(state)
      } catch (e) {
        message.push(e)
        error = true
      }
      try {
        bio = checkBio(bio)
      } catch (e) {
        message.push(e)
        error = true
      }
      try {
        skill = checkSkillLevel(skill)
      } catch (e) {
        message.push(e)
        error = true
      }
      try {
        visibility = checkVisibility(visibility)
      } catch (e) {
        message.push(e)
        error = true
      }
      if (error) {
        let prev = {
          firstName: firstName,
          lastName: lastName,
          city: city,
          state: state,
          bio: bio,
          skill: skill,
          visibility: visibility,
        }
        return res.status(400).render('profile/profileEdit', {
          title: 'Edit Profile',
          user: prev,
          isBeginner: prev.skill === 'beginner',
          isIntermediate: prev.skill === 'intermediate',
          isAdvanced: prev.skill === 'advanced',
          isPublic: prev.visibility === 'public',
          isPrivate: prev.visibility === 'private',
          logedIn: true,
          error: true,
          message: message.join(' AND '),
        })
      } else {
        try {
          let res2 = await editProfile(
            req.session.user._id,
            firstName,
            lastName,
            city,
            state,
            bio,
            skill,
            visibility
          )
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
            skill: res2.skill,
          }
          return res.redirect('/profile')
        } catch (e) {
          return res.status(400).render('profile/profileEdit', {
            title: 'Edit Profile',
            user: req.session.user,
            isBeginner: sanitize(req.session.user.skill) === 'beginner',
            isIntermediate: sanitize(req.session.user.skill) === 'intermediate',
            isAdvanced: sanitize(req.session.user.skill) === 'advanced',
            isPublic: sanitize(req.session.user.visibility) === 'public',
            isPrivate: sanitize(req.session.user.visibility) === 'private',
            logedIn: true,
            error: true,
            message: e,
          })
        }
      }
    }
  })

// login and register
router
  .route('/login')
  .get(async (req, res) => {
    if (req.session.user) {
      res.redirect('/profile')
    } else {
      res.render('login', { title: 'Login' })
    }
  })
  .post(async (req, res) => {
    //TODO xss protection and check session
    let { email, password } = req.body
    email = sanitize(email)
    let message = []
    let error = false
    try {
      email = checkEmailFieldsOnly(email)
    } catch (e) {
      message.push(e)
      error = true
    }
    try {
      password = checkPassword(password)
    } catch (e) {
      message.push(e)
      error = true
    }
    let prev = {
      email: email,
    }
    if (error) {
      return res.status(400).render('login', {
        title: 'Login',
        error: true,
        message: message.join('\n'),
        prev: prev,
      })
    } else {
      try {
        let res2 = await authenticateUser(email, password)
        if (!(typeof res2 == 'object'))
          throw 'Something went wrong with authentication, possible internal server error'
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
          skill: res2.skill,
        }
        return res.redirect('/profile')
      } catch (e) {
        return res.status(400).render('login', {
          title: 'Login',
          error: true,
          message: e,
          prev: prev,
        })
      }
    }
  })

router
  .route('/register')
  .get(async (req, res) => {
    if (req.session.user) {
      res.redirect('/profile')
    } else {
      res.render('register', { title: 'Register' })
    }
  })
  .post(async (req, res) => {
    //xss for all and check session
    if (req.session.user) {
      res.redirect('/profile')
    } else {
      let {
        firstName,
        lastName,
        email,
        password,
        age,
        city,
        state,
        gender,
        skill,
      } = req.body
      firstName = sanitize(firstName)
      lastName = sanitize(lastName)
      email = sanitize(email)
      age = sanitize(age)
      city = sanitize(city)
      state = sanitize(state)
      gender = sanitize(gender)
      skill = sanitize(skill)

      let message = []
      let error = false
      try {
        firstName = checkFirstName(firstName)
      } catch (e) {
        message.push(e)
        error = true
      }
      try {
        lastName = checkLastName(lastName)
      } catch (e) {
        message.push(e)
        error = true
      }
      try {
        email = await checkEmail(email)
      } catch (e) {
        message.push(e)
        error = true
      }
      try {
        password = checkPassword(password)
      } catch (e) {
        message.push(e)
        error = true
      }
      try {
        age = checkAge(age)
      } catch (e) {
        message.push(e)
        error = true
      }
      try {
        city = checkCity(city)
      } catch (e) {
        message.push(e)
        error = true
      }
      try {
        state = checkState(state)
      } catch (e) {
        message.push(e)
        error = true
      }
      try {
        gender = checkGender(gender)
      } catch (e) {
        message.push(e)
        error = true
      }
      try {
        skill = checkSkillLevel(skill)
      } catch (e) {
        message.push(e)
        error = true
      }
      let prev = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        age: age,
        city: city,
        state: state,
        m: gender === 'male',
        f: gender === 'female',
        o: gender === 'other',
        b: skill === 'beginner',
        i: skill === 'intermediate',
        a: skill === 'advanced',
      }
      if (error) {
        return res.status(400).render('register', {
          title: 'Register',
          error: true,
          message: message.join(' AND '),
          prev: prev,
        })
      } else {
        try {
          let res2 = await createUser(
            firstName,
            lastName,
            email,
            city,
            state,
            age,
            gender,
            'Please add a bio and sport interests',
            [],
            password,
            'public',
            skill
          )
          if (!(typeof res2 == 'object'))
            throw 'Something went wrong with registration, possible internal server error'
          res.redirect('/profile/login')
        } catch (e) {
          return res.status(400).render('register', {
            title: 'Register',
            error: true,
            message: e,
            prev: prev,
          })
        }
      }
    }
  })

router
  .route('/interest-setup')
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
        hiking: req.session.user.sportsInterests.includes('hiking'),
      }
      res.render('interestSetup', {
        title: 'Interest Setup',
        interests: interests,
        logedIn: true,
      })
    }
  })
  .post(async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/profile/login')
    } else {
      let sportsInterests = []
      for (let key in req.body) {
        if (req.body[key]) {
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
        hiking: req.session.user.sportsInterests.includes('hiking'),
      }
      try {
        let res2 = await editSportInterests(
          req.session.user._id,
          sportsInterests
        )
        if (res2 !== true)
          throw 'Something went wrong with updating interests, possible internal server error'
        res.redirect('/profile')
      } catch (e) {
        res.status(400).render('interestSetup', {
          title: 'Interest Setup',
          error: true,
          message: e,
          interests: interests,
          logedIn: true,
        })
      }
    }
  })

router.get('/logout', (req, res) => {
  if (!req.session.user) {
    res.redirect('/profile/login')
  } else {
    delete req.session.user
    res.redirect('/profile/login')
  }
})

router.route('/:id').get(async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/profile/login')
  } else {
    try {
      let users1 = await users()
      let user = await users1.findOne({ _id: new ObjectId(req.params.id) })
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      if (user._id.toString() === req.session.user._id.toString()) {
        return res.redirect('/profile')
      } else {
        let following = false
        if (
          user.followerIds &&
          user.followerIds.includes(req.session.user._id)
        ) {
          following = true
        }
        let blocked = false
        if (req.session.user.blockedUserIds.includes(req.params.id)) {
          blocked = true
        }
        if (user.visibility === 'private') {
          return res.status(200).render('profile/publicProfile', {
            title: 'Public Profile',
            logedIn: true,
            public: false,
            user: user,
            following: following,
            blocked: blocked
          })
        } else {
          let postsJoined = []
          if (user.joinedPostIds) {
            let posts1 = await posts()
            for (let i = 0; i < user.joinedPostIds.length; i++) {
              let p = await posts1.findOne({
                _id: new ObjectId(user.joinedPostIds[i]),
              })
              if (p) {
                p.eventDateTime = `${p.eventDateTime.toLocaleDateString()} ${p.eventDateTime.toLocaleTimeString()}`
                postsJoined.push(p)
              }
            }
          }
          let posts2 = []
          if (user.createdPostIds) {
            let posts1 = await posts()
            for (let i = 0; i < user.createdPostIds.length; i++) {
              let p = await posts1.findOne({
                _id: new ObjectId(user.createdPostIds[i]),
              })
              if (p) {
                p.eventDateTime = `${p.eventDateTime.toLocaleDateString()} ${p.eventDateTime.toLocaleTimeString()}`
                posts2.push(p)
              }
            }
          }
          return res.status(200).render('profile/publicProfile', {
            title: 'Public Profile',
            logedIn: true,
            public: true,
            user: user,
            following: following,
            postsJoined: postsJoined,
            posts: posts2,
            blocked: blocked
          })
        }
      }
    } catch (e) {
      res.status(400).json({ error: e })
    }
  }
})

router.route("/:id/block").post(async (req, res) => {
  if(!req.session.user) {
    return res.redirect('/profile/login')
  }
  try{
    //Add blocked user Id to blockedUserIds
    let users1 = await users()
    let update = await users1.updateOne(
      { _id: new ObjectId(req.session.user._id) },
      { $addToSet: { blockedUserIds: req.params.id } }
    )
    req.session.user.blockedUserIds.push(req.params.id)
    res.redirect(`/profile/${req.params.id}`)
  }catch(e){
    return res.status(500).json({ error: 'Failed to block user, possible internal server error' })
  }
});

router.route("/:id/unblock").post(async (req, res) => {
  if(!req.session.user) {
    return res.redirect('/profile/login')
  }
  try{
    //Remove blocked user Id from blockedUserIds
    let users1 = await users()
    let update = await users1.updateOne(
      { _id: new ObjectId(req.session.user._id) },
      { $pull: { blockedUserIds: req.params.id } }
    )
    req.session.user.blockedUserIds = req.session.user.blockedUserIds.filter((id) => id !== req.params.id)
    res.redirect(`/profile/${req.params.id}`)
  }catch(e){
    return res.status(500).json({ error: 'Failed to unblock user, possible internal server error' })
  }
});

router.route('/:id/follow').post(async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  } else {
    try {
      let users1 = await users()
      let user = await users1.findOne({ _id: new ObjectId(req.params.id) })
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      if (!user.followerIds.includes(req.session.user._id)) {
        user.followerIds.push(req.session.user._id)
        let result = await users1.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: { followerIds: user.followerIds } }
        )
        if (!result) {
          return res.status(500).json({
            error: 'Failed to update user, possible internal server error',
          })
        }
      }
      let thisuser = await users1.findOne({
        _id: new ObjectId(req.session.user._id),
      })
      if (!thisuser) {
        return res.status(404).json({ error: 'Current user not found' })
      }
      if (!thisuser.followingIds.includes(user._id.toString())) {
        thisuser.followingIds.push(user._id.toString())
        req.session.user.followingIds = thisuser.followingIds
        req.session.user.followingNumber = thisuser.followingIds.length
        let result = await users1.updateOne(
          { _id: new ObjectId(req.session.user._id) },
          { $set: { followingIds: thisuser.followingIds } }
        )
        if (!result) {
          return res.status(500).json({
            error: 'Failed to update user, possible internal server error',
          })
        }
      }
    } catch (e) {
      return res.status(500).json({ error: `An error occurred: ${e}` })
    }
  }
  res.redirect(`/profile/${req.params.id}`)
})

router.route('/:id/unfollow').post(async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    let users1 = await users()
    let user = await users1.findOne({ _id: new ObjectId(req.params.id) })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    if (user.followerIds.includes(req.session.user._id)) {
      user.followerIds = user.followerIds.filter(
        (id) => id.toString() !== req.session.user._id.toString()
      )
      let result = await users1.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { followerIds: user.followerIds } }
      )
      if (!result) {
        return res.status(500).json({
          error: 'Failed to update user, possible internal server error',
        })
      }
    }
    let thisuser = await users1.findOne({
      _id: new ObjectId(req.session.user._id),
    })
    if (!thisuser) {
      return res.status(404).json({ error: 'Current user not found' })
    }
    if (thisuser.followingIds.includes(user._id.toString())) {
      thisuser.followingIds = thisuser.followingIds.filter(
        (id) => id.toString() !== user._id.toString()
      )
      req.session.user.followingIds = thisuser.followingIds
      req.session.user.followingNumber = thisuser.followingIds.length
      let result = await users1.updateOne(
        { _id: new ObjectId(req.session.user._id) },
        { $set: { followingIds: thisuser.followingIds } }
      )
      if (!result) {
        return res.status(500).json({
          error: 'Failed to update user, possible internal server error',
        })
      }
    }
  } catch (e) {
    return res.status(500).json({ error: `An error occurred: ${e}` })
  }
  res.redirect(`/profile/${req.params.id}`)
})

export default router

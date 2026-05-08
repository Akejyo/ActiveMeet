import express from 'express';
const router = express.Router();
import { ObjectId } from 'mongodb';
import { posts, users, joinRequests } from '../config/mongoCollections.js';
import { likePost, dislikePost } from '../data/posts.js';
import { createJoinRequest } from '../data/joinRequests.js';

//TODO: Finish remaning Routes at the end

//* Temporary data
import { samplePosts } from './sampleData.js';
import { checkDateAndTime, checkLocation, checkMaxParticipants, parsAndCheckAgeRestriction, 
  checkSport, checkTitle, checkSkillLevelRestriction, checkGenderRestriction, checkDescription,
  checkComment, sanitize
} from '../helpers.js';
import e from 'express';
import { addComment, createPost, getPostById, updatePost } from '../data/posts.js';

router.route('/create').get((req, res) => {
  if (!req.session.user) {
    return res.redirect('/profile/login');
  } else {
    res.render('post/postCreate', { title: 'Create Post', logedIn: true });
  }
})
.post(async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/profile/login');
  } else {
    let { sport, title, location, date, time, maxParticipants, ageRestriction, 
      skillLevel, genderRestriction, description } = req.body;
    
    sport = sanitize(sport);
    title = sanitize(title);
    location = sanitize(location);
    date = sanitize(date);
    time = sanitize(time);
    maxParticipants = sanitize(maxParticipants);
    skillLevel = sanitize(skillLevel);
    genderRestriction = sanitize(genderRestriction);
    description = sanitize(description);
    ageRestriction = sanitize(ageRestriction);


    let message = []
    let error = false;
    try{
      sport = checkSport(sport);
    }catch(e){
      message.push(e)
      error = true;
    }
    try{
      title = checkTitle(title);
    }catch(e){
      message.push(e)
      error = true;
    }
    try{
      location = checkLocation(location);
    }catch(e){
      message.push(e)
      error = true;
    }
    let dateAndTime = undefined
    try{
      dateAndTime = new Date(`${date}T${time}`);
      dateAndTime = checkDateAndTime(dateAndTime);
    }catch(e){
      message.push(e)
      error = true;
    }
    try{
      maxParticipants = checkMaxParticipants(maxParticipants);
    } catch(e){
      message.push(e)
      error = true;
    }
    let ageRestriction2 = undefined
    try{
      ageRestriction2 = parsAndCheckAgeRestriction(ageRestriction);
    } catch(e){
      message.push(e)
      error = true;
    }
    try{
      skillLevel = checkSkillLevelRestriction(skillLevel);
    } catch(e){
      message.push(e)
      error = true;
    }
    try{
      genderRestriction = checkGenderRestriction(genderRestriction);
    } catch(e){
      message.push(e)
      error = true;
    }
    try{
      description = checkDescription(description);
    } catch(e){
      message.push(e)
      error = true;
    }
    let prev = {
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
      isHiking: (sport === "hiking"),
      title: title,
      location: location,
      date: date,
      time: time,
      maxParticipants: maxParticipants,
      ageRestriction: ageRestriction,
      isBeginner: (skillLevel === "beginner"),
      isIntermediate: (skillLevel === "intermediate"),
      isAdvanced: (skillLevel === "advanced"),
      isAllLevels: (skillLevel === "all levels"),
      isCoed: (genderRestriction === "co-ed"),
      isMaleOnly: (genderRestriction === "male only"),
      isFemaleOnly: (genderRestriction === "female only"),
      description: description
    }
    if (error) {
      return res.status(400).render('post/postCreate', { title: 'Create Post', logedIn: true, error: true,
        prev: prev, message: message.join(" AND ") });
    } else {
      try{
        let newPost = await createPost(title, req.session.user._id, sport, description,
          dateAndTime, maxParticipants, ageRestriction2, skillLevel, genderRestriction, location
        )
        req.session.user.createdPostIds.push(newPost._id);
        res.redirect(`/posts/${newPost._id}`);
      }catch(e){
        return res.status(500).render('post/postCreate', { title: 'Create Post', logedIn: true, 
          prev: prev, error: true, message: e});
      }
    }
  }
});


router.route('/:id').get(async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/profile/login');
  } else {
    const postId = req.params.id;
    try {
      let posts1 = await posts()
      let post = await posts1.findOne({ _id: new ObjectId(postId) });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      let users1 = await users();
      let user = await users1.findOne({ _id: new ObjectId(post.authorId) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      let requestUsers = [];
      let alreadyRequested = false;
      for (let i = 0; i < post.pendingRequestIds.length; i++) {
        let joinRequest1 = await joinRequests();
        let joinObj = await joinRequest1.findOne({ _id: new ObjectId(post.pendingRequestIds[i]) });
        let requestUser = await users1.findOne({ _id: new ObjectId(joinObj.requesterId) });
        if (requestUser) {
          if(joinObj.requesterId === req.session.user._id) alreadyRequested = true;
          requestUsers.push({ id: requestUser._id, name: `${requestUser.firstName} ${requestUser.lastName}` });
        }
      }
      let alreadyJoined = post.acceptedParticipantIds.includes(req.session.user._id) || alreadyRequested;
      let post2 = {
        id: post._id,
        sport: post.sport,
        title: post.title,
        author: user.firstName + ' ' + user.lastName,
        authorId: post.authorId,
        location: post.location,
        date: post.eventDateTime.toLocaleDateString(),
        time: post.eventDateTime.toLocaleTimeString(),
        skill: post.skillLevelRestriction,
        ageRange: `${post.ageRestriction.min}-${post.ageRestriction.max}`,
        gender: post.genderRestriction,
        status: post.status,
        description: post.description,
        likes: post.likedBy.length,
        accepted: post.acceptedParticipantIds,
        // hasRequests: (post.pendingRequestIds.length > 0),
        requests: requestUsers,
        dislikes: post.dislikedBy.length,
        comments: post.comments.length,
      }
      let comments = [];
      for (let i = 0; i < post.comments.length; i++) {
        let author = await users1.findOne({ _id: new ObjectId(post.comments[i].userId) });
        comments.push({
          id: post.comments[i]._id,
          author: author.firstName + ' ' + author.lastName,
          content: post.comments[i].commentText
        });
      }
      let isAuthor = post.authorId === req.session.user._id;
      res.status(200).render('post/postDetail', { title: 'Post Detail', 
        post: post2, comments: comments, isAuthor: isAuthor, alreadyJoined: alreadyJoined, logedIn: true });
    }catch(e) {
      return res.status(500).json({ error: `An error occurred: ${e}`});
    }
  }
})
.post(async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/profile/login');
  }else{
    let { comment } = req.body;
    comment = sanitize(comment);
    let message = [];
    let error = false;
    try{
      comment = checkComment(comment);
    }catch(e){
      message.push(e);
      error = true;
    }
    try{
      let posts1 = await posts();
      let post = await posts1.findOne({ _id: new ObjectId(req.params.id) });
      if (!post) throw "Post not found, possible internal error";
      let userComments = post.comments.filter(c => c.userId === req.session.user._id);
      if (userComments.length > 0) {
        let lastComment = userComments[userComments.length - 1];
        let now = new Date();
        if (now - lastComment.commentedAt < 30000) {
          throw "To avoid spam, you must wait 30 seconds between comments.";
        }
      }
    } catch(e) {
      message.push(e);
      error = true;
    }
    if (error) {
      let prev = { comment: comment };
      const postId = req.params.id;
      try {
        let posts1 = await posts()
        let post = await posts1.findOne({ _id: new ObjectId(postId) });
        if (!post) {
          return res.status(404).json({ error: 'Post not found' });
        }
        let users1 = await users();
        let user = await users1.findOne({ _id: new ObjectId(post.authorId) });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        let requestUsers = [];
        for (let i = 0; i < post.pendingRequestIds.length; i++) {
          let requestUser = await users1.findOne({ _id: new ObjectId(post.pendingRequestIds[i]) });
          if (requestUser) {
            requestUsers.push({ id: requestUser._id, name: `${requestUser.firstName} ${requestUser.lastName}` });
          }
        }
        let post2 = {
          id: post._id,
          sport: post.sport,
          title: post.title,
          author: user.firstName + ' ' + user.lastName,
          authorId: post.authorId,
          location: post.location,
          date: post.eventDateTime.toLocaleDateString(),
          time: post.eventDateTime.toLocaleTimeString(),
          skill: post.skillLevelRestriction,
          ageRange: `${post.ageRestriction.min}-${post.ageRestriction.max}`,
          gender: post.genderRestriction,
          description: post.description,
          likes: post.likedBy.length,
          accepted: post.acceptedParticipantIds,
          // hasRequests: (post.pendingRequestIds.length > 0),
          requests: requestUsers,
          dislikes: post.dislikedBy.length,
          comments: post.comments.length
        }
        let comments = [];
        for (let i = 0; i < post.comments.length; i++) {
          let author = await users1.findOne({ _id: new ObjectId(post.comments[i].userId) });
          comments.push({
            id: post.comments[i]._id,
            author: author.firstName + ' ' + author.lastName,
            content: post.comments[i].commentText
          });
        }
        let isAuthor = post.authorId === req.session.user._id;
        return res.status(400).render('post/postDetail', { title: 'Post Detail', 
          post: post2, comments: comments, isAuthor: isAuthor, logedIn: true, error: true,
          message: message.join(" AND "), prev: prev });
      }catch(e) {
        return res.status(500).json({ error: `An error occurred: ${e}`});
      }
    } else{
      try{
        let newcomment = await addComment(req.params.id, req.session.user._id, comment);
        return res.redirect(`/posts/${req.params.id}`);
      } catch(e) {
        return res.status(500).json({ error: `An error occurred: ${e}`});
      }
    }
  }
});

router.get('/:id/like', async (req, res) => {
  if(!req.session.user) return res.redirect("/profile/login");
  try{
    await likePost(req.params.id, req.session.user._id);
  } catch(e){
    // Post already liked, ignore
  }
  res.redirect(`/posts/${req.params.id}`);
});

router.get('/:id/dislike', async (req, res) => {
  if(!req.session.user) return res.redirect("/profile/login");
  try{
    await dislikePost(req.params.id, req.session.user._id);
  } catch(e){
    // Post already disliked, ignore
  }
  res.redirect(`/posts/${req.params.id}`);
});

// TODO: Add a POST route for processing a request to join a post.
router.get('/:id/join', async (req, res) => {
  if (!req.session.user) return res.redirect('/profile/login');
  try {
    await createJoinRequest(req.params.id, req.session.user._id, '');
  } catch(e) {
    
  }
  res.redirect(`/posts/${req.params.id}`);
});

router.get('/:id/accept/:userId', (req, res) => {
  // TODO: Implement the logic for accepting a request to join a post
  res.redirect(`/posts/${req.params.id}`);
});

router.get('/:id/decline/:userId', (req, res) => {
  // TODO: Implement the logic for declining a request to join a post
  res.redirect(`/posts/${req.params.id}`);
});

router.get('/:id/decline/:userId', (req, res) => {
  // TODO: Implement the logic for declining a request to join a post
  res.redirect(`/posts/${req.params.id}`);
});

// GET /posts/:id/edit
router.get('/:id/edit', async (req, res) => {
  try{
    if(!req.session.user) return res.redirect("/profile/login");
    const post = await getPostById(req.params.id);
      return res.render('post/postEdit', {
          title: 'Edit Post',
          logedin: true,
          post
      });
  } catch(e){
    return res.status(404).render("post/postEdit", {error: e.toString()});
  }
});

// POST /posts/:id/edit
router.post("/:id/edit", async (req, res) =>{
  try{
    let {
      title,
      sport,
      description,
      eventDateTime,
      maxParticipants,
      ageRestriction,
      skillLevelRestriction,
      genderRestriction,
      location,
      status
    } = req.body;
    title = sanitize(title);
    sport = sanitize(sport);
    description = sanitize(description);
    eventDateTime = sanitize(eventDateTime);
    maxParticipants = sanitize(maxParticipants);
    skillLevelRestriction = sanitize(skillLevelRestriction);
    genderRestriction = sanitize(genderRestriction);
    location = sanitize(location);
    status = sanitize(status);

    let ageRestrictionObj;
    if (typeof ageRestriction === 'string') {
      ageRestrictionObj = parsAndCheckAgeRestriction(sanitize(ageRestriction));
    } else if (ageRestriction && typeof ageRestriction === 'object' && !Array.isArray(ageRestriction)) {
      ageRestrictionObj = {
        min: Number(sanitize(ageRestriction.min)),
        max: Number(sanitize(ageRestriction.max))
      };
    }

    const updatedPost = await updatePost(
      req.params.id,
      title,
      sport,
      description,
      new Date(eventDateTime),
      Number(maxParticipants),
      ageRestrictionObj,
      skillLevelRestriction,
      genderRestriction,
      location,
      status
    );
    return res.redirect(`/posts/${updatedPost._id.toString()}`);
  } catch(e){
    return res.status(400).render("post/postEdit", {
      title: "Edit Post",
      error: e.toString(),
      post:{
        _id: req.params.id,
        ...req.body
      }
    });
  }
});


export default router;

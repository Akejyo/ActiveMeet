import express from 'express';
const router = express.Router();
import { ObjectId } from 'mongodb';
import { posts, users } from '../config/mongoCollections.js';

//TODO: For all posts routes, modify handlebars to show different things based on owner of post.

//* Temporary data
import { samplePosts } from './sampleData.js';
import { checkDateAndTime, checkLocation, checkMaxParticipants, parsAndCheckAgeRestriction, 
  checkSport, checkTitle, checkSkillLevelRestriction, checkGenderRestriction, checkDescription,
  checkComment
} from '../helpers.js';
import e from 'express';
import { addComment, createPost } from '../data/posts.js';

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
        res.redirect(`/posts/${newPost._id}`);
      }catch(e){
        return res.status(500).render('post/postCreate', { title: 'Create Post', logedIn: true, 
          prev: prev, error: true, message: e});
      }
    }
  }
});


router.route('/:id').get(async (req, res) => { //TODO post route for comments
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
        requests: requestUsers
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
        post: post2, comments: comments, isAuthor: isAuthor, logedIn: true });
    }catch(e) {
      return res.status(500).json({ error: `An error occurred: ${e}`});
    }
  }
})
.post(async (req, res) => {
  // TODO: Implement the logic for posting a comment
  if (!req.session.user) {
    return res.redirect('/profile/login');
  }else{
    let { comment } = req.body;
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
          requests: requestUsers
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

router.get('/:id/like', (req, res) => {
  // TODO: Implement the logic for liking a post
  res.redirect(`/posts/${req.params.id}`)
});

router.get('/:id/dislike', (req, res) => {
  // TODO: Implement the logic for disliking a post
  res.redirect(`/posts/${req.params.id}`)
});

// TODO: Add a POST route for processing a request to join a post.
router.get('/:id/join', (req, res) => {
  // TODO: Implement the logic for joining a post
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

router.route('/:id/edit').get(async(req, res) => { //TODO both get and post routes
    const postId = req.params.id;
    res.render('post/postEdit', { //Delete this and replace with actual logic
        title: 'Edit Post',
        post: samplePosts.find(p => p.id === parseInt(postId))
    });
})
.post((req, res) => {
    // TODO: Implement the logic for updating a post
    res.redirect(`/posts/${req.params.id}`);
});

export default router;
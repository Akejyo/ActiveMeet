import express from 'express';
const router = express.Router();
import {createPost, getPostById, getAllPosts, addComment, removeComment, updatePost, removePost, likePost, dislikePost} from "../data/posts.js";

// GET /posts
router.get("/", async (req, res) =>{
  try{
    const posts = await getAllPosts();
    return res.render("post/postsList", {
      title: "Posts",
      posts
    });
  } catch(e){
    return res.status(500).render("error", {error: e});
  }
});

// GET /posts/create
router.get('/create', (req, res) => {
  return res.render('post/postCreate', { title: 'Create Post' });
});

// POST /posts/create
router.post("/create", async (req, res) => {
  try{
    const {
      title,
      authorId,
      sport,
      description,
      eventDateTime,
      maxParticipants,
      ageRestriction,
      skillLevelRestriction,
      genderRestriction,
      location
    } = req.body;
    const newPost = await createPost(title, authorId, sport, description, new Date(eventDateTime), Number(maxParticipants), {min: Number(ageRestriction.min), max: Number(ageRestriction.max)}, skillLevelRestriction, genderRestriction, location);
    return res.redirect(`/posts/${newPost._id.toString()}`);
  } catch(e){
    return res.status(400).render("post/postCreate", {
      title: "Create Post",
      error: e.toString(),
      formData: req.body
    });
  }
});

// Get /posts/:id
router.get('/:id', async (req, res) => {
  try{
    const post = await getPostById(req.params.id);  
    return res.render('post/postDetail', {
      title: 'Post Detail',
      post,
      comments: post.comments || []
    });
  } catch(e){
    return res.status(404).render("error", {error: e.toString()});
  }

});

// GET /posts/:id/edit
router.get('/:id/edit', async (req, res) => {
  try{
    const post = await getPostById(req.params.id);
      return res.render('post/postEdit', {
          title: 'Edit Post',
          post
      });
  } catch(e){
    return res.status(404).render("error", {error: e.toString()});
  }
});

// POST /posts/:id/edit
router.post("/:id/edit", async (req, res) =>{
  try{
    const {
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
    const updatedPost = await updatePost(
      req.params.id,
      title,
      sport,
      description,
      new Date(eventDateTime),
      Number(maxParticipants),
      {
        min: Number(ageRestriction.min),
        max: Number(ageRestriction.max)
      },
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

// POST /posts/:id/delete
router.post("/:id/delete", async (req, res) =>{
  try{
    await removePost(req.params.id);
    return res.redirect("/posts");
  } catch(e){
    return res.status(400).render("error", {error: e.toString()});
  }
});

// POST /posts/:id/comments
router.post("/:id/comments", async (req, res) =>{
  try{
    const {authorId, comment} = req.body;
    await addComment(req.params.id, authorId, comment);
    return res.redirect(`/posts/${req.params.id}`);
  } catch(e){
    return res.status(400).render("error", {error: e.toString()});
  }
});

// POST /posts/:id/comments/commentId/delete
router.post("/:id/comments/:commentId/delete", async (req, res) => {
  try{
    await removeComment(req.params.id, req.params.commentId);
    return res.redirect(`/posts/${req.params.id}`);
  } catch(e){
    return res.status(400).render("error", {error: e.toString()});
  }
});

// POST /posts/:id/like
router.post("/:id/like", async (req, res) => {
  try{
    const {userId} = req.body;
    await likePost(req.params.id, userId);
    return res.redirect(`/posts/${req.params.id}`);
  } catch(e){
    return res.status(400).render("error", {error: e.toString()});
  }
});

// POST /posts/:id/dislike
router.post("/:id/dislike", async (req, res) => {
  try{
    const {userId} = req.body;
    await dislikePost(req.params.id, userId);
    return res.redirect(`/posts/${req.params.id}`);
  } catch(e){
    return res.status(400).render("error", {error: e.toString()});
  }
});

export default router;
//TODO functions to add, delete, ... from database

import { posts, users } from "../config/mongoCollections.js";
import { checkAuthorId, checkTitle, checkSport, checkDescription, checkDateAndTime,
    checkMaxParticipants, checkAgeRestrictions, checkSkillLevelRestriction, 
    checkGenderRestriction, checkLocation, checkComment, checkPostId, checkCommentId,
    checkStatusPosts
} from "../helpers.js";
import { ObjectId } from "mongodb";

export async function createPost(title, authorId, sport, description, eventDateTime, 
    maxParticipants, ageRestriction, skillLevelRestriction, genderRestriction, location){
    title = checkTitle(title);
    authorId = await checkAuthorId(authorId);
    sport = checkSport(sport);
    description = checkDescription(description);
    eventDateTime = checkDateAndTime(eventDateTime);
    maxParticipants = checkMaxParticipants(maxParticipants);
    ageRestriction = checkAgeRestrictions(ageRestriction);
    skillLevelRestriction = checkSkillLevelRestriction(skillLevelRestriction);
    genderRestriction = checkGenderRestriction(genderRestriction);
    location = checkLocation(location);
    let newPost = {
        authorId: authorId,
        sport: sport,
        title: title,
        description: description,
        eventDateTime: eventDateTime,
        createdAt: new Date(),
        maxParticipants: maxParticipants,
        acceptedParticipantIds: [],
        pendingRequestIds: [],
        ageRestriction: ageRestriction,
        skillLevelRestriction: skillLevelRestriction,
        genderRestriction: genderRestriction,
        location: location,
        comments: [],
        likedBy: [],
        dislikedBy: [],
        status: "open"
    };
    let posts1 = await posts()
    let iRes = await posts1.insertOne(newPost)
    if (!iRes.acknowledged || !iRes.insertedId) throw 'Could not add post'
    let ret = await posts1.findOne({_id: iRes.insertedId})
    let users1 = await users() //add postId to user's createdPostIds array
    let updateUser = await users1.updateOne({_id: new ObjectId(authorId)}, {$push: {createdPostIds: iRes.insertedId.toString()}})
    if (!updateUser.acknowledged || updateUser.modifiedCount === 0) throw 'Could not update user with post'
    return ret;
}
// Finds and returns post associated with postId
export async function getPostById(postId){
    postId = await checkPostId(postId);
    const postsCollection = await posts();
    const post = await postsCollection.findOne({_id: new ObjectId(postId)});
    if(post === null) throw `Error: no post found with PostId: ${postId}`;
    return post;
}
// Returns all posts (finds and returns with no conditions)
export async function getAllPosts(){
    const postsCollection = await posts();
    return await postsCollection.find({}).toArray();
}
// Create comment (Finds post by postId, pushes comment subobject with commentId and authorId)
export async function addComment(postId, authorId, comment){
    postId = await checkPostId(postId)
    authorId = await checkAuthorId(authorId)
    comment = checkComment(comment)
    let posts1 = await posts()
    let updateRes = await posts1.updateOne({_id: new ObjectId(postId)}, {$push: {comments: 
        {
            commentId: new ObjectId(), 
            userId: authorId, 
            commentText: comment, 
            commentedAt: new Date()
        }}})
    if (!updateRes.acknowledged || updateRes.modifiedCount === 0) throw 'Could not add comment'
    let ret = await posts1.findOne({_id: new ObjectId(postId)})
    return ret;
}
// Remove comment (finds post by postId, then comment under that post by commentId, and removes the comment)
export async function removeComment(postId, commentId){
    postId = await checkPostId(postId);
    commentId = await checkCommentId(commentId);
    const postsCollection = await posts();
    const update = await postsCollection.updateOne(
        {_id: new ObjectId(postId)}, 
        {
            $pull: {
                comments: {commentId: new ObjectId(commentId)}
            }
        }
    );
    if(!update.acknowledged || update.modifiedCount === 0) throw "Error: Could not remove comment";
    return await this.getPostById(postId);
}
// Update Post (finds post by postId and updates it with all inputted params)
export async function updatePost(postId, title, sport, description, eventDateTime, maxParticipants, ageRestriction, skillLevelRestriction, genderRestriction, location, status){
    postId = await checkPostId(postId);
    title = checkTitle(title);
    sport = checkSport(sport);
    description = checkDescription(description);
    eventDateTime = checkDateAndTime(eventDateTime);
    maxParticipants = checkMaxParticipants(maxParticipants);
    ageRestriction = checkAgeRestrictions(ageRestriction);
    skillLevelRestriction = checkSkillLevelRestriction(skillLevelRestriction);
    genderRestriction = checkGenderRestriction(genderRestriction);
    location = checkLocation(location);
    status = checkStatusPosts(status);

    const updateObj = {
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
    };

    const postsCollection = await posts();
    const update = await postsCollection.updateOne(
        {_id: new ObjectId(postId)},
        {$set: updateObj}
    );
    if(!update.acknowledged || update.modifiedCount === 0) throw "Error: Could not update post";
    return await this.getPostById(postId);
}
// Removes post by postId (Finds and deleted post by postId)
export async function removePost(postId){
    postId = await checkPostId(postId);
    const postsCollection = await posts();
    const remove = await postsCollection.findOneAndDelete(
        {_id: new ObjectId(postId)}
    );
    if(!remove) throw "Error: Post could not be removed";
    return {deleted: true};
}
// Likes post (stores userId in likedBy object attribute of post object)
export async function likePost(postId, userId){
    postId = await checkPostId(postId);
    userId = await checkAuthorId(userId);
    const postsCollection = await posts();

    const update = await postsCollection.updateOne(
        {_id: new ObjectId(postId)},
        {
            $addToSet: {likedBy: userId},
            $pull: {dislikedBy: userId}         // Makes sure to remove dislike
        }
    );
    if(!update.acknowledged || update.matchedCount === 0) throw "Error: Could not like post";
    return await this.getPostById(postId);
}
// Dislikes post
export async function dislikePost(postId, userId){
    postId = await checkPostId(postId);
    userId = await checkAuthorId(userId);
    const postsCollection = await posts();
    const update = await postsCollection.updateOne(
        {_id: new ObjectId(postId)},
        {
            $pull: {likedBy: userId},   // Make sure to remove like
            $addToSet: {dislikedBy: userId} 
        }
    );
    if(!update.acknowledged || update.matchedCount === 0) throw "Error: Could not dislike post";
    return await this.getPostById(postId);
}

export async function findAuthor(authorId){
    authorId = await checkAuthorId(authorId);
    const users1 = await users();
    let ret = await users1.findOne({_id: new ObjectId(authorId)})
    if (!ret) throw "No post found"
    let re2 = ret.firstName + " " + ret.lastName
    return re2
}
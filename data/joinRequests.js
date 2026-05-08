
import { joinRequests, posts, users } from "../config/mongoCollections.js";
import { checkAuthorId, checkPostId, checkMessage } from "../helpers.js";
import { ObjectId } from "mongodb";

export async function createJoinRequest(postId, requesterId, message){
    postId = await checkPostId(postId)
    requesterId = await checkAuthorId(requesterId)
    message = checkMessage(message)
    let newJoinRequest = {
        postId: postId,
        requesterId: requesterId,
        status: 'pending',
        message: message,
        requestedAt: new Date(),
        respondedAt: null
    }
    let joinRequests1 = await joinRequests()
    let iRes = await joinRequests1.insertOne(newJoinRequest)
    if (!iRes.acknowledged || !iRes.insertedId) throw 'Could not add join request'
    let ret = await joinRequests1.findOne({_id: iRes.insertedId})
    let posts1 = await posts()
    let update = await posts1.updateOne({_id: new ObjectId(postId)}, {$push: {pendingRequestIds: ret._id.toString()}})
    if (!update.acknowledged) throw 'Could not update post with new join request'
    return ret;
}

export async function checkRequesterMeetsRequirements(requesterId, postId) {
    // Implementation for checking if the requester meets the post's requirements
    requesterId = await checkAuthorId(requesterId)
    postId = await checkPostId(postId)
    let users1 = await users()
    let posts1 = await posts()
    let requester = await users1.findOne({_id: new ObjectId(requesterId)})
    let post = await posts1.findOne({_id: new ObjectId(postId)})
    // Add logic to check if requester meets the post's requirements
    let autoreject = false
    if(post.maxParticipants == post.acceptedParticipantIds.length) {
        autoreject = true
    }
    if (requester.age < post.ageRestriction.min || requester.age > post.ageRestriction.max) {
        autoreject = true
    }
    //'beginner', 'intermediate', 'advanced', 'all levels'
    let skills = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 }
    if (post.skillLevelRestriction !== 'all levels' && skills[requester.skill] < skills[post.skillLevelRestriction]) {
        autoreject = true
    }
    if (post.genderRestriction != 'co-ed') {
        //male only', 'female only
        if (post.genderRestriction == "male only" && requester.gender != "male") {
            autoreject = true
        }
        if (post.genderRestriction == "female only" && requester.gender != "female") {
            autoreject = true
        }
    }
    if (post.status !== 'open') {
        autoreject = true
    }
    if (autoreject) {
        let requests = await joinRequests();
        let joinReq = await requests.findOne({
        postId: post._id.toString(),
        requesterId: requester._id.toString(),
        status: "pending"
        });
        if (!joinReq) return false;

        await requests.updateOne(
        {_id: joinReq._id},
        {$set: {status: "denied", respondedAt: new Date()}}
        );

        await posts1.updateOne(
        {_id: new ObjectId(post._id)},
        {$pull: {pendingRequestIds: joinReq._id.toString()}}
        );
    } else {
        return false
    }
    
    return true
}

//Add more function if needed (updates, remove, etc...)

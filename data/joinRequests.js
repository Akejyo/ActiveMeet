
import { joinRequests, posts } from "../config/mongoCollections.js";
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

//Add more function if needed (updates, remove, etc...)

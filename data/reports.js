//TODO functions to add, delete, ... from database

import { posts, reports } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {checkAuthorId, checkPostId, checkReason} from "../helpers.js";

export async function createReport(reporterId, reportedPostId, reason){
    reporterId = await checkAuthorId(reporterId)
    reportedPostId = await checkPostId(reportedPostId)
    reason = checkReason(reason)
    let posts1 = await posts()
    let foundPost = await posts1.findOne({_id: new ObjectId(reportedPostId)})
    let newReport = {
        reporterId: reporterId,
        reportedUserId: foundPost.authorId,
        reportedPostId: reportedPostId,
        reason: reason,
        status: 'open',
        createdAt: new Date(),
        reviewedBy: null,
        resolutionNotes: null,
    }
    let reports1 = await reports()
    let iRes = await reports1.insertOne(newReport)
    if (!iRes.acknowledged || !iRes.insertedId) throw 'Could not add report'
    let ret = await reports1.findOne({_id: iRes.insertedId})
    return ret;
}

//Add more function if needed (updates, remove, etc...)
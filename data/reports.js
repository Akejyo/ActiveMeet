
import { posts, reports, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {checkAuthorId, checkId, checkPostId, checkReason, checkReportType, checkEmailFieldsOnly,
    checkReason2, checkDescription
} from "../helpers.js";

export async function createReport(reporterId, reportedPostId, reason){ //Do not use this function directly, use createReport2 instead
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

export async function createReport2(reporterId, reportType, targetEmail, reason, description) {
    reportType = checkReportType(reportType);
    reporterId = checkId(reporterId);
    targetEmail = checkEmailFieldsOnly(targetEmail);
    reason = checkReason2(reason);
    description = checkDescription(description);
    let users1 = await users();
    let targetUser = await users1.findOne({ email: targetEmail });
    if (!targetUser) {
        throw "There is no user with that email address.";
    }
    let newReport = {
        reporterId: reporterId,
        reportedUserId: targetUser._id,
        reportType: reportType,
        reason: reason,
        description: description,
        status: 'open',
        createdAt: new Date(),
        reviewedBy: null,
        resolutionNotes: null,
    }
    let reports1 = await reports();
    let iRes = await reports1.insertOne(newReport);
    if (!iRes.acknowledged || !iRes.insertedId) throw 'Could not add report';
    let ret = await reports1.findOne({_id: iRes.insertedId});
    return ret;
}

//Add more function if needed (updates, remove, etc...)
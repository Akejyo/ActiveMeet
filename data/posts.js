//TODO functions to add, delete, ... from database

import { posts } from "../config/mongoCollections.js";
import { checkAuthorId, checkTitle, checkSport, checkDescription, checkDateAndTime,
    checkMaxParticipants, checkAgeRestrictions, checkSkillLevelRestriction, 
    checkGenderRestriction, checkLocation
} from "../helpers.js";


export async function createPost(title, authorId, sport, description, eventDateTime, 
    maxParticipants, ageRestriction, skillLevelRestriction, genderRestriction, location){
    title = checkTitle(title)
    authorId = await checkAuthorId(authorId)
    sport = checkSport(sport)
    description = checkDescription(description)
    eventDateTime = checkDateAndTime(eventDateTime)
    maxParticipants = checkMaxParticipants(maxParticipants)
    ageRestriction = checkAgeRestrictions(ageRestriction)
    skillLevelRestriction = checkSkillLevelRestriction(skillLevelRestriction)
    genderRestriction = checkGenderRestriction(genderRestriction)
    location = checkLocation(location)
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
    }
    let posts1 = await posts()
    let iRes = await posts1.insertOne(newPost)
    if (!iRes.acknowledged || !iRes.insertedId) throw 'Could not add post'
    let ret = await posts1.findOne({_id: iRes.insertedId})
    return ret;
}

//Add more function if needed (updates, remove, etc...)
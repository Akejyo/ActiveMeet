//Helper functions for data validation
//Could copy and add the necessary ones to client side validation
import {users, posts, joinRequests, reports} from "./config/mongoCollections.js";
import {ObjectId} from 'mongodb';

export function checkId(id){
    if (!id) throw "Id was not provided"
    if (typeof id != 'string') throw "Id must be a string"
    id = id.trim()
    if (id.length == 0) throw "Id can not be an empty string"
    if (!ObjectId.isValid(id)) throw "Id must be a valid one"
    return id
}

//TODO validate new user fields
export function checkFirstName(name){
    if (!name) throw "No first name provided"
    if(typeof(name) != 'string') throw "First name has to be a string"
    name = name.trim()
    if(name.length < 3 || name.length > 20) throw "First name has to be between 3 and 20 characters"
    let accept1 = /^[a-zA-Z]+$/
    if (!accept1.test(name)) throw "Invalid character in first name, can only contain letters"
    return name
}

export function checkLastName(name){
    if (!name) throw "No last name provided"
    if(typeof(name) != 'string') throw "Last name has to be a string"
    name = name.trim()
    if(name.length < 3 || name.length > 20) throw "Last name has to be between 3 and 20 characters"
    let accept1 = /^[a-zA-Z\s]+$/
    if (!accept1.test(name)) throw "Invalid character in last name, can only contain letters and spaces"
    return name
}

export async function checkEmail(email){
    if (!email) throw "Email was not provided"
    if (typeof(email) != 'string') throw "Email must be a string"
    email = email.trim()
    let par = email.split('@')
    if (par.length != 2) throw "Invalid email format"
    if (par[0].length > 64) throw "Invalid email format"
    let acpe1 = /^[a-zA-Z0-9!#\$%&'\*\+\-\/=\?\^_\{~\.`}]*$/ //Found to be the accepted chars for username email address
    if(!acpe1.test(par[0])) throw "Invalid email format"
    if(par[0].includes("..")) throw "Invalid email format"
    if(par[1].includes("..")) throw "Invalid email format"
    if(par[0][0] === '.' || par[0][par[0].length - 1] === "." || par[1][0] === '.' || par[1][par[1].length - 1] === "." ) throw "Invalid email format"
    let acpe2 = /^[a-zA-Z0-9\-.]*$/
    if(!acpe2.test(par[1])) throw "Invalid email format"
    if(email.length > 320) throw "Invalid email format"

    let userCollection = await users() //Unique email for login
    email = email.toLowerCase()
    let ue = await userCollection.findOne({email: email})
    if (ue) throw "Email already exists"
    return email
}

export function checkCity(city){
    if(!city) throw "No city was provided"
    if (typeof(city) != 'string') throw "City needs to be a string"
    city = city.trim()
    if (city.length < 1 || city.length > 45) throw "Length of city needs to be between 1 and 45" //shortest city name in US is 1 char and largest is 45 chars
    let accept1 = /^[a-zA-Z\s]+$/
    if (!accept1.test(city)) throw "Invalid character in city, can only contain letters"
    return city
}

export function checkState(state){
    if (!state) throw "No state was provided"
    if (typeof(state) != 'string') throw "State needs to be a string"
    state = state.trim()
    if (state.length != 2) throw "State must be in 2 letter format"
    state = state.toUpperCase()
    let states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL','GA', 'HI', 
        'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 
        'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 
        'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI','WY', 'PR',
        'VI', 'AS']
    if (!(states.includes(state))) throw "State is not a valid 2 letter state"
    return state
}

export function checkAge(age){
    if (!age) throw "No age was provided"
    if (typeof(age) == 'number') {

    } else if (typeof(age) == 'string'){
        age  = age.trim()
        if(!Number.isNaN(Number(age))) {
            age = Number(age)
        }else{
            throw "Age string can't be converted into a number"
        }
    } else{
        throw "Age has to be a number or a string that can be turned into a number"
    }
    if(age < 13) throw "The minimum age is 13 due to the law"
    if (age > 120) throw "Invalid age, max age is 120" //could change
    return age
}

export function checkGender(gen){
    if(!gen) throw "No gender was provided"
    if (typeof(gen) != 'string') throw "gender needs to be a string"
    let gender = ['male', 'female']
    gen = gen.trim()
    gen = gen.toLowerCase()
    if (!gender.includes(gen)) throw "Please only type male or female"
    return gen
}

export function checkBio(bio){
    if (!bio) throw "No bio was provided"
    if (typeof(bio) != 'string') throw "Bio has to be a string"
    bio = bio.trim()
    if (bio.length < 5) throw "Please write something for bio, (over 5 chars)"
    if (bio.length > 200) throw "Please keep bio under 200 characters"
    return bio
}

export function checkSportInterests(spIntr){ //array
    if (!spIntr) throw "No sport interests were provided"
    if (!Array.isArray(spIntr)) throw "Sport interests has to be an array"
    if (spIntr.length == 0) throw "Please provide at least one sport interest"
    for (let i = 0; i < spIntr.length; i++) {
        spIntr[i] = checkSport(spIntr[i])
    }
    return spIntr
}

export function checkPassword(pwd){
    //TODO what will be the min for password
    if (!pwd) throw "No password provided"
    if (typeof(pwd) != 'string') throw "Password has to be a string"
    pwd = pwd.trim()
    if (pwd.length < 8) throw "Password has to be at least 8 characters long"
    //further chesks TODO (special char, uppercase, lowercase, number, etc.)
    let upercase  = false
    let num = false
    let special = false
    for (let c of pwd){
        if (c === " ") {
            throw "password can not have spaces"
        } else if ( c.charCodeAt() >= 65 && c.charCodeAt() <= 90) {
            upercase = true
        } else if ( c.charCodeAt() >= 97 && c.charCodeAt() <= 122){

        } else if (c.charCodeAt() >= 48 && c.charCodeAt() <= 57) {
            num = true
        } else {
            special = true
        }
    }
    if (!(upercase && num && special)) throw "Password must have at least one Uppercase letter, one number and one special character"
    return pwd
}

export function checkSkillLevel(sk){
    if(!sk) throw "No skill level provided"
    if (typeof(sk) != 'string') throw "Skill level has to be a string"
    sk = sk.trim()
    let skillLevels = ['beginner', 'intermediate', 'advanced']
    sk = sk.toLowerCase()
    if (!skillLevels.includes(sk)) throw "Invalid skill level provided (beginner, intermediate, advanced)"
    return sk
}

export function checkVisibility(vis){
    if(!vis) throw "No visibility provided"
    if(typeof(vis) != 'string') throw "Visibility has to be a string"
    vis = vis.trim()
    if (vis != 'public' && vis != 'private') throw "Visibility has to be either public or private"
    return vis
}

//TODO validate posts fields

export async function checkAuthorId(authorId){
    authorId = checkId(authorId)
    let users1 = await users()
    let found = await users1.findOne({_id: new ObjectId(authorId)})
    if (!found) throw "There is no user with that id"
    return authorId
}

export function checkSport(sport){ //single sport
    if(!sport) throw "No sport was provided"
    if(typeof(sport) != 'string') throw "Sport has to be a string"
    sport = sport.trim()
    let sports = ['basketball', 'soccer', 'tennis', 'baseball', 'volleyball', 
        'football', 'hockey', 'golf', 'swimming', 'running', 'badminton', 'bowling',
        'archery', 'cycling', 'boxing', 'cricket', 'darts', 'gymnastics', 'gym', 'hiking'] //could add more
    sport = sport.toLowerCase()
    if (!sports.includes(sport)) throw "Invalid sport provided"
    return sport
}

export function checkTitle(title){
    if (!title) throw "No first title provided"
    if(typeof(title) != 'string') throw "Title has to be a string"
    title = title.trim()
    if(title.length < 3 || title.length > 20) throw "Title has to be between 3 and 20 characters"
    let accept1 = /^[a-zA-Z\s]+$/
    if (!accept1.test(title)) throw "Invalid character in title, can only contain letters and spaces"
    return title
}

export function checkDescription(desc){
    if (!desc) throw "No description provided"
    if (typeof(desc) != 'string') throw "Description has to be a string"
    desc = desc.trim()
    if (desc.length < 5) throw "Please write something for description, (over 5 chars)"
    if (desc.length > 300) throw "Please keep description under 300 characters"
    return desc
}

export function checkDateAndTime(dateAndTime){
    if(!dateAndTime) throw "No date and time provided"
    if (!(dateAndTime instanceof Date)) throw "Date and time has to be a date object"
    if (dateAndTime < new Date()) throw "Date and time has to be in the future"
    return dateAndTime
}

export function checkMaxParticipants(part){
    if (!part) throw "No max participants provided"
    if (typeof(part) == 'number') {
    } else if (typeof(part) == 'string'){
        part  = part.trim()
        if(!Number.isNaN(Number(part))) {
            part = Number(part)
        }else{
            throw "Max participants string can't be converted into a number"
        }
    } else {
        throw "Max participants has to be a number or a string that can be turned into a number"
    }
    if (part < 2) throw "Max participants has to be at least 2"
    if (part > 20) throw "Max participants has to be less than 20"
    return part
}

export function checkAgeRestrictions(obj){ //{min: 13, max: 120}
    if (!obj) throw "No age restrictions provided"
    if (typeof(obj) != 'object') throw "Age restrictions has to be an object"
    if (Array.isArray(obj)) throw "Age restrictions has to be an object, not an array"
    if (!obj.min || !obj.max) throw "Age restrictions has to have min and max properties"
    if (Object.keys(obj).length != 2) throw "Age restrictions can only have min and max properties"
    if (typeof(obj.min) != 'number' || typeof(obj.max) != 'number') throw "Age restrictions has to be a number"
    if (obj.min < 13 || obj.max > 120) throw "Invalid age range provided"
    if (obj.min > obj.max) throw "Minimum age has to be less than maximum age"
    return obj
}

export function checkSkillLevelRestriction(sk){
    if(!sk) throw "No skill level restriction provided"
    if (typeof(sk) != 'string') throw "Skill level restriction has to be a string"
    sk = sk.trim()
    let skillLevels = ['beginner', 'intermediate', 'advanced', 'all levels']
    sk = sk.toLowerCase()
    if (!skillLevels.includes(sk)) throw "Invalid skill level restriction provided (beginner, intermediate, advanced, all levels)"
    return sk
}

export function checkGenderRestriction(gr){
    if(!gr) throw "No gender restriction provided"
    if (typeof(gr) != 'string') throw "Gender restriction has to be a string"
    gr = gr.trim()
    let genders = ['male only', 'female only', 'co-ed']
    gr = gr.toLowerCase()
    if (!genders.includes(gr)) throw "Invalid gender restriction provided (male only, female only, co-ed)"
    return gr
}

export function checkLocation(locObj){ //Works for string now, could change to be object
    if(!locObj) throw "No location provided"
    if (typeof(locObj) != 'string') throw "Location has to be a string"
    locObj = locObj.trim()
    if (locObj.length < 5 || locObj.length > 100) throw "Location has to be between 5 and 100 characters"
    return locObj
} 

export function checkComment(comment){
    if (!comment) throw "No comment provided"
    if (typeof(comment) != 'string') throw "Comment has to be a string"
    comment = comment.trim()
    if (comment.length < 2 || comment.length > 300) throw "Comment has to be between 2 and 300 characters"
    return comment
}

export function checkComments(cmm){ //array
    if (!cmm) throw "No comments provided"
    if (!Array.isArray(cmm)) throw "Comments has to be an array"
    for (let i = 0; i < cmm.length; i++) {
        if (typeof(cmm[i]) !== "object" || Array.isArray(cmm[i])) throw "Each comment has to be an object" //{user: 'name', content; 'string comment'
        if (!cmm[i].user || !cmm[i].content) throw "Each comment has to have user and content"
        if (Object.keys(cmm[i]).length != 2) throw "Each comment can only have user and content fields"
        if (typeof(cmm[i].user) != 'string' || typeof(cmm[i].content) != 'string') throw "User and content of each comment has to be a string"
        cmm[i].user = cmm[i].user.trim()
        cmm[i].content = cmm[i].content.trim()
        if (cmm[i].user.length < 2 || cmm[i].user.length > 50) throw "User of each comment has to be between 2 and 50 characters"
        if (cmm[i].content.length < 2 || cmm[i].content.length > 300) throw "Content of each comment has to be between 2 and 300 characters"
    }
    return cmm
}

export function checkStatusPosts(st){ //open, full, closed, cancelled
    if(!st) throw "No status provided"
    if (typeof(st) != 'string') throw "Status has to be a string"
    st = st.trim()
    let status = ['open', 'full', 'closed', 'cancelled']
    st = st.toLowerCase()
    if (!status.includes(st)) throw "Invalid status provided (open, full, closed, cancelled)"
    return st
}

//TODO validate join requests fields

export function checkStatusJoin(st){ //pending, accepted, denied
    if(!st) throw "No status provided"
    if (typeof(st) != 'string') throw "Status has to be a string"
    st = st.trim()
    let status = ['pending', 'accepted', 'denied']
    st = st.toLowerCase()
    if (!status.includes(st)) throw "Invalid status provided (pending, accepted, denied)"
    return st
}

export async function checkPostId(postId){
    postId = checkId(postId)
    let posts1 = await posts()
    let found = await posts1.findOne({_id: new ObjectId(postId)})
    if (!found) throw "There is no post with that id"
    return postId
}

export function checkMessage(mss){ //optional message
    if (!mss) return ""
    if (typeof(mss) != 'string') throw "Message has to be a string"
    mss = mss.trim()
    if (mss.length > 300) throw "Please keep the message under 300 characters"
    return mss
}

export async function checkCommentId(commentId){
    commentId = checkId(commentId);
    let postsCollection = await posts();
    let comment = await postsCollection.findOne({"comments.commentId": new ObjectId(commentId)});
    if(!comment) throw "Error: No comment found with that id";
    return commentId;
}
//TODO validate report fields
export function checkReason(reas){
    if (!reas) throw "No reason provided"
    if (typeof(reas) != 'string') throw "Reason has to be a string"
    reas = reas.trim()
    if (reas.length < 5) throw "Please write something for reason, (over 5 chars)"
    if (reas.length > 300) throw "Please keep reason under 300 characters"
    return reas
}

export function checkStatusReport(st) { //open, reviewed, resolved, dismissed
    if(!st) throw "No status provided"
    if (typeof(st) != 'string') throw "Status has to be a string"
    st = st.trim()
    let status = ['open', 'reviewed', 'resolved', 'dismissed']
    st = st.toLowerCase()
    if (!status.includes(st)) throw "Invalid status provided (open, reviewed, resolved, dismissed)"
    return st
}

export function checkReviewdBy(rb){ //empty or string
    if(!rb) return ""
    if (typeof(rb) != 'string') throw "Reviewed by has to be a string"
    rb = rb.trim()
    if (rb.length > 50) throw "Reviewed by can't be longer than 50 characters"
    return rb
}

export function checkNotes(nt){
    if (!nt) return ""
    if (typeof(nt) != 'string') throw "Notes has to be a string"
    nt = nt.trim()
    if (nt.length > 300) throw "Please keep notes under 300 characters"
    return nt
}

//TODO add key word search for inaproproate content

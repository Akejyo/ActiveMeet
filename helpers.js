//Helper functions for data validation
//Could copy and add the necessary ones to client side validation
import { checkLastName } from "../../lab10/helpers.js";
import {users, posts, joinRequests, reports} from "./config/mongoCollections.js";

export function checkId(){

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

}

export function checkEmail(email){

}

export function checkCity(city){

}

export function checkState(state){

}

export function checkAge(age){

}

export function checkGender(gen){

}

export function checkBio(bio){

}

export function checkSportInterests(spIntr){

}

export function checkPassword(pwd){

}

export function checkVisibility(vis){
    if(!vis) throw "No visibility provided"
    if(typeof(vis) != 'string') throw "Visibility has to be a string"
    vis = vis.trim()
    if (vis != 'public' && vis != 'private') throw "Visibility has to be either public or private"
    return vis
}

//TODO validate posts fields

export function checkSport(sport){

}

export function checkTitle(title){

}

export function checkDescription(desc){

}

export function checkDateAndTime(dateAndTime){

}

export function checkMaxParticipants(part){

}

export function checkAgeRestrictions(obj){

}

export function checkSkillLevelRestriction(sk){

}

export function checkGenderRestriction(gr){

}

export function checkLocation(locObj){

} 

export function checkComments(cmm){

}

export function checkStatusPosts(st){ //open, full, closed, cancelled

}

//TODO validate join requests fields

export function checkStatusJoin(st){ //pending, accepted, denied

}

export function checkMessage(mss){

}

//TODO validate report fields

export function checkReason(reas){

}

export function checkStatusReport(st) { //open, reviewed, resolved, dismissed

}

export function checkReviewdBy(rb){

}

export function checkNotes(nt){
    
}
import express from 'express'
import {
  checkDescription,
  checkEmailFieldsOnly,
  checkReason2,
  checkReportType,
  sanitize,
} from '../helpers.js'
import { users, reports } from '../config/mongoCollections.js'
import { createReport2 } from '../data/reports.js'
import { ObjectId } from 'mongodb'

const router = express.Router()

router
  .route('/')
  .get(async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/profile/login')
    } else {
      return res.render('report', { title: 'Report', logedIn: true })
    }
  })
  .post(async (req, res) => {
    if (!req.session.user) {
      return res.redirect('/profile/login')
    } else {
      let { reportType, targetEmail, reason, description } = req.body
      reportType = sanitize(reportType)
      targetEmail = sanitize(targetEmail)
      reason = sanitize(reason)
      description = sanitize(description)

      let message = []
      let error = false
      try {
        reportType = checkReportType(reportType)
      } catch (e) {
        error = true
        message.push(e)
      }
      try {
        targetEmail = checkEmailFieldsOnly(targetEmail)
        let users1 = await users()
        let targetUser = await users1.findOne({ email: targetEmail })
        if (!targetUser) {
          throw 'There is no user with that email address.'
        }
      } catch (e) {
        error = true
        message.push(e)
      }
      try {
        reason = checkReason2(reason)
      } catch (e) {
        error = true
        message.push(e)
      }
      try {
        description = checkDescription(description)
      } catch (e) {
        error = true
        message.push(e)
      }
      if (error) {
        let prev = {
          isPost: reportType === 'post',
          isUser: reportType === 'user',
          targetEmail: targetEmail,
          isInappropriate: reason === 'inappropriate content',
          isHarassment: reason === 'harassment',
          isSpam: reason === 'spam',
          isFakeEvent: reason === 'fake event',
          isOther: reason === 'other',
          description: description,
        }
        return res
          .status(400)
          .render('report', {
            title: 'Report',
            logedIn: true,
            error: true,
            message: message.join(' AND '),
            prev: prev,
          })
      } else {
        try {
          let rep = await createReport2(
            req.session.user._id.toString(),
            reportType,
            targetEmail,
            reason,
            description
          )
          if (!rep) {
            throw 'Failed to create report.'
          }
          //Add reported user to reporter's blocked list if they have submitted 2 reports about the same user
          let reports1 = await reports()
          let users1 = await users()
          let targetUser = await users1.findOne({ email: targetEmail })
          let userReports = await reports1
            .find({
              reporterId: req.session.user._id.toString(),
              reportedUserId: targetUser._id,
            })
            .toArray()
          if (
            userReports.length >= 2 &&
            !req.session.user.blockedUserIds.includes(targetUser._id.toString())
          ) {
            let update = await users1.updateOne(
              { _id: new ObjectId(req.session.user._id) },
              { $addToSet: { blockedUserIds: targetUser._id.toString() } }
            )
            if (!update) {
              throw 'Failed to update blocked users, but report was created.'
            }
            req.session.user.blockedUserIds.push(targetUser._id.toString())
          }
          return res.redirect('/profile')
        } catch (e) {
          let prev = {
            isPost: reportType === 'post',
            isUser: reportType === 'user',
            targetEmail: targetEmail,
            isInappropriate: reason === 'inappropriate content',
            isHarassment: reason === 'harassment',
            isSpam: reason === 'spam',
            isFakeEvent: reason === 'fake event',
            isOther: reason === 'other',
            description: description,
          }
          return res
            .status(500)
            .render('report', {
              title: 'Report',
              logedIn: true,
              error: true,
              message: e,
              prev: prev,
            })
        }
      }
    }
  })

export default router

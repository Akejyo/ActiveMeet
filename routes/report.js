import express from 'express';
import { checkDescription, checkEmailFieldsOnly, checkReason2, checkReportType, sanitize
} from '../helpers.js';
import { users } from '../config/mongoCollections.js';
import { createReport2 } from '../data/reports.js';
const router = express.Router();

router.route('/').get( async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/profile/login');
    } else{
        return res.render('report', { title: 'Report', logedIn: true});
    }
})
.post( async (req, res) => { 
    if (!req.session.user) {
        return res.redirect('/profile/login');
    } else {
        let { reportType, targetEmail, reason, description } = req.body;
        reportType = sanitize(reportType);
        targetEmail = sanitize(targetEmail);
        reason = sanitize(reason);
        description = sanitize(description);
        
        let message = []
        let error = false;
        try{
            reportType = checkReportType(reportType);
        }catch(e){
            error = true;
            message.push(e);
        }
        try{
            targetEmail = checkEmailFieldsOnly(targetEmail);
            let users1 = await users();
            let targetUser = await users1.findOne({ email: targetEmail });
            if (!targetUser) {
                throw "There is no user with that email address.";
            }
        }catch(e){
            error = true;
            message.push(e);
        }
        try{
            reason = checkReason2(reason);
        }catch(e){
            error = true;
            message.push(e);
        }
        try{
            description = checkDescription(description);
        }catch(e){
            error = true;
            message.push(e);
        }
        if (error) {
            let prev = {
                isPost: (reportType === 'post'),
                isUser: (reportType === 'user'),
                targetEmail: targetEmail,
                isInappropriate: (reason === 'inappropriate content'),
                isHarassment: (reason === 'harassment'),
                isSpam: (reason === 'spam'),
                isFakeEvent: (reason === 'fake event'),
                isOther: (reason === 'other'),
                description: description
            }
            return res.status(400).render('report', { title: 'Report', logedIn: true, 
                error: true, message: message.join(' AND '), prev: prev });
        } else {
            try{
                let rep = await createReport2(req.session.user._id.toString(), reportType, targetEmail, reason, description);
                if (!rep) {
                    throw "Failed to create report.";
                }
                // TODO: Add logic to block users if many reports submitted
                return res.redirect('/profile');
            }catch(e){
                let prev = {
                    isPost: (reportType === 'post'),
                    isUser: (reportType === 'user'),
                    targetEmail: targetEmail,
                    isInappropriate: (reason === 'inappropriate content'),
                    isHarassment: (reason === 'harassment'),
                    isSpam: (reason === 'spam'),
                    isFakeEvent: (reason === 'fake event'),
                    isOther: (reason === 'other'),
                    description: description
                }
                return res.status(500).render('report', { title: 'Report', logedIn: true, 
                    error: true, message: e, prev: prev });
            }
        }
    }

});

export default router;
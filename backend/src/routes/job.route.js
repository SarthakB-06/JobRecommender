import {Router} from 'express';
import {verifyJWT} from '../middlewares/authentication.js'

import {getJobRecommendations, getSavedJobs, saveJob, unsaveJob} from '../controllers/job.controller.js'

const router = Router();
router.route('/recommendations').get(verifyJWT , getJobRecommendations);

router.route('/save').post(verifyJWT , saveJob)
router.route('/unsave/:jobId').delete(verifyJWT , unsaveJob)
router.route('/saved').get(verifyJWT , getSavedJobs)


export default router
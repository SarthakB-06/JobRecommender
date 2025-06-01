import {Router} from 'express';
import {verifyJWT} from '../middlewares/authentication.js'

import {getJobRecommendations} from '../controllers/job.controller.js'

const router = Router();
router.route('/recommendations').get(verifyJWT , getJobRecommendations);


export default router
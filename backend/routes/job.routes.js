import express from 'express'
import { getAdminJobs, getAllJobs, getJobById, postJob } from '../controllers/job.controller.js';
import isaAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.route("/post").post(isaAuthenticated,postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isaAuthenticated,getAdminJobs);
router.route("/get/:id").get(isaAuthenticated,getJobById);

export default router;
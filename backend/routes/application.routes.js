import express from 'express'
import isaAuthenticated from '../middlewares/isAuthenticated.js';
import { applyJobs,  getApplicants,  getAppliedJobs, updateStatus } from '../controllers/application.controller.js';

const router = express.Router();

router.route("/apply/:id").post(isaAuthenticated,applyJobs);
router.route("/get").get(isaAuthenticated,getAppliedJobs);
router.route("/:id/applicants").get(isaAuthenticated,getApplicants);
router.route("/status/:id/update").post(isaAuthenticated,updateStatus);

export default router;  
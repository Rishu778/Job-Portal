import express from 'express'
import { getCompany, getCompanyById, registerCompany, updateCompany } from '../controllers/company.controller.js';
import isaAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();

router.route("/register").post(isaAuthenticated,registerCompany)
router.route("/getcompany").get(isaAuthenticated,getCompany)
router.route("/getcompany/:id").get(isaAuthenticated,getCompanyById)
router.route("/update/:id").post(isaAuthenticated,singleUpload,updateCompany);

export default router;
import express from "express";
import { getAnalytics } from "../controllers/analytics.controller";
import { protect } from "../middleware/auth.middleware";
import { deleteLink, getIdentity, updateIdentity } from "../controllers/links.controller";
import { upload } from "../middleware/multer.middleware";

const router = express.Router();

router.use(protect)
router.get("/", getIdentity);
router.put("/", upload.single("image"), updateIdentity);
router.delete("/link/:linkId", deleteLink);

export default router;
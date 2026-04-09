import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";
import { uploadImage } from "../controllers/upload.controller";


const router=Router();

router.use(protect)

router.post("/",upload.single("file"),uploadImage)

export default router;
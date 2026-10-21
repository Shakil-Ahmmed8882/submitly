import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { submissionLimiter } from "../../middleware/rateLimiter";
import { validateRequest } from "../../middleware/validateRequest";
import { SubmissionController } from "./submission.controller";
import { CreateSubmissionSchema, ReviewSubmissionSchema } from "./submission.validation";

const router = Router();

router.post(
	"/",
	auth("STUDENT"),
	submissionLimiter,
	validateRequest(CreateSubmissionSchema),
	SubmissionController.create,
);

router.get("/mine", auth("STUDENT"), SubmissionController.getMySubmissions);

router.get("/", auth("MENTOR"), SubmissionController.getAll);

router.patch(
	"/:id/review",
	auth("MENTOR"),
	validateRequest(ReviewSubmissionSchema),
	SubmissionController.review,
);

router.get("/stats", auth("MENTOR"), SubmissionController.getStats);

export const SubmissionRoutes = router;

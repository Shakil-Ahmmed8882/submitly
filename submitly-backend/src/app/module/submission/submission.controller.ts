import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SubmissionService } from "./submission.service";
import { QuerySubmissionsSchema } from "./submission.validation";

const create = catchAsync(async (req: Request, res: Response) => {
	const submission = await SubmissionService.create(req.user!.userId, req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Project submitted successfully",
		data: { submission },
	});
});

const getMySubmissions = catchAsync(async (req: Request, res: Response) => {
	const submissions = await SubmissionService.getMySubmissions(req.user!.userId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Submissions retrieved successfully",
		data: { submissions },
	});
});

const getAll = catchAsync(async (req: Request, res: Response) => {
	const parsed = QuerySubmissionsSchema.safeParse(req.query);
	if (!parsed.success) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			parsed.error.issues.map((issue) => issue.message).join(", "),
		);
	}

	const { submissions, meta } = await SubmissionService.getAll(parsed.data);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Submissions retrieved successfully",
		data: { submissions },
		meta,
	});
});

const review = catchAsync(async (req: Request, res: Response) => {
	const submission = await SubmissionService.review(
		req.params.id,
		req.user!.userId,
		req.body,
	);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Submission reviewed successfully",
		data: { submission },
	});
});

const getStats = catchAsync(async (req: Request, res: Response) => {
	const stats = await SubmissionService.getStats();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Stats retrieved successfully",
		data: { stats },
	});
});

export const SubmissionController = {
	create,
	getMySubmissions,
	getAll,
	review,
	getStats,
};

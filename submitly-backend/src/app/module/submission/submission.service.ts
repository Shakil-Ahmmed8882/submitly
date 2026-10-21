import httpStatus from "http-status";
import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import type { ICreateSubmissionPayload, IReviewPayload, ISubmissionQuery } from "./submission.interface";

const create = async (userId: string, payload: ICreateSubmissionPayload) => {
	try {
		const submission = await prisma.submission.create({
			data: {
				project_name: payload.project_name,
				repo_url: payload.repo_url,
				live_link: payload.live_link,
				description: payload.description,
				user_id: userId,
			},
		});

		return submission;
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			throw new AppError(httpStatus.CONFLICT, "You've already submitted this repository");
		}
		throw error;
	}
};

const getMySubmissions = async (userId: string) => {
	const submissions = await prisma.submission.findMany({
		where: { user_id: userId },
		orderBy: { created_at: "desc" },
	});

	return submissions;
};

const getAll = async (query: ISubmissionQuery) => {
	const page = query.page ?? 1;
	const limit = query.limit ?? 10;
	const skip = (page - 1) * limit;

	const where: Prisma.SubmissionWhereInput = {};
	if (query.status) {
		where.status = query.status;
	}

	const [submissions, total] = await Promise.all([
		prisma.submission.findMany({
			where,
			skip,
			take: limit,
			include: {
				user: {
					select: { id: true, name: true, email: true },
				},
			},
			orderBy: { created_at: "desc" },
		}),
		prisma.submission.count({ where }),
	]);

	return {
		submissions,
		meta: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const review = async (submissionId: string, mentorId: string, payload: IReviewPayload) => {
	const submission = await prisma.submission.findUnique({
		where: { id: submissionId },
	});

	if (!submission) {
		throw new AppError(httpStatus.NOT_FOUND, "Submission not found");
	}

	if (submission.status !== "PENDING") {
		throw new AppError(httpStatus.CONFLICT, "Submission has already been reviewed");
	}

	const updated = await prisma.submission.update({
		where: { id: submissionId },
		data: {
			status: payload.status,
			review_comment: payload.comment ?? null,
			reviewed_by_id: mentorId,
			reviewed_at: new Date(),
		},
	});

	return updated;
};

const getStats = async () => {
	const grouped = await prisma.submission.groupBy({
		by: ["status"],
		_count: { status: true },
	});

	const stats = {
		pending: 0,
		approved: 0,
		rejected: 0,
		total: 0,
	};

	for (const group of grouped) {
		const count = group._count.status;
		stats.total += count;

		switch (group.status) {
			case "PENDING":
				stats.pending = count;
				break;
			case "APPROVED":
				stats.approved = count;
				break;
			case "REJECTED":
				stats.rejected = count;
				break;
		}
	}

	return stats;
};

export const SubmissionService = {
	create,
	getMySubmissions,
	getAll,
	review,
	getStats,
};

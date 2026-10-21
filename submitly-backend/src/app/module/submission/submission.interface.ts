export interface ICreateSubmissionPayload {
	project_name: string;
	repo_url: string;
	live_link?: string;
	description: string;
}

export interface IReviewPayload {
	status: "APPROVED" | "REJECTED";
	comment?: string;
}

export interface ISubmissionQuery {
	page?: number;
	limit?: number;
	status?: "PENDING" | "APPROVED" | "REJECTED";
}

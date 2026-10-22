"use client";

import { useState } from "react";
import { ModalWrapper } from "@/components/reusable-components/modal/ModalWrapper";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Submission, TReviewStatus } from "@/types/submissions.type";
import { useReviewSubmission } from "../../services/mentor.service.hooks";

export type TReviewTarget = {
  submission: Submission;
  status: TReviewStatus;
};

type TReviewModalProps = {
  review: TReviewTarget | null;
  onClose: () => void;
};

type TReviewFormProps = {
  review: TReviewTarget;
  onClose: () => void;
};

const MAX_COMMENT_LENGTH = 500;

export default function ReviewModal(props: TReviewModalProps) {
  const { review, onClose } = props;
  return (
    <ModalWrapper
      open={review !== null}
      setOpen={(open) => {
        if (!open) onClose();
      }}
    >
      {review ? <ReviewForm review={review} onClose={onClose} /> : null}
    </ModalWrapper>
  );
}

function ReviewForm(props: TReviewFormProps) {
  const { review, onClose } = props;
  const { submission, status } = review;
  const mutation = useReviewSubmission();
  const [comment, setComment] = useState("");
  const isApprove = status === "APPROVED";

  function confirm() {
    const trimmed = comment.trim();
    mutation.mutate(
      {
        id: submission.id,
        input: { status, ...(trimmed ? { comment: trimmed } : {}) },
      },
      { onSuccess: onClose },
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">
          {isApprove ? "Approve" : "Reject"} “{submission.project_name}”?
        </h2>
        <p className="text-sm text-muted-foreground">
          This can't be changed afterwards.
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="review-comment" className="text-xs font-medium">
          Comment <span className="text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={MAX_COMMENT_LENGTH}
          rows={3}
          placeholder="Leave feedback for the student"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
        <Button
          variant={isApprove ? "default" : "destructive"}
          onClick={confirm}
          disabled={mutation.isPending}
        >
          {isApprove ? "Approve" : "Reject"}
        </Button>
      </div>
    </div>
  );
}

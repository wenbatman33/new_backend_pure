interface StepFormProps {
  memberIds: string;
  isDiff: boolean;
  runJobDate: string;
}

interface SearchFormProps {
  memberID?: string;
  memberAccount?: string;
}

interface ReviewItem {
  id: number;
  memberID: number;
  memberAccount: string;
  gift: number | string;
  type: number;
  gameGroupName: string;
  peroid: string;
  createdAt: string;
  expiredAt: string;
}

export type { StepFormProps, SearchFormProps, ReviewItem };

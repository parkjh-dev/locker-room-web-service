// comments module public API

// Hooks
export { useComments } from './hooks/useComments';
export { useCreateComment } from './hooks/useCreateComment';
export { useCreateReply } from './hooks/useCreateReply';
export { useDeleteComment } from './hooks/useDeleteComment';

// Components
export { CommentList } from './components/CommentList';
export { CommentItem } from './components/CommentItem';
export { CommentForm } from './components/CommentForm';
export { ReplyForm } from './components/ReplyForm';

// Types
export type {
  Comment,
  CreateCommentRequest,
  CreateReplyRequest,
  UpdateCommentRequest,
} from './types/comment';

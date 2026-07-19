import { toggleLike, toggleBookmark } from "@/app/actions/engagement";

export default function LikeBookmarkButtons({
  contentId,
  path,
  likeCount,
  likedByMe,
  bookmarkedByMe,
  isLoggedIn,
}: {
  contentId: string;
  path: string;
  likeCount: number;
  likedByMe: boolean;
  bookmarkedByMe: boolean;
  isLoggedIn: boolean;
}) {
  const likeAction = toggleLike.bind(null, contentId, path);
  const bookmarkAction = toggleBookmark.bind(null, contentId, path);

  return (
    <div className="engage-row">
      <form action={likeAction}>
        <button
          type="submit"
          className="engage-btn"
          data-active={likedByMe}
          title={isLoggedIn ? "좋아요" : "로그인 후 좋아요를 누를 수 있어요"}
        >
          {likedByMe ? "❤️" : "🤍"} {likeCount}
        </button>
      </form>
      <form action={bookmarkAction}>
        <button
          type="submit"
          className="engage-btn"
          data-active={bookmarkedByMe}
          title={isLoggedIn ? "북마크" : "로그인 후 북마크할 수 있어요"}
        >
          {bookmarkedByMe ? "🔖" : "📑"} {bookmarkedByMe ? "북마크됨" : "북마크"}
        </button>
      </form>
    </div>
  );
}

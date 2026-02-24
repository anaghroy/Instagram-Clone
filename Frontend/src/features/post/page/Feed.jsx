import { useEffect } from "react";
import Post from "../components/Post";
import { usePost } from "../hook/usePost";

const Feed = () => {
  const { feed, handleGetFeed, loading } = usePost();

  useEffect(() => {
    handleGetFeed();
  }, []);

  if (loading || !feed)
    return (
      <main>
        <h1>Feed is loading...</h1>
      </main>
    );
  console.log(feed);

  return (
    <main className="feed-page">
      <div className="feed">
        <div className="posts">
          {feed.map((post) => {
            return <Post key={post._id} user={post.user} post={post} />;
          })}
        </div>
      </div>
    </main>
  );
};

export default Feed;

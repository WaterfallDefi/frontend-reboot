import dayjs from "dayjs";
import { memo, useEffect, useState } from "react";
import "./blog.css";
import "./blog_mobile.css";
import BlogDetail from "./Detail/BlogDetail";

type Props = {};

type MediumItem = {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  categories: string[];
};

const getMediumFeed = async () => {
  const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/waterfall-defi`);
  const data = await response.json();
  return data;
};

const Blog = memo<Props>(() => {
  const [mediumData, setMediumData] = useState<MediumItem[]>([]);
  const [detailIndex, setDetailIndex] = useState<number>(-1);

  useEffect(() => {
    const fetch = async () => {
      const result = await getMediumFeed();
      console.log(result);
      if (result?.status === "ok") {
        setMediumData(result?.items);
      }
    };
    fetch();
  }, []);

  return detailIndex === -1 ? (
    <div style={{ paddingTop: 70, maxWidth: 1024, margin: "0 auto" }}>
      <div className="blogArea">
        {mediumData.map((d, i) => {
          if (i === 0) {
            return (
              <div className="featureBlogContainer" key={i} onClick={() => setDetailIndex(i)}>
                <div className="blogThumbnail" style={{ backgroundImage: `url(${d.thumbnail})` }}></div>
                <div>
                  <div className="blogTitle">{d.title}</div>
                  <div className="blogDesc" dangerouslySetInnerHTML={{ __html: d.description }}></div>
                  <div className="blogPubDate">
                    <div className="blogByAuthor">By</div> {d.author} <span></span>{" "}
                    {dayjs(d.pubDate).format("MMMM D YYYY")}
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div className="blogContainer" key={i} onClick={() => setDetailIndex(i)}>
              <div className="blogThumbnail" style={{ backgroundImage: `url(${d.thumbnail})` }}></div>
              <div className="blogTitle">{d.title}</div>
              <div className="blogDesc" dangerouslySetInnerHTML={{ __html: d.description }}></div>
              <div className="blogPubDate">
                <div className="blogByAuthor">By</div> {" " + d.author} <span></span>{" "}
                {dayjs(d.pubDate).format("MMMM D YYYY")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <BlogDetail data={mediumData[detailIndex]} setDetailIndex={setDetailIndex} />
  );
});

export default Blog;

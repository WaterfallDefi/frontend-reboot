import dayjs from "dayjs";
import React, { memo } from "react";
import "./blog_detail.css";

type Props = {
  data: MediumItem;
  setDetailIndex: React.Dispatch<React.SetStateAction<number>>;
};
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
const BlogDetail = memo<Props>((props: Props) => {
  const { data, setDetailIndex } = props;

  return (
    <div style={{ paddingTop: 70 }}>
      <div className="blogDetailContainer">
        <div className="blogDetailHead">
          <div className="blogDetailBack" onClick={() => setDetailIndex(-1)}>
            Back
          </div>
          <div className="blogDetailTitle">{data?.title}</div>
          <div style={{ position: "relative" }}>
            <div className="blogDetailDate">
              <div className="blogDetailByAuthor">By</div> {data?.author}{" "}
              <span></span>
              {dayjs(data?.pubDate).format("MMMM D YYYY")}
            </div>
          </div>
        </div>
        <div>
          <div
            className="blogDetailDesc"
            dangerouslySetInnerHTML={{ __html: data?.description }}
          ></div>
        </div>
      </div>
    </div>
  );
});

export default BlogDetail;

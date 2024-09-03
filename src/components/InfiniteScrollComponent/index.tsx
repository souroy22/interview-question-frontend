import { CSSProperties, ReactNode } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./style.css";

type PropTypes = {
  height?: string | number;
  children: ReactNode | null;
  targetId: string;
  loadMoreData: () => void;
  dataLength: number;
  hasMore: boolean;
  LoadingComponent?: ReactNode;
  style?: CSSProperties;
};

const InfiniteScrollComponent = ({
  height = "calc(100dvh - 70px)",
  children,
  targetId,
  loadMoreData,
  dataLength,
  hasMore,
  LoadingComponent,
  style = {},
}: PropTypes) => {
  return (
    <InfiniteScroll
      dataLength={dataLength}
      next={loadMoreData}
      hasMore={hasMore}
      loader={
        LoadingComponent ?? (
          <h4 className="no_record_found">Loading.........</h4>
        )
      }
      height={height}
      scrollableTarget={targetId}
      style={style}
    >
      {children}
    </InfiniteScroll>
  );
};

export default InfiniteScrollComponent;

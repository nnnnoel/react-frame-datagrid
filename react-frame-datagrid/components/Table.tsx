import * as React from 'react';
import styled from '@emotion/styled';
import TableBody from './TableBody';
import { useAppStore } from '../store';
import TableHead from './TableHead';
import TableHeadFrozen from './TableHeadFrozen';
import TableBodyFrozen from './TableBodyFrozen';
import TableFooter from './TableFooter';
import Loading from './Loading';
import { RFDGDataItem, RFDGPage, RFDGSortParam } from '../types';
import { getFrozenColumnsWidth } from '../utils';

interface Props<T> {
  width?: number;
  height?: number;
  loading?: boolean;
  spinning?: boolean;
  scrollTop?: number;
  scrollLeft?: number;

  headerHeight?: number;
  footerHeight?: number;
  itemHeight?: number;
  itemPadding?: number;
  frozenColumnIndex?: number;

  selectedIdsMap?: Map<number, any>;
  sortParams?: Record<string, RFDGSortParam>;
  page?: RFDGPage;
  data?: RFDGDataItem<T>[];
}

function Table<T>(props: Props<T>) {
  const setInitialized = useAppStore(s => s.setInitialized);
  const width = useAppStore(s => s.width);
  const height = useAppStore(s => s.height);
  const containerBorderWidth = useAppStore(s => s.containerBorderWidth);
  const className = useAppStore(s => s.className);
  const itemHeight = useAppStore(s => s.itemHeight);
  const itemPadding = useAppStore(s => s.itemPadding);

  const headerHeight = useAppStore(s => s.headerHeight);
  const footerHeight = useAppStore(s => s.footerHeight);
  const scrollLeft = useAppStore(s => s.scrollLeft);
  const scrollTop = useAppStore(s => s.scrollTop);
  const contentBodyHeight = useAppStore(s => s.contentBodyHeight);
  const columns = useAppStore(s => s.columns);
  const data = useAppStore(s => s.data);
  const setScroll = useAppStore(s => s.setScroll);
  const trHeight = itemHeight + itemPadding * 2 + 1;
  const paddingTop = Math.floor(scrollTop / trHeight) * trHeight;
  const frozenColumnsWidth = useAppStore(s => s.frozenColumnsWidth);
  const rowSelection = useAppStore(s => s.rowSelection);
  const page = useAppStore(s => s.page);
  const loading = useAppStore(s => s.loading);
  const spinning = useAppStore(s => s.spinning);

  const setHeight = useAppStore(s => s.setHeight);
  const setContentBodyHeight = useAppStore(s => s.setContentBodyHeight);
  const setDisplayItemCount = useAppStore(s => s.setDisplayItemCount);
  const setWidth = useAppStore(s => s.setWidth);
  const setLoading = useAppStore(s => s.setLoading);
  const setSpinning = useAppStore(s => s.setSpinning);

  const setHeaderHeight = useAppStore(s => s.setHeaderHeight);
  const setFooterHeight = useAppStore(s => s.setFooterHeight);
  const setItemHeight = useAppStore(s => s.setItemHeight);
  const setItemPadding = useAppStore(s => s.setItemPadding);
  const setFrozenColumnIndex = useAppStore(s => s.setFrozenColumnIndex);
  const setSelectedIdsMap = useAppStore(s => s.setSelectedIdsMap);
  const setSortParams = useAppStore(s => s.setSortParams);
  const setFrozenColumnsWidth = useAppStore(s => s.setFrozenColumnsWidth);
  const setPage = useAppStore(s => s.setPage);
  const setData = useAppStore(s => s.setData);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const frozenScrollContainerRef = React.useRef<HTMLDivElement>(null);

  const onScroll = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollLeft } = scrollContainerRef.current;
      setScroll(scrollTop, scrollLeft);
    }
  }, [setScroll]);

  const onWheel: (this: HTMLDivElement, ev: HTMLElementEventMap['wheel']) => any = React.useCallback(evt => {
    evt.preventDefault();

    if (scrollContainerRef.current) {
      const delta = { x: 0, y: 0 };

      if ((evt as any).detail) {
        delta.y = (evt as any).detail * 10;
      } else {
        if (typeof evt.deltaY === 'undefined') {
          delta.y = -(evt as any).wheelDelta;
          delta.x = 0;
        } else {
          delta.y = evt.deltaY;
          delta.x = evt.deltaX;
        }
      }

      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollTop + delta.y;
    }
  }, []);

  React.useEffect(() => {
    if (props.height !== undefined) {
      const propsHeight = Math.max(props.height, 100);
      setHeight(propsHeight);
      const contentBodyHeight = propsHeight - headerHeight - (page ? footerHeight : 0) - containerBorderWidth * 2;
      const displayItemCount = Math.ceil(contentBodyHeight / (itemHeight + itemPadding * 2));

      setContentBodyHeight(contentBodyHeight);
      setDisplayItemCount(displayItemCount);
    }
  }, [
    setHeight,
    props.height,
    height,
    headerHeight,
    page,
    footerHeight,
    containerBorderWidth,
    itemHeight,
    itemPadding,
    setContentBodyHeight,
    setDisplayItemCount,
  ]);

  React.useEffect(() => {
    if (props.width !== undefined) {
      setWidth(Math.max(props.width, 100));
    }
  }, [setWidth, props.width]);
  React.useEffect(() => {
    if (props.loading !== undefined) setLoading(props.loading);
  }, [setLoading, props.loading]);
  React.useEffect(() => {
    if (props.spinning !== undefined) setSpinning(props.spinning);
  }, [setSpinning, props.spinning]);
  React.useEffect(() => {
    if (props.headerHeight !== undefined) setHeaderHeight(Math.max(props.headerHeight, 22));
  }, [setHeaderHeight, props.headerHeight]);
  React.useEffect(() => {
    if (props.footerHeight !== undefined) setFooterHeight(props.footerHeight);
  }, [setFooterHeight, props.footerHeight]);
  React.useEffect(() => {
    if (props.itemHeight !== undefined) setItemHeight(props.itemHeight);
  }, [setItemHeight, props.itemHeight]);
  React.useEffect(() => {
    if (props.itemPadding !== undefined) setItemPadding(props.itemPadding);
  }, [setItemPadding, props.itemPadding]);
  React.useEffect(() => {
    if (props.frozenColumnIndex !== undefined) {
      const frozenColumnsWidth = getFrozenColumnsWidth({
        rowSelection,
        itemHeight,
        frozenColumnIndex: props.frozenColumnIndex,
        columns,
      });
      setFrozenColumnsWidth(frozenColumnsWidth);
      setFrozenColumnIndex(props.frozenColumnIndex);
    }
  }, [setFrozenColumnIndex, props.frozenColumnIndex, rowSelection, itemHeight, columns, setFrozenColumnsWidth]);
  React.useEffect(() => {
    if (props.selectedIdsMap !== undefined) setSelectedIdsMap(props.selectedIdsMap);
  }, [setSelectedIdsMap, props.selectedIdsMap]);
  React.useEffect(() => {
    if (props.sortParams !== undefined) setSortParams(props.sortParams);
  }, [setSortParams, props.sortParams]);
  React.useEffect(() => {
    if (props.page !== undefined) setPage({ ...props.page });
  }, [
    setPage,
    props.page,
    props.page?.currentPage,
    props.page?.loading,
    props.page?.pageSize,
    props.page?.totalPages,
    props.page?.totalElements,
    props.page?.onChange,
    props.page?.displayPaginationLength,
  ]);
  React.useEffect(() => {
    if (props.data !== undefined) setData(props.data);
  }, [setData, props.data]);

  //setInitialized
  React.useEffect(() => {
    setInitialized(true);

    const scrollContainerRefCurrent = scrollContainerRef?.current;
    const frozenScrollContainerRefCurrent = frozenScrollContainerRef?.current;
    if (scrollContainerRefCurrent) {
      scrollContainerRefCurrent.removeEventListener('scroll', onScroll);
      scrollContainerRefCurrent.addEventListener('scroll', onScroll, { passive: true, capture: true });
      scrollContainerRefCurrent.scrollLeft = props.scrollLeft ?? scrollLeft;
      scrollContainerRefCurrent.scrollTop = props.scrollTop ?? scrollTop;
    }

    if (frozenScrollContainerRefCurrent) {
      frozenScrollContainerRefCurrent.removeEventListener('wheel', onWheel);
      frozenScrollContainerRefCurrent.addEventListener('wheel', onWheel);
    }

    return () => {
      scrollContainerRefCurrent?.removeEventListener('scroll', onScroll);
      frozenScrollContainerRefCurrent?.removeEventListener('wheel', onWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.scrollTop, props.scrollLeft]);

  return (
    <Container
      ref={containerRef}
      role={'react-frame-datagrid'}
      style={{ width, height, borderWidth: `${containerBorderWidth}px` }}
      className={className}
    >
      <HeaderContainer style={{ height: headerHeight }} role={'rfdg-header-container'}>
        {frozenColumnsWidth > 0 && (
          <FrozenHeader
            style={{
              width: frozenColumnsWidth,
            }}
            role={'rfdg-frozen-header'}
          >
            <TableHeadFrozen container={containerRef} />
          </FrozenHeader>
        )}
        <Header style={{ marginLeft: -scrollLeft, paddingLeft: frozenColumnsWidth }} role={'rfdg-header'}>
          <TableHead container={containerRef} />
        </Header>
      </HeaderContainer>

      <BodyContainer style={{ height: contentBodyHeight }}>
        {frozenColumnsWidth > 0 && (
          <FrozenScrollContent
            ref={frozenScrollContainerRef}
            style={{
              width: frozenColumnsWidth,
            }}
            role={'rfdg-frozen-scroll-container'}
          >
            <TableBodyFrozen
              style={{
                marginTop: -scrollTop % trHeight,
              }}
            />
          </FrozenScrollContent>
        )}
        <ScrollContainer ref={scrollContainerRef} role={'rfdg-scroll-container'}>
          <ScrollContent
            style={{
              paddingTop: paddingTop,
              height: data.length * trHeight,
            }}
          >
            <TableBody />
          </ScrollContent>
        </ScrollContainer>

        <Loading active={!!spinning} size={'small'} />
      </BodyContainer>

      {page && (
        <FooterContainer style={{ height: footerHeight }} role={'rfdg-footer-container'}>
          <TableFooter />
        </FooterContainer>
      )}
      <Loading active={!!loading} />
    </Container>
  );
}

const Container = styled.div`
  border-color: var(--rfdg-border-color-base);
  border-style: solid;
  box-sizing: border-box;
  position: relative;
`;

const HeaderContainer = styled.div`
  background: var(--rfdg-header-bg);
  position: relative;
  min-width: 100%;
  overflow: hidden;
`;

const Header = styled.div`
  z-index: 1;
`;

const FrozenHeader = styled.div`
  position: absolute;
  background-color: var(--rfdg-header-bg);
  border-right: 1px solid var(--rfdg-border-color-base);
  box-shadow: 0 0 3px var(--rfdg-border-color-base);
  z-index: 3;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
  background-color: var(--rfdg-scroll-track-bg);
  overflow: hidden;
`;

const ScrollContainer = styled.div`
  position: relative;
  overflow: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: var(--rfdg-scroll-size);
    height: var(--rfdg-scroll-size);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--rfdg-scroll-thumb-bg);
    border-radius: var(--rfdg-scroll-thumb-radius);
    border: 2px solid var(--rfdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--rfdg-scroll-thumb-hover-bg);
    border: 1px solid var(--rfdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-track {
    background-color: var(--rfdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-track:vertical {
    background-color: var(--rfdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-track:horizontal {
    background-color: var(--rfdg-scroll-track-bg);
  }

  &::-webkit-scrollbar-corner {
    background-color: var(--rfdg-scroll-track-corner-bg);
  }
`;

const ScrollContent = styled.div`
  position: absolute;
  min-width: 100%;
  z-index: 1;
`;

const FrozenScrollContent = styled.div`
  flex: none;
  border-right: 1px solid var(--rfdg-border-color-base);
  box-shadow: 0 0 3px var(--rfdg-border-color-base);
  z-index: 2;
  overflow: hidden;
  position: relative;
`;

const FooterContainer = styled.div`
  position: relative;
  min-width: 100%;
  overflow: hidden;
  background: var(--rfdg-footer-bg);
  border-top: 1px solid var(--rfdg-border-color-base);
`;

export default Table;

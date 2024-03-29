import * as React from 'react';
import styled from '@emotion/styled';
import { RFDataGrid, RFDGColumn } from '../react-frame-datagrid';
import { Button, Divider, Space } from 'antd';

interface Props {}

interface IListItem {
  id: string;
  title: string;
  writer: string;
  createAt: string;
}

const list = Array.from(Array(1000)).map((v, i) => ({
  values: {
    id: `ID_${i}`,
    title: `title_${i}`,
    writer: `writer_${i}`,
    createAt: `2022-09-08`,
  },
}));

function LoadingExample(props: Props) {
  const [loading, setLoading] = React.useState(false);
  const [spinning, setSpinning] = React.useState(false);
  const [width, setWidth] = React.useState(800);
  const [height, setHeight] = React.useState(300);
  const [columns, setColumns] = React.useState<RFDGColumn<IListItem>[]>([
    {
      key: 'id',
      label: '아이디 IS LONG !',
      width: 100,
      sortDisable: true,
    },
    {
      key: 'title',
      label: '제목',
      width: 300,
      itemRender: item => {
        return `${item.writer}//${item.title}`;
      },
    },
    {
      key: 'writer',
      label: '작성자',
      width: 100,
      itemRender: item => {
        return `${item.writer}//A`;
      },
    },
    {
      key: 'createAt',
      label: '작성일',
      width: 100,
    },
  ]);

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.clientWidth);
    }
  }, []);

  return (
    <Container ref={containerRef}>
      <RFDataGrid<IListItem>
        width={width}
        height={height}
        headerHeight={35}
        data={list}
        columns={columns}
        onChangeColumns={(columnIndex, width, columns) => {
          console.log('onChangeColumnWidths', columnIndex, width, columns);
          setColumns(columns);
        }}
        rowSelection={{
          selectedIds: [],
          onChange: (ids, selectedAll) => {
            console.log('onChange rowSelection', ids, selectedAll);
          },
        }}
        loading={loading}
        spinning={spinning}
      />

      <br />

      <Space wrap>
        <Button onClick={() => setLoading(true)}>Loading : true</Button>
        <Button onClick={() => setLoading(false)}>Loading : false</Button>
        <Button onClick={() => setSpinning(true)}>Spinning : true</Button>
        <Button onClick={() => setSpinning(false)}>Spinning : false</Button>
      </Space>
    </Container>
  );
}

const Container = styled.div`
  font-size: 13px;
`;

export default LoadingExample;

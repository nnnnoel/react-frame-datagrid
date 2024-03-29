import { RFDGColumn, RFDGRowSelection } from '../types';

interface Props<T> {
  rowSelection?: RFDGRowSelection;
  itemHeight: number;
  frozenColumnIndex: number;
  columns: RFDGColumn<T>[];
}

export function getFrozenColumnsWidth<T>({ rowSelection, itemHeight, frozenColumnIndex, columns }: Props<T>) {
  let frozenColumnsWidth: number = 0;
  if (!!rowSelection) {
    frozenColumnsWidth += Math.min(itemHeight, 15) + 7 * 2;
  }
  if (frozenColumnIndex > 0) {
    frozenColumnsWidth += columns.slice(0, frozenColumnIndex).reduce((acc, cur) => {
      return acc + (cur.width ?? 0);
    }, 0);
  }
  return frozenColumnsWidth;
}

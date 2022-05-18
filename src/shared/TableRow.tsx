type Props = { data: any };

const TableRow: React.FC<Props> = ({ data }) => {
  const cols = [];
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const element = data[key];
      cols.push(element);
    }
  }
  return (
    <div className="table-row">
      {cols.map((c) => (
        <div className="col">{c}</div>
      ))}
    </div>
  );
};

export default TableRow;

const AtomicBlock = (props) => {
  const { block, contentState } = props;
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src, height, width } = entity.getData();
    if (entity.getType() === 'DATETIME') {
      const value = entity.getData().value;
      return <div>{value}</div>;
    }
 
  if (entity.getType() === 'TABLE') {
    const { rows, columns } = entity.getData();

    return (
      <table>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td
                 style={{border:'1px solid black'}}
                >
               
                  Cell {rowIndex + 1}-{colIndex + 1}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return <img src={src} alt="Uploaded" style={{ width, height, maxWidth: '100%' }} />;
};

export const blockRenderer = (contentBlock) => {
  const type = contentBlock.getType();

  if (type === 'atomic') {
    return {
      component: AtomicBlock,
      editable: false,
    };
  }

  return null;
};


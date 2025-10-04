import React from 'react';
import Grid2, { Grid2Props } from '@mui/material/Grid2';

type FiligranGridProps = Grid2Props;

const FiligranGrid = (props: FiligranGridProps) => {
  if (Object.prototype.hasOwnProperty.call(props, 'xs')) {
    throw new Error('xs is deprecated, use size instead');
  }
  return <Grid2 {...props} />;
};

export default FiligranGrid;

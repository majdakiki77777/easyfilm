import React from 'react';
import { Typography, Button } from '@mui/material';
import useStyles from './pagistyles';

const Pagination = ({ currentPage, setPage, totalPages }) => {
  const classes = useStyles();

  const handlePrev = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1); // ✅ PASS VALUE
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1); // ✅ PASS VALUE
    }
  };

  if (totalPages === 0) return null;

  return (
    <div className={classes.container}>
      <Button onClick={handlePrev} className={classes.button} variant='contained' color="primary">
        Prev
      </Button>

      <Typography variant='h4' className={classes.pageNumber}>
        {currentPage}
      </Typography>

      <Button onClick={handleNext} className={classes.button} variant='contained' color="primary">
        Next
      </Button>
    </div>
  );
};

export default Pagination;

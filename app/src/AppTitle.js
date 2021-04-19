import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MySvg from './microscope-1.svg';
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles({
  imageIcon: {
    display: 'flex',
    justifyContent: 'flex-end',
    height: '10%',
    width: '10%'
  },
  wrapicon: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  wraptitle: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  titleTest: {
    display: 'flex',
    justifyContent: 'center'
  },
});

const AppTitleTest = () => {
  const classes = useStyles();
  return (
    <Grid className={classes.titleTest} container direction="row" align='center'>
      <Button
          variant="contained"
          color="secondary"
          startIcon={<Avatar
            src={
              process.env.PUBLIC_URL + "/microscope.png"
            }
            variant='square'
          />}
        >
        <Typography variant="h4">
            MicroMap
        </Typography>
      </Button>
    </Grid>
  );
}

export {
  AppTitleTest
};

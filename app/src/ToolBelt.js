import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { DisplayBoard } from './DisplayBoard';
import { EditBoard } from './EditBoard';
import { SlideSelector } from './SlideSelector';
import { BasicTextFields } from './AddLayer'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  divider:{
    background: "white"
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: '#282c34',
    color: 'white'
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    background: '#282c34',
    color: 'white'
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const ToolBelt = ({classList, displayOnSwitch, editOnRadioChange, slides, resetSlide, resetInit, addLayer}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // console.log("Debug ToolBelt: ");
    // console.log("-----------");
    // console.log("Provided annotations: ", classList);
    // console.log("re-render ToolBelt");
    // console.log("-----------\n\n");
  });

  return (
    <div>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <ChevronRightIcon />
          </IconButton>
          <SlideSelector slides={slides}
                         resetImage={resetSlide}
                         resetInit={resetInit}/>
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Typography gutterBottom variant="h4">
              Tool Belt
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon style={{fill: "white"}}/> : <ChevronRightIcon style={{fill: "white"}}/>}
          </IconButton>
        </div>

        <Divider
          classes={{
            root: classes.divider,
          }} />


        <div style={{marginTop: "35px"}}>
          <Typography gutterBottom variant="h6">
              Display
          </Typography>
        </div>

        <Divider
          variant="middle"
          classes={{
            root: classes.divider,
          }} />

        <DisplayBoard classList={classList} onSwitch={displayOnSwitch} />


        <div style={{marginTop: "35px"}}>
          <Typography gutterBottom variant="h6">
              Edit
          </Typography>
        </div>

        <Divider
          variant="middle"
          classes={{
            root: classes.divider,
          }} />

        <EditBoard classList={classList} onRadioChange={editOnRadioChange} />

        <BasicTextFields addLayer={addLayer}/>

      </Drawer>

    </div>
  );
}

export {
  ToolBelt
};

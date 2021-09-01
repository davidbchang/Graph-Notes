import React from 'react';
import { Theme, createTheme, createStyles, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import ModalHeader from 'react-bootstrap/ModalHeader'
import {
    ModalBody,
    ModalFooter   
} from "react-bootstrap";
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

const drawerWidth = 320;

const darkTheme = createTheme({
    palette: {
      type: 'dark',
    },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginRight: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      dark: '#002884'
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: darkTheme.palette.text.disabled
    },
    drawerContainer: {
        overflow: 'auto',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  }),
);

type IDrawerProps = {
    activeItem: any,
    onDelete: (any) => any,
    onHide: () => any,
    onEdit: (any) => any,
    show: boolean
};

export default function PermanentDrawerRight({
    activeItem,
    onDelete,
    onHide,
    onEdit,
    show
}: IDrawerProps) {
  const classes = useStyles();

  let body = <div className={classes.root}>
  <Drawer
    className={classes.drawer}
    variant="permanent"
    classes={{
      paper: classes.drawerPaper,
    }}
    anchor="right"
  >
    <div className={classes.toolbar} />

    <ModalHeader style={{justifyContent: "center", alignItems: "center"}}>
      <h2 style={{fontWeight: 'bold', color: 'black' }}>
        {activeItem.title}
      </h2>
    </ModalHeader>
    
    <Divider />
    <ModalBody>
      <p style={{fontWeight: 'bold', color: 'black' }}>
          Priority: {activeItem.priority}
      </p>
      <p style={{color: 'black' }}>
          {activeItem.description}
      </p>
    </ModalBody>
    <ModalFooter>
      <Button 
      variant="contained"
      color="default" 
      onClick={onEdit}>
          Edit
      </Button>
      <Button 
      variant="contained"
      color="secondary" 
      startIcon={<DeleteIcon />}
      onClick={() => {
          onDelete(activeItem);
          onHide();
      }}>
          Delete
      </Button>
    </ModalFooter>
  </Drawer>
</div>

  return (
    <>
      {show ? (body) : null}
    </>
  );
}
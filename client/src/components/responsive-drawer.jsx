
import React from 'react';
import Drawer from 'material-ui/Drawer';
import Hidden from 'material-ui/Hidden';

const ResponsiveDrawer = ({ drawerClasses, anchor = 'left', children, isOpen, handleClose, id  }) => {
  return (
    [
      <Hidden lgUp key={`hidden-up-drawer-${id}`}>
        <Drawer
          type="temporary"
          anchor={anchor}
          open={isOpen}
          onRequestClose={handleClose}
          classes={drawerClasses}
        >
          {children}
        </Drawer>
      </Hidden>,
      <Hidden mdDown key={`hidden-down-drawer-${id}`}>
        <Drawer
          type="permanent"
          open
          anchor={anchor}
          classes={drawerClasses}
        >
          {children}
        </Drawer>
      </Hidden>
    ]
  );
};

export default ResponsiveDrawer;

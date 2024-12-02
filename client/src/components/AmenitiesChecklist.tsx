import React from "react";
import {List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, IconButton, Checkbox, Collapse} from "@mui/material";
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const amenitiesOptions = [
    "Pool",
    "Gym",
    "Parking",
    "Elevator",
    "Garden",
    "Playground",
    "Rooftop",
    "Security",
    "Pet-friendly",
    "Community Room"
]

export const AmenitiesChecklist = ({ 
    checked,
    setChecked,
  }: {
    checked: string[];
    setChecked: (array: string[]) => void;
  }) => {
    const [open, setOpen] = React.useState(false);
  
    const handleCollapseToggle = () => {
      setOpen(!open);
    };
  
    const handleToggle = (value: string) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
  
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
  
      setChecked(newChecked);
    };
  
    return (
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        subheader={
          <ListSubheader component="div" onClick={handleCollapseToggle}>
            <IconButton onClick={handleCollapseToggle} sx={{ float: 'right' }}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            Amenities
          </ListSubheader>
        }
      >
        <Collapse in={open} timeout="auto" unmountOnExit>
          {amenitiesOptions.map((value) => (
            <ListItem key={value} disablePadding>
              <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.includes(value)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText id={value} primary={value} />
              </ListItemButton>
            </ListItem>
          ))}
        </Collapse>
      </List>
    );
  };
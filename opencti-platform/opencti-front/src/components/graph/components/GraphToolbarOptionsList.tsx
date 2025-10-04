import React from 'react'; import { Checkbox, List, ListItemButton, ListItemIcon, ListItemText, Popover } from '@components';

interface GraphToolbarOptionsListProps<T> {
  onClose: () => void
  onSelect: (o: T) => void
  options: T[]
  getOptionKey: (o:T) => string
  getOptionText: (o:T) => string
  isOptionSelected?: (o: T) => boolean
  anchorEl?: Element
  isMultiple?: boolean
}

function GraphToolbarOptionsList<T>({
  onClose,
  onSelect,
  options,
  getOptionKey,
  getOptionText,
  anchorEl,
  isMultiple = false,
  isOptionSelected = () => false,
}: GraphToolbarOptionsListProps<T>) {
  return (
    <Popover
      open={!!anchorEl}
      anchorEl={anchorEl}
      onClose={onClose}
    >
      <List>
        {options.map((option) => (
          <ListItemButton
            dense
            key={getOptionKey(option)}
            onClick={() => onSelect(option)}
          >
            {isMultiple && (
              <ListItemIcon sx={{ minWidth: 0 }}>
                <Checkbox
                  edge="start"
                  disableRipple
                  sx={{ paddingTop: 0.5, paddingBottom: 0.5 }}
                  checked={isOptionSelected(option)}
                />
              </ListItemIcon>
            )}
            <ListItemText primary={getOptionText(option)} />
          </ListItemButton>
        ))}
      </List>
    </Popover>
  );
}

export default GraphToolbarOptionsList;

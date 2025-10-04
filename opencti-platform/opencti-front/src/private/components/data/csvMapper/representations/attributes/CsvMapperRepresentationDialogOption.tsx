import React, { FunctionComponent, ReactNode, useMemo } from 'react';
import { CogOutline } from 'mdi-material-ui';
import { CsvMapperRepresentationAttributeFormData } from '@private/components/data/csvMapper/representations/attributes/Attribute';
import { Badge, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@components';
import { useFormatter } from '../../../../../../components/i18n';

interface CsvMapperRepresentationDialogOptionProps {
  children: ReactNode
  configuration?: CsvMapperRepresentationAttributeFormData
}

const CsvMapperRepresentationDialogOption: FunctionComponent<CsvMapperRepresentationDialogOptionProps> = ({ children, configuration }) => {
  const [open, setOpen] = React.useState(false);
  const { t_i18n } = useFormatter();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const visible = useMemo(() => {
    const hasDefaultValues = (!!configuration?.default_values || configuration?.default_values === false) && JSON.stringify(configuration.default_values) !== '[]';
    const hasDatePattern = !!configuration?.pattern_date;
    const hasSeparator = !!configuration?.separator;
    return hasDefaultValues || hasDatePattern || hasSeparator;
  }, [configuration]);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <IconButton
        color="primary"
        aria-label={t_i18n('Settings')}
        onClick={handleClickOpen}
        size="large"
      >
        <Badge color="secondary" variant="dot" invisible={!visible}>
          <CogOutline/>
        </Badge>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="csv-mapper-dialog-title"
        aria-describedby="Configure optional settings to the field"
      >
        <DialogTitle id="csv-mapper-dialog-title">
          {t_i18n('Attribute mapping configuration')}
        </DialogTitle>
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            {t_i18n('Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CsvMapperRepresentationDialogOption;

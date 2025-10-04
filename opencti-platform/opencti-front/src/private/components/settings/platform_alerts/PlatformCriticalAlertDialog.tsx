import React, { useState } from 'react';
import GroupWithNullConfidenceLevelAlertContent from '@private/components/settings/platform_alerts/GroupWithNullConfidenceLevelAlertContent';
import { Dialog, DialogContent, DialogTitle } from '@components';
import { useFormatter } from '../../../../components/i18n';
import { RootSettings$data } from '../../../__generated__/RootSettings.graphql';
import Transition from '../../../../components/Transition';
import useGranted, { SETTINGS_SETACCESSES } from '../../../../utils/hooks/useGranted';

type PlatformCriticalAlertDialogProps = {
  alerts: RootSettings$data['platform_critical_alerts']
};

const PlatformCriticalAlertDialog: React.FC<PlatformCriticalAlertDialogProps> = ({ alerts }) => {
  const { t_i18n } = useFormatter();
  const hasSetAccesses = useGranted([SETTINGS_SETACCESSES]);

  const [open, setOpen] = useState<boolean>(alerts.length > 0);

  // we only display the first alert if any.
  const alert = alerts[0];

  if (!alert || !hasSetAccesses) {
    return null;
  }

  const closeHandler = () => {
    setOpen(false);
  };

  const getDialogContentFromAlertType = () => {
    switch (alert.type) {
      case 'GROUP_WITH_NULL_CONFIDENCE_LEVEL': {
        return <GroupWithNullConfidenceLevelAlertContent alert={alert} closeHandler={closeHandler} />;
      }
      default:
        return <DialogContent>{t_i18n('Unknown configuration error in the platform.')}</DialogContent>;
    }
  };

  return (
    <Dialog
      open={open}
      slotProps={{ paper: { elevation: 1 } }}
      slots={{ transition: Transition }}
      onClose={closeHandler}
    >
      <DialogTitle>{t_i18n('Important notice: your action is required!')}</DialogTitle>
      {getDialogContentFromAlertType()}
    </Dialog>
  );
};

export default PlatformCriticalAlertDialog;

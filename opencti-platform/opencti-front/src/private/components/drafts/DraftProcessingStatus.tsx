import React, { FunctionComponent, useState } from 'react';
import Drawer from '@private/components/common/drawer/Drawer';
import CircularProgress from '@mui/material/CircularProgress';
import { CheckCircleOutlined } from '@mui/icons-material';
import { Alert, Badge, Tab, Tabs, Tooltip } from '@components';
import { useFormatter } from '../../../components/i18n';
import useDraftContext from '../../../utils/hooks/useDraftContext';
import DraftWorks from './DraftWorks';
import DraftTasks from './DraftTasks';

interface DraftProcessingStatusProps {
  forceRefetch: () => void;
}
const DraftProcessingStatus: FunctionComponent<DraftProcessingStatusProps> = ({ forceRefetch }) => {
  const { t_i18n } = useFormatter();
  const [displayProcesses, setDisplayProcesses] = useState(false);
  const [tabValue, setTabValue] = useState<string>('Works');
  const draftContext = useDraftContext();
  const currentDraftId = draftContext ? draftContext.id : '';
  const currentDraftProcessingCount = draftContext?.processingCount ?? 0;
  const isCurrentDraftProcessing = currentDraftProcessingCount > 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {!isCurrentDraftProcessing && (
        <Tooltip title={t_i18n('No processes running')}>
          <CheckCircleOutlined
            onClick={() => { setDisplayProcesses(true); }}
            color="success"
            style={{ cursor: 'pointer' }}
          />
        </Tooltip>
      )}
      {isCurrentDraftProcessing && (
        <Tooltip title={t_i18n('Processes currently running')}>
          <Badge
            badgeContent={currentDraftProcessingCount}
            color="warning"
          >
            <CircularProgress
              onClick={() => { forceRefetch(); setDisplayProcesses(true); }}
              variant={'indeterminate'}
              size={25}
              style={{ cursor: 'pointer' }}
            />
          </Badge>
        </Tooltip>)}
      <Drawer
        title={t_i18n('Draft processes')}
        open={displayProcesses}
        onClose={() => { setDisplayProcesses(false); }}
      >
        <>
          <Alert severity="info">{t_i18n('This page lists the most recent works and tasks of the current draft')}</Alert>
          <Tabs style={{ paddingBottom: 10 }} value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label={t_i18n('Works')} value="Works" />
            <Tab label={t_i18n('Tasks')} value="Tasks" />
          </Tabs>
          {tabValue === 'Works' && (<DraftWorks draftId={currentDraftId}/>)}
          {tabValue === 'Tasks' && (<DraftTasks draftId={currentDraftId}/>)}
        </>
      </Drawer>
    </div>
  );
};

export default DraftProcessingStatus;

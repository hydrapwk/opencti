import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  StixCoreObjectHistoryLinesQuery,
  StixCoreObjectHistoryLinesQuery$variables,
} from '@private/components/common/stix_core_objects/__generated__/StixCoreObjectHistoryLinesQuery.graphql';
import { Avatar, List, ListItem, ListItemIcon, ListItemText, Paper, Skeleton, Typography } from '@components';
import StixCoreObjectHistoryLines, { stixCoreObjectHistoryLinesQuery } from './StixCoreObjectHistoryLines';
import { useFormatter } from '../../../../components/i18n';
import useQueryLoading from '../../../../utils/hooks/useQueryLoading';

type StixCoreObjectLatestHistoryProps = {
  stixCoreObjectId: string;
};

const StixCoreObjectLatestHistory = ({ stixCoreObjectId }: StixCoreObjectLatestHistoryProps) => {
  const { t_i18n } = useFormatter();
  const theme = useTheme();

  const paginationOptions: StixCoreObjectHistoryLinesQuery$variables = {
    filters: {
      mode: 'and',
      filterGroups: [],
      filters: [
        { key: ['context_data.id'], values: [stixCoreObjectId] },
        {
          key: ['event_type'],
          values: ['mutation', 'create', 'update', 'delete', 'merge'],
        },
      ],
    },
    first: 7,
    orderBy: 'timestamp',
    orderMode: 'desc',
  };

  const queryRef = useQueryLoading<StixCoreObjectHistoryLinesQuery>(
    stixCoreObjectHistoryLinesQuery,
    paginationOptions,
  );

  return (
    <>
      <Typography variant="h4">
        {t_i18n('Most recent history')}
      </Typography>
      {queryRef
        && <React.Suspense
          fallback={<Paper
            sx={{
              marginTop: theme.spacing(1),
              padding: 0,
              borderRadius: 4,
            }}
            variant="outlined"
            className={'paper-for-grid'}
                    >
            <List>
              {Array.from(Array(5), (e, i) => (
                <ListItem
                  key={`latest_history_skel_${i}`}
                  dense
                  divider
                >
                  <ListItemIcon>
                    <Avatar>{i}</Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        width="90%"
                        height={15}
                        style={{ marginBottom: 10 }}
                      />
                    }
                    secondary={
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        width="90%"
                        height={15}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>}
           >
          <StixCoreObjectHistoryLines
            queryRef={queryRef}
            isRelationLog={false}
            paginationOptions={paginationOptions}
          />
        </React.Suspense>
      }
    </>
  );
};

export default StixCoreObjectLatestHistory;

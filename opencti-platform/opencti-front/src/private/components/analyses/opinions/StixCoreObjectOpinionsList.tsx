import React, { FunctionComponent } from 'react';
import { graphql, usePreloadedQuery } from 'react-relay';
import { PreloadedQuery } from 'react-relay/relay-hooks/EntryPointTypes';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@components';
import OpinionPopover from './OpinionPopover';
import { truncate } from '../../../../utils/String';
import ItemMarkings from '../../../../components/ItemMarkings';
import { StixCoreObjectOpinionsListQuery } from './__generated__/StixCoreObjectOpinionsListQuery.graphql';
import { useFormatter } from '../../../../components/i18n';
import ItemIcon from '../../../../components/ItemIcon';

export const stixCoreObjectOpinionsListQuery = graphql`
  query StixCoreObjectOpinionsListQuery(
    $first: Int
    $orderBy: OpinionsOrdering
    $orderMode: OrderingMode
    $filters: FilterGroup
  ) {
    opinions(      
      first: $first
      orderBy: $orderBy
      orderMode: $orderMode
      filters: $filters
    ) {
      edges {
        node {
          id
          opinion
          explanation
          createdBy {
            name
            id
          }
          objectMarking {
            id
            definition_type
            definition
          }
        }
      }
    }
  }
`;

interface StixCoreObjectOpinionsListProps {
  queryRef: PreloadedQuery<StixCoreObjectOpinionsListQuery>
  open: boolean,
  handleClose: () => void,
  onDelete: () => void
}

const StixCoreObjectOpinionsList: FunctionComponent<StixCoreObjectOpinionsListProps> = ({ queryRef, open, handleClose, onDelete }) => {
  const { t_i18n } = useFormatter();
  const { opinions } = usePreloadedQuery<StixCoreObjectOpinionsListQuery>(stixCoreObjectOpinionsListQuery, queryRef);
  return (
    <Dialog
      slotProps={{ paper: { elevation: 1 } }}
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle>
        {t_i18n('List of opinions')}
      </DialogTitle>
      <DialogContent>
        <List>
          {opinions && (opinions.edges ?? []).map((opinionEdge) => {
            const opinion = opinionEdge?.node;
            return (
              <ListItem
                key={opinion?.id}
                divider={true}
                disablePadding
                secondaryAction={opinion
                  && <OpinionPopover
                    opinion={opinion}
                    variant='inList'
                    onDelete={() => {
                      onDelete();
                      handleClose();
                    }}
                     />
                }
              >
                <ListItemButton
                  component={Link}
                  to={`/dashboard/analyses/opinions/${opinion?.id}`}
                >
                  <ListItemIcon>
                    <ItemIcon type="Opinion" />
                  </ListItemIcon>
                  <ListItemText
                    primary={opinion?.opinion}
                    secondary={
                      <Tooltip title={opinion?.explanation}>
                        <span>{truncate(opinion?.explanation, 80)}</span>
                      </Tooltip>
                  }
                    sx={{
                      flex: 'none',
                      width: '400px',
                      marginRight: '50px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />
                  <Tooltip title={opinion?.createdBy?.name ?? '-'}>
                    <div style={{
                      marginRight: 50,
                      width: '200px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    >
                      {opinion?.createdBy?.name ?? '-'}
                    </div>
                  </Tooltip>
                  <div style={{ marginRight: 50 }}>
                    <ItemMarkings
                      variant="inList"
                      markingDefinitions={opinion?.objectMarking ?? []}
                      limit={1}
                    />
                  </div>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default StixCoreObjectOpinionsList;

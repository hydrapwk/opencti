import React, { useState } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import makeStyles from '@mui/styles/makeStyles';
import { OpenInBrowserOutlined } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Paper, Tooltip, Typography } from '@components';
import { ExternalReferenceDetails_externalReference$data } from './__generated__/ExternalReferenceDetails_externalReference.graphql';
import { useFormatter } from '../../../../components/i18n';
import ItemCreators from '../../../../components/ItemCreators';
import Transition from '../../../../components/Transition';
import type { Theme } from '../../../../components/Theme';

// Deprecated - https://mui.com/system/styles/basics/
// Do not use it for new code.
const useStyles = makeStyles<Theme>((theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    padding: '15px',
    borderRadius: 4,
  },
}));

interface ExternalReferenceDetailsComponentProps {
  externalReference: ExternalReferenceDetails_externalReference$data;
}

const ExternalReferenceDetailsComponent = ({
  externalReference,
}: ExternalReferenceDetailsComponentProps) => {
  const classes = useStyles();
  const { t_i18n } = useFormatter();
  const [displayExternalLink, setDisplayExternalLink] = useState(false);
  const [externalLink, setExternalLink] = useState<string | URL | undefined>(
    undefined,
  );
  const handleOpenExternalLink = (url: string) => {
    setDisplayExternalLink(true);
    setExternalLink(url);
  };

  const handleCloseExternalLink = () => {
    setDisplayExternalLink(false);
    setExternalLink(undefined);
  };

  const handleBrowseExternalLink = () => {
    window.open(externalLink, '_blank');
    setDisplayExternalLink(false);
    setExternalLink(undefined);
  };

  return (
    <div style={{ height: '100%' }}>
      <Typography variant="h4" gutterBottom={true}>
        {t_i18n('Details')}
      </Typography>
      <Paper classes={{ root: classes.paper }} className={'paper-for-grid'} variant="outlined">
        <Grid container={true} spacing={3}>
          <Grid size={6}>
            <Typography variant="h3" gutterBottom={true}>
              {t_i18n('External ID')}
            </Typography>
            {externalReference.external_id ?? '-'}
            <Typography
              variant="h3"
              gutterBottom={true}
              style={{ marginTop: 20 }}
            >
              {t_i18n('Creators')}
            </Typography>
            <ItemCreators creators={externalReference.creators ?? []} />
          </Grid>
          <Grid size={6}>
            <Typography variant="h3" gutterBottom={true}>
              {t_i18n('URL')}
            </Typography>
            <pre style={{ position: 'relative', minHeight: 35 }}>
              {externalReference.url}
              <Tooltip title={t_i18n('Browse the link')}>
                <IconButton
                  onClick={() => handleOpenExternalLink(externalReference.url ?? '')
                  }
                  size="medium"
                  color="primary"
                  style={{ position: 'absolute', right: 0, top: 0 }}
                  disabled={!externalReference.url}
                >
                  <OpenInBrowserOutlined />
                </IconButton>
              </Tooltip>
            </pre>
          </Grid>
        </Grid>
      </Paper>
      <Dialog
        slotProps={{ paper: { elevation: 1 } }}
        open={displayExternalLink}
        keepMounted={true}
        slots={{ transition: Transition }}
        onClose={handleCloseExternalLink}
      >
        <DialogTitle>
          {t_i18n('Are you sure?')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t_i18n('Do you want to browse this external link?')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExternalLink}>{t_i18n('Cancel')}</Button>
          <Button color="secondary" onClick={handleBrowseExternalLink}>
            {t_i18n('Confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const ExternalReferenceDetails = createFragmentContainer(
  ExternalReferenceDetailsComponent,
  {
    externalReference: graphql`
      fragment ExternalReferenceDetails_externalReference on ExternalReference {
        id
        external_id
        url
        creators {
          id
          name
        }
      }
    `,
  },
);

export default ExternalReferenceDetails;

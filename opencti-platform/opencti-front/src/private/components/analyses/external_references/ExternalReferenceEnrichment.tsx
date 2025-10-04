import React, { FunctionComponent, useState } from 'react';
import { CloudRefreshOutline } from 'mdi-material-ui';
import { IconButton, Tooltip } from '@components';
import { ExternalReferenceEnrichmentLinesQuery$data } from './__generated__/ExternalReferenceEnrichmentLinesQuery.graphql';
import { QueryRenderer } from '../../../../relay/environment';
import { useFormatter } from '../../../../components/i18n';
import ExternalReferenceEnrichmentLines, { externalReferenceEnrichmentLinesQuery } from './ExternalReferenceEnrichmentLines';
import Drawer from '../../common/drawer/Drawer';

interface ExternalReferenceEnrichmentProps {
  externalReferenceId: string,
}

const ExternalReferenceEnrichment: FunctionComponent<ExternalReferenceEnrichmentProps> = (
  { externalReferenceId },
) => {
  const { t_i18n } = useFormatter();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'inline-block' }}>
      <Tooltip title={t_i18n('Enrichment')}>
        <IconButton
          onClick={() => setOpen(true)}
          color="primary"
          aria-label="Refresh"
          size="large"
        >
          <CloudRefreshOutline />
        </IconButton>
      </Tooltip>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={t_i18n('Enrichment connectors')}
      >
        <QueryRenderer
          query={externalReferenceEnrichmentLinesQuery}
          variables={{ id: externalReferenceId }}
          render={({ props: queryProps }: { props: ExternalReferenceEnrichmentLinesQuery$data }) => {
            if (
              queryProps
              && queryProps.externalReference
              && queryProps.connectorsForImport
            ) {
              return (
                <ExternalReferenceEnrichmentLines
                  externalReference={queryProps.externalReference}
                  connectorsForImport={queryProps.connectorsForImport}
                />
              );
            }
            return <div />;
          }}
        />
      </Drawer>
    </div>
  );
};

export default ExternalReferenceEnrichment;

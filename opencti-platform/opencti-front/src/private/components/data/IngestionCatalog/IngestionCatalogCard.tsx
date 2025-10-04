import React from 'react';
import { VerifiedOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import IngestionCatalogChip from '@private/components/data/IngestionCatalog/IngestionCatalogUseCaseChip';
import { useTheme } from '@mui/styles';
import { IngestionConnector } from '@private/components/data/IngestionCatalog';
import EnterpriseEditionButton from '@private/components/common/entreprise_edition/EnterpriseEditionButton';
import { truncate } from 'src/utils/String';
import { getConnectorMetadata } from '@private/components/data/IngestionCatalog/utils/ingestionConnectorTypeMetadata';
import { Badge, Box, Button, Card, CardActions, CardContent, CardHeader, Grid, Tooltip } from '@components';
import { useFormatter } from '../../../../components/i18n';
import EnrichedTooltip from '../../../../components/EnrichedTooltip';
import { INGESTION_SETINGESTIONS } from '../../../../utils/hooks/useGranted';
import Security from '../../../../utils/Security';
import type { Theme } from '../../../../components/Theme';

export interface IngestionCatalogCardProps {
  node: IngestionConnector;
  dataListId: string;
  isEnterpriseEdition: boolean
  onClickDeploy: () => void
  deploymentCount?: number;
}

type RenderConnectorUseCasesType = {
  useCases: string[];
  withTooltip?: boolean;
  withBadge?: boolean;
};

const DeployButton = ({ deploymentCount, onClick }: { deploymentCount?: number, onClick: () => void }) => {
  const { t_i18n } = useFormatter();

  return (
    <Tooltip title={deploymentCount ? `${deploymentCount} deployments` : '' }>
      <Badge badgeContent={deploymentCount} color={'warning'}>
        <Button
          variant="contained"
          onClick={onClick}
          size="small"
        >
          {t_i18n('Deploy')}
        </Button>
      </Badge>
    </Tooltip>
  );
};

const IngestionCatalogCard = ({
  node: connector,
  isEnterpriseEdition,
  onClickDeploy,
  deploymentCount = 0,
}: IngestionCatalogCardProps) => {
  const { t_i18n } = useFormatter();
  const theme = useTheme<Theme>();
  const link = `/dashboard/data/ingestion/catalog/${connector.slug}`;

  const renderConnectorUseCases = ({
    useCases,
    withTooltip = true,
    withBadge = false,
  }: RenderConnectorUseCasesType) => {
    const renderUseCaseWithBadge = (useCase: string) => (
      <Badge variant="dot" color="primary" sx={{ width: '100%' }}>
        <IngestionCatalogChip
          withTooltip={withTooltip}
          isInTooltip
          label={useCase}
        />
      </Badge>
    );

    return (
      <Grid container spacing={1}>
        {useCases.map((useCase: string, index: number) => (
          <Grid key={useCase} size={6}>
            {withBadge && index === 1 ? (
              renderUseCaseWithBadge(useCase)
            ) : (
              <IngestionCatalogChip
                withTooltip={withTooltip}
                isInTooltip
                label={useCase}
              />
            )}
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderLabels = () => {
    const hasMoreThanTwoUseCases = connector.use_cases.length > 2;
    if (hasMoreThanTwoUseCases) {
      const slicedList = connector.use_cases.slice(0, 2);
      return (
        <EnrichedTooltip
          title={renderConnectorUseCases({ useCases: connector.use_cases })}
        >
          {renderConnectorUseCases({
            useCases: slicedList,
            withTooltip: false,
            withBadge: true,
          })}
        </EnrichedTooltip>
      );
    }

    return renderConnectorUseCases({
      useCases: connector.use_cases,
      withBadge: hasMoreThanTwoUseCases,
    });
  };

  const connectorMetadata = getConnectorMetadata(connector.container_type, t_i18n);

  return (
    <>
      <Card
        variant="outlined"
        style={{
          height: 330,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <CardHeader
            sx={{
              paddingBottom: 0,
              marginBottom: 0,
              alignItems: 'start',
              '& .MuiCardHeader-content': {
                minWidth: 0,
              },
            }}
            avatar={
              <img
                style={{
                  height: 50,
                  width: 50,
                  objectFit: 'contain',
                  borderRadius: 4,
                }}
                src={connector.logo}
                alt={connector.title}
              />
            }
            title={
              <Tooltip title={connector.title} placement="top">
                <div
                  style={{
                    width: '100%',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: 20,
                    lineHeight: '24px',
                    fontWeight: 600,
                    marginBottom: theme.spacing(0.5),
                  }}
                >
                  {connector.title}
                </div>

              </Tooltip>
            }
            subheader={renderLabels()}
            action={connector.verified && <VerifiedOutlined color="success" />}
          />

          <CardContent
            style={{
              height: '100%',
              marginTop: theme.spacing(0.5),
            }}
          >
            <div>{truncate(connector.short_description, 250)}</div>
          </CardContent>
        </div>
        <CardActions style={{ justifyContent: 'space-between', padding: 16 }}>
          <IngestionCatalogChip
            label={connectorMetadata.label}
            color={connectorMetadata.color}
          />
          <div style={{ display: 'flex', gap: 4 }}>
            <Button variant="outlined" size="small" component={Link} to={link}>
              {t_i18n('Details')}
            </Button>
            <Security needs={[INGESTION_SETINGESTIONS]}>
              {
                isEnterpriseEdition ? (
                  <DeployButton deploymentCount={deploymentCount} onClick={onClickDeploy} />
                ) : (
                  <Box sx={{ '& .MuiButton-root': { marginLeft: 0 } }}>
                    {/** FIXME: remove marginLeft in EnterpriseEditionButton * */}
                    <EnterpriseEditionButton title="Deploy" />
                  </Box>
                )
              }
            </Security>
          </div>
        </CardActions>
      </Card>
    </>
  );
};

export default IngestionCatalogCard;

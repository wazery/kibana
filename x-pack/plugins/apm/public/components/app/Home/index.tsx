/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiTabs,
  EuiTitle,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import React from 'react';
import { $ElementType } from 'utility-types';
import { useApmPluginContext } from '../../../hooks/useApmPluginContext';
import { ApmHeader } from '../../shared/ApmHeader';
import { EuiTabLink } from '../../shared/EuiTabLink';
import { ServiceMapLink } from '../../shared/Links/apm/ServiceMapLink';
import { ServiceOverviewLink } from '../../shared/Links/apm/ServiceOverviewLink';
import { SettingsLink } from '../../shared/Links/apm/SettingsLink';
import { TraceOverviewLink } from '../../shared/Links/apm/TraceOverviewLink';
import { SetupInstructionsLink } from '../../shared/Links/SetupInstructionsLink';
import { ServiceMap } from '../ServiceMap';
import { ServiceOverview } from '../ServiceOverview';
import { TraceOverview } from '../TraceOverview';
import { RumOverview } from '../RumDashboard';
import { RumOverviewLink } from '../../shared/Links/apm/RumOverviewLink';

function getHomeTabs({
  serviceMapEnabled = true,
}: {
  serviceMapEnabled: boolean;
}) {
  const homeTabs = [
    {
      link: (
        <ServiceOverviewLink>
          {i18n.translate('xpack.apm.home.servicesTabLabel', {
            defaultMessage: 'Services',
          })}
        </ServiceOverviewLink>
      ),
      render: () => <ServiceOverview />,
      name: 'services',
    },
    {
      link: (
        <TraceOverviewLink>
          {i18n.translate('xpack.apm.home.tracesTabLabel', {
            defaultMessage: 'Traces',
          })}
        </TraceOverviewLink>
      ),
      render: () => <TraceOverview />,
      name: 'traces',
    },
  ];

  if (serviceMapEnabled) {
    homeTabs.push({
      link: (
        <ServiceMapLink>
          {i18n.translate('xpack.apm.home.serviceMapTabLabel', {
            defaultMessage: 'Service Map',
          })}
        </ServiceMapLink>
      ),
      render: () => <ServiceMap />,
      name: 'service-map',
    });
  }

  homeTabs.push({
    link: (
      <RumOverviewLink>
        {i18n.translate('xpack.apm.home.rumTabLabel', {
          defaultMessage: 'Real User Monitoring',
        })}
      </RumOverviewLink>
    ),
    render: () => <RumOverview />,
    name: 'rum-overview',
  });

  return homeTabs;
}

const SETTINGS_LINK_LABEL = i18n.translate('xpack.apm.settingsLinkLabel', {
  defaultMessage: 'Settings',
});

interface Props {
  tab: 'traces' | 'services' | 'service-map' | 'rum-overview';
}

export function Home({ tab }: Props) {
  const { config } = useApmPluginContext();
  const homeTabs = getHomeTabs(config);
  const selectedTab = homeTabs.find(
    (homeTab) => homeTab.name === tab
  ) as $ElementType<typeof homeTabs, number>;

  return (
    <div>
      <ApmHeader>
        <EuiFlexGroup alignItems="center">
          <EuiFlexItem grow={false}>
            <EuiTitle size="l">
              <h1>APM</h1>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <SettingsLink>
              <EuiButtonEmpty size="s" color="primary" iconType="gear">
                {SETTINGS_LINK_LABEL}
              </EuiButtonEmpty>
            </SettingsLink>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <SetupInstructionsLink />
          </EuiFlexItem>
        </EuiFlexGroup>
      </ApmHeader>
      <EuiTabs>
        {homeTabs.map((homeTab) => (
          <EuiTabLink isSelected={homeTab === selectedTab} key={homeTab.name}>
            {homeTab.link}
          </EuiTabLink>
        ))}
      </EuiTabs>
      {selectedTab.render()}
    </div>
  );
}

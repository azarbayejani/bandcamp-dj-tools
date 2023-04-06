import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom';
import CollectionPage from './CollectionPage';
import PurchasesPage from './PurchasesPage';
import TralbumPage from './TralbumPage';

const appDiv = document.createElement('div');
appDiv.id = 'pitchSliderApp';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

const renderTralbumPage = () => {
  const player = document.querySelector('.inline_player');
  if (player) {
    if (!document.getElementById(appDiv.id)) {
      player.append(appDiv);
    }

    // BUG: this assumes that all of these are playable tracks!
    const trackNodes = document.querySelectorAll('.title-col .title');
    trackNodes.forEach((trackNode, i) => {
      const timeNode = trackNode.querySelector('.time');
      if (timeNode) {
        const portal = document.createElement('span');
        portal.id = `BandcampPitchAdjust_bpm_${i + 1}`;
        const existingPortal = document.getElementById(portal.id);
        if (!existingPortal) {
          timeNode.after(portal);
        } else {
          existingPortal.innerHTML = '';
        }
      }
    });
    ReactDOM.render(<TralbumPage />, document.querySelector('#pitchSliderApp'));
  }
};

const renderCollectionPage = () => {
  const controlsExtra = document.querySelector<HTMLElement>('.controls-extra');
  const volumeControl = document.querySelector<HTMLElement>('.vol');

  if (volumeControl && controlsExtra) {
    const newVolumeContainer = document.createElement('div');

    newVolumeContainer.style.display = 'flex';
    newVolumeContainer.style.flexDirection = 'column';
    newVolumeContainer.style.overflow = 'hidden';

    controlsExtra.style.marginTop = '12px';

    newVolumeContainer.appendChild(volumeControl);
    controlsExtra.appendChild(newVolumeContainer);
    if (!document.getElementById(appDiv.id)) {
      newVolumeContainer.appendChild(appDiv);
    }
    ReactDOM.render(<CollectionPage />, appDiv);
  }
};

const renderPurchasesPage = () => {
  const purchasesDiv = document.querySelector<HTMLElement>('.purchases');
  const pageDataDiv = document.getElementById('pagedata');

  if (!pageDataDiv || !pageDataDiv.dataset.blob) {
    console.error('No page data!');
    return;
  }

  let pageData;
  try {
    pageData = JSON.parse(pageDataDiv.dataset.blob);
  } catch {
    console.error('Could not get page data!');
    return;
  }
  const username = pageData?.identities?.fan?.username;

  if (!username) {
    console.error('Could not get user identity!');
    return;
  }

  const rawCrumbs = document.getElementById('js-crumbs-data')?.dataset?.crumbs;
  let crumbsData: { [key: string]: string } = {};
  if (rawCrumbs) {
    try {
      crumbsData = JSON.parse(rawCrumbs);
    } catch {
      console.error('Could not get crumbs data!');
      return;
    }
  }

  if (purchasesDiv) {
    const purchasesAppDiv = document.createElement('div');
    purchasesDiv.before(purchasesAppDiv);
    ReactDOM.render(
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <PurchasesPage
          username={username}
          crumb={crumbsData['api/orderhistory/1/get_items']}
        />
      </QueryClientProvider>,
      purchasesAppDiv
    );
  }
};

const getPage = () => {
  if (document.querySelector('.inline_player')) {
    return 'tralbum';
  }
  if (document.querySelector('#collection-player')) {
    return 'fan-collection';
  }
  if (document.querySelector('.purchases')) {
    return 'purchases';
  }
};

switch (getPage()) {
  case 'tralbum':
    renderTralbumPage();
    break;
  case 'fan-collection':
    renderCollectionPage();
    break;
  case 'purchases':
    renderPurchasesPage();
    break;
}

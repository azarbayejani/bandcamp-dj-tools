import React, { useEffect, useState } from 'react';

import { fetchBandcampTrackInfoStore } from '~/utils/fetchBandcampTrackInfoStore';
import { TrackInfoByUrl } from '~/types';
import AlbumTrackBpms from './AlbumTrackBpms';
import { BpmProvider } from '../BpmContext';
import useAudio, { AudioState } from '../AudioStore';
import CurrentTrackBpm from './CurrentTrackBpm';
import { PitchAdjust } from '@tempo-adjust/player-components';
import { AudioController } from '../AudioController';
import { useShallow } from 'zustand/shallow';

const getCurrTrackUrl = () =>
  document.querySelector('.title_link')?.getAttribute('href')?.trim();

const selector = ({
  togglePreservesPitch,
  setPlaybackRate,
  playbackRate,
  preservesPitch,
}: AudioState) => ({
  togglePreservesPitch,
  setPlaybackRate,
  playbackRate,
  preservesPitch,
});

const TralbumPagePitchAdjust = () => {
  const {
    togglePreservesPitch,
    setPlaybackRate,
    playbackRate,
    preservesPitch,
  } = useAudio(useShallow(selector));

  return (
    <PitchAdjust
      playbackRate={playbackRate}
      preservesPitch={preservesPitch}
      onChangePreservesPitch={togglePreservesPitch}
      onChangePlaybackRate={({ playbackRate }) => setPlaybackRate(playbackRate)}
    />
  );
};

const TralbumPage = () => {
  const [trackInfoStore, setTrackInfoStore] = useState<TrackInfoByUrl>();

  useEffect(() => {
    new AudioController('audio', getCurrTrackUrl);
    fetchBandcampTrackInfoStore().then((store) => setTrackInfoStore(store));
  }, []);

  if (!trackInfoStore) {
    return null;
  }

  return (
    <BpmProvider
      selector="audio"
      initialTrackInfoStore={trackInfoStore}
      getCurrTrackUrl={getCurrTrackUrl}
    >
      <AlbumTrackBpms />
      <div style={{ marginTop: 4, display: 'flex', gap: 12 }}>
        <CurrentTrackBpm />
        <div style={{ borderLeft: '1px solid rgba(0, 0, 0, 0.15)' }}></div>
        <div style={{ flexGrow: 1 }}>
          <TralbumPagePitchAdjust />
        </div>
      </div>
    </BpmProvider>
  );
};

export default TralbumPage;

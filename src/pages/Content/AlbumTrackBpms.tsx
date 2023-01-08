import React from 'react';
import ReactDOM from 'react-dom';
import { TrackInfo, useAudio } from './AudioContext';
import { toOneDecimal } from '../../services/toOneDecimal';

type AlbumTrackBpmProps = TrackInfo;

function AlbumTrackBpm({ trackNumber, bpm, loading }: AlbumTrackBpmProps) {
  const portalTarget = document.querySelector(
    `#BandcampPitchAdjust_bpm_${trackNumber}`
  );
  if (!portalTarget) {
    return null;
  }

  if (loading) {
    return ReactDOM.createPortal(<>(loading...)</>, portalTarget);
  }

  if (!bpm) {
    return null;
  }

  return ReactDOM.createPortal(`(${toOneDecimal(bpm)})`, portalTarget);
}

export default function AlbumTrackBpms() {
  const { trackInfoState } = useAudio();
  if (!trackInfoState.loadingStarted) {
    return null;
  }

  return (
    <>
      {Object.entries(trackInfoState.trackInfoByUrl).map(([_, trackInfo]) => (
        <AlbumTrackBpm {...trackInfo} key={trackInfo.trackNumber} />
      ))}
    </>
  );
}
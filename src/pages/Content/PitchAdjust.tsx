import React from 'react';
import { useCallback } from 'react';
import { useAudio } from './AudioContext';

import './content.styles.scss';

const tempoRanges = [
  {
    label: '±6',
    min: 1 - 0.06,
    max: 1 + 0.06,
  },
  {
    label: '±10',
    min: 1 - 0.1,
    max: 1 + 0.1,
  },
  {
    label: '±16',
    min: 1 - 0.16,
    max: 1 + 0.16,
  },
  {
    label: 'WIDE',
    // TODO: make this based on the browser
    min: 0.1,
    max: 2.0,
  },
];

const useTempoRange = () => {
  const [tempoRangeIndex, setTempoRangeIndex] = React.useState(1);
  return {
    tempoRange: tempoRanges[tempoRangeIndex % tempoRanges.length],
    advanceToNextTempoRange: useCallback(
      () => setTempoRangeIndex(tempoRangeIndex + 1),
      [tempoRangeIndex]
    ),
  };
};

interface PitchAdjustProps {
  variant?: 'tralbum' | 'collection';
}

const PitchAdjust = ({ variant = 'tralbum' }: PitchAdjustProps) => {
  const { playbackRate, setPlaybackRate } = useAudio();
  const { tempoRange, advanceToNextTempoRange } = useTempoRange();

  const percentage = String(((playbackRate - 1) * 100).toPrecision(3));
  const percentageAsString =
    playbackRate < 1
      ? String(percentage).slice(0, 4)
      : `+${String(percentage).slice(0, 3)}`;

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlaybackRate(event.target.valueAsNumber);
  };

  const handleClickTempoRange = () => {
    advanceToNextTempoRange();
  };

  return (
    <div
      className={`BandcampTempoAdjust__slider BandcampTempoAdjust__slider--${variant}`}
    >
      <input
        className={`BandcampTempoAdjust__slider_range BandcampTempoAdjust__slider_range--${variant}`}
        type="range"
        onChange={handleSliderChange}
        onInput={handleSliderChange}
        min={tempoRange.min}
        max={tempoRange.max}
        step={0.001}
        value={playbackRate}
      />
      <div style={{ display: 'flex' }}>
        <button
          title="Reset"
          className={`BandcampTempoAdjust__button BandcampTempoAdjust__button--${variant}`}
          onClick={() => setPlaybackRate(1)}
        >
          {percentageAsString}%
        </button>
        <button
          title="Range adjust"
          className={`BandcampTempoAdjust__button BandcampTempoAdjust_button--${variant}`}
          onClick={handleClickTempoRange}
        >
          ({tempoRange.label})
        </button>
      </div>
    </div>
  );
};

export default PitchAdjust;

import * as React from 'react';

import { LayerMap } from './layout';

import styles from './Layer.module.css';
import { Key } from './Key';

// Variables that define the physical arrangement of keys on a Ferris.
// Combined with CSS variables to figure out final positions and rotations.

// In milimeters, from the top, on the left side.
// The right side uses the same math and values, just mirrored.
const columnTopOffsets = [17.6, 7, 0, 6, 8]; // For the main cluster.
const innerThumb = { top: 59, inset: 66, rot: 20 };
const outerThumb = { top: 67, inset: 86, rot: 30 };

const layout = [
  { index:  0, side: 'left',  row: 0, col: 0 },
  { index:  1, side: 'left',  row: 0, col: 1 },
  { index:  2, side: 'left',  row: 0, col: 2 },
  { index:  3, side: 'left',  row: 0, col: 3 },
  { index:  4, side: 'left',  row: 0, col: 4 },

  { index:  5, side: 'right', row: 0, col: 0 },
  { index:  6, side: 'right', row: 0, col: 1 },
  { index:  7, side: 'right', row: 0, col: 2 },
  { index:  8, side: 'right', row: 0, col: 3 },
  { index:  9, side: 'right', row: 0, col: 4 },

  { index: 10, side: 'left',  row: 1, col: 0 },
  { index: 11, side: 'left',  row: 1, col: 1 },
  { index: 12, side: 'left',  row: 1, col: 2 },
  { index: 13, side: 'left',  row: 1, col: 3, nub: true },
  { index: 14, side: 'left',  row: 1, col: 4 },

  { index: 15, side: 'right', row: 1, col: 0 },
  { index: 16, side: 'right', row: 1, col: 1, nub: true },
  { index: 17, side: 'right', row: 1, col: 2 },
  { index: 18, side: 'right', row: 1, col: 3 },
  { index: 19, side: 'right', row: 1, col: 4 },

  { index: 20, side: 'left',  row: 2, col: 0 },
  { index: 21, side: 'left',  row: 2, col: 1 },
  { index: 22, side: 'left',  row: 2, col: 2 },
  { index: 23, side: 'left',  row: 2, col: 3 },
  { index: 24, side: 'left',  row: 2, col: 4 },

  { index: 25, side: 'right', row: 2, col: 0 },
  { index: 26, side: 'right', row: 2, col: 1 },
  { index: 27, side: 'right', row: 2, col: 2 },
  { index: 28, side: 'right', row: 2, col: 3 },
  { index: 29, side: 'right', row: 2, col: 4 },

  { index: 30, side: 'left',  row: 3, col: 0 }, // Left inner thumb
  { index: 31, side: 'left',  row: 3, col: 1 }, // Left outer thumb

  { index: 32, side: 'right', row: 3, col: 1 }, // Right outer thumb
  { index: 33, side: 'right', row: 3, col: 0 }, // Right inner thumb
];

function keyIndexToStyle(index: number) {
  let { side, row, col } = layout[index];
  if (row === 3) {
    const { top, inset, rot } = col === 0 ? { ...innerThumb } : { ...outerThumb };
    return {
      top: `calc(var(--scale) * ${top}mm)`,
      [side]: `calc(var(--scale) * ${inset}mm)`,
      transformOrigin: side === 'left' ? '0 0' : '100% 0',
      transform: `rotate(${side === 'left' ? rot : -rot}deg)`,
    };
  }

  const topOff = columnTopOffsets[side === 'left' ? col : 4 - col];
  const top = `calc( (var(--scale) * ${topOff}mm) + ( ${row} * ( var(--key-gap) + var(--key-height) ) ) )`;
  const inset = `calc(var(--inset) + ${side === 'left' ? col : 4 - col} * ( var(--key-gap) + var(--key-width) ) )`;
  return { top, [side]: inset };
}

export const Layer: React.FC<{ map: LayerMap, name: string }> = ({ map, name }) => {
  const layerIndex = map.layers.findIndex(l => l.name === name);
  return (
    <div className={`${styles.layerWrapper} ${styles[`layerTint-${name}`]}`}>
      <div className={styles.layer} id={`layer-${layerIndex}`}>
        <h3>{name} ({layerIndex})</h3>
        {map.getFull(name)?.map((k, i) => {
          const className = [styles.key, !!layout[i]?.nub && styles.keyWithNub].filter(c => c).join(' ');
          const style = keyIndexToStyle(i);
          return (
            <div key={i} className={className} style={style} title={k}>
              <Key def={k} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

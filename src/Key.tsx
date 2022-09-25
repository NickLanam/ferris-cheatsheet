import * as React from 'react';

import styles from './Key.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBluetooth,
  faUsb,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons';
import {
  faChevronUp,
  faUpLong,
  faBan,
  faArrowRightArrowLeft,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faVolumeLow,
  faVolumeHigh,
  faVolumeXmark,
  faBackwardFast,
  faForwardFast,
  faPlay,
  faDeleteLeft,
  faTurnDown,
  faCamera,
  faRectangleList,
  faAnglesUp,
} from '@fortawesome/free-solid-svg-icons';

interface KeyDefinition {
  primary: React.ReactNode;
  hold?: React.ReactNode;
  bluetoothMode?: 'clear' | 'select' | 'out';
  transparent?: true,
  disabled?: true,
  layerMode?: 'primary' | 'hold' | 'primary-sticky' | 'primary-hold',
}

function keyStringToDef(raw: string): KeyDefinition {
  const [what, arg1, arg2] = raw.split(' ');
  switch (what) {
    case '&kp': return { primary: arg1 };
    case '&mt': return { primary: arg2, hold: arg1 };
    case '&sk': return { primary: arg1 };
    case '&bt': return {  primary: arg2 ?? arg1, bluetoothMode: arg1 === 'BT_CLR' ? 'clear' : 'select' };
    case '&out': return { primary: arg1.replace('OUT_', ''), bluetoothMode: 'out' };
    case '&trans': return { primary: '', transparent: true };
    case '&none': return { primary: '', disabled: true };
    case '&lt': return { primary: arg2, hold: arg1, layerMode: 'hold' };
    case '&to': return { primary: arg1, layerMode: 'primary' };
    case '&sl': return { primary: arg1, layerMode: 'primary-sticky' };
    case '&mo': return { primary: arg1, layerMode: 'primary-hold' };
    default: throw new Error(`Can't decode "${raw}": ${JSON.stringify({ what, arg1, arg2 })}`);
  }
}

function toLabel(key: React.ReactNode): React.ReactNode {
  if (typeof key !== 'string') return key;

  const simpleSubs: Record<string, string> = {
    EXCL: '!',  AT: '@',    HASH: '#',  DLLR: '$',
    PRCT: '%',  CARET: '^', AMPS: '&',  ASTRK: '*', ASTERISK: '*',

    UNDER: '_', MINUS: '-', PLUS: '+',  EQL: '=',
    DOT: '.',   CMMA: ',',  SLASH: '/', BSLH: '\\',
    COLN: ':',  SEMI: ';',  APOS: "'",  GRAVE: '`',

    LT: '<',    GT: '>',    LBKT: '[',  RBKT: ']',
    LPAR: '(',  RPAR: ')',  LBRC: '{',  RBRC: '}',

    LALT: '\u2325', RALT: '\u2325', // ⌥
    LGUI: '\u2318', RGUI: '\u2318', // ⌘ ... Yes, instead of a penguin or the Windows logo. It's for consistency.
    SPC: '\u2423', SPACE: '\u2423', // ␣

    KP_NUM: 'NUM\nLOCK',
    SLCK: 'SCRL\nLOCK',
  };

  const simpleIcons: Record<string, IconDefinition> = {
    'LCTL': faChevronUp, 'RCTL': faChevronUp,
    'LSFT': faUpLong, 'RSFT': faUpLong,
    'DARW': faCaretDown,
    'LARW': faCaretLeft,
    'RARW': faCaretRight,
    'UARW': faCaretUp,
    'MVDN': faVolumeLow,
    'MVUP': faVolumeHigh,
    'MVNO': faVolumeXmark,
    'MPRV': faBackwardFast,
    'MNXT': faForwardFast,
    'MSTP': faPlay,
    'BKSP': faDeleteLeft,
    'PSCRN': faCamera,
    'K_APP': faRectangleList,
    'BT_CLR': faBan,
  };

  if (simpleSubs[key]) {
    return <div>{simpleSubs[key]}</div>;
  } else if (simpleIcons[key]) {
    return <FontAwesomeIcon icon={simpleIcons[key]} />;
  } else if (key.startsWith('N') && key.length === 2) {
    return key.substring(1);
  } else if (key.startsWith('KP_')) {
    return <><strong>#</strong>&nbsp;{toLabel(key.substring(3))}</>
  }

  switch (key) {
    case 'BLE':
      return (<><FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ fontSize: '50%', margin: '0 0.25rem' }}/><FontAwesomeIcon icon={faBluetooth} /></>);
    case 'USB':
      return (<><FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ fontSize: '50%', margin: '0 0.25rem' }}/><FontAwesomeIcon icon={faUsb} style={{ fontSize: '75%' }} /></>);
    case 'DEL':
      // delete-right isn't free, delete-left is. Just flip it horizontally.
      return <FontAwesomeIcon icon={faDeleteLeft} style={{ transform: 'scaleX(-100%)' }} />;
    case 'ENTER':
      // turn-left isn't free, turn-down is. Just rotate it 90° clockwise.
      return <FontAwesomeIcon icon={faTurnDown} style={{ transform: 'rotate(90deg)' }} />;
    default:
      return key;
  }
}

export const Key: React.FC<{ def: string }> = ({ def }) => {
  const keyDef = keyStringToDef(def);

  let upIcon: React.ReactNode = '';
  let midIcon: React.ReactNode = '';
  let downIcon: React.ReactNode = '';

  if (keyDef.bluetoothMode === 'clear') midIcon = <FontAwesomeIcon icon={faBluetooth} />;
  else if (keyDef.bluetoothMode === 'select') midIcon = <FontAwesomeIcon icon={faBluetooth} />;
  else if (keyDef.bluetoothMode === 'out') midIcon = <FontAwesomeIcon icon={faBluetooth} />;
  else if (keyDef.transparent) midIcon = ' '; // Blank
  else if (keyDef.disabled) midIcon = <FontAwesomeIcon icon={faBan} />;

  let smallMid = false;
  if (keyDef.layerMode === 'hold') {
    downIcon = <FontAwesomeIcon icon={faAnglesUp} style={{ marginRight: '0.25rem' }} />;
  } else if (keyDef.layerMode) {
    midIcon = <FontAwesomeIcon icon={faAnglesUp} style={{ marginRight: '0.25rem' }} />;
    smallMid = true;
  }

  const upLabel = ''; // Might use this later, but for now it's a stub
  const midLabel = toLabel(keyDef.primary);
  const downLabel = toLabel(keyDef.hold);

  return (
    <>
      {upLabel && (
        <div className={[styles.label, styles.labelUpper].join(' ')}>
          {upIcon}
          {upLabel}
        </div>
      )}
      <div className={[styles.label, smallMid ? styles.labelMidSmall : styles.labelMid].join(' ')}>
        {midIcon}
        {midLabel}
      </div>
      {downLabel && (
        <div className={styles.labelLower + ' ' + styles.label}>
          {downIcon}
          {downLabel}
        </div>
      )}
    </>
  );
};

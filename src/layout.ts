// A file to convert the actual layout from my cradio.keymap into a JS object, which is super wasteful but also automatic.
// All for a little convenience on my part.
// This isn't doing actual parsing of the whole file. It doesn't read macros or other configs.
// It's really focused on just what my personal layout does.

const LAYERS_RAW = `
// Base: QWERTY with tweaks to fit a Ferris; home row mods.
BASE {
    bindings = <
    &kp Q        &kp W         &kp E         &kp R          &kp T          &kp Y          &kp U          &kp I         &kp O         &kp P
    &kp A        &mt LSFT S    &mt LGUI D    &mt LALT F     &kp G          &kp H          &mt LALT J     &mt RGUI K    &mt RSFT L    &kp APOS
    &mt LCTL Z   &kp X         &kp C         &kp V          &kp B          &kp N          &mt RALT M     &mt SEMI CMMA &mt COLN DOT  &mt RCTL SLASH
                                              &sk LCTL       &lt LOWER SPC  &lt RAISE SPC  &sk LSFT
    >;
};

// Lower: Escape, backspace, delete, tab, enter; ([{<nesting>}]), numbers, and puncutation frequently needed with them.
LOWER {
    bindings = <
    &kp ESC      &kp LBKT      &kp RBKT      &kp LBRC       &kp RBRC       &mt SEMI CMMA  &kp N7        &kp N8         &kp N9        &kp GRAVE
    &kp BKSP     &mt LSFT LPAR &mt LGUI RPAR &mt LALT LT    &kp GT         &kp N0         &kp N4        &kp N5         &kp N6        &kp DEL
    &mt LCTL TAB &kp UNDER     &kp MINUS     &kp PLUS       &kp EQL        &mt COLN DOT   &kp N1        &kp N2         &kp N3        &kp ENTER
                                              &trans         &trans         &lt ADJUST SPC &trans
    >;
};

// Raise: the rest of the punctuation, media controls, arrows+home+end+pgup+pgdn; some overlaps from the "Lower" layer.
RAISE {
    bindings = <
    &kp ESC      &kp EXCL      &kp AT         &kp HASH      &kp DLLR       &kp BSLH       &mt MPRV MVDN &mt MSTP MVNO  &mt MNXT MVUP &kp GRAVE
    &kp BKSP     &mt LSFT PRCT &mt LGUI CARET &mt LALT AMPS &kp ASTRK      &kp LARW       &kp DARW      &kp UARW       &kp RARW      &kp DEL
    &mt LCTL TAB &kp UNDER     &kp MINUS      &kp PLUS      &kp EQL        &kp HOME       &kp PGDN      &kp PGUP       &kp END       &kp ENTER
                                              &trans        &lt ADJUST SPC &trans         &trans
    >;
};

// Adjust: Function keys, bluetooth, other layers, and miscellany.
ADJUST {
    bindings = <
    &kp ESC      &kp F1        &kp F2         &kp F3        &kp F4         &kp PSCRN      &bt BT_CLR    &bt BT_SEL 0   &bt BT_SEL 1  &out OUT_BLE
    &kp BKSP     &kp F5        &kp F6         &kp F7        &kp F8         &kp CAPS       &mt LALT BRK  &mt RGUI INS   &kp RSFT      &out OUT_USB
    &mt LCTL TAB &kp F9        &kp F10        &kp F11       &kp F12        &to GAME       &kp RALT      &to NUMPAD     &kp K_APP     &kp ENTER
                                              &trans        &trans         &trans         &trans
    >;
};

NUMPAD {
    bindings = <
    &none        &none         &none          &none         &kp KP_NUM     &kp KP_N7      &kp KP_N8     &kp KP_N9      &kp KP_SLASH  &kp KP_ASTERISK
    &none        &none         &none          &none         &kp SLCK       &kp KP_N4      &kp KP_N5     &kp KP_N6      &kp KP_N0     &kp KP_MINUS
    &none        &none         &none          &none         &none          &kp KP_N1      &kp KP_N2     &kp KP_N3      &kp KP_DOT    &kp KP_PLUS
                                              &to BASE      &to BASE       &to BASE       &kp KP_ENTER
    >;
};

/* ================ GAMING ================ */

// Game base: mostly QWERTY, with left hand shifted to add ctrl/shft/alt. Thumb accesses the rest.
// Goal is to keep right hand on the mouse during the action, as most games expect.
GAME {
    bindings = <
    &kp TAB      &kp Q         &kp W          &kp E         &kp R          &kp Y          &kp U          &kp I         &kp O         &kp P
    &kp LSFT     &kp A         &kp S          &kp D         &kp F          &kp H          &mt LALT J     &mt RGUI K    &mt RSFT L    &kp APOS
    &kp LCTL     &kp Z         &kp X          &kp C         &kp V          &kp N          &mt RALT M     &mt SEMI CMMA &mt COLN DOT  &mt RCTL SLASH
                                              &sl GAME_L    &kp SPC        &to BASE       &to BASE
    >;
};

// Game lower: less-common keys that are usually reachable with the left hand.
GAME_L {
    bindings = <
    &kp ESC    &trans        &trans         &trans        &kp T            &trans         &trans        &trans         &trans        &kp GRAVE
    &kp BKSP   &trans        &trans         &trans        &kp G            &trans         &trans        &trans         &trans        &trans
    &kp LALT   &trans        &trans         &trans        &kp B            &trans         &trans        &trans         &trans        &trans
                                            &trans        &mo GAME_R       &to BASE       &to BASE
    >;
};

// Game raise: F1-12
GAME_R {
    bindings = <
    &kp ESC    &kp F1        &kp F2         &kp F3        &kp F4           &trans         &trans        &trans         &trans       &trans
    &kp BKSP   &kp F5        &kp F6         &kp F7        &kp F8           &trans         &trans        &trans         &trans       &trans
    &kp LALT   &kp F9        &kp F10        &kp F11       &kp F12          &trans         &trans        &trans         &trans       &trans
                                            &trans        &trans           &to BASE       &to BASE
    >;
};
`;

export class LayerMap {
  readonly layers: Array<{ name: string, keys: string[] }> = [];

  constructor(raw: string) {
    const searcher = /([A-Z_]+) {\s*bindings = <\s*([^>]+)>;\s*};/gm;
    let next;
    while ((next = searcher.exec(raw)) !== null) {
      if (next.length !== 3 || typeof next[1] !== 'string') continue;
      this.layers.push({ name: next[1], keys: next[2].split('&').map(c => c.trim()).filter(c => c).map(c => `&${c}`) });
    }
  }

  getFull(layerName: string): string[] | null {
    return this.layers.find(l => l.name === layerName)?.keys ?? null;
  }
}

export const layers = new LayerMap(LAYERS_RAW);

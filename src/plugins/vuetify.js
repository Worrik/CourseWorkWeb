import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            light: {
                primary: colors.purple,
                secondary: colors.grey.darken1,
                accent: colors.shades.black,
                error: colors.red.accent3,
                background: colors.indigo.lighten5,
            },
            dark: {
                primary: '#FDFFFF',
                background: '#A79C86',
                secondary: '#8D4745',
                navbar: '#9d8f7e',
                appbar: '#d57d5e',
                delete: '#857d6d',
                update: '#857d6d',
                create: '#857d6d',
            },
        },
    }
});

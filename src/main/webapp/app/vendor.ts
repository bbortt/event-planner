/* after changing this file run 'npm run webpack:build' */
import '../content/scss/vendor.scss';

// enable devextreme localization
import { loadMessages } from 'devextreme/localization';

import deMessages from 'devextreme/localization/messages/de.json';
import enMessages from 'devextreme/localization/messages/en.json';

loadMessages(deMessages);
loadMessages(enMessages);

// 3rd-Party dependency of `devextreme`
import 'jszip/dist/jszip.min.js';

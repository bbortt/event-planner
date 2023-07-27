import 'zone.js';
import '@angular/localize/init';

// Fix needed for SockJS, see https://github.com/sockjs/sockjs-client/issues/439
// As well as ng2-dragula, see https://github.com/valor-software/ng2-dragula/issues/849
(window as any).global = window;

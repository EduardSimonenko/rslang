import { App } from './components/app/app';
import AppView from './components/view/appView';

const app = new App();
app.start();

const appView = new AppView();
appView.drawAuthForm();

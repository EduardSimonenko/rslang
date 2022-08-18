import { App } from './components/app/app';
import Authorization from './components/controller/authorization/authorization';
import AppView from './components/view/appView';

const app = new App();
app.start();

const appView = new AppView();
appView.drawAuthForm();

const authorization = new Authorization();
authorization.listen();

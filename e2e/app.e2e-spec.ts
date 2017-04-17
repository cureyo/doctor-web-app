import { MaterialDashboardAngular2Page } from './app.po';

describe('material-dashboard-angular2 App', function() {
  let page: MaterialDashboardAngular2Page;

  beforeEach(() => {
    page = new MaterialDashboardAngular2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

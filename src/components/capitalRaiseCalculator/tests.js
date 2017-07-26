describe('Campaign Component', () => {
  it('Campaign List', () => {
    // Check that $.ajax.get was called
    // Check that we have a show right data For both security types
    const stub = $.ajax;
    import routes from './route'
    new routes.campaignList();
    stub.called.eq.true;
  });
  it('Campaign Detail', function () {
      // Check that $.ajax.get was called
      // Check that we have a show right data For both security types
      const stub = $.ajax;
      import routes from './route'
      new routes.campaignDetail();
      stub.called.eq.true;
    })
});

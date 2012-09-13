with (scope('App')) {
  // End point for Github login.
  route ('#login/:access_token', function(access_token) {
    Storage.set('access_token',access_token);
    set_route(Storage.remove('_redirect_to_after_login') || '#');
  });

  define('code', function() {
    return pre({ 'class': 'code' }, arguments);
  });

  define('shy_form', function() {
    var the_form = form(arguments),
        wrapper = div({ id: 'shy-form-wrapper' }, the_form);
    the_form.onsubmit = function(e) { wrapper.style.display = 'none'; var wait = document.getElementById('shy-form-waiting'); if (wait) wait.style.display = ''; };
    return wrapper;
  });

  define('shy_form_during_submit', function() {
    return div({ id: 'shy-form-waiting', style: 'display: none' }, div(arguments));
  });

  define('show_shy_form', function() {
    document.getElementById('shy-form-wrapper').style.display = '';
    var wait = document.getElementById('shy-form-waiting');
    if (wait) wait.style.display = 'none';
  });
};

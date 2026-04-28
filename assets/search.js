
(function() {
  var index = null;
  var input = document.getElementById('search-input');
  var resultsDiv = document.getElementById('search-results');
  if (!input) return;

  fetch('../search_index.json')
    .catch(function() { return fetch('search_index.json'); })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      index = data;
      input.addEventListener('input', onSearch);
    });

  function onSearch() {
    var q = input.value.trim().toLowerCase();
    if (!q || q.length < 1) { resultsDiv.innerHTML = ''; return; }
    var results = index.filter(function(a) {
      return (a.title && a.title.toLowerCase().indexOf(q) >= 0) ||
             (a.court_short && a.court_short.toLowerCase().indexOf(q) >= 0) ||
             (a.tags && a.tags.some(function(t){ return t.toLowerCase().indexOf(q) >= 0; })) ||
             (a.summary && a.summary.toLowerCase().indexOf(q) >= 0);
    }).slice(0, 20);

    if (results.length === 0) {
      resultsDiv.innerHTML = '<p style="color:#8899aa;padding:12px 0;">未找到相关文章</p>';
      return;
    }
    var html = results.map(function(a) {
      var tags = (a.tags || []).slice(0,3).map(function(t){
        return '<span style="background:#243447;color:#6ab0d4;font-size:.75rem;padding:2px 8px;border-radius:12px;margin-right:4px;">' + escHtml(t) + '</span>';
      }).join('');
      return '<div class="article-item" onclick="location.href='articles/' + a.id + '.html'">' +
        '<h3><a href="articles/' + a.id + '.html">' + escHtml(a.title) + '</a></h3>' +
        '<div class="article-meta">' +
          '<span>' + escHtml(a.date || '') + '</span>' +
          '<span>' + escHtml(a.court_short || '') + '</span>' +
        '</div>' +
        (tags ? '<div style="margin-top:6px">' + tags + '</div>' : '') +
        (a.summary ? '<div class="article-summary">' + escHtml(a.summary.substring(0,100)) + '</div>' : '') +
      '</div>';
    }).join('');
    resultsDiv.innerHTML = '<div style="font-size:.85rem;color:#8899aa;margin-bottom:10px;">找到 ' + results.length + ' 篇相关文章</div>' + html;
  }

  function escHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
})();

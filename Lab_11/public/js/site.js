(function ($) {
  // Get the form
  const searchForm = $('#searchForm');
  const searchTerm = $('#search_term');
  const siteTitle = $('#siteTitle')

  const showList = $('#showList');
  const homeLink = $('#homeLink');
  let currentArticle = undefined;
  const showDiv = $('#show');

  function renderHomePage(responseMessage, isHomePage = true) {
    showList.empty();
    showDiv.css('display', 'none');
    showList.css('display', 'block');
    homeLink.css('display', isHomePage ? 'none' : 'block');
    // responseMessage = JSON.parse(responseMessage);
    const newElement = $(responseMessage);
    newElement.sort((a, b) => {
      if (isHomePage)
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
      else return a.score - b.score;
    });
    for (let i = 0; i < newElement.length; i++) {
      const e = isHomePage ? newElement[i] : newElement[i].show;
      let link = $(`<a href="${e._links.self.href}"></a>`).text(e.name);
      let li = $(`<li></li>`).html(link);
      li.on('click', function (e) {
        e.preventDefault();
        showDiv.empty();
        // siteTitle.css('display', 'none');
        const article = $("<article></article>");
        const articleTitle = $('<h1></h1>').text(e.target.innerText);
        article.append(articleTitle);
        showDiv.append(article);
        const specificRequestConfig = {
          method: 'GET',
          url: e.target.href
        }
        $.ajax(specificRequestConfig).then((responseMessage) => {
          const dl = $('<dl></dl>')
          let imgSource = '/img/unknown.jpeg'
          try {
            imgSource = responseMessage.image.medium || '/img/unknown.jpeg';
          } catch (e) {
          }
          let language = responseMessage.language || "N/A";
          dl.append("<dt class='dt'>Language</dt>");
          dl.append($('<dd class="dd"></dd>').text(language));

          let genres = responseMessage.genres;
          let genreElement = $('<dd class="dd"></dd>');
          if (genres && typeof genres === 'object' && Array.isArray(genres) && genres.length > 0) {
            if (genres.length === 1) {
              dl.append("<dt class='dt'>Genre</dt>");
              genreElement.text(genres[0]);
            } else {
              let genreInner = $('<ul></ul>');
              for (let j = 0; j < genres.length; j++) {
                genreInner.append(
                  $('<li></li>').text(genres[j]),
                );
                console.log(genres[j])
              }
              genreElement.html(genreInner);
              dl.append("<dt class='dt'>Genres</dt>");
            }
          } else {
            dl.append("<dt class='dt'>Genres</dt>");
            genreElement.text('N/A');
          }
          dl.append(genreElement);

          let avgRating = 'N/A';
          try {
            avgRating = responseMessage.rating.average;
          } catch (e) {
          }
          if (avgRating === undefined || avgRating === null) avgRating = "N/A";
          dl.append("<dt class='dt'>Average Rating</dt>");
          dl.append($("<dd class='dd'></dd>").text(avgRating));

          let networkName = 'N/A';
          try {
            networkName = responseMessage.network.name || 'N/A';
          } catch (e) {
          }
          dl.append("<dt class='dt'>Network</dt>");
          dl.append($("<dd class='dd'></dd>").text(networkName));

          let summary = responseMessage.summary || 'N/A';
          dl.append("<dt class='dt'>Summary</dt>");
          dl.append($("<dd class='dd'></dd>").html(summary));
          const image = `<img src="${imgSource}" class="image" height="295" width="210">`
          article.append(image);
          article.append(dl);
          showDiv.css('display', 'block');
          showList.css('display', 'none');
          homeLink.css('display', 'block');
        })
      })
      showList.append(li);
    }
    showList.css('display', 'block');
    // bindEventsToTodoItem(newElement);
    // todoItem.replaceWith(newElement);
  }

  const requestConfig = {
    method: 'GET',
    url: 'http://api.tvmaze.com/shows'
  };
  $.ajax(requestConfig).then((e) => renderHomePage(e));

  searchForm.on('submit', function (e) {
    e.preventDefault();
    let formContent = searchTerm.val();
    if (typeof formContent !== 'string') return;
    formContent = formContent.trim();
    if (formContent === '') {
      const notification = $("<div class='notification is-danger is-light'></div>")
      const closeButton = $("<button class='delete closeNotification'</button>");
      notification.append(closeButton);
      notification.append("Cannot process empty/spaces input");
      $('body').prepend(notification);
      closeButton.on('click', (e) => {
        e.target.parentElement.remove();
      })
    } else {
      const query = encodeURIComponent(formContent);
      const url = `http://api.tvmaze.com/search/shows?q=${query}`;
      const requestConfig = {
        method: 'GET',
        url,
      };
      $.ajax(requestConfig).then((e) => renderHomePage(e, false));
    }
  })
})(window.jQuery);

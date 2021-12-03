x = (function($) {
  $(document).ready(function() {
    // Get the form
    const searchForm = $("#searchForm");
    const searchTerm = $("#search_term");
    const siteTitle = $("#siteTitle");

    const showList = $("#showList");
    const homeLink = $("#homeLink");
    const showDiv = $("#show");
    const loadingDiv = $("#loading");

    /**
     * Enable/Disable the results
     * @param resultsList The element containing all the results
     * @param enable true=enable, false=disable
     */
    function showResults(enable = true, resultsList = showList) {
      if (enable) {
        resultsList.show();
      } else {
        resultsList.hide();
      }
    }

    function showHomeLink(isCurrentPageHomePage = undefined, returnHomeElement = homeLink) {
      if (isCurrentPageHomePage === undefined || isCurrentPageHomePage === true) {
        returnHomeElement.hide();
      } else {
        returnHomeElement.show();
      }
    }

    /**
     * Make an AJAX get request
     * @param url The URL to fetch
     * @return {Object} The config for a get request
     */
    function configForGetRequest(url) {
      return {
        method: "GET",
        url
      };
    }

    /**
     * Show/hide the loading element
     * @param enable true=enable, false=disable
     * @param loadingElement The jquery object corresponding to the hider
     */
    function showLoading(enable = true, loadingElement = loadingDiv) {
      if (enable) {
        loadingElement.show();
      } else {
        loadingElement.hide();
      }
    }

    function emptyListOfShows(shows = showList) {
      shows.empty();
    }

    function emptyDetailsOfShow(showDetails = showDiv) {
      showDetails.empty();
    }

    function showDetailsOfShow(enable = true, showDetails = showDiv) {
      if (enable) {
        showDetails.show();
      } else {
        showDetails.hide();
      }
    }

    function showSiteTitle(enable = true, element = siteTitle) {
      if (enable) {
        element.show();
      } else {
        element.hide();
      }
    }

    function renderDetailsOfShow(showName, articleElement, responseMessage) {
      $(document).prop("title", `TV Guide: ${showName}`);
      showName = showName.replaceAll("\"", "");
      const dl = $("<dl></dl>");
      let imgSource = "/img/unknown.jpeg";
      try {
        imgSource = responseMessage.image.medium || "/img/unknown.jpeg";
      } catch (e) {
      }
      let language = responseMessage.language || "N/A";
      dl.append("<dt class='dt'>Language</dt>");
      dl.append($("<dd class=\"dd\"></dd>").text(language));

      let genres = responseMessage.genres;
      let genreElement = $("<dd class=\"dd\"></dd>");
      if (genres && typeof genres === "object" && Array.isArray(genres) && genres.length > 0) {
        if (genres.length === 1) {
          dl.append("<dt class='dt'>Genre</dt>");
          genreElement.text(genres[0]);
        } else {
          let genreInner = $("<ul></ul>");
          for (let j = 0; j < genres.length; j++) {
            genreInner.append(
              $("<li></li>").text(genres[j])
            );
          }
          genreElement.html(genreInner);
          dl.append("<dt class='dt'>Genres</dt>");
        }
      } else {
        dl.append("<dt class='dt'>Genres</dt>");
        genreElement.text("N/A");
      }
      dl.append(genreElement);

      let avgRating = "N/A";
      try {
        avgRating = responseMessage.rating.average;
        if (typeof avgRating === 'string' && avgRating.trim() === ''){
          avgRating = "N/A"
        }
      } catch (e) {
      }
      if (avgRating === undefined) avgRating = "N/A";
      dl.append("<dt class='dt'>Average Rating</dt>");
      dl.append($("<dd class='dd'></dd>").text(avgRating));

      let networkName = "N/A";
      try {
        networkName = responseMessage.network.name || "N/A";
      } catch (e) {
      }
      dl.append("<dt class='dt'>Network</dt>");
      dl.append($("<dd class='dd'></dd>").text(networkName));

      let summary = responseMessage.summary || "N/A";
      dl.append("<dt class='dt'>Summary</dt>");
      dl.append($("<dd class='dd'></dd>").html(summary));
      const image = `<img src="${imgSource}" class="image" height="295" width="210" alt="Image of Show (${showName})">`;
      articleElement.append(image);
      articleElement.append(dl);
      showLoading(false);
      showDetailsOfShow();
      showResults(false);
      showHomeLink(false);
    }

    /**
     * When you click on a show in the list of shows...
     * @param clickEvent
     */
    function getAndRenderDetailsOfShow(clickEvent) {
      showLoading();
      clickEvent.preventDefault();
      showDiv.empty();
      // siteTitle.css('display', 'none');
      showSiteTitle(false);
      const article = $("<article></article>");
      const showName = clickEvent.target.innerText;
      // console.log(showName);
      const articleTitle = $("<h1></h1>").html(showName);
      article.append(articleTitle);
      showDiv.append(article);
      const specificRequestConfig = configForGetRequest(clickEvent.target.href);
      const showDetailsRequest = $.ajax(specificRequestConfig);
      showDetailsRequest.done(renderDetailsOfShow.bind(undefined, showName, article));
    }

    function alphabeticalSortElements(isHomePage, a, b) {
      if (isHomePage)
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
      else return a.score - b.score;
    }

    function renderHomePage(listOfShowsFromAPI, isHomePage = true) {
      $(document).prop("title", isHomePage ? "TV Guide" : `TV Guide Search: ${searchTerm.val()}`);
      showSiteTitle(true);
      emptyListOfShows();
      showDetailsOfShow(false);
      listOfShowsFromAPI.sort(alphabeticalSortElements.bind(undefined, isHomePage));
      for (let i = 0; i < listOfShowsFromAPI.length; i++) {
        const e = isHomePage ? listOfShowsFromAPI[i] : listOfShowsFromAPI[i].show;
        let link = $(`<a href="${e._links.self.href}"></a>`).text(e.name);
        let li = $(`<li></li>`).html(link);
        li.on("click", getAndRenderDetailsOfShow);
        showList.append(li);
      }
      showHomeLink(isHomePage);
      showResults();
      showLoading(false);
    }

    const requestConfig = configForGetRequest("http://api.tvmaze.com/shows");
    $.ajax(requestConfig).then((e) => renderHomePage(e));

    searchForm.on("submit", function(e) {
      emptyListOfShows();
      e.preventDefault();
      let formContent = searchTerm.val();
      if (typeof formContent !== "string") console.log("I see you manipulating my JS...");
      formContent = formContent.trim();
      if (formContent === "") {
        const notification = $("<div class='notification is-danger is-light alertInvalidSearch'></div>");
        const closeButton = $("<button class='delete closeNotification'</button>");
        // const progressBar = $(`<progress value="0" class="progress is-danger">0%</progress>`)
        notification.append(closeButton);
        notification.append("<p>Cannot process empty/spaces input</p>");
        // notification.append(progressBar);
        $("body").prepend(notification);
        closeButton.on("click", (e) => {
          e.target.parentElement.remove();
        });
        // setTimeout(function() {
        //   notification.remove();
        // }, 3000);
        // progressBar.animate({value:100}, duration=2800, easing="linear");
      } else {
        showLoading();
        $(".alertInvalidSearch").each(function() {
          $(this).remove();
        });
        const query = encodeURIComponent(formContent);
        const url = `http://api.tvmaze.com/search/shows?q=${query}`;
        const requestConfig = configForGetRequest(url);
        $.ajax(requestConfig).then((e) => renderHomePage(e, false));
      }
    });
  });
});

x(window.jQuery);

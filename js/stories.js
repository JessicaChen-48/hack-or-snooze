"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <i class="far fa-star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// when users click the story submit button for stories
async function submitStoryForm(e) {
  e.preventDefault();
  console.log("testing submit");

  let authorInput = $("#author-input").val();
  let titleInput = $("#title-input").val();
  let urlInput = $("#url-input").val();

  let newStoryToAdd = await storyList.addStory(currentUser, {
    title: titleInput,
    author: authorInput,
    url: urlInput,
  });

  storyList.unshift(newStoryToAdd);

  putStoriesOnPage();
}

$(".submit-new-stories").on("click", "#submit-story-button", submitStoryForm);

// click on favorite icon to favorite

$("body").on("click", "i", async function (e) {

  console.log("a star was born")

  let $star = $(e.target);

  let storyId = $star.parent().attr("id");

  console.log(storyId);

  let currentStory;

  for (let story of storyList.stories) {
    if (story.storyId === storyId) {
      currentStory = story;
    }
  }

  if ($star.hasClass("far")){
    await currentUser.addFavorite(currentStory);
  } else {
    await currentUser.removeFavorite(currentStory);
  }

  $star.toggleClass("fas far");


});





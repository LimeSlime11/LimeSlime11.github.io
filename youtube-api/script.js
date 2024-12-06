// Replace with your actual YouTube API key
const API_KEY = "AIzaSyCLcsDdKFWZ4kXCU53zpIW8cYoStJeakSU";
const container = document.getElementById("playlistContainer");

async function fetchPlaylistVideos(playlistId) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    container.innerHTML = "";

    if (data.items) {
      // Loop through each item and create a video element for each
      data.items.forEach((item, index) =>
        createVideoItem(item.snippet.resourceId.videoId, index)
      );
    } else {
      console.error("No videos found in the playlist.");
      container.innerHTML = "<p>No videos found for this playlist ID.</p>";
    }
  } catch (error) {
    console.error("Error fetching playlist data:", error);
    container.innerHTML =
      "<p>Error loading playlist. Please check the playlist ID and try again.</p>";
  }
}

function createVideoItem(videoId, index) {
  const itemDiv = document.createElement("div");
  itemDiv.className = "item";

  const wrapperDiv = document.createElement("div");
  wrapperDiv.className = "wrapper";

  // Create an iframe for the YouTube video
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.width = "560";
  iframe.height = "315";
  iframe.frameBorder = "0";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;

  // Create a hidden checkbox for enlarging the video
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `videoCheckbox${index}`; // Unique ID for each video checkbox
  checkbox.className = "videoCheckbox";

  // Create a label overlay that links to the checkbox
  const labelOverlay = document.createElement("label");
  labelOverlay.htmlFor = `videoCheckbox${index}`; // Associate label with checkbox
  labelOverlay.className = "overlay"; // CSS class for the overlay

  // Append elements in the correct order
  wrapperDiv.appendChild(iframe);
  wrapperDiv.appendChild(checkbox); // Hidden checkbox for CSS trigger
  wrapperDiv.appendChild(labelOverlay); // Overlay label to trigger the checkbox
  itemDiv.appendChild(wrapperDiv);

  container.appendChild(itemDiv);
}

function extractPlaylistId(input) {
  const regex = /(?:list=)([a-zA-Z0-9_-]+)/;
  const match = input.match(regex);
  return match ? match[1] : input.trim();
}

document.getElementById("loadPlaylist").addEventListener("click", () => {
  const input = document.getElementById("textField").value.trim();
  const playlistId = extractPlaylistId(input);

  if (playlistId) {
    fetchPlaylistVideos(playlistId);
  } else {
    container.innerHTML = "<p>Please enter a valid playlist ID or URL.</p>";
  }
});

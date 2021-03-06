const API_KEY = "af3f15616f035b038ace1a5f1d39ffec";
const IMAGES_URL = `https://image.tmdb.org/t/p/w300`;
let PAGE = 1;
let type = "current";
let USER_INPUT = "";
const id_arr = [];
let moreDetails = {};

const form = document.getElementById("form");
const movie_area = document.getElementById("movieArea");
const load_btn = document.getElementById("load_btn");
const popup = document.getElementById("popup");
const clear_search = document.getElementById("clear_search");
const search_input = document.getElementById("search__input");

let popup_main = "";
let popup_exit = "";

clear_search.addEventListener("click", (e) => {
    clear_search.classList.add("closed");
    console.log(search_input.value);
    search_input.value = ``;
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    PAGE = 1;
    USER_INPUT = e.target.movieTerm.value;
    searchForMovie(USER_INPUT);

    if (clear_search.classList.contains("closed")) {
        clear_search.classList.remove("closed");
    }
});

load_btn.addEventListener("click", (type) => loadMore(type));
clear_search.addEventListener("click", clearSearch);

async function clearSearch() {
    id_arr.length = 0;
    PAGE = 1;
    let movies = await apiCall("current");
    movie_area.innerHTML = ``;
    type = "current";
    displayMovies(movies);

    // location.reload(); dont do this
}

async function apiCall(type, USER_INPUT) {
    let api_url =
        type === "search"
            ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${USER_INPUT}&page=${PAGE}&include_adult=false`
            : `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${PAGE}`;

    console.log(type);
    console.log(api_url);
    let response = await fetch(api_url);
    return await response.json();
}

async function searchForMovie(USER_INPUT) {
    type = "search";
    let movies = await apiCall(type, USER_INPUT);
    movie_area.innerHTML = ``;
    id_arr.length = 0;
    displayMovies(movies);
}

async function displayCurrentMovies(type) {
    let movies = await apiCall(type, USER_INPUT);
    displayMovies(movies);
}

displayCurrentMovies(type);

function displayMovies(movies) {
    movies.results.forEach(async (movie, index) => {
        id_arr.push(movie.id);
        const poster = movie.poster_path;
        const image_path = IMAGES_URL + poster;

        movie_area.innerHTML += `
        <div class="movie_area_div">
                <img src=${image_path} alt="image of movie ${movie.title}">
                <div class="movie_area_flex">
                    <p id="movie_title"> ${movie.title} </p>
                    <div id="movie_area_flex2">
                        <p id="movie_average">
                            <span id="star"> ???? </span>
                            ${movie.vote_average}
                        </p>
                    </div>
                </div>
        </div>`;

        let getAllMoviesDOM = document.querySelectorAll(".movie_area_div");
        getAllMoviesDOM.forEach((m, i) => {
            m.addEventListener("click", async () => {
                let movies_more_info = await fetch(
                    `https://api.themoviedb.org/3/movie/${id_arr[i]}?api_key=${API_KEY}&language=en-US`
                );

                const movies_more_info_data = await movies_more_info.json();

                moreDetails["backdrop_path"] =
                    IMAGES_URL + movies_more_info_data.backdrop_path;
                moreDetails["overview"] = movies_more_info_data.overview;
                moreDetails["title"] = movies_more_info_data.title;
                moreDetails["genre"] = movies_more_info_data.genres[0].name;
                moreDetails["date"] = movies_more_info_data.release_date;
                moreDetails["runtime"] = movies_more_info_data.runtime;

                console.log(moreDetails.title);
                movie_area.style.filter = "blur(10px)";

                popup.innerHTML = `
                    <div class="popup_main">
                        <div class="popup_container">
                            <p class="popup_exit">???</p>
                            <div class="popup_info">
                                <div id="popup_img">
                                    <div id="popup_imgtag">
                                        <img src=${moreDetails["backdrop_path"]} alt="backdrop image of ${moreDetails.title}">
                                            <div id="popup_text_left">
                                                <div id="popup_sub">${moreDetails.genre}</div>
                                                <div id="popup_title">${moreDetails.title}</div>
                                                <div id="popup_sub">${moreDetails.runtime} mins | ${moreDetails.date}</div>
                                             </div>
                                             <div id="popup_text_right">
                                                 <div id="popup_overview">${moreDetails.overview} </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                popup_main = document.querySelector(".popup_main");
                popup_exit = document.querySelector(".popup_exit");

                popup_main.style.display = "block";

                popup_exit.addEventListener("click", () => {
                    popup_main.style.display = "none";
                    movie_area.style.filter = "blur(0px)";
                });
            });
        });
    });
}

async function loadMore() {
    PAGE = PAGE + 1;
    let movies = await apiCall(type, USER_INPUT);
    console.log(`Inside loadMore(), ${type}, ${USER_INPUT}`);
    displayMovies(movies);
}

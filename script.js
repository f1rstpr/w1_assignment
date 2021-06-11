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

let popup_main = "";
let popup_exit = "";

form.addEventListener("submit", (e) => {
    e.preventDefault();
    PAGE = 1;
    USER_INPUT = e.target.movieTerm.value;
    searchForMovie(USER_INPUT);
});

load_btn.addEventListener("click", (type) => loadMore(type));

async function apiCall(type, USER_INPUT) {
    let api_url =
        type === "search"
            ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${USER_INPUT}&page=${PAGE}&include_adult=false`
            : `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${PAGE}`;

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
    let movies = await apiCall(type);
    displayMovies(movies);
}

displayCurrentMovies(type);

function displayMovies(movies) {
    movies.results.forEach(async (movie) => {
        id_arr.push(movie.id);
        const poster = movie.poster_path;
        const image_path = IMAGES_URL + poster;

        movie_area.innerHTML += `
        <div class="movie_area_div">
                <img src=${image_path}>
                <div class="movie_area_flex">
                    <p id="movie_title"> ${movie.title} </p>

                    <div id="movie_area_flex2">
                        <p id="movie_average">
                            <span id="star"> 🌟 </span>
                            ${movie.vote_average}
                        </p>
                    </div>
                </div>
        </div>`;

        const getAllMoviesDOM = document.querySelectorAll(".movie_area_div");
        getAllMoviesDOM.forEach((m, i) => {
            m.addEventListener("click", async () => {
                const movies_more_info = await fetch(
                    `https://api.themoviedb.org/3/movie/${id_arr[i]}?api_key=${API_KEY}&language=en-US`
                );
                const movies_more_info_data = await movies_more_info.json();
                console.log(movies_more_info_data);
                moreDetails["backdrop_path"] =
                    IMAGES_URL + movies_more_info_data.backdrop_path;
                moreDetails["overview"] = movies_more_info_data.overview;
                moreDetails["title"] = movies_more_info_data.title;
                moreDetails["genre"] = movies_more_info_data.genres[0].name;
                moreDetails["date"] = movies_more_info_data.release_date;
                moreDetails["runtime"] = movies_more_info_data.runtime;

                movie_area.style.filter = "blur(10px)";
                console.log(moreDetails);
                console.log(moreDetails["backdrop_path"]);
                console.log(moreDetails.title);
                {
                    /*<img id="popup_imgtag" src=${moreDetails.backdrop_path}>*/
                }
                console.log(
                    "background-image: url(" + moreDetails.backdrop_path + ")"
                );
                popup.innerHTML = `
                    <div class="popup_main">
                        <div class="popup_container">
                            <p class="popup_exit">❌</p>
                            <div class="popup_info">
                                <div id="popup_img">

                                    <div id="popup_imgtag">

                                    </div>
                                </div>
                                <div>${moreDetails.genre}</div>
                                <div>${moreDetails.title}</div>
                                <div>${moreDetails.runtime} mins | ${moreDetails.date}</div>
                                <div>${moreDetails.overview} </div>
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
    let movies = await apiCall(type, USER_INPUT);
    console.log("loadMore", movies);
    PAGE = PAGE + 1;
    displayCurrentMovies(movies);
}

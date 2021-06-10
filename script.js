const API_KEY = "af3f15616f035b038ace1a5f1d39ffec";
const IMAGES_URL = `https://image.tmdb.org/t/p/w300`;
let PAGE = 1;
let type = "current";
let USER_INPUT = "";

const form = document.getElementById("form");
const movie_area = document.getElementById("movieArea");
const load_btn = document.getElementById("load_btn");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    PAGE = 1;
    USER_INPUT = e.target.movieTerm.value;
    searchForMovie(USER_INPUT);
});

// https://stackoverflow.com/questions/40802071/pass-an-extra-argument-to-a-callback-function
load_btn.addEventListener("click", (type) => loadMore(type));

async function apiCall(type, USER_INPUT) {

    // if (USER_INPUT !== undefined) {
    //     // console.log(USER_INPUT.split(" ").join("%20"));
    //     // console.log(USER_INPUT, "<<<<<< after");
    //     USER_INPUT = USER_INPUT.split(" ").join("%20");
    // }

    let api_url =
        type === "search"
            ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${USER_INPUT}&page=${PAGE}&include_adult=false`
            : `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${PAGE}`;

    // console.log(api_url);
    // console.log(`USER INPUT: ${USER_INPUT}`);
    let response = await fetch(api_url);
    return await response.json();
}

async function searchForMovie(USER_INPUT) {
    type = "search";
    let movies = await apiCall(type, USER_INPUT);
    movie_area.innerHTML = ``;
    displayMovies(movies);
}

async function displayCurrentMovies(type) {
    let movies = await apiCall(type);
    displayMovies(movies);
}

displayCurrentMovies(type);

function displayMovies(movies) {
    movies.results.forEach(async (movie) => {
        const poster = movie.poster_path;
        const image_path = IMAGES_URL + poster;
        movie_area.innerHTML += `
        <div id="movie_area_div">

                <img src=${image_path}>
                <div class="movie_area_flex">
                    <p id="movie_title"> ${movie.title} </p>
                    <p id="movie_average"> ${movie.vote_average} </p>
                </div>

        </div>`;
    });
}

async function loadMore() {
    let movies = await apiCall(type, USER_INPUT);
    console.log("loadMore", movies);
    displayMovies(movies);
    PAGE = PAGE + 1;
}

// List the movies

// On submit should show the user the movies matching the search term

// window.onload = () => {
//     searchForMovie();
//     apiCall();
// };

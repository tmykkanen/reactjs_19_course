import React, { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard";
import Search from "./components/Search";
import Spinner from "./components/Spinner";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${API_KEY}`,
	},
};

const App = () => {
	const [searchTerm, setSearchTerm] = React.useState<string>("");
	const [errorMessage, setErrorMessage] = React.useState<string>("");
	const [movies, setMovies] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	const fetchMovies = async () => {
		setIsLoading(true);
		setErrorMessage("");
		try {
			const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
			const response = await fetch(endpoint, API_OPTIONS);

			if (!response.ok) {
				throw new Error("Failed to fetch movies.");
			}

			const data = await response.json();

			if (data.Response === "False") {
				setErrorMessage(data.Error || "Failed to fetch movies.");
				setMovies([]);
				return;
			}

			setMovies(data.results || []);
		} catch (error) {
			console.error(`Error fetching movies: ${error}`);
			setErrorMessage("Error fetching movies. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchMovies();
	}, []);

	return (
		<main>
			<div className="pattern"></div>
			<div className="wrapper">
				<header>
					<img src="./hero.png" alt="Hero Banner" />
					<h1>
						Find <span className="text-gradient">Movies</span> You'll Enjoy
						Without the Hassle
					</h1>
					<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				</header>
				<section className="all-movies">
					<h2 className="mt-10">All Movies</h2>
					{isLoading ? (
						<Spinner />
					) : errorMessage ? (
						<p className="text-red-500">{errorMessage}</p>
					) : (
						<ul>
							{movies.map((movie) => (
								<MovieCard key={movie.id} movie={movie} />
							))}
						</ul>
					)}
					{errorMessage && <p className="text-red-500">{errorMessage}</p>}
				</section>
			</div>
		</main>
	);
};

export default App;

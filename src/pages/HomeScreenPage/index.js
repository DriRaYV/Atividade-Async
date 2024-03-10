import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { PhotoRevealComponent } from "../../components/PhotoRevealComponent";
import * as S from "./style";
import moment from "moment";

const HomeScreen = () => {
  const [movie, setMovie] = useState();
  const [movieFilter, setMovieFilter] = useState([]);
  const [originalMovieFilter, setOriginalMovieFilter] = useState([]);
  const [selected, setSelected] = useState("");
  const [tips, setTips] = useState([]);
  const [next, setNext] = useState(false);
  const [trackUri, setTrackUri] = useState("");
  const [tokenSpotify, setTokenSpotify] = useState("");
  const [conclusion, setConclusion] = useState(0);
  const [blur, setBlur] = useState(12);
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState("");

  const handleGetSpotifyToken = async () => {
    return fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(
          `${process.env.REACT_APP_SPOTIFY_ACCESS_ID}:${process.env.REACT_APP_SPOTIFY_ACCESS_SECRET}`
        )}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        setTokenSpotify(data.access_token);
      })
      .catch((err) => err);
  };

  const handleSearchSoundtrack = async (movieName, token) => {
    return fetch(
      `https://api.spotify.com/v1/search?q=soundtrack:${movieName}&type=track&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        setTrackUri(data?.tracks?.items[Math.floor(Math.random() * 20)]?.id);
      })
      .catch((err) => console.log(err));
  };

  const handleFetchMovies = async () => {
    return fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_MOVIE_API_TOKEN}&language=pt-br&include_adult=false`
    )
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        setOriginalMovieFilter(data?.results);
      })
      .catch((err) => console.log(err));
  };

  const handleFetchOneMovie = async () => {
    console.log(
      `https://api.themoviedb.org/3/discover/movie?api_key=${
        process.env.REACT_APP_MOVIE_API_TOKEN
      }&language=pt-br&include_adult=false&page=${Math.floor(
        Math.random() * 500
      )}`
    );
    return fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${
        process.env.REACT_APP_MOVIE_API_TOKEN
      }&language=pt-br&include_adult=false&page=${Math.floor(
        Math.random() * 500
      )}`
    )
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        const randomMovie = () => {
          const rand =
            data?.results[Math.floor(Math.random() * data?.results?.length)];
          if (!rand?.poster_path) {
            randomMovie();
          }

          return rand;
        };

        fetch(
          `https://api.themoviedb.org/3/movie/${randomMovie()?.id}?api_key=${
            process.env.REACT_APP_MOVIE_API_TOKEN
          }&language=pt-br&append_to_response=credits`
        )
          .then((movieRes) => {
            if (!movieRes.ok) {
              throw new Error("Erro ao buscar artista");
            }
            return movieRes.json();
          })
          .then((movieData) => {
            setMovie(movieData);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  const handleInputChange = async (e) => {
    return fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MOVIE_API_TOKEN}&language=pt-br&query=${e}`
    )
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        setMovieFilter(data?.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCleanNextPhase = () => {
    setTips([]);
    setTrackUri("");
    setConclusion(0);
    setMessage("");
    setNext(false);
    setBlur(12);
    handleFetchOneMovie();
    handleGetSpotifyToken();
  };

  useEffect(() => {
    handleFetchMovies();
    handleFetchOneMovie();
    handleGetSpotifyToken();
  }, []);

  useEffect(() => {
    if (!selected) return;
    if (selected === movie?.title || conclusion === 3) {
      setBlur(0);
      setNext(true);
      if (selected === movie?.title) {
        setPoints(points + 1);
        setMessage("Você acertou! 🔥");
      } else {
        setPoints(0);
        setMessage("Você errou! 🥶");
      }
    } else if (tips.length < 2) {
      setConclusion(conclusion + 1);
      setBlur(blur / 1.7);
      const tipToAdd =
        tips.length === 0
          ? {
              tip: `A data de lançamento do filme foi em `,
              key: moment(new Date(movie?.release_date)).format("DD/MM/YYYY"),
            }
          : {
              tip: `O filme foi originalmente lançado com o idioma: `,
              key: movie?.original_language,
            };
      setTips([...tips, tipToAdd]);
    } else if (tokenSpotify) {
      setConclusion(conclusion + 1);
      setBlur(blur / 1.3);
      handleSearchSoundtrack(movie?.original_title, tokenSpotify);
    }
  }, [selected]);

  return (
    movie && (
      <S.PageWrapper>
        <S.BoxInfoPhoto>
          <S.BoxPhoto>
            <S.Text>
              Acertos contínuos:{" "}
              <span style={{ color: "#EB7D3F" }}>{points}</span> 🔥
            </S.Text>
            <S.Text>{message}</S.Text>

            <PhotoRevealComponent
              blur={blur}
              img={
                movie?.poster_path &&
                `https://image.tmdb.org/t/p/w400${movie?.poster_path}`
              }
            />
            {!next && (
              <S.Input
                id="free-solo-demo"
                onChange={(event, newValue) => setSelected(newValue)}
                options={
                  movieFilter.map((option) => option.title).length
                    ? [...new Set(movieFilter.map((option) => option.title))]
                    : [
                        ...new Set(
                          originalMovieFilter.map((option) => option.title)
                        ),
                      ]
                }
                renderInput={(params) => (
                  <div style={{ position: "relative" }}>
                    <TextField
                      onChange={(e) => handleInputChange(e.target.value)}
                      {...params}
                      label="Digite o nome de um filme"
                    />
                  </div>
                )}
              />
            )}

            <S.BoxTips>
              {tips.map((tip, _index) => (
                <S.Tip key={_index}>
                  {tip.tip} <span style={{ color: "#2597C8" }}>{tip.key}</span>
                </S.Tip>
              ))}
              {trackUri && (
                <iframe
                  src={`https://open.spotify.com/embed/track/${trackUri}`}
                  width="300"
                  height="80"
                  allowtransparency="true"
                  allow="encrypted-media"
                ></iframe>
              )}
            </S.BoxTips>
            {next && (
              <Button
                variant="contained"
                onClick={() => handleCleanNextPhase()}
              >
                Próximo
              </Button>
            )}
          </S.BoxPhoto>
          {next && (
            <>
              <S.MovieInfo>
                <S.Title>Informações do filme!</S.Title>
                <S.Text>
                  Nome do filme em português:{" "}
                  {movie.title || "não possui título"}
                </S.Text>
                <S.Text>
                  Nome original do filme:{" "}
                  {movie.original_title || "não possui título original"}
                </S.Text>
                <S.Text>
                  Sinopse: {movie.overview || "não possui sinopse"}
                </S.Text>
                <S.Text>
                  Ano de lançamento:{" "}
                  {moment(new Date(movie?.release_date)).format("DD/MM/YYYY") ||
                    "não possui data de lançamento"}
                </S.Text>
                <S.Text>
                  Nota do público:{" "}
                  {movie?.vote_average || "não possui nota do público"}
                </S.Text>
              </S.MovieInfo>
            </>
          )}
        </S.BoxInfoPhoto>
      </S.PageWrapper>
    )
  );
};

export { HomeScreen };

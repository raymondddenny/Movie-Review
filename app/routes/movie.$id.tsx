import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, json, useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  const url = await fetch(
    `https://api.themoviedb.org/3/movie/${params.id}?language=en-US`,
    {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZTFiZDE5NmQ3Y2ZmNzEwNTlhNDdkZjgyMTdlZDZhYyIsInN1YiI6IjVlYTU1ZmM3NjZmMmQyMDAxZTNmMzM5NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4Wb0iL7tPR0xcHJcQb_3J6ywojXT4_A4X_YfoVUA6XI",
      },
    }
  );

  return json(await url.json());
}

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  genres: { id: number; name: string }[];
  popularity: number;
  release_date: string;
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
  original_language: string;
  homepage: string;
}

export default function MovieDetail() {
  const dataDetail = useLoaderData<MovieDetail>();
  console.log(dataDetail);
  return (
    <div className="p-10 min-h-screen">
      <img
        className="w-full h-[40vh] object-cover rounded-lg"
        src={`https://image.tmdb.org/t/p/original${dataDetail!.backdrop_path}`}
        alt="movie"
      />
      <h1 className="text-3xl text-center font-bold pt-5">
        {dataDetail!.title}
      </h1>
      <p className="text-lg text-gray-600 text-center">{dataDetail.overview}</p>
      <div className="flex gap-x-10 mt-10">
        <div className="w-1/2 font-medium">
          <h1>
            <span className="underline">Homepage:</span>
            <Link
              className="hover:text-blue-600"
              to={dataDetail.homepage}
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              Link
            </Link>
          </h1>
          <p>
            <span className="underline">Original Language:</span>{" "}
            {dataDetail.original_language}
          </p>
          <p>
            <span className="underline">Release Date:</span>{" "}
            {dataDetail.release_date}
          </p>
          <p>
            <span className="underline">Popularity:</span>{" "}
            {(dataDetail.popularity / 100).toFixed()}%{" "}
          </p>
        </div>
        <div className="w-1/2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

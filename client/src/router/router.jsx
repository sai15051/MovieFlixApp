import { Routes , Route} from "react-router-dom";

import Register from "../pages/Register";
import Login from "../pages/Login";
import GuardedRoute from "./GuardedRoute";

import AllMovies from "../pages/AllMovies";
import MovieDetails from "../pages/MovieDetails";

import { ThemeProvider } from "../contexts/ThemeContext";

const createRoutes = () => (
    <ThemeProvider>
    <Routes>
        {/* <Route path="/" element={
            <GuardedRoute >

            </GuardedRoute>
        } /> */}

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="my-list" element={<AllMovies/>} />
        <Route path="/movies/:id" element={<MovieDetails />} />


    </Routes>
    </ThemeProvider>
)

export default createRoutes


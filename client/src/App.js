import Body from "./components/Body";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

function App() {
    return (
        <div className="bg-black h-screen w-screen flex flex-col text-white">
            <header className="h-16 border-b border-b-zinc-600 py-4 px-6">
                <h1 className="text-white font-semibold text-xl mb-4">
                    SMS.Ltd
                </h1>
            </header>

            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Body />}
                    />
                </Routes>
            </BrowserRouter>

        </div>
    );
}

export default App;

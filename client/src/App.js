import Body from "./components/Body";
import UserModal from "./components/UserModal";
import { useState } from "react";

function App() {
    return (
        <div className="bg-black h-screen w-screen flex flex-col">
            <header className="h-16 border-b border-b-zinc-600 py-4 px-6">
                <h1 className="text-white font-semibold text-xl">
                    SMS.Ltd
                </h1>
            </header>

            <main className="text-white p-6">
                <Body />
                
            </main>

        </div>
    );
}

export default App;

import Gallery from "./components/Gallery";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Photo Gallery</h1>
        <Gallery />
      </main>
    </div>
  );
}

export default App;
import { BundleBuilder } from './components/builder/BundleBuilder';

function App() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-8 md:py-8">
        <h1 className="mb-6 text-2xl font-bold text-primary md:mb-8">
          Security System Bundle Builder
        </h1>
        <BundleBuilder />
      </div>
    </main>
  );
}

export default App;

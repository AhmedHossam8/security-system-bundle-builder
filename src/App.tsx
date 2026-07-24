import { useState } from 'react';
import { Camera } from 'lucide-react';
import { products } from './data/products';
import { BuilderStep } from './components/builder/BuilderStep';
import { ProductGrid } from './components/builder/ProductGrid';

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const cameras = products.filter((p) => p.category === 'cameras');

  return (
    <main className="min-h-screen p-4 md:p-8">
      <h1 className="mb-8 text-2xl font-bold text-primary">Security System Bundle Builder</h1>
      <BuilderStep
        stepNumber={1}
        totalSteps={4}
        title="Choose your cameras"
        selectedCount={1}
        isOpen={isOpen}
        icon={<Camera className="h-5 w-5" />}
        nextLabel="Next: Choose your plan"
        onToggle={() => setIsOpen(!isOpen)}
        onNext={() => console.log('Next clicked')}
      >
        <ProductGrid products={cameras} />
      </BuilderStep>
    </main>
  );
}

export default App;

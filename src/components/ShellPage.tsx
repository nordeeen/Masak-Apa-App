import Navbar from './Navbar';
import StepIndicator from './Stepindicator';

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pb-24">
        <StepIndicator />
        {children}
      </main>
    </>
  );
}

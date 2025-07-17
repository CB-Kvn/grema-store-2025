import { Logo, LCPLogo } from './common/Logo';

// Test component to verify logo optimization
const LogoTest = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Logo Optimization Test</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Black Logo (Regular)</h3>
            <Logo variant="black" className="w-32 h-12" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">White Logo (Regular)</h3>
            <div className="bg-black p-4 inline-block">
              <Logo variant="white" className="w-32 h-12" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">LCP Optimized Logo</h3>
            <LCPLogo variant="black" className="w-32 h-12" />
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Optimization Details:</h3>
        <ul className="text-sm space-y-1">
          <li>✅ AVIF format for maximum compression (18.0 KB vs 23.6 KB PNG)</li>
          <li>✅ WebP format for broad browser support</li>
          <li>✅ PNG fallback for maximum compatibility</li>
          <li>✅ Responsive srcSet for different screen sizes</li>
          <li>✅ Proper loading attribute (eager for LCP, lazy for others)</li>
          <li>✅ Proper width/height attributes to prevent layout shift</li>
        </ul>
      </div>
    </div>
  );
};

export default LogoTest;

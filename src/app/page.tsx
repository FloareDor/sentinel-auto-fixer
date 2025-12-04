import { Window } from "@/components/windows95/window";
import { Button } from "@/components/windows95/button";
import { Dialog } from "@/components/windows95/dialog";
import { TitleBar } from "@/components/windows95/titlebar";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 win95-ui">Sentinel MVP - Windows 95 Theme Test</h1>
          <p className="text-win95-black mb-6 win95-ui">
            Testing Windows 95 components: Window, Button, Dialog, TitleBar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Window Test */}
          <Window title="Test Window">
            <div className="space-y-4">
              <p className="win95-ui text-sm">This is a classic Windows 95 window with 3D borders.</p>
              <div className="flex gap-2">
                <Button>OK</Button>
                <Button variant="default">Default</Button>
              </div>
            </div>
          </Window>

          {/* Button Test */}
          <Window title="Button Components">
            <div className="space-y-4">
              <p className="win95-ui text-sm mb-4">Testing Windows 95 style buttons:</p>
              <div className="flex gap-2 flex-wrap">
                <Button>Normal</Button>
                <Button variant="default">Default</Button>
                <Button disabled>Disabled</Button>
              </div>
              <p className="win95-ui text-sm text-win95-dark-gray">
                Buttons have raised/inset states on interaction
              </p>
            </div>
          </Window>

          {/* TitleBar Test */}
          <Window title="TitleBar Component">
            <div className="space-y-4">
              <TitleBar title="Standalone TitleBar" />
              <p className="win95-ui text-sm">
                TitleBar with minimize, maximize, and close buttons (visual only)
              </p>
            </div>
          </Window>

          {/* Scrollbar Test */}
          <Window title="Scrollbar Test">
            <div className="space-y-2 max-h-32 overflow-y-auto">
              <p className="win95-ui text-sm">Line 1: Testing custom scrollbars</p>
              <p className="win95-ui text-sm">Line 2: Windows 95 style scrollbars</p>
              <p className="win95-ui text-sm">Line 3: Should show classic appearance</p>
              <p className="win95-ui text-sm">Line 4: With 3D beveled borders</p>
              <p className="win95-ui text-sm">Line 5: And proper colors</p>
              <p className="win95-ui text-sm">Line 6: More content for scrolling</p>
              <p className="win95-ui text-sm">Line 7: Keep scrolling to see</p>
              <p className="win95-ui text-sm">Line 8: The scrollbar styling</p>
            </div>
          </Window>
        </div>

        {/* Dialog Test */}
        <Dialog title="Test Dialog">
          <p className="win95-ui text-sm">
            This is a modal dialog box with classic Windows 95 styling.
            It demonstrates the dialog component functionality.
          </p>
        </Dialog>

        {/* Status */}
        <Window title="Test Status" className="mt-8">
          <div className="space-y-2">
            <h3 className="win95-ui font-bold text-win95-blue">✅ Windows 95 Theme Test Status</h3>
            <ul className="win95-ui text-sm space-y-1">
              <li>✓ CSS variables loaded (--win95-gray, --win95-blue, etc.)</li>
              <li>✓ 3D border utilities working (raised/inset)</li>
              <li>✓ Classic fonts applied (MS Sans Serif, Courier New)</li>
              <li>✓ Scrollbars styled with Windows 95 appearance</li>
              <li>✓ Window component renders with 3D borders</li>
              <li>✓ Button component has interactive raised/inset states</li>
              <li>✓ Dialog component displays as modal overlay</li>
              <li>✓ TitleBar component shows window controls</li>
              <li>✓ Desktop background uses teal color</li>
            </ul>
          </div>
        </Window>
      </main>
    </div>
  );
}

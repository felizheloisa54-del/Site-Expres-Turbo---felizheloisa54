import React from 'react';
import { ViewportMode, BusinessProfile, ThemeConfig, SelectedElementInspect, SectionToggle } from '../../types';
import { RenderedLandingPage } from './RenderedLandingPage';
import { SuspendedPageNotice } from './SuspendedPageNotice';

interface Props {
  business: BusinessProfile;
  theme: ThemeConfig;
  viewport: ViewportMode;
  isPreviewMode: boolean;
  onUpdateBusiness: (updated: BusinessProfile) => void;
  onSelectElement: (inspect: SelectedElementInspect) => void;
  onReactivate?: () => void;
  sections?: SectionToggle[];
}

export const CanvasContainer: React.FC<Props> = ({
  business,
  theme,
  viewport,
  isPreviewMode,
  onUpdateBusiness,
  onSelectElement,
  onReactivate,
  sections,
}) => {
  // If the site is suspended via Killswitch, display the administrative lock notice
  if (business.status === 'suspended') {
    return (
      <div className="w-full flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-slate-100/70">
        <div className="max-w-xl w-full">
          <SuspendedPageNotice business={business} onReactivate={onReactivate} />
        </div>
      </div>
    );
  }

  // Frame dimension based on viewport mode
  const getContainerStyle = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[400px] my-6 rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden ring-1 ring-slate-800 bg-white';
      case 'tablet':
        return 'max-w-[780px] my-6 rounded-[36px] shadow-2xl border-[10px] border-slate-800 overflow-hidden ring-1 ring-slate-700 bg-white';
      case 'desktop':
      default:
        return 'w-full shadow-xs bg-white';
    }
  };

  return (
    <div className="w-full flex-1 overflow-y-auto flex flex-col items-center bg-[#F8F9FA] transition-all">
      <div className={`transition-all duration-300 w-full flex flex-col ${getContainerStyle()}`}>
        {/* Mock phone status speaker notch for mobile mode */}
        {viewport === 'mobile' && (
          <div className="h-6 bg-slate-900 w-full flex items-center justify-center shrink-0">
            <div className="w-20 h-3 bg-slate-950 rounded-full" />
          </div>
        )}

        {/* The Live Rendered Landing Page */}
        <RenderedLandingPage
          business={business}
          theme={theme}
          viewport={viewport}
          isPreviewMode={isPreviewMode}
          onUpdateBusiness={onUpdateBusiness}
          onSelectElement={onSelectElement}
          sections={sections}
        />
      </div>
    </div>
  );
};

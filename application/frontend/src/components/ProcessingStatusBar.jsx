import React from 'react';
import { CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const ProcessingStatusBar = ({ stage, progress }) => {
  const stages = [
    { id: 'reading', label: 'Document Read', order: 1 },
    { id: 'mapping', label: 'Mapping Regulations', order: 2 },
    { id: 'detecting', label: 'Detecting Risks', order: 3 },
    { id: 'generating', label: 'Generating Report', order: 4 }
  ];

  const getCurrentStageOrder = () => {
    const currentStage = stages.find(s => s.id === stage);
    return currentStage ? currentStage.order : 0;
  };

  const currentOrder = getCurrentStageOrder();

  return (
    <div className="bg-[#262626] border border-[#393939] rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#f4f4f4]">Processing Audit</h3>
        <span className="text-sm text-gray-400">{progress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#161616] rounded-full h-2 mb-6">
        <div 
          className="bg-[#0f62fe] h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage Indicators */}
      <div className="grid grid-cols-4 gap-4">
        {stages.map((stageItem) => {
          const isCompleted = stageItem.order < currentOrder;
          const isCurrent = stageItem.id === stage;
          const isPending = stageItem.order > currentOrder;

          return (
            <div 
              key={stageItem.id}
              className={`flex items-center space-x-2 p-3 rounded-lg transition-all ${
                isCompleted ? 'bg-green-900/20 border border-green-700' :
                isCurrent ? 'bg-blue-900/20 border border-[#0f62fe]' :
                'bg-[#161616] border border-[#393939]'
              }`}
            >
              {isCompleted && (
                <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              )}
              {isCurrent && (
                <ArrowPathIcon className="w-5 h-5 text-[#0f62fe] flex-shrink-0 animate-spin" />
              )}
              {isPending && (
                <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0" />
              )}
              <span className={`text-sm ${
                isCompleted ? 'text-green-400' :
                isCurrent ? 'text-[#0f62fe]' :
                'text-gray-500'
              }`}>
                {stageItem.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingStatusBar;

// Made with Bob

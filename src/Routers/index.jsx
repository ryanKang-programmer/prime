import React from 'react';
import App from '../App';
import PipelineOverview from '../ProjectWorkspace/PipelineOverview/PipelineOverview';
import PipelineMap from '../ProjectWorkspace/PipelineOverview/PipelineMap';
import Dashboard from '../ProjectWorkspace/Dashboard';
import ImportCoordinates from '../ProjectWorkspace/PipelineOverview/ImportCoordinates';
import ExportCoordinates from '../ProjectWorkspace/PipelineOverview/ExportCoordinates';
import HazardSimulation from '../ProjectWorkspace/PipelineOverview/HazardSimulation';
import LeakDetection from '../ProjectWorkspace/LeakDetection/LeakDetection';
import Simulation from '../ProjectWorkspace/LeakDetection/Simulation';
import Localization from '../ProjectWorkspace/LeakDetection/Localization';
import StressAnalysis from '../ProjectWorkspace/StressAnalysis/StressAnalysis';
import StressSimulation from '../ProjectWorkspace/StressAnalysis/Simulation';
import StressRealtime from '../ProjectWorkspace/StressAnalysis/Realtime';
import RiskAssessment from '../ProjectWorkspace/RiskAssessment/RiskAssesment';
import ModifyBoundary from '../ProjectWorkspace/WhatIf/ModifyBoundary';
import NewAnalysis from '../ProjectWorkspace/WhatIf/NewAnalysis';
import NewSimulation from '../ProjectWorkspace/WhatIf/NewSimulation';
import Comprehensive from '../ProjectWorkspace/Comprehensive/NewSimulation';
import Report from '../ProjectWorkspace/Report'

  const Routers = () => {
    return ({
        path: "/",
        element: <App />,
        // errorElement: <ErrorPage />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/pipe/overview",
            element: <PipelineOverview />,
          },
          {
            path: "/pipe/map",
            element: <PipelineMap />,
          },
          {
            path: "/pipe/importCoord",
            element: <ImportCoordinates />,
          },
          {
            path: "/pipe/exportCoord",
            element: <ExportCoordinates />,
          },
          {
            path: "/pipe/hazard",
            element: <HazardSimulation />,
          },
          {
            path: "/leak",
            element: <LeakDetection />,
          },
          {
            path: "/leak/realtime",
            element: <LeakDetection />,
          },
          {
            path: "/leak/simulation",
            element: <Simulation />,
          },
          {
            path: "/leak/localization",
            element: <Localization />,
          },
          {
            path: "/stress",
            element: <StressAnalysis />,
          },
          {
            path: "/stress/realtime",
            element: <StressRealtime />,
          },
          {
            path: "/stress/simulation",
            element: <StressSimulation />,
          },
          {
            path: "/whatIf",
            element: <PipelineOverview />,
          },
          {
            path: "/whatIf/simulation",
            element: <NewSimulation />,
          },
          {
            path: "/whatIf/analysis",
            element: <NewAnalysis />,
          },
          {
            path: "/whatIf/boundary",
            element: <ModifyBoundary />,
          },
          {
            path: "/risk",
            element: <RiskAssessment />,
          },
          {
            path: "/risk/leak",
            element: <RiskAssessment />,
          },
          {
            path: "/risk/stress",
            element: <RiskAssessment />,
          },
          {
            path: "/risk/combined",
            element: <RiskAssessment />,
          },
          {
            path: "/report",
            element: <Report />,
          },
          {
            path: "/comprehensive",
            element: <Comprehensive />,
          },
        ],
      })
  }

export default Routers;
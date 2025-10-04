import React from 'react';
import useFirestoreCollection from './hooks/useFirestoreCollection';
import { sendIntervention } from './services/pubsub';
import TaskList from './components/TaskList';
import FinancialsList from './components/FinancialsList';
import MetricsList from './components/MetricsList';

const OversightHub = () => {
  const { data: tasks, loading: tasksLoading, error: tasksError } = useFirestoreCollection('tasks');
  const { data: financials, loading: financialsLoading, error: financialsError } = useFirestoreCollection('financials');
  const { data: metrics, loading: metricsLoading, error: metricsError } = useFirestoreCollection('content_metrics');

  const error = tasksError || financialsError || metricsError;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 font-sans">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">Oversight Hub</h1>
        <button
          onClick={sendIntervention}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          {/* INTERVENE */}
        </button>
      </header>

      {error && <div className="bg-red-800 text-white p-4 rounded-lg mb-8">{error}</div>}

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TaskList tasks={tasks} loading={tasksLoading} />
        <FinancialsList financials={financials} loading={financialsLoading} />
        <MetricsList metrics={metrics} loading={metricsLoading} />
      </main>
    </div>
  );
};

export default OversightHub;
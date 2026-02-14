import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  Typography,
  Alert,
} from '@mui/material';
import { Plus, Save, Play, Trash2 } from 'lucide-react';
import PhaseNode from './PhaseNode';
import PhaseConfigPanel from './PhaseConfigPanel';
import { makeRequest } from '../services/cofounderAgentClient';

const nodeTypes = {
  phase: PhaseNode,
};

const WorkflowCanvas = ({ onSave, availablePhases, workflow = null }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflowName, setWorkflowName] = useState(workflow?.name || '');
  const [workflowDescription, setWorkflowDescription] = useState(workflow?.description || '');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with workflow if provided
  React.useEffect(() => {
    if (workflow && workflow.phases) {
      const newNodes = workflow.phases.map((phase, index) => ({
        id: `phase-${index}`,
        data: { label: phase.name, phase },
        position: { x: index * 250, y: 0 },
        type: 'phase',
      }));

      const newEdges = workflow.phases.slice(0, -1).map((_, index) => ({
        id: `edge-${index}`,
        source: `phase-${index}`,
        target: `phase-${index + 1}`,
      }));

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [workflow]);

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const addPhase = (phase) => {
    const newNodeId = `phase-${nodes.length}`;
    const newNode = {
      id: newNodeId,
      data: { label: phase.name, phase },
      position: { x: nodes.length * 250, y: 0 },
      type: 'phase',
    };

    setNodes((nds) => [...nds, newNode]);

    // Auto-connect to last node
    if (nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      setEdges((eds) => [
        ...eds,
        {
          id: `edge-${nodes.length - 1}`,
          source: lastNode.id,
          target: newNodeId,
        },
      ]);
    }
  };

  const updatePhaseConfig = (nodeId, config) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, phase: config } }
          : node
      )
    );
  };

  const removePhase = (nodeId) => {
    const nodeIndex = nodes.findIndex((n) => n.id === nodeId);
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) =>
      eds.filter(
        (e) =>
          e.source !== nodeId &&
          e.target !== nodeId
      )
    );
  };

  const buildWorkflowDefinition = () => {
    // Verify workflow has phases
    if (nodes.length === 0) {
      setError('Workflow must have at least one phase');
      return null;
    }

    if (!workflowName.trim()) {
      setError('Workflow name is required');
      return null;
    }

    if (!workflowDescription.trim()) {
      setError('Workflow description is required');
      return null;
    }

    return {
      name: workflowName,
      description: workflowDescription,
      phases: nodes.map((node) => ({
        name: node.data.phase.name,
        agent: node.data.phase.agent || node.data.phase.name,
        description: node.data.phase.description,
        timeout_seconds: node.data.phase.timeout_seconds || 300,
        max_retries: node.data.phase.max_retries || 3,
        skip_on_error: node.data.phase.skip_on_error || false,
        required: node.data.phase.required !== false,
        quality_threshold: node.data.phase.quality_threshold,
        metadata: node.data.phase.metadata || {},
      })),
    };
  };

  const handleSave = async () => {
    const definition = buildWorkflowDefinition();
    if (definition) {
      try {
        const response = await makeRequest('POST', '/api/workflows/custom', definition);
        onSave(response);
        setSaveDialogOpen(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleExecute = () => {
    const definition = buildWorkflowDefinition();
    if (definition) {
      // TODO: Execute workflow
      console.log('Execute workflow:', definition);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', gap: 2, p: 2 }}>
      {/* Sidebar: Available Phases */}
      <Card sx={{ width: 280, overflow: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Available Phases</Typography>
          <Stack spacing={1}>
            {availablePhases.map((phase) => (
              <Button
                key={phase.name}
                variant="outlined"
                fullWidth
                size="small"
                onClick={() => addPhase(phase)}
                startIcon={<Plus size={16} />}
              >
                {phase.name}
              </Button>
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Canvas: React Flow */}
      <Box sx={{ flex: 1, borderRadius: 1, overflow: 'hidden', border: '1px solid #ddd' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelectedNode(node)}
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {error && (
          <Alert severity="error" sx={{ position: 'absolute', top: 16, left: 16 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Right Panel: Phase Config or Workflow Info */}
      <Card sx={{ width: 350, overflow: 'auto' }}>
        <CardContent>
          {selectedNode ? (
            <PhaseConfigPanel
              nodeId={selectedNode.id}
              phase={selectedNode.data.phase}
              onUpdate={updatePhaseConfig}
              onRemove={removePhase}
            />
          ) : (
            <>
              <Typography variant="h6" gutterBottom>Workflow Details</Typography>
              <Stack spacing={2}>
                <TextField
                  label="Workflow Name"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Description"
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                />
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Phases: {nodes.length}</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {nodes.map((node) => (
                      <Chip
                        key={node.id}
                        label={node.data.phase.name}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<Save size={18} />}
                    onClick={() => setSaveDialogOpen(true)}
                    fullWidth
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Play size={18} />}
                    onClick={handleExecute}
                    fullWidth
                  >
                    Execute
                  </Button>
                </Stack>
              </Stack>
            </>
          )}
        </CardContent>
      </Card>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Workflow</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Saving this workflow as a reusable template
          </Typography>
          <TextField
            label="Workflow Name"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={workflowDescription}
            onChange={(e) => setWorkflowDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowCanvas;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { 
  Bot, 
  Brain, 
  Shield, 
  Search, 
  Code, 
  TestTube,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Settings
} from 'lucide-react';

const AgentDashboard = ({ activeTask, onAgentAction }) => {
  const [agents, setAgents] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    averageTime: 0,
    successRate: 0,
    activeAgents: 0
  });
  const [swarmActivity, setSwarmActivity] = useState([]);

  useEffect(() => {
    initializeAgents();
    fetchSystemMetrics();
    const interval = setInterval(updateAgentStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTask) {
      simulateSwarmExecution(activeTask);
    } else {
      resetAgentsToIdle();
    }
  }, [activeTask]);

  const initializeAgents = () => {
    const agentDefinitions = [
      {
        id: 'conductor',
        name: 'Conductor',
        emoji: '🎭',
        role: 'Orchestration & Planning',
        specialty: 'Task coordination and workflow management',
        capabilities: ['Task Planning', 'Agent Coordination', 'Resource Management'],
        status: 'idle',
        currentTask: null,
        progress: 0,
        performance: { tasksCompleted: 156, successRate: 98.2, avgTime: 2.1 }
      },
      {
        id: 'coda',
        name: 'Coda',
        emoji: '⨹',
        role: 'Symbolic Processing',
        specialty: 'Natural language to symbolic representation',
        capabilities: ['NL Parsing', 'Symbol Compression', 'Context Analysis'],
        status: 'idle',
        currentTask: null,
        progress: 0,
        performance: { tasksCompleted: 203, successRate: 94.7, avgTime: 1.8 }
      },
      {
        id: 'spark',
        name: 'Spark',
        emoji: '⚡',
        role: 'Code Generation',
        specialty: 'AST-aware code generation and modification',
        capabilities: ['Code Generation', 'AST Manipulation', 'Refactoring'],
        status: 'idle',
        currentTask: null,
        progress: 0,
        performance: { tasksCompleted: 189, successRate: 96.1, avgTime: 4.2 }
      },
      {
        id: 'oracle',
        name: 'Oracle',
        emoji: '🔮',
        role: 'Knowledge Retrieval',
        specialty: 'Context gathering and pattern matching',
        capabilities: ['Knowledge Search', 'Pattern Recognition', 'Context Building'],
        status: 'idle',
        currentTask: null,
        progress: 0,
        performance: { tasksCompleted: 234, successRate: 97.3, avgTime: 1.5 }
      },
      {
        id: 'sentinel',
        name: 'Sentinel',
        emoji: '🛡️',
        role: 'Security & Validation',
        specialty: 'Security scanning and code validation',
        capabilities: ['Security Scanning', 'Vulnerability Detection', 'Compliance Check'],
        status: 'idle',
        currentTask: null,
        progress: 0,
        performance: { tasksCompleted: 167, successRate: 99.1, avgTime: 2.8 }
      },
      {
        id: 'critic',
        name: 'Critic',
        emoji: '🔍',
        role: 'Quality Assurance',
        specialty: 'Code review and quality assessment',
        capabilities: ['Code Review', 'Quality Analysis', 'Best Practices'],
        status: 'idle',
        currentTask: null,
        progress: 0,
        performance: { tasksCompleted: 145, successRate: 95.8, avgTime: 3.1 }
      }
    ];

    setAgents(agentDefinitions);
  };

  const fetchSystemMetrics = () => {
    setSystemMetrics({
      totalTasks: 1094,
      completedTasks: 1052,
      averageTime: 2.7,
      successRate: 96.2,
      activeAgents: 6
    });
  };

  const simulateSwarmExecution = (task) => {
    const workflow = [
      { agentId: 'conductor', task: 'Analyzing request and creating execution plan', duration: 3000 },
      { agentId: 'coda', task: 'Parsing natural language to symbolic representation', duration: 2500 },
      { agentId: 'oracle', task: 'Retrieving relevant context and patterns', duration: 4000 },
      { agentId: 'spark', task: 'Generating code based on requirements', duration: 6000 },
      { agentId: 'sentinel', task: 'Performing security and vulnerability scan', duration: 3500 },
      { agentId: 'critic', task: 'Reviewing code quality and best practices', duration: 2000 }
    ];

    let currentStep = 0;
    const activity = [];

    const executeStep = () => {
      if (currentStep >= workflow.length) {
        // Workflow complete
        setAgents(prev => prev.map(agent => ({
          ...agent,
          status: 'idle',
          currentTask: null,
          progress: 0
        })));
        
        activity.push({
          id: Date.now(),
          type: 'workflow_completed',
          message: 'Swarm execution completed successfully',
          timestamp: new Date(),
          status: 'success'
        });
        setSwarmActivity(activity);
        return;
      }

      const step = workflow[currentStep];
      
      // Set current agent to active
      setAgents(prev => prev.map(agent => 
        agent.id === step.agentId 
          ? { ...agent, status: 'active', currentTask: step.task, progress: 0 }
          : agent.status === 'active' 
            ? { ...agent, status: 'completed', progress: 100 }
            : agent
      ));

      activity.push({
        id: Date.now() + currentStep,
        type: 'agent_started',
        message: `${step.agentId} started: ${step.task}`,
        timestamp: new Date(),
        status: 'info',
        agentId: step.agentId
      });

      // Simulate progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        setAgents(prev => prev.map(agent => 
          agent.id === step.agentId 
            ? { ...agent, progress }
            : agent
        ));

        if (progress >= 100) {
          clearInterval(progressInterval);
          
          activity.push({
            id: Date.now() + currentStep + 1000,
            type: 'agent_completed',
            message: `${step.agentId} completed successfully`,
            timestamp: new Date(),
            status: 'success',
            agentId: step.agentId
          });
          setSwarmActivity([...activity]);
          
          currentStep++;
          setTimeout(executeStep, 800);
        }
      }, step.duration / 10);
    };

    executeStep();
  };

  const resetAgentsToIdle = () => {
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: 'idle',
      currentTask: null,
      progress: 0
    })));
  };

  const updateAgentStatus = () => {
    // Simulate real-time updates
    setAgents(prev => prev.map(agent => ({
      ...agent,
      performance: {
        ...agent.performance,
        tasksCompleted: agent.performance.tasksCompleted + (Math.random() > 0.95 ? 1 : 0)
      }
    })));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      case 'idle': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getAgentIcon = (agentId) => {
    const icons = {
      conductor: Bot,
      coda: Brain,
      spark: Zap,
      oracle: Search,
      sentinel: Shield,
      critic: TestTube
    };
    return icons[agentId] || Bot;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agent Swarm</h1>
          <p className="text-muted-foreground">
            Monitor and manage your AI development agents
          </p>
        </div>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Configure Agents
        </Button>
      </div>

      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{systemMetrics.totalTasks}</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{systemMetrics.successRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Time</p>
                <p className="text-2xl font-bold">{systemMetrics.averageTime}m</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">{systemMetrics.activeAgents}</p>
              </div>
              <Bot className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const IconComponent = getAgentIcon(agent.id);
          return (
            <Card key={agent.id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{agent.emoji}</div>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {agent.specialty}
                </p>
                
                {/* Capabilities */}
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.map((capability, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {capability}
                    </Badge>
                  ))}
                </div>
                
                {/* Current Task */}
                {agent.currentTask && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">
                      {agent.currentTask}
                    </div>
                    <Progress value={agent.progress} className="h-2" />
                                      <div className="text-xs text-muted-foreground">
                      {agent.progress}% complete
                    </div>
                  </div>
                )}
                
                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="font-semibold">{agent.performance.tasksCompleted}</div>
                    <div className="text-muted-foreground">Tasks</div>
                  </div>
                  <div>
                    <div className="font-semibold">{agent.performance.successRate}%</div>
                    <div className="text-muted-foreground">Success</div>
                  </div>
                  <div>
                    <div className="font-semibold">{agent.performance.avgTime}m</div>
                    <div className="text-muted-foreground">Avg Time</div>
                  </div>
                </div>
                
                {agent.status === 'idle' && (
                  <div className="text-sm text-muted-foreground text-center py-2">
                    Ready for tasks
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Task & Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Task */}
        {activeTask && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Current Task
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{activeTask.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {activeTask.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Started: {new Date(activeTask.startTime).toLocaleTimeString()}</span>
                <Badge variant="outline">
                  Priority: {activeTask.priority || 'Medium'}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{Math.round((agents.filter(a => a.status === 'completed').length / agents.length) * 100)}%</span>
                </div>
                <Progress 
                  value={(agents.filter(a => a.status === 'completed').length / agents.length) * 100} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Swarm Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Swarm Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {swarmActivity.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No recent activity
                </div>
              ) : (
                swarmActivity.slice(-10).reverse().map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'error' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{agent.emoji}</span>
                    <span className="font-medium">{agent.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {agent.performance.successRate}% success rate
                  </div>
                </div>
                <Progress value={agent.performance.successRate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDashboard;
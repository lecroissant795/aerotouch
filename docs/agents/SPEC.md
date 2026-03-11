# AeroTouch AI Agent System - Specification Index

This document serves as the master index for all agent specifications in the AeroTouch AI Agent System.

## Overview

The AeroTouch AI Agent System is a multi-team AI agent architecture designed to run an e-commerce business autonomously. The system consists of 7 teams with a total of 24 specialized agents.

## Teams & Agents

### 1. Marketing Team (5 agents)
- [TikTok Strategist](./teams/marketing/tiktok-strategist.md)
- [Instagram Curator](./teams/marketing/instagram-curator.md)
- [Growth Hacker](./teams/marketing/growth-hacker.md)
- [Content Creator](./teams/marketing/content-creator.md)
- [Facebook Ads Specialist](./teams/marketing/facebook-ads-specialist.md)

### 2. Finance Team (6 agents)
- [Financial Statements Generator](./teams/finance/financial-statements.md)
- [Cashflow Manager](./teams/finance/cashflow-manager.md)
- [Inventory Accountant](./teams/finance/inventory-accountant.md)
- [Balance Sheet Analyst](./teams/finance/balance-sheet-analyst.md)
- [Financial Consultant](./teams/finance/financial-consultant.md)
- [Audit Agent](./teams/finance/audit-agent.md)

### 3. Inventory & Supply Team (3 agents)
- [Supply Chain Manager](./teams/inventory/supply-chain-manager.md)
- [Stock Reorder Agent](./teams/inventory/stock-reorder-agent.md)
- [Vendor Relations Agent](./teams/inventory/vendor-relations.md)

### 4. Tech Team (3 agents)
- [Frontend Developer](./teams/tech/frontend-developer.md)
- [Backend Architect](./teams/tech/backend-architect.md)
- [Analytics Engineer](./teams/tech/analytics-engineer.md)

### 5. Product Team (3 agents)
- [Trend Researcher](./teams/product/trend-researcher.md)
- [Feedback Synthesiser](./teams/product/feedback-synthesiser.md)
- [Sprint Prioritizer](./teams/product/sprint-prioritizer.md)

### 6. Testing Team (3 agents)
- [Tool Evaluator](./teams/testing/tool-evaluator.md)
- [API Tester](./teams/testing/api-tester.md)
- [Test Results Analyst](./teams/testing/test-results-analyst.md)

### 7. Operations Team (3 agents)
- [Support Responder](./teams/operations/support-responder.md)
- [Infrastructure Reporter](./teams/operations/infrastructure-reporter.md)
- [Legal Compliance Agent](./teams/operations/legal-compliance.md)

## Agent Architecture

All agents follow a unified architecture:
- **Base Class**: Common functionality for all agents
- **System Prompt**: Role-specific instructions
- **Tools**: Domain-specific capabilities
- **Memory**: In-context conversation history

## Usage

Each agent specification contains:
1. **Role** - What the agent does
2. **Responsibilities** - Key duties and tasks
3. **System Prompt** - The instruction prompt for the LLM
4. **Expected Outputs** - What the agent should produce
5. **Example Inputs** - Sample tasks the agent can handle
6. **Success Criteria** - How to evaluate agent performance

## Inter-Agent Communication

Agents within the same team can collaborate on complex tasks. The orchestrator can delegate work across teams as needed.

---
*Last Updated: 2026-03-07*

import test from 'node:test';
import assert from 'node:assert/strict';
import { agents, events, tasks, projectOffice } from '../src/data/office.js';

test('replay only projects events at or before the selected cursor', () => {
  const start = projectOffice(events, 0);
  assert.equal(start.visible.length, 1);
  assert.equal(start.taskStates['QR8-001'].status, 'In progress');
  assert.equal(start.taskStates['QR8-002'].status, 'Queued');
  assert.equal(start.completed, 0);
  assert.equal(start.visible.some(e => e.evidence), false);
});

test('handoff releases the prior owner and assigns the receiving agent', () => {
  const before = projectOffice(events, 3);
  assert.equal(before.agentStates.atlas.taskId, 'QR8-002');
  const after = projectOffice(events, 4);
  assert.equal(after.agentStates.atlas.status, 'Available');
  assert.equal(after.agentStates.atlas.taskId, null);
  assert.equal(after.agentStates.pixel.taskId, 'QR8-002');
  assert.equal(after.taskStates['QR8-002'].agentId, 'pixel');
});

test('completion releases agents and replay reset removes future state', () => {
  const final = projectOffice(events, events.length - 1);
  assert.equal(final.completed, 3);
  assert.equal(final.taskStates['QR8-004'].status, 'In review');
  assert.equal(final.agentStates.pixel.status, 'Available');
  const reset = projectOffice(events, 0);
  assert.equal(reset.taskStates['QR8-004'].status, 'Queued');
  assert.equal(reset.agentStates.orbit.status, 'Available');
});

test('every replay step has consistent ownership and valid source references', () => {
  assert.equal(new Set(events.map(e => e.id)).size, events.length);
  for (let cursor = 0; cursor < events.length; cursor++) {
    const event = events[cursor];
    assert.ok(agents.some(a => a.id === event.agentId));
    assert.ok(tasks.some(t => t.id === event.taskId));
    const state = projectOffice(events, cursor);
    for (const [agentId, status] of Object.entries(state.agentStates)) {
      if (status.taskId) {
        assert.equal(state.taskStates[status.taskId].agentId, agentId);
        assert.notEqual(state.taskStates[status.taskId].status, 'Complete');
      }
    }
  }
});

test('projection is repeatable and never mutates source events', () => {
  const original = JSON.stringify(events);
  assert.deepEqual(projectOffice(events, 6), projectOffice(events, 6));
  assert.equal(JSON.stringify(events), original);
});

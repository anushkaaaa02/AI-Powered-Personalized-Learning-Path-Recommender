/* ============================================================
   PATHWISE — PROGRESS TRACKER (shared client-side helpers)
   Pure, read-only helpers over already-fetched progress/roadmap
   data. Mutations (completing a topic/project, streaks,
   achievement checks) now happen on the backend — see
   PWStore.data.completeTopic() / completeProject() in storage.js.
   ============================================================ */

const PWProgress = (() => {

  function flatTopics(pathId){
    const roadmap = PWData.ROADMAPS[pathId] || [];
    return roadmap.flatMap(phase => phase.topics.map(t => ({ ...t, phase: phase.title })));
  }

  function topicState(topicId, progress, pathId){
    if(progress.completedTopics.includes(topicId)) return "completed";
    if(progress.currentTopic === topicId) return "current";
    return "locked";
  }

  function percentage(pathId, progress){
    const total = PWData.totalTopics(pathId);
    if(!total) return 0;
    return Math.round((progress.completedTopics.length / total) * 100);
  }

  function nextTopic(pathId, progress){
    const topics = flatTopics(pathId);
    return topics.find(t => !progress.completedTopics.includes(t.id));
  }

  return { flatTopics, topicState, percentage, nextTopic };
})();

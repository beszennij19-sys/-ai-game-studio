using UnityEngine;
using System.Collections.Generic;

namespace AIStudio {
    public class AIGameDirector41 : MonoBehaviour {
        public string projectId;
        public string currentStoryNode;
        public List<string> activeQuests = new List<string>();
        public List<string> completedQuests = new List<string>();
        public List<string> activeEvents = new List<string>();
        public List<string> consequences = new List<string>();
        public List<string> rewards = new List<string>();

        public void Configure(string project, string startNode = "chapter_1") {
            projectId = project;
            currentStoryNode = startNode;
        }

        public void SetStoryNode(string nodeId) {
            if (!string.IsNullOrEmpty(nodeId)) currentStoryNode = nodeId;
        }

        public void AcceptQuest(string questId) {
            if (!string.IsNullOrEmpty(questId) && !activeQuests.Contains(questId) && !completedQuests.Contains(questId))
                activeQuests.Add(questId);
        }

        public void CompleteQuest(string questId) {
            activeQuests.Remove(questId);
            if (!string.IsNullOrEmpty(questId) && !completedQuests.Contains(questId))
                completedQuests.Add(questId);
        }

        public void TriggerEvent(string eventId) {
            if (!string.IsNullOrEmpty(eventId) && !activeEvents.Contains(eventId))
                activeEvents.Add(eventId);
        }

        public void AddConsequence(string value) {
            if (!string.IsNullOrEmpty(value)) consequences.Add(value);
        }

        public void AddReward(string value) {
            if (!string.IsNullOrEmpty(value)) rewards.Add(value);
        }
    }
}

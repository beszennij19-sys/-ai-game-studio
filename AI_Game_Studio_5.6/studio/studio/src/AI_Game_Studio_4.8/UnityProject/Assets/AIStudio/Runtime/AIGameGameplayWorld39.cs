using UnityEngine;
using System.Collections.Generic;

namespace AIStudio {
    public class AIGameGameplayWorld39 : MonoBehaviour {
        public string projectId;
        public string worldId;
        public bool eventsEnabled = true;
        public bool encountersEnabled = true;

        private readonly List<string> activeEvents = new List<string>();

        public void Configure(string project, string world) {
            projectId = project;
            worldId = world;
        }

        public void ActivateEvent(string eventId) {
            if (!activeEvents.Contains(eventId)) activeEvents.Add(eventId);
        }

        public bool IsEventActive(string eventId) {
            return activeEvents.Contains(eventId);
        }
    }
}

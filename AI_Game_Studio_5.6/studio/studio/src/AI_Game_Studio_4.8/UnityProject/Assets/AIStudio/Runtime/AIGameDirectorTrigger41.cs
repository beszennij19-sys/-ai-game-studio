using UnityEngine;

namespace AIStudio {
    public class AIGameDirectorTrigger41 : MonoBehaviour {
        public string triggerId;
        public string questId;
        public string eventId;

        public void Fire() {
            var director = FindObjectOfType<AIGameDirector41>();
            if (director == null) return;
            if (!string.IsNullOrEmpty(questId)) director.CompleteQuest(questId);
            if (!string.IsNullOrEmpty(eventId)) director.TriggerEvent(eventId);
        }
    }
}

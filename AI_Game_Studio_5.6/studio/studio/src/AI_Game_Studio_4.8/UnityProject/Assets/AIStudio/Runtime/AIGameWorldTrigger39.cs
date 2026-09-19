using UnityEngine;

namespace AIStudio {
    public class AIGameWorldTrigger39 : MonoBehaviour {
        public string triggerId;
        public string eventId;

        private void OnTriggerEnter(Collider other) {
            if (other.CompareTag("Player")) {
                var world = FindObjectOfType<AIGameGameplayWorld39>();
                if (world != null) world.ActivateEvent(eventId);
            }
        }
    }
}

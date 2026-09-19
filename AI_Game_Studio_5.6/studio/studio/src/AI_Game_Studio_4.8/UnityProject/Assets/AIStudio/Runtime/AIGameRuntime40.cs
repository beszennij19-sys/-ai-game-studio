using UnityEngine;
using System;
using System.Collections.Generic;

namespace AIStudio {
    [Serializable]
    public class AIGameRuntimeState40 {
        public int health = 100;
        public int maxHealth = 100;
        public int coins = 0;
        public List<string> inventory = new List<string>();
        public string activeQuest;
        public List<string> completedQuests = new List<string>();
        public List<string> activeEvents = new List<string>();
        public string currentLocation;
    }

    public class AIGameRuntime40 : MonoBehaviour {
        public string projectId;
        public AIGameRuntimeState40 state = new AIGameRuntimeState40();
        public bool runtimeReady;

        public void Configure(string project) {
            projectId = project;
            runtimeReady = true;
        }

        public void Damage(int amount) {
            state.health = Mathf.Max(0, state.health - Mathf.Max(0, amount));
        }

        public void Heal(int amount) {
            state.health = Mathf.Min(state.maxHealth, state.health + Mathf.Max(0, amount));
        }

        public void AddItem(string itemId) {
            if (!string.IsNullOrEmpty(itemId)) state.inventory.Add(itemId);
        }

        public void ActivateEvent(string eventId) {
            if (!string.IsNullOrEmpty(eventId) && !state.activeEvents.Contains(eventId))
                state.activeEvents.Add(eventId);
        }
    }
}

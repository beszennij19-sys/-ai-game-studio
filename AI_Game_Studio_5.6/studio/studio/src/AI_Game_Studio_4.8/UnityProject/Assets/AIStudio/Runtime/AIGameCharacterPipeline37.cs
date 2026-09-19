using UnityEngine;

namespace AIStudio {
    [System.Serializable]
    public class AIGameCharacterPipeline37 : MonoBehaviour {
        public string projectId;
        public string characterId;
        public string modelPath;
        public string rigType = "humanoid";

        public void Configure(string project, string character, string model) {
            projectId = project;
            characterId = character;
            modelPath = model;
        }
    }
}
